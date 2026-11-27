-- 001_init.sql｜ANUBIS ERP 初始 schema
-- 合規防呆設計／風險提醒：
--   1. 全數 SYNTHETIC_DEMO、PROTOTYPE_NOT_APPROVED；此 schema 不是已上線系統。
--   2. 三法人 LE-01/LE-02/LE-03 以 legal_entity_id 實體隔離，所有交易表皆帶此欄。
--   3. 金額欄位一律 NUMERIC(18,0) 整數分（cents）；禁止 float / double precision。
--   4. 財務計算走 NUMERIC（decimal），任何換算用 ::numeric，不用浮點。
--   5. audit_events 只開放 INSERT + SELECT，禁止 UPDATE / DELETE（含 trigger 保險）。
--   6. entity_aliases 須人工確認才可啟用，不接受自動合併客戶。

BEGIN;

-- ---------------------------------------------------------------------------
-- 角色與上下文：app.legal_entity_id / app.role 由 API 在交易開始時 set_config
-- 合規防呆設計／風險提醒：role 必須白名單，不能由前端任意填寫。
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'anubis_role') THEN
    CREATE TYPE anubis_role AS ENUM (
      'platform_owner', 'security_admin', 'access_admin', 'accounting',
      'administration', 'warehouse', 'sales', 'executive_readonly',
      'content_compliance', 'auditor_readonly'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'anubis_entity_id') THEN
    CREATE TYPE anubis_entity_id AS ENUM ('LE-01', 'LE-02', 'LE-03');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'anubis_source') THEN
    CREATE TYPE anubis_source AS ENUM ('SYNTHETIC_DEMO');
  END IF;
END $$;

-- 合規防呆設計／風險提醒：僅平台Owner / 稽核 / 唯讀主管可跨法人讀；業務寫入僅針對所屬法人。
CREATE OR REPLACE FUNCTION anubis_can_read(p_entity anubis_entity_id)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT p_entity::text = NULLIF(current_setting('app.legal_entity_id', true), '')
     OR current_setting('app.role', true) IN (
          'platform_owner', 'auditor_readonly', 'executive_readonly', 'security_admin'
        );
$$;

CREATE OR REPLACE FUNCTION anubis_can_write(p_entity anubis_entity_id)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT p_entity::text = NULLIF(current_setting('app.legal_entity_id', true), '')
     AND current_setting('app.role', true) IN (
          'security_admin', 'access_admin', 'accounting', 'administration',
          'warehouse', 'sales', 'content_compliance'
        );
$$;

-- ---------------------------------------------------------------------------
-- 法人主檔
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS legal_entities (
  id            anubis_entity_id PRIMARY KEY,
  name          text        NOT NULL,
  country       text        NOT NULL DEFAULT 'TW',
  status        text        NOT NULL DEFAULT 'active',
  source        anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at    timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE legal_entities IS '合規防呆設計／風險提醒：三法人獨立；不得因關係推論共用資料。';
ALTER TABLE legal_entities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS legal_entities_read ON legal_entities;
CREATE POLICY legal_entities_read ON legal_entities
  FOR SELECT USING (anubis_can_read(id));

-- ---------------------------------------------------------------------------
-- 法人別名：需人工確認
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entity_aliases (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  legal_entity_id anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  alias           text NOT NULL,
  normalized      text NOT NULL,
  confidence      numeric(5,4) NOT NULL DEFAULT 0.0000,
  confirmed_by    text,
  confirmed_at    timestamptz,
  source          anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (legal_entity_id, normalized)
);
COMMENT ON COLUMN entity_aliases.confirmed_by IS '合規防呆設計／風險提醒：NULL 表示未確認，禁止用於合併或申報。';
ALTER TABLE entity_aliases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS entity_aliases_read ON entity_aliases;
CREATE POLICY entity_aliases_read ON entity_aliases
  FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS entity_aliases_insert ON entity_aliases;
CREATE POLICY entity_aliases_insert ON entity_aliases
  FOR INSERT WITH CHECK (anubis_can_write(legal_entity_id) AND confirmed_by IS NULL);
DROP POLICY IF EXISTS entity_aliases_update ON entity_aliases;
CREATE POLICY entity_aliases_update ON entity_aliases
  FOR UPDATE USING (
    anubis_can_write(legal_entity_id)
    AND current_setting('app.role', true) IN ('access_admin', 'security_admin')
  )
  WITH CHECK (confirmed_by IS NOT NULL AND confirmed_at IS NOT NULL);

-- 合規防呆設計／風險提醒：阻擋未經人工確認就啟用別名。
CREATE OR REPLACE FUNCTION entity_aliases_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.confirmed_by IS DISTINCT FROM OLD.confirmed_by
     AND current_setting('app.role', true) NOT IN ('access_admin', 'security_admin') THEN
    RAISE EXCEPTION '合規防呆設計／風險提醒：別名確認僅限 access_admin / security_admin';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_entity_aliases_guard ON entity_aliases;
CREATE TRIGGER trg_entity_aliases_guard
  BEFORE UPDATE ON entity_aliases
  FOR EACH ROW EXECUTE FUNCTION entity_aliases_guard();

-- ---------------------------------------------------------------------------
-- 商品
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id              text PRIMARY KEY,
  legal_entity_id anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  sku             text NOT NULL,
  name            text NOT NULL,
  line            text NOT NULL CHECK (line IN ('human', 'pet')),
  form            text NOT NULL CHECK (form IN ('capsule', 'powder', 'tablet')),
  -- 合規防呆設計／風險提醒：整數分，NUMERIC(18,0)，不用 float。
  price_cents     numeric(18,0) NOT NULL CHECK (price_cents >= 0),
  stock           integer NOT NULL CHECK (stock >= 0),
  batch           text NOT NULL DEFAULT '',
  expiry          date,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  source          anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (legal_entity_id, sku)
);
COMMENT ON COLUMN products.price_cents IS '合規防呆設計／風險提醒：金額為整數分；展示層再以 ::numeric / 100 轉 decimal。';
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS products_read ON products;
CREATE POLICY products_read ON products FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS products_write ON products;
CREATE POLICY products_write ON products FOR ALL
  USING (anubis_can_write(legal_entity_id))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

-- ---------------------------------------------------------------------------
-- 客戶
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id              text PRIMARY KEY,
  legal_entity_id anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  name            text NOT NULL,
  aliases         text[] NOT NULL DEFAULT '{}',
  owner_sales_id  text,
  city            text NOT NULL DEFAULT '',
  special_rule    boolean NOT NULL DEFAULT false,
  source          anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS customers_read ON customers;
CREATE POLICY customers_read ON customers FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS customers_write ON customers;
CREATE POLICY customers_write ON customers FOR ALL
  USING (anubis_can_write(legal_entity_id))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

-- ---------------------------------------------------------------------------
-- 訂單與訂單明細
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                  text PRIMARY KEY,
  legal_entity_id     anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  customer_id         text NOT NULL REFERENCES customers(id),
  document_type       text NOT NULL CHECK (document_type IN ('sale', 'replacement', 'exchange')),
  total_cents         numeric(18,0) NOT NULL CHECK (total_cents >= 0),
  -- 合規防呆設計／風險提醒：補貨紙面 0 元，內部權益扣抵另記，不得混為營收。
  internal_equity_cents numeric(18,0) NOT NULL DEFAULT 0 CHECK (internal_equity_cents >= 0),
  status              text NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'pending_approval', 'approved', 'printed', 'shipped')),
  created_by          text NOT NULL,
  source              anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at          timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orders_read ON orders;
CREATE POLICY orders_read ON orders FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS orders_write ON orders;
CREATE POLICY orders_write ON orders FOR ALL
  USING (anubis_can_write(legal_entity_id))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

CREATE TABLE IF NOT EXISTS order_lines (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  legal_entity_id   anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  order_id          text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        text NOT NULL REFERENCES products(id),
  sku               text NOT NULL,
  qty               integer NOT NULL CHECK (qty > 0),
  unit_price_cents  numeric(18,0) NOT NULL CHECK (unit_price_cents >= 0),
  -- 合規防呆設計／風險提醒：amount = qty * unit_price，由 NUMERIC 計算，禁止 float。
  amount_cents      numeric(18,0) NOT NULL CHECK (amount_cents >= 0),
  source            anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  CHECK (amount_cents = qty::numeric(18,0) * unit_price_cents)
);
ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS order_lines_read ON order_lines;
CREATE POLICY order_lines_read ON order_lines FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS order_lines_write ON order_lines;
CREATE POLICY order_lines_write ON order_lines FOR ALL
  USING (anubis_can_write(legal_entity_id))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

-- ---------------------------------------------------------------------------
-- 合約池
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contracts (
  id                text PRIMARY KEY,
  legal_entity_id   anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  customer_id       text NOT NULL REFERENCES customers(id),
  kind              text NOT NULL CHECK (kind IN ('amount_pool', 'item_pool')),
  total_cents       numeric(18,0) NOT NULL CHECK (total_cents >= 0),
  drawn_cents       numeric(18,0) NOT NULL DEFAULT 0 CHECK (drawn_cents >= 0),
  item_quota        jsonb NOT NULL DEFAULT '{}'::jsonb,
  valid_from        date NOT NULL,
  valid_to          date NOT NULL,
  status            text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'transferred')),
  source            anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (drawn_cents <= total_cents),
  CHECK (valid_to >= valid_from)
);
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS contracts_read ON contracts;
CREATE POLICY contracts_read ON contracts FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS contracts_write ON contracts;
CREATE POLICY contracts_write ON contracts FOR ALL
  USING (anubis_can_write(legal_entity_id) AND current_setting('app.role', true) IN ('accounting', 'administration'))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

-- ---------------------------------------------------------------------------
-- 應收／請款：25 日切帳由服務層以 Asia/Taipei 處理，DB 只存 period
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS receivables (
  id                text PRIMARY KEY,
  legal_entity_id   anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  customer_id       text NOT NULL REFERENCES customers(id),
  period            text NOT NULL CHECK (period ~ '^\d{4}-\d{2}$'),
  billed_cents      numeric(18,0) NOT NULL CHECK (billed_cents >= 0),
  collected_cents   numeric(18,0) NOT NULL DEFAULT 0 CHECK (collected_cents >= 0),
  overpay_cents     numeric(18,0) NOT NULL DEFAULT 0 CHECK (overpay_cents >= 0),
  discount_cents    numeric(18,0) NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  status            text NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'partial', 'settled', 'overpaid')),
  source            anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (legal_entity_id, customer_id, period)
);
ALTER TABLE receivables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS receivables_read ON receivables;
CREATE POLICY receivables_read ON receivables FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS receivables_write ON receivables;
CREATE POLICY receivables_write ON receivables FOR ALL
  USING (anubis_can_write(legal_entity_id) AND current_setting('app.role', true) IN ('accounting', 'administration'))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

-- ---------------------------------------------------------------------------
-- 稽核事件：不可竄改（只有 INSERT / SELECT，無 UPDATE / DELETE grant）
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_events (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  legal_entity_id   anubis_entity_id,
  at                timestamptz NOT NULL DEFAULT now(),
  actor_id          text NOT NULL,
  actor_role        anubis_role NOT NULL,
  action            text NOT NULL,
  target_type       text NOT NULL,
  target_id         text NOT NULL DEFAULT '',
  before            jsonb,
  after             jsonb,
  request_id        text,
  source            anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE audit_events IS '合規防呆設計／風險提醒：append-only；UPDATE/DELETE 一律拒絕，連 table owner 也受 trigger 約束。';
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audit_events_read ON audit_events;
CREATE POLICY audit_events_read ON audit_events FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS audit_events_insert ON audit_events;
CREATE POLICY audit_events_insert ON audit_events
  FOR INSERT WITH CHECK (source = 'SYNTHETIC_DEMO');

CREATE OR REPLACE FUNCTION audit_events_immutable()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '合規防呆設計／風險提醒：audit_events 不可 UPDATE / DELETE';
END $$;
DROP TRIGGER IF EXISTS trg_audit_events_immutable_u ON audit_events;
CREATE TRIGGER trg_audit_events_immutable_u
  BEFORE UPDATE ON audit_events FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();
DROP TRIGGER IF EXISTS trg_audit_events_immutable_d ON audit_events;
CREATE TRIGGER trg_audit_events_immutable_d
  BEFORE DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();

-- ---------------------------------------------------------------------------
-- 授權委派
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grants (
  id                  text PRIMARY KEY,
  legal_entity_id     anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  grantor_id          text NOT NULL,
  grantee_id          text NOT NULL,
  role                anubis_role NOT NULL,
  ceiling             text[] NOT NULL DEFAULT '{}',
  legal_entity_scope  anubis_entity_id[] NOT NULL DEFAULT '{}',
  delegated           boolean NOT NULL DEFAULT false,
  approved_by         text,
  effective_from      timestamptz NOT NULL DEFAULT now(),
  effective_to        timestamptz,
  source              anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at          timestamptz NOT NULL DEFAULT now(),
  -- 合規防呆設計／風險提醒：不可自授、不可自審自核；委派需書面核准人。
  CHECK (grantor_id <> grantee_id),
  CHECK (approved_by IS NULL OR approved_by <> grantor_id),
  CHECK (delegated = false OR approved_by IS NOT NULL)
);
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS grants_read ON grants;
CREATE POLICY grants_read ON grants FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS grants_write ON grants;
CREATE POLICY grants_write ON grants FOR ALL
  USING (anubis_can_write(legal_entity_id) AND current_setting('app.role', true) IN ('security_admin', 'access_admin'))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

-- ---------------------------------------------------------------------------
-- 高風險改帳差異預覽：只產預覽，核准後由獨立流程寫入
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS adjustment_previews (
  id                  text PRIMARY KEY,
  legal_entity_id     anubis_entity_id NOT NULL REFERENCES legal_entities(id),
  request_id          text NOT NULL,
  target_type         text NOT NULL,
  target_id           text NOT NULL,
  before_data         jsonb NOT NULL DEFAULT '{}'::jsonb,
  after_data          jsonb NOT NULL DEFAULT '{}'::jsonb,
  status              text NOT NULL DEFAULT 'awaiting_approval'
                      CHECK (status IN ('awaiting_approval', 'approved', 'rejected', 'applied')),
  required_approvers  integer NOT NULL DEFAULT 2 CHECK (required_approvers >= 2),
  source              anubis_source NOT NULL DEFAULT 'SYNTHETIC_DEMO',
  created_at          timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE adjustment_previews IS '合規防呆設計／風險提醒：至少兩人核准；此表只存差異，不直接改帳。';
ALTER TABLE adjustment_previews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adjustment_previews_read ON adjustment_previews;
CREATE POLICY adjustment_previews_read ON adjustment_previews FOR SELECT USING (anubis_can_read(legal_entity_id));
DROP POLICY IF EXISTS adjustment_previews_write ON adjustment_previews;
CREATE POLICY adjustment_previews_write ON adjustment_previews FOR ALL
  USING (anubis_can_write(legal_entity_id) AND current_setting('app.role', true) IN ('accounting', 'administration'))
  WITH CHECK (anubis_can_write(legal_entity_id) AND source = 'SYNTHETIC_DEMO');

-- ---------------------------------------------------------------------------
-- 財務 decimal 視圖：合規防呆設計／風險提醒——展示與報表一律走 NUMERIC 除以 100
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_product_price_decimal AS
SELECT id, legal_entity_id, sku,
       (price_cents::numeric / 100) AS price_decimal,
       source
FROM products;

CREATE OR REPLACE VIEW v_receivable_decimal AS
SELECT id, legal_entity_id, period,
       (billed_cents::numeric / 100) AS billed_decimal,
       (collected_cents::numeric / 100) AS collected_decimal,
       source
FROM receivables;

-- ---------------------------------------------------------------------------
-- 最小權限：app 角色只拿到必要 grant；audit_events 無 UPDATE / DELETE
-- 合規防呆設計／風險提醒：若 DB 尚未建立角色，請由 DBA 依 README 建立。
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anubis_app') THEN
    GRANT USAGE ON SCHEMA public TO anubis_app;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO anubis_app;
    GRANT INSERT, UPDATE, DELETE ON legal_entities, entity_aliases, products, customers,
      orders, order_lines, contracts, receivables, grants, adjustment_previews TO anubis_app;
    -- 刻意不 GRANT UPDATE / DELETE ON audit_events
    REVOKE UPDATE, DELETE ON audit_events FROM anubis_app;
    GRANT INSERT ON audit_events TO anubis_app;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anubis_app;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anubis_readonly') THEN
    GRANT USAGE ON SCHEMA public TO anubis_readonly;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO anubis_readonly;
    REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anubis_readonly;
  END IF;
END $$;

COMMIT;

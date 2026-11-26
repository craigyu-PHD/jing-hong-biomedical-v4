/* 精鴻生醫 v17｜產品深度資料模型（人用保健與 ANUBIS 寵物保健完全獨立）
   合規防呆設計：禁止跨線套用宣稱；不作疾病診斷、治療或預防之宣稱。
   風險提醒：以下成分劑量、批號、效期、核准字號、庫存與價格均為「示意／待公司核准」，正式上線前須逐項替換為公司核准文件。 */
(function (win) {
  'use strict';

  win.JH_PRODUCTS = [
    {
      id: 'h1', sku: 'JH-H001', line: 'human', target: 'adult', form: 'capsule', purpose: 'daily', cert: 'patent',
      priceTwd: 1280, stock: 42, limit: 10, batch: 'JH2611A（示意）', expiry: '2028-11-30（示意）', version: 'v17.0-demo',
      img: 'assets/product-real-pack.jpg', related: ['h2', 'h4'],
      zh: {
        name: '牛樟椴木子實體專利膠囊',
        spec: '膠囊劑型 · 60 粒／盒（示意規格，待確認）',
        ingredients: '牛樟芝椴木子實體萃取物（含三萜類指標，劑量待確認）、靈芝子實體萃取、植物性膠囊殼（示意）。',
        usage: '成人日常保養，每日 1–2 粒，飯後搭配溫開水食用（示意，依正式標示為準）。',
        storage: '請置於陰涼乾燥處，避免陽光直射與高溫潮濕。',
        approvalNo: '食品標示／專利字號待公司補齊（示意）',
        approvalDate: '待公司核准確認',
        labReport: '重金屬、農藥殘留、微生物及三萜類含量第三方檢驗（範本預留，待補正式報告）。',
        audience: '一般成人日常保養；孕哺期、特殊體質或服藥者請先諮詢醫師或藥師。',
        qa: [
          { q: '素食者可以食用嗎？', a: '此處預留膠囊殼來源標示（植物性／明膠），實際以公司核准包裝為準。' },
          { q: '三萜類含量有檢驗依據嗎？', a: '每批原料規劃附第三方檢驗報告，正式文件待公司授權上傳。' }
        ]
      },
      en: {
        name: 'Basswood Antrodia Fruiting Body Capsule',
        spec: 'Capsule · 60 caps/box (Demo spec, pending verification)',
        ingredients: 'Basswood-cultivated Antrodia cinnamomea fruiting body extract, Ganoderma extract, veggie capsule (Demo).',
        usage: 'Adults: 1–2 capsules daily after meals with lukewarm water (Demo; follow approved label).',
        storage: 'Store in a cool, dry place away from direct sunlight.',
        approvalNo: 'Food labeling / patent number pending company verification (Demo)',
        approvalDate: 'Pending company approval',
        labReport: '3rd-party lab test template for heavy metals, pesticides, microbes, and triterpenoids (pending).',
        audience: 'General adults for daily wellness. Consult a physician if pregnant, nursing, or on medication.',
        qa: [
          { q: 'Is it suitable for vegetarians?', a: 'Capsule shell origin will follow the final company-approved packaging specification.' },
          { q: 'Is triterpenoid content verified?', a: 'Batch-level 3rd-party COA templates are reserved pending official upload.' }
        ]
      }
    },
    {
      id: 'h2', sku: 'JH-H002', line: 'human', target: 'adult', form: 'powder', purpose: 'daily', cert: 'thirdparty',
      priceTwd: 1080, stock: 58, limit: 12, batch: 'JH2611B（示意）', expiry: '2028-10-15（示意）', version: 'v17.0-demo',
      img: 'assets/product-capsule.jpg', related: ['h1', 'h3'],
      zh: {
        name: '順暢養神 牛樟芝益生菌',
        spec: '複方粉劑／膠囊 · 30 包／盒（示意規格，待確認）',
        ingredients: '牛樟芝萃取物、複合乳酸菌株、膳食纖維與益生元（含量待公司確認）。',
        usage: '每日 1 包，可直接入口或搭配 40°C 以下溫水食用（示意）。',
        storage: '請置於陰涼乾燥處，避免高溫影響益生菌活性。',
        approvalNo: '食品標示待公司補齊（示意）',
        approvalDate: '待公司核准確認',
        labReport: '菌數定性定量與重金屬／微生物檢驗（範本預留，待補正式報告）。',
        audience: '忙碌上班族與日常消化保養族群；特殊疾病或服藥者請先諮詢專業人員。',
        qa: [
          { q: '可以用熱水沖泡嗎？', a: '建議搭配 40°C 以下溫開水，維持複合菌株活性。' },
          { q: '需要冷藏保存嗎？', a: '依正式包裝標示為準，常溫陰涼乾燥處即可（示意）。' }
        ]
      },
      en: {
        name: 'Antrodia & Probiotics Blend',
        spec: 'Blend Powder/Capsule · 30 sachets/box (Demo spec)',
        ingredients: 'Antrodia extract, multi-strain probiotics, dietary fiber & prebiotics (dosage pending).',
        usage: '1 sachet daily, direct or with water below 40°C (Demo).',
        storage: 'Keep in a cool, dry place away from heat.',
        approvalNo: 'Food labeling pending verification (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'CFU count and heavy-metal/microbial 3rd-party COA template (pending).',
        audience: 'Adults seeking daily routine support. Consult a physician if under medical care.',
        qa: [
          { q: 'Can I mix it with hot water?', a: 'Use water below 40°C to preserve probiotic viability.' },
          { q: 'Does it require refrigeration?', a: 'Follow final approved packaging; cool dry storage is shown as demo.' }
        ]
      }
    },
    {
      id: 'h3', sku: 'JH-H003', line: 'human', target: 'adult', form: 'capsule', purpose: 'night', cert: 'thirdparty',
      priceTwd: 1180, stock: 30, limit: 10, batch: 'JH2611C（示意）', expiry: '2028-09-30（示意）', version: 'v17.0-demo',
      img: 'assets/product-formula.jpg', related: ['h1', 'h5'],
      zh: {
        name: '牛樟芝睡飽寶膠囊',
        spec: '複方膠囊 · 60 粒／盒（示意規格，待確認）',
        ingredients: '牛樟芝萃取、草本舒緩複方與色胺酸相關素材（劑量待公司確認）。',
        usage: '每日睡前 30–60 分鐘食用 2 粒（示意，依正式標示為準）。',
        storage: '常溫避光、乾燥保存。',
        approvalNo: '公開參展品項，正式字號待補（示意）',
        approvalDate: '待公司核准確認',
        labReport: '農殘與西藥成分零檢出第三方報告（範本預留，待補正式報告）。',
        audience: '夜間作息調整之成人；不作失眠治療宣稱，孕婦或服藥者請先諮詢醫師。',
        qa: [
          { q: '白天食用會嗜睡嗎？', a: '本品定位為夜間日常保養規劃，建議依標示於睡前食用。' },
          { q: '是否含西藥助眠成分？', a: '規劃逐批送檢西藥零檢出，正式報告待公司補齊。' }
        ]
      },
      en: {
        name: 'Antrodia Night Care Capsule',
        spec: 'Blend Capsule · 60 caps/box (Demo spec)',
        ingredients: 'Antrodia extract, herbal night-care blend (dosage pending verification).',
        usage: '2 capsules 30–60 minutes before bedtime (Demo; not a sleep-disorder treatment).',
        storage: 'Store away from light and moisture.',
        approvalNo: 'Exhibition item; official number pending (Demo)',
        approvalDate: 'Pending company approval',
        labReport: '3rd-party pesticide & adulterant-free test template (pending).',
        audience: 'Adults planning evening wellness. Consult a doctor if pregnant or medicated.',
        qa: [
          { q: 'Can it be taken during the day?', a: 'Formulated for evening routine; follow label timing.' },
          { q: 'Does it contain pharmaceutical sedatives?', a: 'Batch screening for adulterants is reserved in the QA pipeline.' }
        ]
      }
    },
    {
      id: 'h4', sku: 'JH-H004', line: 'human', target: 'adult', form: 'extract', purpose: 'daily', cert: 'triterpene',
      priceTwd: 1480, stock: 24, limit: 6, batch: 'JH2611D（示意）', expiry: '2028-12-15（示意）', version: 'v17.0-demo',
      img: 'assets/product-extract.jpg', related: ['h1', 'h5'],
      zh: {
        name: '牛樟椴木子實體晶萃',
        spec: '濃縮晶萃 · 30 瓶／盒（示意規格，待確認）',
        ingredients: '牛樟椴木子實體濃縮萃取液、純水與天然風味調整（濃度待確認）。',
        usage: '每日 1 瓶，搖勻後直接飲用或稀釋（示意）。',
        storage: '置於陰涼處，開封後請立即飲用完畢。',
        approvalNo: '食品標示待公司補齊（示意）',
        approvalDate: '待公司核准確認',
        labReport: '三萜類指紋圖譜與微生物檢驗（範本預留，待補正式報告）。',
        audience: '偏好液態好吸收劑型之成人；孩童及特殊體質請先諮詢醫師。',
        qa: [
          { q: '瓶底有沉澱物正常嗎？', a: '植物與菇蕈濃縮萃取若有微量自然沉澱屬正常現象，飲用前請搖勻（示意）。' },
          { q: '與膠囊差異為何？', a: '晶萃為濃縮液態劑型，方便不擅吞嚥膠囊者日常補充。' }
        ]
      },
      en: {
        name: 'Basswood Antrodia Concentrated Extract',
        spec: 'Liquid Extract · 30 vials/box (Demo spec)',
        ingredients: 'Concentrated basswood Antrodia fruiting body extract (concentration pending).',
        usage: '1 vial daily; shake well before drinking (Demo).',
        storage: 'Keep cool; consume immediately after opening.',
        approvalNo: 'Food labeling pending verification (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Triterpenoid fingerprint & microbial COA template (pending).',
        audience: 'Adults preferring liquid dosage forms. Consult a physician for special conditions.',
        qa: [
          { q: 'Is slight sediment normal?', a: 'Natural botanical sediment may occur; shake well before use (Demo).' },
          { q: 'How does it differ from capsules?', a: 'Liquid extract offers an easy-to-take option without swallowing capsules.' }
        ]
      }
    },
    {
      id: 'h5', sku: 'JH-H005', line: 'human', target: 'adult', form: 'capsule', purpose: 'daily', cert: 'triterpene',
      priceTwd: 980, stock: 64, limit: 12, batch: 'JH2611E（示意）', expiry: '2028-08-30（示意）', version: 'v17.0-demo',
      img: 'assets/product-natural.jpg', related: ['h1', 'h4'],
      zh: {
        name: '牛樟芝清氣順',
        spec: '草本複方 · 60 粒／盒（示意規格，待確認）',
        ingredients: '牛樟芝萃取搭配薄荷、魚腥草等草本複方（劑量待公司確認）。',
        usage: '每日 2 粒，溫水搭配食用（示意）。',
        storage: '陰涼乾燥處密封保存。',
        approvalNo: '公開參展品項，正式字號待補（示意）',
        approvalDate: '待公司核准確認',
        labReport: '重金屬與農藥殘留檢驗（範本預留，待補正式報告）。',
        audience: '換季或環境空氣品質不佳時之日常保養成人（不作呼吸道疾病治療宣稱）。',
        qa: [
          { q: '可與其他牛樟芝品項併服嗎？', a: '建議留意每日總攝取量，或先諮詢營養師與藥師。' },
          { q: '有清涼感嗎？', a: '依正式配方草本比例而定，細節待公司核准。' }
        ]
      },
      en: {
        name: 'Antrodia Herbal Fresh Formula',
        spec: 'Herbal Blend · 60 caps/box (Demo spec)',
        ingredients: 'Antrodia extract with botanical herbs (dosage pending verification).',
        usage: '2 capsules daily with lukewarm water (Demo).',
        storage: 'Keep sealed in a cool, dry place.',
        approvalNo: 'Exhibition item; official number pending (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Heavy-metal & pesticide 3rd-party COA template (pending).',
        audience: 'Adults seeking seasonal daily comfort (no respiratory disease claims).',
        qa: [
          { q: 'Can it be combined with other Antrodia items?', a: 'Monitor total daily intake or consult a pharmacist.' },
          { q: 'Does it have a cooling taste?', a: 'Depends on final approved herbal ratios.' }
        ]
      }
    },
    {
      id: 'h6', sku: 'JH-OEM01', line: 'human', target: 'oem', form: 'service', purpose: 'oem', cert: 'thirdparty',
      priceTwd: 0, stock: 99, limit: 1, batch: '專案客製批次', expiry: '依合約排程', version: 'v17.0-demo',
      img: 'assets/lab.jpg', related: ['h1', 'h4'],
      zh: {
        name: 'OEM / ODM 代工開發',
        spec: '客製開發 · 最低訂購量依劑型議定（示意）',
        ingredients: '提供牛樟芝、益生菌、草本複方等配方設計、膠囊／粉劑／液劑規劃。',
        usage: '由專案團隊依客戶品牌定位提供打樣、包裝與規格文件支援。',
        storage: '依開發品項之安定性測試報告訂定保存條件。',
        approvalNo: '配合客戶辦理食品／外銷文件審查',
        approvalDate: '依專案合約排程',
        labReport: '可配合安排 SGS / 第三方檢驗與出口 COA 文件。',
        audience: '生醫品牌商、連鎖通路、企業送禮與海外經銷夥伴（須人工審核後報價）。',
        qa: [
          { q: '最小起訂量（MOQ）是多少？', a: '依膠囊、粉包或晶萃劑型不同而異，請透過洽詢表單或訂單系統由專人評估。' },
          { q: '是否支援英文出口文件？', a: '可支援英文規格書、裝箱單與報關所需檢驗文件架構。' }
        ]
      },
      en: {
        name: 'OEM / ODM Custom Development',
        spec: 'Custom Service · MOQ by dosage form (Demo)',
        ingredients: 'Custom formulation for Antrodia, probiotics, and herbal blends across capsules, powders, and liquids.',
        usage: 'End-to-end sampling, packaging, and compliance documentation support.',
        storage: 'Defined per stability testing of each custom SKU.',
        approvalNo: 'Supports client food-safety and export documentation review',
        approvalDate: 'Per project schedule',
        labReport: '3rd-party lab testing and export COA coordination available.',
        audience: 'Brands, pharmacy chains, corporate gifting, and global distributors (manual review required).',
        qa: [
          { q: 'What is the MOQ?', a: 'Varies by capsule, sachet, or liquid format; contact our team for a tailored quote.' },
          { q: 'Do you support export docs?', a: 'Yes, English spec sheets, packing lists, and COA templates are supported.' }
        ]
      }
    },
    {
      id: 'p1', sku: 'AN-P001', line: 'pet', target: 'cat', form: 'capsule', purpose: 'urinary', cert: 'vet-guide',
      priceTwd: 880, stock: 36, limit: 8, batch: 'AN2611A（示意）', expiry: '2028-10-30（示意）', version: 'v17.0-demo',
      img: 'assets/pet-cat.jpg', related: ['p2', 'p4'],
      zh: {
        name: '優利貓 尿道保健膠囊',
        spec: '貓用膠囊 · 30 粒／盒（公開通路規格）',
        ingredients: '貓用草本保養萃取複方（詳細劑量待公司核准文件確認）。',
        usage: '公開通路標示為每日一次、飯後食用；請依獸醫師指示調整。',
        storage: '陰涼乾燥處保存，避免潮濕結塊。',
        approvalNo: '寵物營養補充品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '寵物線獨立重金屬與微生物檢驗（範本預留，待補正式報告）。',
        audience: '貓咪日常泌尿道保養；不作泌尿疾病治療宣稱，不適請就醫。',
        qa: [
          { q: '可以打開膠囊拌入罐頭嗎？', a: '可視貓咪接受度拌食，建議依獸醫師或包裝正式指示使用。' },
          { q: '狗狗可以吃嗎？', a: '本品專為貓咪設計；犬貓共用需求請參考「優利威腸溶圓粒」。' }
        ]
      },
      en: {
        name: 'ANUBIS Cat Urinary Care Capsule',
        spec: 'Feline Capsule · 30 caps/box (Public channel spec)',
        ingredients: 'Feline herbal care blend (exact dosages pending company approval).',
        usage: 'Public listing notes once daily after meals; follow veterinarian guidance.',
        storage: 'Store in a cool, dry place.',
        approvalNo: 'Pet supplement labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Pet-line independent heavy-metal & microbial COA template (pending).',
        audience: 'Daily feline urinary care; not a treatment for urinary disease.',
        qa: [
          { q: 'Can I mix capsule powder into wet food?', a: 'Follow final packaging or veterinarian advice for administration.' },
          { q: 'Is it for dogs too?', a: 'Formulated for cats; see ANUBIS Urinary Enteric Pellets for dogs & cats.' }
        ]
      }
    },
    {
      id: 'p2', sku: 'AN-P002', line: 'pet', target: 'cat', form: 'capsule', purpose: 'cardio', cert: 'vet-guide',
      priceTwd: 920, stock: 28, limit: 8, batch: 'AN2611B（示意）', expiry: '2028-11-15（示意）', version: 'v17.0-demo',
      img: 'assets/pet-cat2.jpg', related: ['p1', 'p3'],
      zh: {
        name: '安芯貓 心血管日常保健',
        spec: '貓用口服膠囊 · 30 粒／盒（示意規格，待確認）',
        ingredients: '公開通路列為貓用心血管日常保養品項，配方細節待官方文件確認。',
        usage: '依包裝體重分級建議用量，並由獸醫師評估後使用（示意）。',
        storage: '避光乾燥常溫保存。',
        approvalNo: '寵物營養補充品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '第三方安全檢驗報告預留欄位（待公司補齊）。',
        audience: '熟齡貓或日常心血管保養需求；不替代心臟疾病醫療處方。',
        qa: [
          { q: '可與心臟處方藥物一起使用嗎？', a: '若毛孩正在服用處方藥物，務必先經主治獸醫師評估。' },
          { q: '需要長期補充嗎？', a: '請依獸醫師定期檢查結果安排日常保養週期。' }
        ]
      },
      en: {
        name: 'ANUBIS Cat Cardio Daily Care',
        spec: 'Feline Capsule · 30 caps/box (Demo spec)',
        ingredients: 'Listed in public channels for feline cardio routine care; exact formula pending official file.',
        usage: 'Follow weight-based label instructions and veterinarian guidance (Demo).',
        storage: 'Store away from light and moisture.',
        approvalNo: 'Pet supplement labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: '3rd-party safety COA template reserved.',
        audience: 'Senior cats or daily cardio routine support; never replaces veterinary prescriptions.',
        qa: [
          { q: 'Can it be used alongside heart medication?', a: 'Always consult your attending veterinarian before combining with prescriptions.' },
          { q: 'Is long-term use recommended?', a: 'Plan routine supplementation with your vet based on checkups.' }
        ]
      }
    },
    {
      id: 'p3', sku: 'AN-P003', line: 'pet', target: 'dog-cat', form: 'capsule', purpose: 'immunity', cert: 'vet-guide',
      priceTwd: 860, stock: 50, limit: 10, batch: 'AN2611C（示意）', expiry: '2028-09-20（示意）', version: 'v17.0-demo',
      img: 'assets/pet-dog.jpg', related: ['p2', 'p4'],
      zh: {
        name: '安敏口服膠囊 Enhance-Immunity',
        spec: '犬貓口服膠囊 · 30 粒／盒（示意規格，待確認）',
        ingredients: '犬貓日常防護草本與營養萃取（公開品名 Enhance-Immunity，劑量待確認）。',
        usage: '依犬貓體重每日 1–2 粒，建議依獸醫師指示使用（示意）。',
        storage: '置於陰涼乾燥處。',
        approvalNo: '寵物營養補充品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '重金屬與微生物檢驗報告預留（待公司補齊）。',
        audience: '犬貓換季與日常防護保養；不作免疫疾病治療宣稱。',
        qa: [
          { q: '幼犬幼貓可以使用嗎？', a: '離乳後幼犬貓使用劑量請先向獸醫師確認。' },
          { q: '與人用保健線有關聯嗎？', a: 'ANUBIS 寵物線完全獨立設計與管理，禁止跨線混用。' }
        ]
      },
      en: {
        name: 'ANUBIS Enhance-Immunity Capsule',
        spec: 'Dog & Cat Capsule · 30 caps/box (Demo spec)',
        ingredients: 'Canine & feline daily defense botanicals (dosage pending verification).',
        usage: '1–2 capsules daily by pet weight, per vet guidance (Demo).',
        storage: 'Store in a cool, dry place.',
        approvalNo: 'Pet supplement labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Heavy-metal & microbial COA template reserved.',
        audience: 'Dogs and cats for daily wellness; no disease-treatment claims.',
        qa: [
          { q: 'Is it safe for puppies and kittens?', a: 'Consult a veterinarian for young pet dosing.' },
          { q: 'Does it share formulas with the human line?', a: 'No. ANUBIS is strictly separated from human supplements.' }
        ]
      }
    },
    {
      id: 'p4', sku: 'AN-P004', line: 'pet', target: 'dog-cat', form: 'powder', purpose: 'urinary', cert: 'thirdparty',
      priceTwd: 760, stock: 45, limit: 10, batch: 'AN2611D（示意）', expiry: '2028-10-01（示意）', version: 'v17.0-demo',
      img: 'assets/pet-puppy.jpg', related: ['p1', 'p3'],
      zh: {
        name: '優利威腸溶圓粒',
        spec: '犬貓腸溶圓粒 · 15 包／盒（公開通路規格）',
        ingredients: '公開成分包含化石草、紅石榴、車前草、茯苓、決明子、蔓越莓等萃取（比例待確認）。',
        usage: '依體重拌入飼料或直接餵食，建議搭配充足飲水（示意）。',
        storage: '常溫乾燥處密封保存。',
        approvalNo: '寵物營養補充品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '草本農殘與微生物檢驗報告預留（待公司補齊）。',
        audience: '犬貓適用日常泌尿保養；急症或血尿狀況請立即就醫。',
        qa: [
          { q: '腸溶圓粒有什麼優點？', a: '圓粒設計便於混入濕食或乾糧餵食，適口性佳（示意）。' },
          { q: '需要搭配多喝水嗎？', a: '是的，日常泌尿保養建議同步維持毛孩充足飲水。' }
        ]
      },
      en: {
        name: 'ANUBIS Urinary Enteric Pellets',
        spec: 'Dog & Cat Enteric Pellets · 15 sachets/box (Public spec)',
        ingredients: 'Orthosiphon, pomegranate, plantain, poria, cassia seed, cranberry extracts (ratios pending).',
        usage: 'Mix with food by body weight and ensure adequate hydration (Demo).',
        storage: 'Keep sealed in a dry place.',
        approvalNo: 'Pet supplement labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Herbal pesticide & microbial COA template reserved.',
        audience: 'Dogs and cats for daily urinary care; seek immediate vet care for acute symptoms.',
        qa: [
          { q: 'Why enteric pellets?', a: 'Easy to mix into dry or wet food for better acceptance (Demo).' },
          { q: 'Should my pet drink more water?', a: 'Yes, hydration is key alongside routine urinary care.' }
        ]
      }
    },
    {
      id: 'p5', sku: 'AN-P005', line: 'pet', target: 'dog-cat', form: 'drops', purpose: 'eye', cert: 'vet-guide',
      priceTwd: 690, stock: 60, limit: 10, batch: 'AN2611E（示意）', expiry: '2028-07-30（示意）', version: 'v17.0-demo',
      img: 'assets/product-extract.jpg', related: ['p6', 'p7'],
      zh: {
        name: '千力光 護眼液 10ml',
        spec: '眼部保養液 · 10ml／瓶（公開通路規格）',
        ingredients: '犬貓眼部日常清潔與舒緩保養成分（詳細配方待公司核准文件確認）。',
        usage: '每日 1–2 次清潔眼周或依獸醫師指示使用（示意）。',
        storage: '陰涼處保存，開封後建議於 30 天內使用完畢。',
        approvalNo: '寵物外用保養品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '無菌與刺激性測試報告預留（待公司補齊）。',
        audience: '犬貓日常眼部清潔保養；若有紅腫分泌物異常請諮詢獸醫師。',
        qa: [
          { q: '開封後可以放多久？', a: '建議開封後一個月內用完，避免瓶口接觸毛孩眼部或手部。' },
          { q: '與晶漾眼部保養液差別？', a: '晶漾主打玻尿酸與尿囊素保濕，千力光定位日常護眼清潔保養。' }
        ]
      },
      en: {
        name: 'ANUBIS Eye Care Solution 10ml',
        spec: 'Eye Care Drops · 10ml/bottle (Public spec)',
        ingredients: 'Gentle canine & feline eye cleansing and soothing solution (formula pending).',
        usage: '1–2 times daily or as directed by a veterinarian (Demo).',
        storage: 'Keep cool; use within 30 days after opening.',
        approvalNo: 'Pet external care labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Sterility & irritation test template reserved.',
        audience: 'Routine pet eye hygiene; consult a vet for redness or abnormal discharge.',
        qa: [
          { q: 'How long does it last after opening?', a: 'Recommended within 30 days; avoid touching the dropper tip.' },
          { q: 'Difference from Jing-Yang Eye Care?', a: 'Jing-Yang focuses on hyaluronic acid & allantoin hydration.' }
        ]
      }
    },
    {
      id: 'p6', sku: 'AN-P006', line: 'pet', target: 'dog-cat', form: 'drops', purpose: 'eye', cert: 'thirdparty',
      priceTwd: 690, stock: 55, limit: 10, batch: 'AN2611F（示意）', expiry: '2028-08-15（示意）', version: 'v17.0-demo',
      img: 'assets/quality.jpg', related: ['p5', 'p7'],
      zh: {
        name: '晶漾 眼部保養液 10ml',
        spec: '眼部保濕液 · 10ml／瓶（公開通路規格）',
        ingredients: '玻尿酸、尿囊素與等張緩衝液（濃度待公司核准確認）。',
        usage: '專注眼部保濕與日常保養，依包裝或獸醫師指示使用（示意）。',
        storage: '避光常溫保存，開封後盡速使用。',
        approvalNo: '寵物外用保養品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: 'pH 值、滲透壓與無菌檢驗預留（待公司補齊）。',
        audience: '犬貓眼部保濕與日常保養；非眼疾治療藥水。',
        qa: [
          { q: '含有類固醇或抗生素嗎？', a: '本品定位為玻尿酸與尿囊素日常保養液，不含藥用成分（以正式核准標示為準）。' },
          { q: '犬貓皆適用嗎？', a: '是的，犬貓日常眼部保濕皆可使用。' }
        ]
      },
      en: {
        name: 'ANUBIS Moist Eye Care 10ml',
        spec: 'Hydrating Eye Drops · 10ml/bottle (Public spec)',
        ingredients: 'Hyaluronic acid, allantoin, isotonic buffer (concentration pending).',
        usage: 'For routine eye moisture; follow packaging or vet guidance (Demo).',
        storage: 'Store away from light; use promptly after opening.',
        approvalNo: 'Pet external care labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'pH, osmolality & sterility COA template reserved.',
        audience: 'Daily eye hydration for dogs and cats; not an ophthalmic drug.',
        qa: [
          { q: 'Does it contain steroids or antibiotics?', a: 'Formulated for routine hydration without medicinal drugs (subject to approved label).' },
          { q: 'Suitable for both dogs and cats?', a: 'Yes, suitable for both.' }
        ]
      }
    },
    {
      id: 'p7', sku: 'AN-P007', line: 'pet', target: 'dog-cat', form: 'spray', purpose: 'skin', cert: 'vet-guide',
      priceTwd: 580, stock: 72, limit: 12, batch: 'AN2611G（示意）', expiry: '2028-11-10（示意）', version: 'v17.0-demo',
      img: 'assets/nature.jpg', related: ['p8', 'p9'],
      zh: {
        name: '華康寵物理膚噴劑 50ml',
        spec: '外用噴劑 · 50ml／瓶（公開通路規格）',
        ingredients: '天然草本萃取外用配方（詳細成分比例待公司文件確認）。',
        usage: '距離毛孩皮膚 10–15 公分適量噴灑，建議依獸醫師指示使用。',
        storage: '置於陰涼處，遠離火源與孩童可觸及處。',
        approvalNo: '寵物外用護理品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '微生物與皮膚相容性測試預留（待公司補齊）。',
        audience: '犬貓日常皮膚護理；開放性傷口請先就醫。',
        qa: [
          { q: '毛孩舔到怎麼辦？', a: '雖採草本基底，仍建議噴灑後戴上頭套待乾燥，避免舔舐。' },
          { q: '每天可以使用幾次？', a: '依獸醫師或正式包裝指示使用。' }
        ]
      },
      en: {
        name: 'ANUBIS Herbal Skin Spray 50ml',
        spec: 'Topical Spray · 50ml/bottle (Public spec)',
        ingredients: 'Natural herbal topical extract blend (ratios pending verification).',
        usage: 'Spray 10–15cm from skin as directed by a veterinarian.',
        storage: 'Keep cool and out of reach of children.',
        approvalNo: 'Pet topical care labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Microbial & dermal compatibility template reserved.',
        audience: 'Routine canine & feline skin care; consult a vet for open wounds.',
        qa: [
          { q: 'What if my pet licks it?', a: 'Use an e-collar until dry to prevent licking.' },
          { q: 'How often can it be applied?', a: 'Follow veterinarian or approved label directions.' }
        ]
      }
    },
    {
      id: 'p8', sku: 'AN-P008', line: 'pet', target: 'dog-cat', form: 'spray', purpose: 'skin', cert: 'vet-guide',
      priceTwd: 580, stock: 68, limit: 12, batch: 'AN2611H（示意）', expiry: '2028-11-20（示意）', version: 'v17.0-demo',
      img: 'assets/forest.jpg', related: ['p7', 'p9'],
      zh: {
        name: '恩菲斯寵物外用噴劑 50ml',
        spec: '外用噴劑 · 50ml／瓶（公開通路規格）',
        ingredients: '天然草本萃取外用液（詳細配方待公司文件確認）。',
        usage: '公開通路標示每日 2 至 4 次、按壓噴灑於局部區域。',
        storage: '陰涼乾燥處常溫保存。',
        approvalNo: '寵物外用護理品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '第三方安全檢測報告預留（待公司補齊）。',
        audience: '犬貓局部皮膚外用日常護理；不作皮膚病治療宣稱。',
        qa: [
          { q: '可噴灑於眼周嗎？', a: '請避開眼睛與口鼻黏膜；眼部請選用專用護眼液。' },
          { q: '適合長毛犬貓嗎？', a: '使用時可撥開毛髮噴灑於皮膚表層。' }
        ]
      },
      en: {
        name: 'ANUBIS Enfes Pet Spray 50ml',
        spec: 'Topical Spray · 50ml/bottle (Public spec)',
        ingredients: 'Natural herbal topical extract (formula pending verification).',
        usage: 'Public listing notes 2–4 times daily on targeted areas.',
        storage: 'Store in a cool, dry place.',
        approvalNo: 'Pet topical care labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: '3rd-party safety test template reserved.',
        audience: 'Daily topical pet skin care; not a skin-disease treatment.',
        qa: [
          { q: 'Can it be sprayed near eyes?', a: 'Avoid eyes and mucous membranes; use dedicated eye care drops instead.' },
          { q: 'Works for long-haired pets?', a: 'Part the fur gently before applying to skin.' }
        ]
      }
    },
    {
      id: 'p9', sku: 'AN-P009', line: 'pet', target: 'dog-cat', form: 'powder', purpose: 'skin', cert: 'vet-guide',
      priceTwd: 520, stock: 52, limit: 10, batch: 'AN2611J（示意）', expiry: '2028-12-01（示意）', version: 'v17.0-demo',
      img: 'assets/product-natural.jpg', related: ['p7', 'p8'],
      zh: {
        name: '傷妥立外用粉劑 10g',
        spec: '外用粉劑 · 10g／瓶（公開通路規格）',
        ingredients: '選用中藥天然素材（詳細成分與比例待公司核准文件確認）。',
        usage: '局部清潔後適量撒敷，維持乾燥；建議由獸醫師指示使用。',
        storage: '務必旋緊瓶蓋防潮，置於陰涼乾燥處。',
        approvalNo: '寵物外用護理品標示待公司核准（示意）',
        approvalDate: '待公司核准確認',
        labReport: '重金屬與微生物檢驗預留（待公司補齊）。',
        audience: '犬貓局部乾爽護理；嚴重傷口請立即由獸醫師處理。',
        qa: [
          { q: '粉劑與噴劑如何選擇？', a: '需要維持局部乾爽時多選用粉劑；大面積噴灑便利性則可參考噴劑，並請諮詢獸醫師。' },
          { q: '開封後如何防潮？', a: '使用後請立即鎖緊瓶蓋並避開浴室等高濕環境。' }
        ]
      },
      en: {
        name: 'ANUBIS Topical Care Powder 10g',
        spec: 'Topical Powder · 10g/bottle (Public spec)',
        ingredients: 'Traditional botanical natural powder (ratios pending verification).',
        usage: 'Apply lightly to keep area dry; follow veterinarian guidance.',
        storage: 'Keep tightly capped in a dry place.',
        approvalNo: 'Pet topical care labeling pending approval (Demo)',
        approvalDate: 'Pending company approval',
        labReport: 'Heavy-metal & microbial COA template reserved.',
        audience: 'Localized dry care for dogs and cats; seek vet care for severe wounds.',
        qa: [
          { q: 'Powder vs. Spray?', a: 'Powder helps keep localized areas dry; sprays cover broader areas. Consult your vet.' },
          { q: 'How to prevent clumping?', a: 'Tightly close the cap immediately and avoid humid areas.' }
        ]
      }
    }
  ];
})(window);

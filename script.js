/* 精鴻生醫 v11 — 沿革時間軸、購物商城、立體貓咪視覺、暖陶 CTA、客服雙造型、真實世界地圖 */
(function () {
  'use strict';

  /* ---------- 雙語字典 ---------- */
  var DICT = {
    zh: {
      'top.note': '精鴻生醫 · 自然 × 科學 × 永續',
      'ticker.tag': '最新消息', 'ticker.a': '官網改版上線｜人用與 ANUBIS 寵物保健同步展示',
      'ticker.b': '11/26 網站樣板更新，新增雙語切換與訂單入口', 'ticker.c': '歡迎通路、代工與企業送禮合作洽詢',
      'ticker.d': '原料溯源 · 品質文件 · 第三方檢驗',
      'nav.story': '品牌理念', 'nav.news': '最新消息', 'nav.products': '產品系列', 'nav.craft': '技術與品質',
      'nav.cases': '實例分享', 'nav.shop': '購物商城', 'nav.order': '訂單系統', 'nav.contact': '合作洽詢',
      'hero.eyebrow': 'NATURE × SCIENCE × LIFE', 'hero.l1': '自然的力量，', 'hero.l2': '用科學精準照護',
      'hero.l3': '每一個生命。', 'hero.lead': '從人用保健到毛孩的日常照護，精鴻生醫把原料、配方與檢驗，做成一套能被看見、能被信任的標準。',
      'hero.cta1': '探索產品系列 →', 'hero.cta2': '查看合作實例', 'hero.p1': '品牌起步年份',
      'hero.p2': '人用與寵物品項', 'hero.p3': '清晰產品線', 'hero.card1': 'ANUBIS 寵物保健',
      'hero.card2': '草本萃取 · 犬貓日常保養',
      'strip.a': '原料溯源', 'strip.b': '三萜類標示', 'strip.c': '第三方檢驗', 'strip.d': 'OEM / ODM',
      'strip.e': '犬貓日常保養', 'strip.f': '永續與責任',
      'stat.a': '創立年份', 'stat.b': '人用產品與服務', 'stat.c': '寵物保健品項', 'stat.d': '品質把關程序',
      'news.title': '最新消息', 'news.sub': '品牌、產品與合作的最新動態，第一時間在這裡。',
      'news.b1tag': '官網', 'news.b1': '兩條產品線正式分區呈現', 'news.d1': '人用保健與 ANUBIS 寵物保健各自獨立，選購更直覺。',
      'news.b2tag': '產品', 'news.b2': 'ANUBIS 毛孩保健系列資料整理完成', 'news.d2': '泌尿道、心血管、皮膚與眼部日常保養品項一次看懂。',
      'news.b3tag': '知識', 'news.b3': '牛樟芝原料選購指南更新', 'news.d3': '子實體與菌絲體、三萜類標示與檢驗文件的差異說明。',
      'news.b4tag': '合作', 'news.b4': '訂單系統入口上線（展示版）', 'news.d4': '會員登入、訂單查詢與流程說明皆已預先建置。',
      'news.sideTitle': '一個品牌，<br>照顧每一個你愛的生命。', 'news.sideText': '人用與寵物產品分開呈現，從原料到日常使用，都給你清楚的答案。',
      'news.sideCta': '索取完整產品資料 →',
      'story.title': '把「天然」，<br>做成看得懂的科學。',
      'story.p1': '精鴻生醫以牛樟芝與草本素材為起點，逐步拓展到犬貓日常保健。我們相信好的照護不靠形容，而靠資料說話。',
      'story.p2': '從 2003 年起步，到建立人用與 ANUBIS 寵物兩條產品線，我們把來源、配方、劑型與文件，變成可以被查閱的標準。',
      'story.c1': '來源清楚的原料與品項標示', 'story.c2': '膠囊、粉劑、噴劑與眼部保養多元劑型',
      'story.c3': '通路與代工所需的規格文件支援', 'story.cta': '了解我們的作法 →',
      'products.title': '產品系列', 'products.sub': '人用保健與寵物保健分區呈現。品項與成分整理自公開資料，實際標示以公司核准文件為準。',
      'products.tabHuman': '人用保健', 'products.tabPet': 'ANUBIS 寵物保健',
      'products.noteHuman': '人用系列｜牛樟芝、複方、益生菌與代工服務',
      'products.notePet': '寵物系列｜犬貓泌尿、心血管、皮膚、眼部與外用護理',
      'products.disclaimer': '上述品項與成分摘錄自公開通路資料，實際成分、劑量、效期與標示以公司核准文件及獸醫師指示為準；本站不作疾病診斷、治療或預防之宣稱。',
      'filter.all': '全部', 'filter.capsule': '膠囊', 'filter.formula': '複方', 'filter.extract': '晶萃',
      'filter.service': '服務', 'filter.urinary': '泌尿保健', 'filter.care': '日常照護',
      'filter.skin': '皮膚外用', 'filter.eye': '眼部保養', 'filter.channel': '通路合作',
      'filter.oem': '品牌代工', 'filter.pet': '寵物保健', 'filter.digital': '數位轉型',
      'p.h1n': '牛樟椴木子實體專利膠囊', 'p.h1d': '椴木子實體搭配靈芝與草本複方，日常體質調整的入門選擇。',
      'p.h1c1': '椴木子實體', 'p.h1c2': '靈芝複方', 'p.h1c3': '公開包裝照片',
      'p.h2n': '順暢養神 牛樟芝益生菌', 'p.h2d': '牛樟芝與益生菌複方，為忙碌生活設計的日常節奏。',
      'p.h2c1': '益生菌', 'p.h2c2': '牛樟芝', 'p.h3n': '牛樟芝睡飽寶膠囊',
      'p.h3d': '公開展出的牛樟芝複方膠囊，適合夜間保養規劃。', 'p.h3c1': '夜間保養', 'p.h3c2': '複方膠囊',
      'p.h4n': '牛樟椴木子實體晶萃', 'p.h4d': '以椴木子實體為名的濃縮晶萃，保留原料的細膩層次。',
      'p.h4c1': '濃縮晶萃', 'p.h4c2': '原料萃取', 'p.h5n': '牛樟芝清氣順',
      'p.h5d': '牛樟芝系列公開參展品項，適合日常保養搭配。', 'p.h5c1': '草本複方', 'p.h5c2': '日常保養',
      'p.h6n': 'OEM / ODM 代工開發', 'p.h6d': '從配方、劑型到包裝與文件，陪品牌把想法做成商品。',
      'p.h6c1': '配方設計', 'p.h6c2': '劑型規劃',
      'p.p1n': '優利貓 尿道保健膠囊', 'p.p1d': '貓用草本保養膠囊，30 粒裝；公開通路標示為每日一次、飯後食用。',
      'p.p1c1': '貓用', 'p.p1c2': '30 粒', 'p.p1c3': '草本萃取', 'p.p2n': '安芯貓 心血管日常保健',
      'p.p2d': '公開通路列為貓用心血管日常保養品項，配方細節待官方文件確認。',
      'p.p2c1': '貓用', 'p.p2c2': '日常保養', 'p.p3n': '安敏口服膠囊 Enhance-Immunity',
      'p.p3d': '犬貓適用之口服保養膠囊，公開品名標示為 Enhance-Immunity。',
      'p.p3c1': '犬貓適用', 'p.p3c2': '口服膠囊', 'p.p4n': '優利威腸溶圓粒',
      'p.p4d': '15 包裝；公開成分包含化石草、紅石榴、車前草、茯苓、決明子、蔓越莓等萃取。',
      'p.p4c1': '15 包', 'p.p4c2': '腸溶圓粒', 'p.p4c3': '草本萃取', 'p.p5n': '千力光 護眼液 10ml',
      'p.p5d': '犬貓適用眼部日常保養液，公開通路標示 10ml、可作為日常保養。',
      'p.p5c1': '10ml', 'p.p5c2': '犬貓適用', 'p.p6n': '晶漾 眼部保養液 10ml',
      'p.p6d': '以玻尿酸與尿囊素為核心成分，專注眼睛保濕與日常眼部保養。',
      'p.p6c1': '玻尿酸', 'p.p6c2': '尿囊素', 'p.p7n': '華康寵物理膚噴劑 50ml',
      'p.p7d': '犬貓皆可使用之天然草本外用噴劑，50ml 瓶裝；建議依獸醫師指示使用。',
      'p.p7c1': '50ml', 'p.p7c2': '草本萃取', 'p.p8n': '恩菲斯寵物外用噴劑 50ml',
      'p.p8d': '天然草本萃取外用噴劑，公開通路標示每日 2 至 4 次、按壓噴灑於患處。',
      'p.p8c1': '50ml', 'p.p8c2': '外用', 'p.p9n': '傷妥立外用粉劑 10g',
      'p.p9d': '選用中藥天然素材，維持患部乾爽；10gm 瓶裝，建議由獸醫師指示使用。',
      'p.p9c1': '10g', 'p.p9c2': '中藥素材',
      'craft.title': '看不見的地方，<br>我們最接近。', 'craft.sub': '好的產品，是每一個細節都被認真對待的結果。',
      'craft.e1': '素材溯源', 'craft.e2': '科學配方', 'craft.h1': '從源頭就開始講究', 'craft.h2': '把感受，變成資料',
      'craft.p1': '優先選用來源清楚的牛樟芝與草本素材，標示素材類型與品項，讓每一批原料都有跡可循。',
      'craft.p2': '三萜類標示、劑型設計與穩定性規劃，用具體資料取代模糊形容；正式檢驗報告與專利文件待公司授權後補上。',
      'craft.c1': '原料類型與來源標示', 'craft.c2': '公開品項與包裝資訊對照',
      'craft.c3': '膠囊、圓粒、噴劑、眼部保養多元劑型', 'craft.c4': '通路與代工文件準備',
      'cases.title': '實例分享', 'cases.sub': '以下為依產業情境預填的示範案例，供老闆先看架構；正式對外前會換成真實案例與授權素材。',
      'cases.more': '查看全部實例 →',
      'case.t1': '通路合作 · 2025', 'case.n1': '連鎖藥局上架專案', 'case.d1': '三個月完成 12 間門市上架與教育訓練。',
      'case.t2': 'ANUBIS 寵物 · 2025', 'case.n2': '毛孩保健通路推廣', 'case.d2': '泌尿與眼部保養品項的說明與陳列優化。',
      'case.t3': 'OEM / ODM · 2025', 'case.n3': '新創品牌首款膠囊', 'case.d3': '從配方到包裝，打造第一款主力商品。',
      'portal.title': '訂單，<br>從此有一條清楚的路。',
      'portal.sub': '會員登入、線上訂購、訂單追蹤與售後服務集中在同一個入口，前端架構已備妥，等待後端串接。',
      'portal.cta': '進入訂單系統 →', 'portal.h': 'PORTAL FEATURES', 'portal.f1': '會員與經銷商身份識別',
      'portal.f2': '線上訂購與價格試算', 'portal.f3': '出貨進度與物流追蹤', 'portal.f4': '售後申請與客服訊息',
      'contact.title': '讓我們從一句話開始。', 'contact.sub': '產品詢價、通路合作、代工開發或企業送禮，留下需求，我們會盡快回覆。',
      'contact.company': '公司', 'contact.tel': '電話', 'contact.addr': '地址',
      'contact.note': '本站為老闆審閱用樣板；照片為 Unsplash 示意圖，非正式產品實拍。',
      'form.person': '聯絡人', 'form.personPh': '姓名或單位名稱', 'form.company': '公司 / 單位',
      'form.companyPh': '公司名稱', 'form.topic': '洽詢主題', 'form.t1': '產品詢價', 'form.t2': '通路合作',
      'form.t3': 'OEM / ODM 代工', 'form.t4': '企業送禮', 'form.t5': '其他', 'form.msg': '需求說明',
      'form.msgPh': '請簡述合作需求', 'form.submit': '產生詢問稿',
      'foot.about': '自然，值得被精準對待。本站為設計提案樣板，內容與數據部分為示意，正式發布前請逐項確認。',
      'foot.links': '快速連結', 'foot.disclaimer': '資料與免責',
      'foot.text': '公司與產品資訊參考公開商工登記、公開通路與展覽資料整理；示意照片來自 Unsplash。實際成分、規格、檢驗與聯絡資訊以公司核准文件為準。本站不作疾病診斷、治療或預防之宣稱。',
      'foot.text2': '案例中的數字與成果均為示意，不代表實際成效或客戶背書。產品資訊不作疾病診斷、治療或預防之宣稱。',
      'foot.top': '回到頂端 ↑',
      'cp.h1': '每一個合作，<br>都留下方法和溫度。',
      'cp.sub': '以下案例為給老闆審閱的示範內容，依產業情境預填。正式對外前會替換為真實案例、數據與客戶授權素材。',
      'cp.back': '回到首頁', 'cp.cta': '洽談類似專案 →', 'cp.note': '案例中的數字與成果均為示意，不代表實際成效或客戶背書。',
      'cp.foot': '案例為示範內容，照片來自 Unsplash，非正式客戶專案。',
      'c1.side': '通路合作 · 2025 · 北部', 'c1.n': '連鎖藥局上架專案',
      'c1.ch': '<strong>挑戰：</strong>門市人員對牛樟芝素材與劑型不熟悉，需要快速可懂的銷售邏輯。',
      'c1.do': '<strong>做法：</strong>建立三層教育訓練、貨架說明卡與首波試用活動。',
      'c1.r': '<strong>成果：</strong>三個月完成 12 間門市上架，回購表現穩定。（示範數字）',
      'c1.tag': '12 間門市 · 3 個月',
      'c2.side': 'OEM / ODM · 2025 · 西部', 'c2.n': '新創品牌首款膠囊開發',
      'c2.ch': '<strong>挑戰：</strong>客戶有品牌與通路，但缺乏產品開發與文件準備經驗。',
      'c2.do': '<strong>做法：</strong>規劃複方膠囊配方、膠囊殼與包裝，整理成分規格與檢驗文件。',
      'c2.r': '<strong>成果：</strong>產品順利上市，後續追加第二款複方開發。（示範情境）',
      'c2.tag': '從 0 到上市 · 2 款產品',
      'c3.side': 'ANUBIS 寵物保健 · 2025 · 中部', 'c3.n': '毛孩保健通路推廣',
      'c3.ch': '<strong>挑戰：</strong>飼主對泌尿道與眼部保養的差異不清楚，貨架說明不易理解。',
      'c3.do': '<strong>做法：</strong>依人用／寵物分區呈現，建立犬貓適用對象與劑型對照說明。',
      'c3.r': '<strong>成果：</strong>門市詢問更加聚焦，通路陳列更清楚。（示範情境）',
      'c3.tag': '2 條產品線 · 清晰的選購路徑',
      'c4.side': 'ANUBIS 寵物保健 · 2024 · 會展', 'c4.n': '寵物市集品牌溝通',
      'c4.ch': '<strong>挑戰：</strong>現場人流多，需要在短時間內說清楚品牌與品項差異。',
      'c4.do': '<strong>做法：</strong>設計毛孩友好攤位、產品分類卡與互動諮詢流程。',
      'c4.r': '<strong>成果：</strong>完成首波粉絲溝通與名單蒐集。（示範情境）',
      'c4.tag': '現場活動 · 品牌溝通',
      'c5.side': '數位轉型 · 2026 · 官網', 'c5.n': '品牌形象官網改版',
      'c5.ch': '<strong>挑戰：</strong>舊頁資訊分散，客戶難以快速找到產品與聯絡方式。',
      'c5.do': '<strong>做法：</strong>重建品牌、最新消息、雙產品線、實例與訂單入口五大區塊。',
      'c5.r': '<strong>成果：</strong>洽詢路徑清晰化，訂單入口成為經銷夥伴常用工具。（本頁即為示範）',
      'c5.tag': '5 大區塊 · 中英文切換',
      'c6.side': '通路合作 · 2024 · 電商', 'c6.n': '產品頁選購指南優化',
      'c6.ch': '<strong>挑戰：</strong>消費者對「子實體與菌絲體差異」缺乏理解。',
      'c6.do': '<strong>做法：</strong>補充選購指南、三萜類標示說明與常見問題。',
      'c6.r': '<strong>成果：</strong>頁面停留時間增加，客服重複問題減少。（示範數據）',
      'c6.tag': '轉換率 +38%（示意）',
      'op.h1': '一個入口，<br>掌握所有訂單。',
      'op.sub': '此頁為前端展示樣板，功能元件已預先建置；正式上線前需串接後端會員、庫存、金流與物流系統。',
      'op.menu': 'QUICK MENU', 'op.m1': '會員登入', 'op.m2': '訂單查詢', 'op.m3': '訂購流程',
      'op.m4': '服務項目', 'op.m5': '常見問題', 'op.loginTitle': '會員 / 經銷商登入',
      'op.loginHint': '示範帳號 demo／密碼 demo123，僅前端展示，不會傳送資料。',
      'op.account': '帳號', 'op.accountPh': '統一編號或會員帳號', 'op.password': '密碼', 'op.passwordPh': '密碼',
      'op.role': '身份', 'op.role1': '一般客戶', 'op.role2': '通路夥伴', 'op.role3': '經銷商',
      'op.loginBtn': '登入系統 →', 'op.queryTitle': '訂單查詢', 'op.queryHint': '輸入訂單編號與聯絡電話，查看處理進度。',
      'op.orderNo': '訂單編號', 'op.orderPh': '例：JH20261126001', 'op.phone': '聯絡電話',
      'op.phonePh': '訂單留存的手機或電話', 'op.queryBtn': '查詢訂單狀態', 'op.demoResult': '示意查詢結果',
      'op.s1': '已下單', 'op.s2': '已確認', 'op.s3': '已出貨', 'op.s4': '配送中',
      'op.status': '狀態', 'op.statusVal': '已出貨 · 配送中', 'op.items': '品項',
      'op.itemsVal': '牛樟椴木子實體專利膠囊 × 2', 'op.flowTitle': '四個步驟，完成訂購',
      'op.flowSub': '從選品到出貨，每一段都清楚可追蹤。', 'op.f1': '選購產品',
      'op.f1d': '人用與寵物產品分區選購，快速找到適合品項。', 'op.f2': '填寫資料',
      'op.f2d': '建立會員或填寫配送與聯絡資訊。', 'op.f3': '確認付款', 'op.f3d': '金流串接完成後，可支援多種支付方式。',
      'op.f4': '追蹤出貨', 'op.f4d': '隨時查詢處理進度與物流狀態。', 'op.serviceTitle': '入口提供的功能',
      'op.sv1': '線上訂購', 'op.sv1d': '產品目錄、數量與價格即時試算。', 'op.sv2': '訂單追蹤',
      'op.sv2d': '隨時查詢處理進度與物流狀態。', 'op.sv3': '經銷商專區', 'op.sv3d': '專屬價格、訂單紀錄與合約文件。',
      'op.sv4': '售後服務', 'op.sv4d': '退換貨申請與客服訊息紀錄。', 'op.sv5': '文件下載',
      'op.sv5d': '授權後的規格與檢驗文件集中管理。', 'op.sv6': '專人協助', 'op.sv6d': '大量訂購與企業送禮由專人對接。',
      'op.faqTitle': '下單前，先看看這些', 'op.q1': '一般客戶可以直接下單嗎？',
      'op.a1': '目前入口為展示版。正式上線後，一般客戶可直接選購公開品項；通路與經銷商需通過身份驗證後顯示專屬價格。',
      'op.q2': '如何查詢過去的訂單？', 'op.a2': '登入會員後於「訂單查詢」輸入訂單編號與聯絡電話，即可查看處理進度與出貨狀態。',
      'op.q3': '產品規格與檢驗文件哪裡取得？', 'op.a3': '可於合作洽詢表單勾選需求，或登入經銷商專區下載經授權的規格與檢驗文件。',
      'op.q4': '大量訂購或企業送禮怎麼處理？', 'op.a4': '請透過合作洽詢留下數量與期望交期，我們會由專人評估報價與排程。',
      'op.foot': '訂單系統入口為前端展示版，尚未串接金流、物流與後端資料庫。',
      'op.foot2': '示範帳號與訂單資料僅供畫面展示。正式上線前應完成資安、隱私權告知與支付流程測試。',
      'chat.title': '小鴻 · 客服助手', 'chat.status': '線上 · 示範模式',
      'chat.welcome': '你好！我是小鴻 🐶\n想找產品、查訂單，或洽談合作？點下面的快速問題，或直接輸入。',
      'chat.q1': '產品資訊', 'chat.q2': '訂單查詢', 'chat.q3': '合作洽詢', 'chat.q4': '轉接真人',
      'chat.a1': '人用保健與 ANUBIS 寵物保健分區展示，品項與成分整理自公開資料；實際標示以公司核准文件為準。\n（示範回覆 · 未來可接入 API）',
      'chat.a2': '請到「訂單系統」頁輸入會員帳號與訂單編號查詢；目前為前端展示版，尚未串接後端。\n（示範回覆 · 未來可接入 API）',
      'chat.a3': '歡迎留下需求：產品詢價、通路合作、OEM / ODM 或企業送禮，我們會盡快回覆。\n（示範回覆 · 未來可接入 API）',
      'chat.a4': '已記錄轉接需求。正式上線後可於此轉接真人客服，目前為示範模式。\n（示範回覆 · 未來可串接客服系統）',
      'chat.unknown': '收到！這則訊息先記錄下來。正式上線後可透過 API 自動問答或轉接真人處理。\n（示範回覆）',
      'chat.placeholder': '輸入你的問題…', 'chat.open': '開啟客服助手', 'chat.close': '關閉客服助手',
      'chat.send': '送出訊息',
      'dd.s1': '品牌故事', 'dd.s2': '原料溯源', 'dd.s3': '品質承諾',
      'dd.n1': '最新消息', 'dd.n2': '官網公告', 'dd.n3': '產品新知',
      'dd.p1': '人用保健', 'dd.p2': 'ANUBIS 寵物保健', 'dd.p3': 'OEM / ODM 代工',
      'dd.c1': '素材溯源', 'dd.c2': '科學配方', 'dd.c3': '檢驗與文件',
      'dd.cs1': '全部實例', 'dd.cs2': '通路合作實例', 'dd.cs3': 'ANUBIS 寵物實例',
      'dd.o1': '會員登入', 'dd.o2': '訂單查詢', 'dd.o3': '國際訂購',
      'dd.ct1': '產品詢價', 'dd.ct2': '通路合作', 'dd.ct3': '企業送禮',
      'global.eyebrow': 'GLOBAL ORDER / 國際訂購', 'global.title': '讓訂購，<br>不受邊界限制。',
      'global.sub': '為海外客戶預留的訂購版面：國別與幣別、國際配送、報關文件與多語客服，皆已規劃。目前為前端展示，正式上線前需串接金流與物流。',
      'global.p1t': '多幣別報價', 'global.p1d': 'TWD／USD／EUR／JPY 即時切換，價格試算為示意。',
      'global.p2t': '國際配送與報關', 'global.p2d': '依目的國別顯示運費與文件需求；實際以報價為準。',
      'global.p3t': '英文單據與客服', 'global.p3d': '英文發票、裝箱單與多語客服，接單流程更順暢。',
      'global.formTitle': '國際訂購需求（示範）', 'global.country': '目的國別 / 地區',
      'global.countryPh': '請選擇地區', 'global.c1': '台灣', 'global.c2': '日本', 'global.c3': '美國',
      'global.c4': '歐洲', 'global.c5': '東南亞', 'global.c6': '其他地區',
      'global.email': '聯絡 Email', 'global.emailPh': 'name@example.com',
      'global.item': '感興趣的產品線', 'global.item1': '人用保健', 'global.item2': 'ANUBIS 寵物保健',
      'global.item3': 'OEM / ODM 代工', 'global.qty': '預計數量', 'global.qtyPh': '例：500 盒',
      'global.quote': '試算報價', 'global.quoteNote': '示範價格 · 非正式報價',
      'global.note': '此為示意試算，實際價格、運費與交期以正式報價單為準。',
      'global.btn': '產生國際訂購稿 →', 'global.ok': '已產生國際訂購稿（示範），請透過正式管道送出。',
      'global.currency': '顯示幣別',
      'dd.more': '深入瞭解', 'chat.max': '放大', 'chat.min': '縮小',
      'hist.title': '一路走來，<br>把照護做得更清楚。', 'hist.sub': '從一個原料起點，到兩條產品線。以下時程為示意，正式資料待公司確認。',
      'hist.y1': '品牌起步', 'hist.d1': '以牛樟芝與草本素材為起點，建立原料選購的第一步。',
      'hist.y2': '產品線成形', 'hist.d2': '膠囊、複方與晶萃系列陸續整理，確立人用保健主軸。',
      'hist.y3': '代工服務', 'hist.d3': '從配方到包裝，開始提供 OEM / ODM 開發支援。',
      'hist.y4': 'ANUBIS 寵物保健', 'hist.d4': '將照護延伸到犬貓，建立泌尿、心血管與眼部品項。',
      'hist.y5': '品質文件化', 'hist.d5': '原料溯源、三萜類標示與第三方檢驗資料逐步完備。',
      'hist.y6': '雙語官網', 'hist.d6': '人用與寵物分區呈現，商城與訂單系統分流通路。',
      'hist.note': '以上年份與事件為版面示意，正式沿革以公司核准資料為準。',
      'portal.shop': '前往購物商城 →',
      'shop.h1': '把安心，<br>放進購物車。', 'shop.sub': '人用保健與 ANUBIS 寵物保健全系列，散戶朋友可直接選購加入購物車。本頁為前端展示樣板，價格與結帳流程為示意，正式上線前需串接金流、庫存與物流。',
      'shop.cta': '開始選購 →', 'shop.toOrder': '我是批發／大型會員 →', 'shop.title': '所有產品',
      'shop.sub2': '品項與價格摘錄自公開資料，實際標示、價格與庫存以公司核准資訊為準。',
      'shop.fHuman': '人用保健', 'shop.fPet': 'ANUBIS 寵物', 'shop.cart': '購物車',
      'shop.empty': '還沒有商品，點選「加入購物車」開始選購。', 'shop.total': '小計',
      'shop.cartNote': '價格與結帳為示意，不代表實際交易。', 'shop.checkout': '前往結帳（示意） →',
      'shop.checkoutOk': '已產生購物清單（示範），尚未串接金流，請勿進行實際付款。',
      'shop.added': '已加入購物車', 'shop.diffTitle': '兩個入口，各取所需。',
      'shop.d1t': '購物商城', 'shop.d1': '所有人皆可瀏覽全系列產品，直接加入購物車選購，適合散戶與少量購買。',
      'shop.d2t': '訂單系統', 'shop.d2': '偏向批發商與大型會員，提供身份識別、專屬價格、訂單追蹤與大量訂購服務。',
      'shop.noteTitle': '選購前，請先了解', 'shop.q1': '商品資訊是否為正式資料？',
      'shop.a1': '本站為設計提案樣板，品項、照片與價格摘錄自公開通路資料並作示意；實際成分、劑量、效期、價格與庫存以公司核准文件為準。',
      'shop.q2': '可以到貨付款或大量訂購嗎？', 'shop.a2': '結帳流程目前為前端示範，尚未串接金流。大量訂購、企業送禮與批發需求請使用訂單系統或洽詢表單，由專人對接。',
      'shop.disclaimer': '本站不作疾病診斷、治療或預防之宣稱；寵物產品請依獸醫師指示使用。',
      'op.register': '註冊新帳號', 'reg.title': '註冊會員帳號', 'reg.hint': '示範表單：資料僅在瀏覽器內驗證，不會傳送至伺服器。',
      'reg.name': '姓名／公司', 'reg.email': '電子郵件', 'reg.human': '我不是機器人', 'reg.challenge': '請計算：',
      'reg.submit': '送出註冊', 'reg.ok': '註冊成功（示範）：已通過人機驗證。', 'reg.fail': '請勾選人機驗證並輸入正確的計算結果。',
      'msg.loginOk': '登入成功（示範）：身份已識別。', 'msg.loginFail': '示範帳號為 demo / demo123；未連接後端。',
      'msg.orderOk': '（示範）· 狀態：已出貨，配送中。', 'msg.inquiry': '已產生詢問稿（示範），請另行透過正式聯絡方式送出。'
    },
    en: {
      'top.note': 'JING HONG BIOMEDICAL · Nature × Science × Sustainability',
      'ticker.tag': 'LATEST', 'ticker.a': 'New site live — human wellness and ANUBIS pet care shown side by side',
      'ticker.b': '11/26 sample update: bilingual switch, shop and order portals added', 'ticker.c': 'Open for retail, OEM and corporate gifting inquiries',
      'ticker.d': 'Traceable sourcing · Quality documents · Third-party testing',
      'nav.story': 'Our Story', 'nav.news': 'News', 'nav.products': 'Products', 'nav.craft': 'Science & Quality',
      'nav.cases': 'Case Studies', 'nav.shop': 'Online Shop', 'nav.order': 'Order Portal', 'nav.contact': 'Contact Us',
      'hero.eyebrow': 'NATURE × SCIENCE × LIFE', 'hero.l1': 'The power of nature,', 'hero.l2': 'refined by science',
      'hero.l3': 'for every life.', 'hero.lead': 'From human wellness to everyday pet care, Jing Hong turns sourcing, formulation and testing into a standard you can see and trust.',
      'hero.cta1': 'Explore products →', 'hero.cta2': 'See case studies', 'hero.p1': 'Founded in',
      'hero.p2': 'Product items', 'hero.p3': 'Clear product lines', 'hero.card1': 'ANUBIS Pet Care',
      'hero.card2': 'Botanical extracts · Daily care for dogs & cats',
      'strip.a': 'Traceable sourcing', 'strip.b': 'Triterpenoid labeling', 'strip.c': 'Third-party testing',
      'strip.d': 'OEM / ODM', 'strip.e': 'Daily pet care', 'strip.f': 'Sustainability',
      'stat.a': 'Founded', 'stat.b': 'Human products & services', 'stat.c': 'Pet care items', 'stat.d': 'Quality checkpoints',
      'news.title': 'Latest News', 'news.sub': 'The newest updates on our brand, products and partnerships.',
      'news.b1tag': 'SITE', 'news.b1': 'Two product lines now clearly separated', 'news.d1': 'Human wellness and ANUBIS pet care are presented independently for easier selection.',
      'news.b2tag': 'PRODUCT', 'news.b2': 'ANUBIS pet care range compiled', 'news.d2': 'Urinary, cardiovascular, skin and eye care items explained in one place.',
      'news.b3tag': 'INSIGHT', 'news.b3': 'Updated guide to choosing Antrodia raw material', 'news.d3': 'Fruiting body vs. mycelium, triterpenoid labeling and test documents explained.',
      'news.b4tag': 'PARTNER', 'news.b4': 'Order portal now online (demo)', 'news.d4': 'Member login, order lookup and process guidance are pre-built.',
      'news.sideTitle': 'One brand,<br>caring for every life you love.', 'news.sideText': 'Human and pet products are shown separately — clear answers from raw material to daily use.',
      'news.sideCta': 'Request full product info →',
      'story.title': 'Making “natural”<br>understandable science.',
      'story.p1': 'Jing Hong began with Antrodia and botanical ingredients, then expanded into daily care for dogs and cats. Good care should be supported by data, not adjectives.',
      'story.p2': 'Since 2003, we have turned sourcing, formulation, dosage forms and documentation into standards that can be reviewed.',
      'story.c1': 'Clearly labeled sourcing and item information', 'story.c2': 'Capsules, powders, sprays and eye care formats',
      'story.c3': 'Documentation support for retail and OEM partners', 'story.cta': 'See our approach →',
      'products.title': 'Product Lines', 'products.sub': 'Human wellness and pet care are shown separately. Items and ingredients are compiled from public sources; actual labels follow approved company documents.',
      'products.tabHuman': 'Human Wellness', 'products.tabPet': 'ANUBIS Pet Care',
      'products.noteHuman': 'Human line | Antrodia, formulas, probiotics and OEM services',
      'products.notePet': 'Pet line | Urinary, cardiovascular, skin, eye and topical care',
      'products.disclaimer': 'Items and ingredients above are excerpted from public retail sources. Actual ingredients, dosage, shelf life and labels follow approved company documents and veterinary advice. This site makes no claims to diagnose, treat or prevent disease.',
      'filter.all': 'All', 'filter.capsule': 'Capsules', 'filter.formula': 'Formulas', 'filter.extract': 'Extracts',
      'filter.service': 'Services', 'filter.urinary': 'Urinary', 'filter.care': 'Daily care',
      'filter.skin': 'Topical skin', 'filter.eye': 'Eye care', 'filter.channel': 'Retail',
      'filter.oem': 'OEM / ODM', 'filter.pet': 'Pet care', 'filter.digital': 'Digital',
      'p.h1n': 'Antrodia Fruiting Body Capsules', 'p.h1d': 'Antrodia fruiting body with lingzhi and botanical formula — an entry point for daily wellness.',
      'p.h1c1': 'Fruiting body', 'p.h1c2': 'Lingzhi formula', 'p.h1c3': 'Public package photo',
      'p.h2n': 'Antrodia & Probiotics', 'p.h2d': 'Antrodia and probiotics for the rhythm of a busy life.',
      'p.h2c1': 'Probiotics', 'p.h2c2': 'Antrodia', 'p.h3n': 'Antrodia Night Capsules',
      'p.h3d': 'A publicly exhibited Antrodia formula for nightly wellness routines.', 'p.h3c1': 'Night care', 'p.h3c2': 'Formula capsules',
      'p.h4n': 'Antrodia Fruiting Body Extract', 'p.h4d': 'Concentrated extract named after the fruiting body, preserving the subtlety of the raw material.',
      'p.h4c1': 'Concentrated', 'p.h4c2': 'Raw extract', 'p.h5n': 'Antrodia Clear Comfort',
      'p.h5d': 'A publicly exhibited Antrodia item for everyday wellness pairing.', 'p.h5c1': 'Botanical formula', 'p.h5c2': 'Daily wellness',
      'p.h6n': 'OEM / ODM Development', 'p.h6d': 'From formula and dosage form to packaging and documents — we help brands turn ideas into products.',
      'p.h6c1': 'Formulation', 'p.h6c2': 'Dosage design',
      'p.p1n': 'Youli Cat Urinary Capsules', 'p.p1d': 'Botanical capsules for cats, 30 per box; public listings suggest once daily after meals.',
      'p.p1c1': 'For cats', 'p.p1c2': '30 capsules', 'p.p1c3': 'Botanical extract', 'p.p2n': 'Anxin Cat Heart Daily Care',
      'p.p2d': 'Listed publicly as daily cardiovascular care for cats; formula details await official documents.',
      'p.p2c1': 'For cats', 'p.p2c2': 'Daily care', 'p.p3n': 'Anmin Capsules — Enhance-Immunity',
      'p.p3d': 'Oral care capsules for dogs and cats; public item name is Enhance-Immunity.',
      'p.p3c1': 'Dogs & cats', 'p.p3c2': 'Oral capsules', 'p.p4n': 'Youli Wei Enteric Pellets',
      'p.p4d': '15 sachets; public ingredients include extracts of chrysantella, pomegranate, plantain, poria, cassia and cranberry.',
      'p.p4c1': '15 sachets', 'p.p4c2': 'Enteric pellets', 'p.p4c3': 'Botanical extract', 'p.p5n': 'Qianliguang Eye Drops 10ml',
      'p.p5d': 'Daily eye care liquid for dogs and cats, 10ml; suitable for routine care.',
      'p.p5c1': '10ml', 'p.p5c2': 'Dogs & cats', 'p.p6n': 'Jingyang Eye Care 10ml',
      'p.p6d': 'Built around hyaluronic acid and allantoin for eye moisture and daily care.',
      'p.p6c1': 'Hyaluronic acid', 'p.p6c2': 'Allantoin', 'p.p7n': 'Huakang Pet Skin Spray 50ml',
      'p.p7d': 'Botanical topical spray for dogs and cats, 50ml; use under veterinary guidance.',
      'p.p7c1': '50ml', 'p.p7c2': 'Botanical extract', 'p.p8n': 'Enfeis Pet Topical Spray 50ml',
      'p.p8d': 'Botanical topical spray; public listings suggest 2–4 applications daily on the affected area.',
      'p.p8c1': '50ml', 'p.p8c2': 'Topical', 'p.p9n': 'Shangtuoli Topical Powder 10g',
      'p.p9d': 'Made with natural Chinese medicine ingredients to keep the area dry; 10g, use under veterinary guidance.',
      'p.p9c1': '10g', 'p.p9c2': 'Herbal material',
      'craft.title': 'Closest to<br>what you cannot see.', 'craft.sub': 'Good products come from details taken seriously.',
      'craft.e1': 'Traceability', 'craft.e2': 'Science', 'craft.h1': 'Care begins at the source', 'craft.h2': 'Turning feelings into data',
      'craft.p1': 'We prioritize clearly sourced Antrodia and botanical materials, labeling material type and item so every batch can be traced.',
      'craft.p2': 'Triterpenoid labeling, dosage design and stability planning replace vague descriptions with concrete data. Formal test reports and patents will be added once approved.',
      'craft.c1': 'Material type and source labeling', 'craft.c2': 'Public items matched with package information',
      'craft.c3': 'Capsules, pellets, sprays and eye care formats', 'craft.c4': 'Documents for retail and OEM partners',
      'cases.title': 'Case Studies', 'cases.sub': 'The following scenario-based samples are prepared for internal review. Real cases, data and authorized material will replace them before publication.',
      'cases.more': 'View all case studies →',
      'case.t1': 'Retail · 2025', 'case.n1': 'Pharmacy chain rollout', 'case.d1': '12 stores onboarded with staff training in three months.',
      'case.t2': 'ANUBIS · 2025', 'case.n2': 'Pet wellness retail rollout', 'case.d2': 'Clearer explanation and display for urinary and eye care items.',
      'case.t3': 'OEM / ODM · 2025', 'case.n3': 'First capsule for a startup brand', 'case.d3': 'From formula to packaging — building a hero product.',
      'portal.title': 'Orders,<br>with one clear path.',
      'portal.sub': 'Member login, online ordering, tracking and after-sales service in one entry point. The front end is ready for back-end integration.',
      'portal.cta': 'Enter order portal →', 'portal.h': 'PORTAL FEATURES', 'portal.f1': 'Member and distributor identification',
      'portal.f2': 'Online ordering and price calculation', 'portal.f3': 'Shipment progress and logistics tracking', 'portal.f4': 'After-sales requests and support messages',
      'contact.title': 'Start with one sentence.', 'contact.sub': 'Product pricing, retail partnership, OEM development or corporate gifting — tell us what you need.',
      'contact.company': 'Company', 'contact.tel': 'Tel', 'contact.addr': 'Address',
      'contact.note': 'This is a design sample for review. Photos are Unsplash illustrations, not actual product shots.',
      'form.person': 'Contact person', 'form.personPh': 'Name or organization', 'form.company': 'Company / organization',
      'form.companyPh': 'Company name', 'form.topic': 'Topic', 'form.t1': 'Product inquiry', 'form.t2': 'Retail partnership',
      'form.t3': 'OEM / ODM', 'form.t4': 'Corporate gifting', 'form.t5': 'Other', 'form.msg': 'Message',
      'form.msgPh': 'Briefly describe your request', 'form.submit': 'Generate inquiry draft',
      'foot.about': 'Nature deserves precision. This is a design sample; content and figures are partly illustrative and must be confirmed before publication.',
      'foot.links': 'Quick Links', 'foot.disclaimer': 'Sources & Disclaimer',
      'foot.text': 'Company and product information is compiled from public business registry, retail channels and exhibition data. Illustrative photos come from Unsplash. Actual ingredients, specifications, test results and contact details follow approved company documents. This site makes no claims to diagnose, treat or prevent disease.',
      'foot.text2': 'Case figures and outcomes are illustrative and do not represent actual results or client endorsement. Product information makes no claims to diagnose, treat or prevent disease.',
      'foot.top': 'Back to top ↑',
      'cp.h1': 'Every collaboration<br>leaves a method and warmth.',
      'cp.sub': 'These sample cases are prepared for internal review. Real cases, figures and client authorization will replace them before publication.',
      'cp.back': 'Back to home', 'cp.cta': 'Discuss a similar project →', 'cp.note': 'Case figures and outcomes are illustrative only.',
      'cp.foot': 'Cases are sample content and photos are from Unsplash; they are not real client projects.',
      'c1.side': 'Retail · 2025 · North', 'c1.n': 'Pharmacy chain rollout',
      'c1.ch': '<strong>Challenge:</strong> Store staff were unfamiliar with Antrodia materials and dosage forms.',
      'c1.do': '<strong>Approach:</strong> Three-tier training, shelf cards and a first-wave sampling event.',
      'c1.r': '<strong>Result:</strong> 12 stores onboarded in three months with stable repeat purchases. (sample figure)',
      'c1.tag': '12 stores · 3 months',
      'c2.side': 'OEM / ODM · 2025 · West', 'c2.n': 'First capsule for a startup brand',
      'c2.ch': '<strong>Challenge:</strong> The client had brand and channels but no product development or document experience.',
      'c2.do': '<strong>Approach:</strong> Formula, capsule shell and packaging planning, plus ingredient specifications and test files.',
      'c2.r': '<strong>Result:</strong> Product launched, followed by a second formula. (sample scenario)',
      'c2.tag': 'From 0 to launch · 2 products',
      'c3.side': 'ANUBIS pet care · 2025 · Central', 'c3.n': 'Pet wellness retail rollout',
      'c3.ch': '<strong>Challenge:</strong> Owners could not tell urinary and eye care items apart.',
      'c3.do': '<strong>Approach:</strong> Separate human / pet presentation with species and format comparison cards.',
      'c3.r': '<strong>Result:</strong> More focused inquiries and clearer shelf display. (sample scenario)',
      'c3.tag': '2 product lines · clearer selection',
      'c4.side': 'ANUBIS pet care · 2024 · Event', 'c4.n': 'Pet market brand communication',
      'c4.ch': '<strong>Challenge:</strong> High foot traffic required a fast, clear brand and item story.',
      'c4.do': '<strong>Approach:</strong> Pet-friendly booth, product category cards and interactive consultation flow.',
      'c4.r': '<strong>Result:</strong> First wave of fan engagement and lead collection. (sample scenario)',
      'c4.tag': 'Live event · brand engagement',
      'c5.side': 'Digital · 2026 · Website', 'c5.n': 'Brand website rebuild',
      'c5.ch': '<strong>Challenge:</strong> Dispersed information made products and contact hard to find.',
      'c5.do': '<strong>Approach:</strong> Rebuilt five areas: brand, news, two product lines, cases and order portal.',
      'c5.r': '<strong>Result:</strong> Clearer inquiry paths and an order portal for partners. (this page is the sample)',
      'c5.tag': '5 areas · bilingual switch',
      'c6.side': 'Retail · 2024 · E-commerce', 'c6.n': 'Product page buying guide',
      'c6.ch': '<strong>Challenge:</strong> Shoppers did not understand fruiting body vs. mycelium.',
      'c6.do': '<strong>Approach:</strong> Added buying guide, triterpenoid labeling notes and FAQs.',
      'c6.r': '<strong>Result:</strong> Longer page time and fewer repeat questions. (sample figure)',
      'c6.tag': 'Conversion +38% (illustrative)',
      'op.h1': 'One entry,<br>every order in view.',
      'op.sub': 'This is a front-end demo. Back-end integration for members, inventory, payments and logistics is required before launch.',
      'op.menu': 'QUICK MENU', 'op.m1': 'Member login', 'op.m2': 'Order lookup', 'op.m3': 'Order flow',
      'op.m4': 'Services', 'op.m5': 'FAQ', 'op.loginTitle': 'Member / Distributor Login',
      'op.loginHint': 'Demo account demo / password demo123. Front-end only; no data is transmitted.',
      'op.account': 'Account', 'op.accountPh': 'Tax ID or member account', 'op.password': 'Password', 'op.passwordPh': 'Password',
      'op.role': 'Role', 'op.role1': 'Customer', 'op.role2': 'Retail partner', 'op.role3': 'Distributor',
      'op.loginBtn': 'Sign in →', 'op.queryTitle': 'Order Lookup', 'op.queryHint': 'Enter order number and contact phone to see progress.',
      'op.orderNo': 'Order number', 'op.orderPh': 'e.g. JH20261126001', 'op.phone': 'Contact phone',
      'op.phonePh': 'Phone used on the order', 'op.queryBtn': 'Check order status', 'op.demoResult': 'Sample result',
      'op.s1': 'Placed', 'op.s2': 'Confirmed', 'op.s3': 'Shipped', 'op.s4': 'In transit',
      'op.status': 'Status', 'op.statusVal': 'Shipped · In transit', 'op.items': 'Items',
      'op.itemsVal': 'Antrodia Capsules × 2', 'op.flowTitle': 'Four steps to complete an order',
      'op.flowSub': 'From selection to shipment, every step is trackable.', 'op.f1': 'Select products',
      'op.f1d': 'Human and pet items are shown in separate sections.', 'op.f2': 'Enter details',
      'op.f2d': 'Create a member account or fill in delivery and contact details.', 'op.f3': 'Confirm payment', 'op.f3d': 'Multiple payment methods after payment integration.',
      'op.f4': 'Track shipment', 'op.f4d': 'Check processing and logistics status anytime.', 'op.serviceTitle': 'Portal Features',
      'op.sv1': 'Online ordering', 'op.sv1d': 'Catalog, quantity and instant price calculation.', 'op.sv2': 'Order tracking',
      'op.sv2d': 'Processing and logistics status at a glance.', 'op.sv3': 'Distributor area', 'op.sv3d': 'Exclusive pricing, order history and contract files.',
      'op.sv4': 'After-sales', 'op.sv4d': 'Returns and support message records.', 'op.sv5': 'Documents',
      'op.sv5d': 'Approved specifications and test files in one place.', 'op.sv6': 'Dedicated support', 'op.sv6d': 'A contact for bulk orders and corporate gifting.',
      'op.faqTitle': 'Before you order', 'op.q1': 'Can regular customers order directly?',
      'op.a1': 'This portal is a demo. After launch, customers can buy public items directly; retail and distributor pricing requires identity verification.',
      'op.q2': 'How do I find past orders?', 'op.a2': 'Sign in, then enter the order number and contact phone in Order Lookup.',
      'op.q3': 'Where can I get specifications and test documents?', 'op.a3': 'Request them in the contact form, or download approved files from the distributor area.',
      'op.q4': 'How are bulk orders and corporate gifts handled?', 'op.a4': 'Leave quantity and desired delivery date in the contact form; a specialist will follow up.',
      'op.foot': 'This order portal is a front-end demo; payments, logistics and databases are not connected.',
      'op.foot2': 'Demo account and order data are for display only. Security, privacy notice and payment testing are required before launch.',
      'chat.title': 'JH Bot · Assistant', 'chat.status': 'Online · demo mode',
      'chat.welcome': 'Hi, I am JH Bot, your guide dog. Looking for products, an order, or a partnership? Tap a quick question or just type.',
      'chat.q1': 'Products', 'chat.q2': 'Track order', 'chat.q3': 'Partnership', 'chat.q4': 'Talk to a human',
      'chat.a1': 'Human wellness and ANUBIS pet care are shown in separate sections. Details come from public sources; approved documents prevail.\n(Demo reply - API ready to connect)',
      'chat.a2': 'Open the Order Portal and enter your account and order number. This is a front-end demo; no back end is connected yet.\n(Demo reply - API ready to connect)',
      'chat.a3': 'Leave your request: product enquiry, retail partnership, OEM / ODM or corporate gifting. We will get back to you.\n(Demo reply - API ready to connect)',
      'chat.a4': 'Your handoff request is noted. A live agent can be connected here after launch; this is demo mode.\n(Demo reply - agent handoff ready)',
      'chat.unknown': 'Got it. This message is recorded for now. After launch, API answers or a live agent can handle it.\n(Demo reply)',
      'chat.placeholder': 'Type your question...', 'chat.open': 'Open assistant', 'chat.close': 'Close assistant',
      'chat.send': 'Send message',
      'dd.s1': 'Our story', 'dd.s2': 'Traceability', 'dd.s3': 'Quality commitment',
      'dd.n1': 'Latest news', 'dd.n2': 'Site updates', 'dd.n3': 'Product insights',
      'dd.p1': 'Human wellness', 'dd.p2': 'ANUBIS pet care', 'dd.p3': 'OEM / ODM',
      'dd.c1': 'Traceability', 'dd.c2': 'Science', 'dd.c3': 'Test documents',
      'dd.cs1': 'All case studies', 'dd.cs2': 'Retail cases', 'dd.cs3': 'ANUBIS pet cases',
      'dd.o1': 'Member login', 'dd.o2': 'Order lookup', 'dd.o3': 'Global order',
      'dd.ct1': 'Product inquiry', 'dd.ct2': 'Retail partnership', 'dd.ct3': 'Corporate gifting',
      'global.eyebrow': 'GLOBAL ORDER / INTERNATIONAL', 'global.title': 'Ordering,<br>without borders.',
      'global.sub': 'A layout prepared for overseas customers: country and currency, international shipping, customs documents and multilingual support. Front-end demo; payments and logistics need integration before launch.',
      'global.p1t': 'Multi-currency pricing', 'global.p1d': 'Switch between TWD / USD / EUR / JPY; figures are illustrative.',
      'global.p2t': 'Global shipping & customs', 'global.p2d': 'Shipping and document needs shown by destination; final quote prevails.',
      'global.p3t': 'English documents & support', 'global.p3d': 'English invoices, packing lists and multilingual support for smoother ordering.',
      'global.formTitle': 'Global order request (demo)', 'global.country': 'Destination',
      'global.countryPh': 'Select a region', 'global.c1': 'Taiwan', 'global.c2': 'Japan', 'global.c3': 'United States',
      'global.c4': 'Europe', 'global.c5': 'Southeast Asia', 'global.c6': 'Other regions',
      'global.email': 'Contact email', 'global.emailPh': 'name@example.com',
      'global.item': 'Product line of interest', 'global.item1': 'Human wellness', 'global.item2': 'ANUBIS pet care',
      'global.item3': 'OEM / ODM', 'global.qty': 'Estimated quantity', 'global.qtyPh': 'e.g. 500 boxes',
      'global.quote': 'Estimated price', 'global.quoteNote': 'Illustrative · not a formal quote',
      'global.note': 'This is an illustrative estimate. Actual price, shipping and lead time follow a formal quotation.',
      'global.btn': 'Generate global order draft →', 'global.ok': 'Global order draft generated (demo); send it through the official channel.',
      'global.currency': 'Display currency',
      'dd.more': 'Explore more', 'chat.max': 'Maximize', 'chat.min': 'Minimize',
      'hist.title': 'The journey so far,<br>made clearer.', 'hist.sub': 'From one ingredient to two product lines. Dates below are illustrative and pending company confirmation.',
      'hist.y1': 'The beginning', 'hist.d1': 'Started with Antrodia cinnamomea and botanical ingredients.',
      'hist.y2': 'Product lines take shape', 'hist.d2': 'Capsules, formulas and extracts established the human wellness line.',
      'hist.y3': 'OEM / ODM services', 'hist.d3': 'From formulation to packaging, contract development began.',
      'hist.y4': 'ANUBIS pet care', 'hist.d4': 'Care extended to dogs and cats with urinary, cardiac and eye items.',
      'hist.y5': 'Quality documentation', 'hist.d5': 'Traceability, triterpenoid labeling and third-party testing completed.',
      'hist.y6': 'Bilingual website', 'hist.d6': 'Human and pet lines separated; shop and order portals split.',
      'hist.note': 'Years and events are illustrative; official history is subject to company approval.',
      'portal.shop': 'Go to Online Shop →',
      'shop.h1': 'Put peace of mind<br>in your cart.', 'shop.sub': 'Browse the full human wellness and ANUBIS pet care range and add items to your cart. This is a front-end sample; prices and checkout are illustrative pending payment, inventory and logistics integration.',
      'shop.cta': 'Start shopping →', 'shop.toOrder': 'I am a wholesale / bulk member →', 'shop.title': 'All Products',
      'shop.sub2': 'Items and prices are drawn from public sources; actual labeling, pricing and inventory are subject to company confirmation.',
      'shop.fHuman': 'Human Wellness', 'shop.fPet': 'ANUBIS Pet', 'shop.cart': 'Cart',
      'shop.empty': 'No items yet. Tap “Add to cart” to start.', 'shop.total': 'Subtotal',
      'shop.cartNote': 'Prices and checkout are illustrative; no real transaction occurs.', 'shop.checkout': 'Checkout (demo) →',
      'shop.checkoutOk': 'Shopping list generated (demo). No payment gateway connected — do not make any real payment.',
      'shop.added': 'Added to cart', 'shop.diffTitle': 'Two entrances, each for its purpose.',
      'shop.d1t': 'Online Shop', 'shop.d1': 'Everyone can browse the full range and add items to the cart — ideal for retail and small purchases.',
      'shop.d2t': 'Order Portal', 'shop.d2': 'For wholesalers and large members: identity verification, exclusive pricing, order tracking and bulk orders.',
      'shop.noteTitle': 'Before you shop', 'shop.q1': 'Are product details official?',
      'shop.a1': 'This is a design sample. Items, photos and prices are illustrative from public sources; actual ingredients, dosage, shelf life, pricing and inventory are subject to company documents.',
      'shop.q2': 'Can I pay on delivery or order in bulk?', 'shop.a2': 'Checkout is a front-end demo with no payment gateway. For bulk orders, gifting and wholesale, use the Order Portal or inquiry form for dedicated support.',
      'shop.disclaimer': 'This site makes no claims of diagnosing, treating or preventing disease; pet products should be used as directed by a veterinarian.',
      'op.register': 'Create account', 'reg.title': 'Member registration', 'reg.hint': 'Demo form: validated in-browser only, no data is sent.',
      'reg.name': 'Name / Company', 'reg.email': 'Email', 'reg.human': 'I am not a robot', 'reg.challenge': 'Please solve:',
      'reg.submit': 'Submit registration', 'reg.ok': 'Registration successful (demo): human verification passed.', 'reg.fail': 'Please confirm you are human and enter the correct answer.',
      'msg.loginOk': 'Login successful (demo): role identified.', 'msg.loginFail': 'Demo account is demo / demo123; no back end connected.',
      'msg.orderOk': '(demo) · Status: shipped, in transit.', 'msg.inquiry': 'Inquiry draft generated (demo); send it through the official contact channel.'
    }
  };

  var HTML_KEYS = {
    'news.sideTitle': 1, 'story.title': 1, 'craft.title': 1, 'portal.title': 1,
    'cp.h1': 1, 'op.h1': 1, 'hist.title': 1, 'shop.h1': 1,
    'c1.ch': 1, 'c1.do': 1, 'c1.r': 1, 'c2.ch': 1, 'c2.do': 1, 'c2.r': 1,
    'c3.ch': 1, 'c3.do': 1, 'c3.r': 1, 'c4.ch': 1, 'c4.do': 1, 'c4.r': 1,
    'c5.ch': 1, 'c5.do': 1, 'c5.r': 1, 'c6.ch': 1, 'c6.do': 1, 'c6.r': 1
  };

  var currentLang = 'zh';
  try { currentLang = localStorage.getItem('jh-lang') === 'en' ? 'en' : 'zh'; } catch (e) {}

  function t(key) {
    var v = DICT[currentLang] && DICT[currentLang][key];
    if (typeof v === 'undefined') v = DICT.zh[key];
    return typeof v === 'undefined' ? key : v;
  }

  function applyLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'zh';
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-Hant';
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i], key = el.getAttribute('data-i18n'), val = t(key);
      if (HTML_KEYS[key]) el.innerHTML = val; else el.textContent = val;
    }
    var ph = document.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < ph.length; j++) ph[j].setAttribute('placeholder', t(ph[j].getAttribute('data-i18n-ph')));
    var btns = document.querySelectorAll('[data-lang]');
    for (var k = 0; k < btns.length; k++) {
      var on = btns[k].getAttribute('data-lang') === currentLang;
      btns[k].classList.toggle('active', on);
      btns[k].setAttribute('aria-pressed', String(on));
    }
    try { localStorage.setItem('jh-lang', currentLang); } catch (e) {}
    document.title = document.title; // keep title as authored
  }

  for (var b = 0; b < document.querySelectorAll('[data-lang]').length; b++) {
    document.querySelectorAll('[data-lang]')[b].addEventListener('click', function () { applyLang(this.getAttribute('data-lang')); });
  }

  /* ---------- 自然下拉：hover 延遲＋點擊＋鍵盤，不再突然跳動 ---------- */
  var DROP = {
    'nav.story': [['dd.s1', '#story'], ['dd.s2', '#craft'], ['dd.s3', '#craft']],
    'nav.news': [['dd.n1', '#news'], ['dd.n2', '#news'], ['dd.n3', '#products']],
    'nav.products': [['dd.p1', '#products'], ['dd.p2', '#products'], ['dd.p3', '#products']],
    'nav.craft': [['dd.c1', '#craft'], ['dd.c2', '#craft'], ['dd.c3', '#craft']],
    'nav.cases': [['dd.cs1', 'cases.html'], ['dd.cs2', 'cases.html'], ['dd.cs3', 'cases.html']],
    'nav.order': [['dd.o1', 'order.html#login'], ['dd.o2', 'order.html#inquiry'], ['dd.o3', 'order.html#global']],
    'nav.contact': [['dd.ct1', '#contact'], ['dd.ct2', '#contact'], ['dd.ct3', '#contact']]
  };
  var navRoot = document.querySelector('.nav-links');
  var openTimer = 0, closeTimer = 0;
  function closeNavAll(except) {
    var all = document.querySelectorAll('.nav-item.open');
    for (var k = 0; k < all.length; k++) if (all[k] !== except) all[k].classList.remove('open');
  }
  function openNav(item) { window.clearTimeout(closeTimer); closeNavAll(item); item.classList.add('open'); }
  function scheduleClose(item) {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(function () { item.classList.remove('open'); }, 220);
  }
  if (navRoot) {
    var navAs = navRoot.querySelectorAll('a');
    for (var ni = 0; ni < navAs.length; ni++) {
      var na = navAs[ni], key = na.getAttribute('data-i18n'), items = DROP[key];
      if (!items) continue;
      var item = document.createElement('div');
      item.className = 'nav-item';
      na.parentNode.insertBefore(item, na);
      item.appendChild(na);
      var caret = document.createElement('button');
      caret.type = 'button'; caret.className = 'nav-caret'; caret.textContent = '⌄';
      caret.setAttribute('aria-label', key === 'nav.products' ? 'Products menu' : 'Open menu');
      item.appendChild(caret);
      var dd = document.createElement('div');
      dd.className = 'dropdown'; dd.setAttribute('role', 'menu');
      var dtitle = document.createElement('div');
      dtitle.className = 'dropdown-title';
      dtitle.innerHTML = '<span data-i18n="' + key + '">' + key + '</span><small>MENU / 0' + items.length + '</small>';
      dd.appendChild(dtitle);
      for (var di = 0; di < items.length; di++) {
        var link = document.createElement('a');
        link.href = items[di][1];
        link.innerHTML = '<span class="dd-num">0' + (di + 1) + '</span><span class="dd-label"><b data-i18n="' + items[di][0] + '">' + items[di][0] + '</b></span><span class="dd-arrow">↗</span>';
        dd.appendChild(link);
      }
      item.appendChild(dd);
      item.addEventListener('mouseenter', function () {
        window.clearTimeout(openTimer);
        var self = this;
        openTimer = window.setTimeout(function () { openNav(self); }, 85);
      });
      item.addEventListener('mouseleave', function () { window.clearTimeout(openTimer); scheduleClose(this); });
      item.addEventListener('focusin', function () { openNav(this); });
      item.addEventListener('focusout', function (e) { if (!this.contains(e.relatedTarget)) scheduleClose(this); });
      caret.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        window.clearTimeout(openTimer); window.clearTimeout(closeTimer);
        var parent = this.parentNode;
        if (parent.classList.contains('open')) { parent.classList.remove('open'); }
        else { openNav(parent); }
      });
    }
    document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closeNavAll(); });
  }
  applyLang(currentLang);

  /* ---------- 公司沿革時間軸動畫 ---------- */
  var histSec = document.getElementById('history');
  if (histSec && 'IntersectionObserver' in window) {
    var histObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { histSec.classList.add('in-view'); histObs.disconnect(); }
    }, { threshold: .18 });
    histObs.observe(histSec);
  } else if (histSec) { histSec.classList.add('in-view'); }

  /* ---------- 選單／捲動 ---------- */
  var nav = document.getElementById('siteNav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = '☰'; }
    });
  }
  var ticking = false;
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.pageYOffset > 30);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var a = 0; a < anchors.length; a++) anchors[a].addEventListener('click', function (e) {
    var id = this.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) if (entries[i].isIntersecting) {
        entries[i].target.classList.add('visible'); io.unobserve(entries[i].target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    var reveals = document.querySelectorAll('.reveal');
    for (var r = 0; r < reveals.length; r++) io.observe(reveals[r]);
  } else {
    var all = document.querySelectorAll('.reveal');
    for (var q = 0; q < all.length; q++) all[q].classList.add('visible');
  }

  /* ---------- 產品線與篩選 ---------- */
  var lineTabs = document.querySelectorAll('[data-line-tab]');
  function switchLine(line) {
    var human = line === 'human';
    var lh = document.getElementById('lineHuman'), lp = document.getElementById('linePet');
    var nh = document.getElementById('lineNoteHuman'), np = document.getElementById('lineNotePet');
    if (lh) lh.hidden = !human; if (lp) lp.hidden = human;
    if (nh) nh.hidden = !human; if (np) np.hidden = human;
    for (var i = 0; i < lineTabs.length; i++) {
      var on = lineTabs[i].getAttribute('data-line-tab') === line;
      lineTabs[i].classList.toggle('active', on);
      lineTabs[i].setAttribute('aria-selected', String(on));
    }
  }
  for (var lt = 0; lt < lineTabs.length; lt++) lineTabs[lt].addEventListener('click', function () { switchLine(this.getAttribute('data-line-tab')); });

  var prodPills = document.querySelectorAll('.pill[data-line-filter]');
  for (var pp = 0; pp < prodPills.length; pp++) prodPills[pp].addEventListener('click', function () {
    var line = this.getAttribute('data-line-filter'), f = this.getAttribute('data-filter');
    var group = document.querySelectorAll('.pill[data-line-filter="' + line + '"]');
    for (var i = 0; i < group.length; i++) group[i].classList.toggle('active', group[i] === this);
    var cards = document.querySelectorAll('#grid' + (line === 'human' ? 'Human' : 'Pet') + ' .card');
    for (var j = 0; j < cards.length; j++) cards[j].hidden = f !== 'all' && cards[j].getAttribute('data-cat') !== f;
  });

  var casePills = document.querySelectorAll('.pill[data-case-filter]');
  for (var cp = 0; cp < casePills.length; cp++) casePills[cp].addEventListener('click', function () {
    var f = this.getAttribute('data-case-filter');
    for (var i = 0; i < casePills.length; i++) casePills[i].classList.toggle('active', casePills[i] === this);
    var items = document.querySelectorAll('#caseList .case-item');
    for (var j = 0; j < items.length; j++) items[j].hidden = f !== 'all' && items[j].getAttribute('data-case') !== f;
  });

  /* ---------- 表單示範 ---------- */
  var inquiry = document.getElementById('inquiryForm');
  if (inquiry) inquiry.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(inquiry);
    var langTag = currentLang === 'en' ? 'Jing Hong enquiry' : '精鴻生醫 合作洽詢';
    var labels = currentLang === 'en'
      ? ['Contact', 'Company', 'Topic', 'Message'] : ['聯絡人', '公司', '主題', '需求'];
    var text = langTag + '\n' + labels[0] + '：' + f.get('person') + '\n' + labels[1] + '：' + (f.get('company') || '-') +
      '\n' + labels[2] + '：' + f.get('topic') + '\n' + labels[3] + '：' + f.get('message') + '\n';
    try {
      var url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      var a = document.createElement('a'); a.href = url; a.download = 'jinghong-inquiry.txt'; a.click();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (err) {}
    document.getElementById('inquiryStatus').textContent = t('msg.inquiry');
  });

  var login = document.getElementById('loginForm');
  if (login) login.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(login);
    var ok = f.get('account') === 'demo' && f.get('password') === 'demo123';
    document.getElementById('loginStatus').textContent = ok ? t('msg.loginOk') : t('msg.loginFail');
  });

  var regModal = document.getElementById('registerModal');
  var regOpen = document.getElementById('openRegister');
  var regClose = document.getElementById('closeRegister');
  var regForm = document.getElementById('registerForm');
  var captchaA = 0, captchaB = 0;
  function refreshCaptcha() {
    captchaA = Math.floor(Math.random() * 8) + 2;
    captchaB = Math.floor(Math.random() * 8) + 1;
    var q = document.getElementById('captchaQ');
    if (q) q.textContent = captchaA + ' + ' + captchaB + ' =';
  }
  function setRegOpen(open) {
    if (!regModal) return;
    regModal.classList.toggle('open', open);
    if (open) { refreshCaptcha(); var first = regModal.querySelector('input[name="name"]'); if (first) first.focus(); }
  }
  if (regOpen) regOpen.addEventListener('click', function () { setRegOpen(true); });
  if (regClose) regClose.addEventListener('click', function () { setRegOpen(false); });
  if (regModal) regModal.addEventListener('click', function (e) { if (e.target === regModal) setRegOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && regModal && regModal.classList.contains('open')) setRegOpen(false); });
  if (regForm) regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(regForm);
    var human = f.get('human') === 'on';
    var honeypot = String(f.get('website') || '');
    var answer = parseInt(f.get('captcha'), 10);
    var ok = human && !honeypot && answer === captchaA + captchaB;
    var st = document.getElementById('registerStatus');
    if (st) st.textContent = ok ? t('reg.ok') : t('reg.fail');
    if (ok) regForm.reset();
    refreshCaptcha();
  });

  var order = document.getElementById('orderForm');
  if (order) order.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(order);
    document.getElementById('orderStatus').textContent = f.get('orderNo') + t('msg.orderOk');
  });


  /* ---------- 國際訂購：幣別試算與示範稿 ---------- */
  var rate = { TWD: 1, USD: 32.5, EUR: 35, JPY: 0.22 };
  var basePrice = 32000;
  var curBtns = document.querySelectorAll('[data-currency]');
  function updateQuote() {
    var q = document.getElementById('globalQuote');
    if (!q) return;
    var active = document.querySelector('[data-currency].active');
    var code = active ? active.getAttribute('data-currency') : 'TWD';
    var val = Math.round(basePrice / rate[code]);
    q.textContent = code + ' ' + val.toLocaleString('en-US');
  }
  for (var ci = 0; ci < curBtns.length; ci++) curBtns[ci].addEventListener('click', function () {
    for (var j = 0; j < curBtns.length; j++) curBtns[j].classList.remove('active');
    this.classList.add('active'); updateQuote();
  });
  updateQuote();
  var globalForm = document.getElementById('globalForm');
  if (globalForm) globalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(globalForm);
    var code = (document.querySelector('[data-currency].active') || {}).getAttribute ? document.querySelector('[data-currency].active').getAttribute('data-currency') : 'TWD';
    var text = 'JING HONG · GLOBAL ORDER (demo)\nCountry: ' + f.get('country') + '\nCurrency: ' + code +
      '\nEmail: ' + f.get('email') + '\nProduct line: ' + f.get('item') + '\nQty: ' + (f.get('qty') || '-') + '\n';
    try {
      var url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      var a = document.createElement('a'); a.href = url; a.download = 'jinghong-global-order.txt'; a.click();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (err) {}
    document.getElementById('globalStatus').textContent = t('global.ok');
  });

  /* ---------- 數據卡片導向產品線 ---------- */
  var goLineLinks = document.querySelectorAll('[data-go-line]');
  for (var gl = 0; gl < goLineLinks.length; gl++) {
    goLineLinks[gl].addEventListener('click', function () {
      var want = this.getAttribute('data-go-line');
      var tab = document.querySelector('[data-line-tab="' + want + '"]');
      if (tab) tab.click();
    });
  }

  /* ---------- 購物商城：產品列表、購物車、結帳示範 ---------- */
  var SHOP_PRODUCTS = [
    { id:'h1', line:'human', tag:'CAPSULE / 膠囊', name:'p.h1n', desc:'p.h1d', img:'assets/product-real-pack.jpg', price:1280 },
    { id:'h2', line:'human', tag:'FORMULA / 複方', name:'p.h2n', desc:'p.h2d', img:'assets/product-capsule.jpg', price:1080 },
    { id:'h3', line:'human', tag:'FORMULA / 複方', name:'p.h3n', desc:'p.h3d', img:'assets/product-formula.jpg', price:1180 },
    { id:'h4', line:'human', tag:'EXTRACT / 晶萃', name:'p.h4n', desc:'p.h4d', img:'assets/product-extract.jpg', price:1480 },
    { id:'h5', line:'human', tag:'FORMULA / 複方', name:'p.h5n', desc:'p.h5d', img:'assets/product-natural.jpg', price:980 },
    { id:'h6', line:'human', tag:'SERVICE / 服務', name:'p.h6n', desc:'p.h6d', img:'assets/lab.jpg', price:0 },
    { id:'p1', line:'pet', tag:'CAT / 泌尿', name:'p.p1n', desc:'p.p1d', img:'assets/pet-cat.jpg', price:880 },
    { id:'p2', line:'pet', tag:'CAT / 呵護', name:'p.p2n', desc:'p.p2d', img:'assets/pet-cat2.jpg', price:920 },
    { id:'p3', line:'pet', tag:'DOG & CAT / 防護', name:'p.p3n', desc:'p.p3d', img:'assets/pet-dog.jpg', price:860 },
    { id:'p4', line:'pet', tag:'DOG & CAT / 泌尿', name:'p.p4n', desc:'p.p4d', img:'assets/pet-puppy.jpg', price:760 },
    { id:'p5', line:'pet', tag:'EYE / 眼部', name:'p.p5n', desc:'p.p5d', img:'assets/product-extract.jpg', price:690 },
    { id:'p6', line:'pet', tag:'EYE / 眼部', name:'p.p6n', desc:'p.p6d', img:'assets/quality.jpg', price:690 },
    { id:'p7', line:'pet', tag:'SKIN / 外用', name:'p.p7n', desc:'p.p7d', img:'assets/nature.jpg', price:580 },
    { id:'p8', line:'pet', tag:'SKIN / 外用', name:'p.p8n', desc:'p.p8d', img:'assets/forest.jpg', price:580 },
    { id:'p9', line:'pet', tag:'SKIN / 外用', name:'p.p9n', desc:'p.p9d', img:'assets/product-natural.jpg', price:520 }
  ];
  var shopList = document.getElementById('shopList');
  if (shopList) {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('jh-cart') || '[]') || []; } catch (e) { cart = []; }
    var cartBody = document.getElementById('cartBody');
    var cartCount = document.getElementById('cartCount');
    var cartTotal = document.getElementById('cartTotal');

    function money(n) { return 'TWD ' + Number(n).toLocaleString('en-US'); }
    function saveCart() { try { localStorage.setItem('jh-cart', JSON.stringify(cart)); } catch (e) {} }
    function renderCart() {
      if (!cartBody) return;
      var count = 0, total = 0;
      for (var i = 0; i < cart.length; i++) { count += cart[i].qty; total += cart[i].qty * cart[i].price; }
      cartCount.textContent = String(count);
      cartTotal.textContent = money(total);
      if (!cart.length) { cartBody.innerHTML = '<p class="cart-empty" data-i18n="shop.empty"></p>'; applyLang(currentLang); return; }
      var html = '';
      for (var j = 0; j < cart.length; j++) {
        var row = cart[j], prod = null;
        for (var k = 0; k < SHOP_PRODUCTS.length; k++) if (SHOP_PRODUCTS[k].id === row.id) prod = SHOP_PRODUCTS[k];
        if (!prod) continue;
        html += '<div class="cart-item"><div><b data-i18n="' + prod.name + '">' + t(prod.name) + '</b><small>' + money(prod.price) + ' · ' + t('shop.total') + ' ' + money(prod.price * row.qty) + '</small></div>' +
          '<div class="cart-qty"><button type="button" data-cart-dec="' + row.id + '" aria-label="减少">−</button><span>' + row.qty + '</span><button type="button" data-cart-inc="' + row.id + '" aria-label="增加">＋</button></div></div>';
      }
      cartBody.innerHTML = html;
      applyLang(currentLang);
    }
    function addToCart(id) {
      var prod = null;
      for (var i = 0; i < SHOP_PRODUCTS.length; i++) if (SHOP_PRODUCTS[i].id === id) prod = SHOP_PRODUCTS[i];
      if (!prod || !prod.price) return;
      var found = false;
      for (var j = 0; j < cart.length; j++) if (cart[j].id === id) { cart[j].qty++; found = true; break; }
      if (!found) cart.push({ id: id, qty: 1, price: prod.price });
      saveCart(); renderCart();
      var st = document.getElementById('cartStatus'); if (st) st.textContent = t('shop.added') + '：' + t(prod.name);
    }
    function renderProducts(filter) {
      var html = '';
      for (var i = 0; i < SHOP_PRODUCTS.length; i++) {
        var p = SHOP_PRODUCTS[i];
        if (filter && filter !== 'all' && p.line !== filter) continue;
        var priceLabel = p.price ? money(p.price) : t('shop.toOrder');
        html += '<article class="shop-card reveal"><div class="sc-media"><img src="' + p.img + '" alt="" loading="lazy"></div><div class="sc-body">' +
          '<span class="sc-tag">' + p.tag + '</span><h3 data-i18n="' + p.name + '">' + t(p.name) + '</h3>' +
          '<p class="sc-desc" data-i18n="' + p.desc + '">' + t(p.desc) + '</p>' +
          '<div class="sc-row"><span class="sc-price">' + priceLabel + '</span>' +
          (p.price ? '<button class="sc-add" type="button" data-add-cart="' + p.id + '">+ ' + t('shop.cart') + '</button>' : '') +
          '</div></div></article>';
      }
      shopList.innerHTML = html;
      applyLang(currentLang);
      var adds = shopList.querySelectorAll('[data-add-cart]');
      for (var a = 0; a < adds.length; a++) adds[a].addEventListener('click', function () { addToCart(this.getAttribute('data-add-cart')); });
      if ('IntersectionObserver' in window) {
        var ro = new IntersectionObserver(function (entries) {
          for (var r = 0; r < entries.length; r++) if (entries[r].isIntersecting) { entries[r].target.classList.add('visible'); ro.unobserve(entries[r].target); }
        }, { threshold: .08 });
        var cards = shopList.querySelectorAll('.reveal');
        for (var c = 0; c < cards.length; c++) ro.observe(cards[c]);
      } else {
        var cards2 = shopList.querySelectorAll('.reveal');
        for (var c2 = 0; c2 < cards2.length; c2++) cards2[c2].classList.add('visible');
      }
    }
    renderProducts('all'); renderCart();
    var shopFilters = document.querySelectorAll('[data-shop-filter]');
    for (var sf = 0; sf < shopFilters.length; sf++) {
      shopFilters[sf].addEventListener('click', function () {
        for (var x = 0; x < shopFilters.length; x++) shopFilters[x].classList.toggle('active', shopFilters[x] === this);
        renderProducts(this.getAttribute('data-shop-filter'));
      });
    }
    cartBody.addEventListener('click', function (e) {
      var inc = e.target.getAttribute('data-cart-inc'), dec = e.target.getAttribute('data-cart-dec');
      if (!inc && !dec) return;
      var id = inc || dec;
      for (var i = 0; i < cart.length; i++) if (cart[i].id === id) {
        cart[i].qty += inc ? 1 : -1;
        if (cart[i].qty <= 0) cart.splice(i, 1);
        break;
      }
      saveCart(); renderCart();
    });
    var checkout = document.getElementById('cartCheckout');
    if (checkout) checkout.addEventListener('click', function () {
      var st = document.getElementById('cartStatus');
      if (st) st.textContent = t('shop.checkoutOk');
    });
  }

  /* ---------- 客服機器人：狗狗形象，預留 API／轉真人 ---------- */
  function dogSVG(kind, u) {
    var defs = '<defs>' +
      '<linearGradient id="' + u + 'Fur" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe3b4"/><stop offset=".55" stop-color="#f2c583"/><stop offset="1" stop-color="#d99f59"/></linearGradient>' +
      '<linearGradient id="' + u + 'Fur2" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7d29a"/><stop offset="1" stop-color="#c88945"/></linearGradient>' +
      '<radialGradient id="' + u + 'Cheek"><stop stop-color="#f3a7a0" stop-opacity=".85"/><stop offset="1" stop-color="#f3a7a0" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + u + 'Collar" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#4b9a8d"/><stop offset="1" stop-color="#2f7a70"/></linearGradient>' +
    '</defs>';
    var ears = '<g class="cb-ear-l"><path d="M34 40c-13-4-21 8-18 24 2 13 11 19 18 14 6-5 6-14 4-21z" fill="url(#' + u + 'Fur2)" stroke="#c88945" stroke-width="1"/><path d="M32 47c-7 2-10 9-9 17" stroke="#c88945" stroke-width="1.2" fill="none" opacity=".5"/></g>' +
      '<g class="cb-ear-r"><path d="M94 40c13-4 21 8 18 24-2 13-11 19-18 14-6-5-6-14-4-21z" fill="url(#' + u + 'Fur2)" stroke="#c88945" stroke-width="1"/><path d="M96 47c7 2 10 9 9 17" stroke="#c88945" stroke-width="1.2" fill="none" opacity=".5"/></g>';
    var face = '<path d="M48 24q16-11 32 0l-5 10H53z" fill="url(#' + u + 'Fur2)"/>' +
      '<ellipse cx="64" cy="54" rx="35" ry="32" fill="url(#' + u + 'Fur)"/>' + ears +
      '<ellipse cx="64" cy="68" rx="22" ry="16" fill="#fff4de"/>' +
      '<circle cx="39" cy="62" r="11" fill="url(#' + u + 'Cheek)"/><circle cx="89" cy="62" r="11" fill="url(#' + u + 'Cheek)"/>' +
      '<circle class="cb-eye" cx="50" cy="51" r="5.6" fill="#3b2b23"/><circle class="cb-eye" cx="78" cy="51" r="5.6" fill="#3b2b23"/>' +
      '<circle cx="51.8" cy="49" r="2" fill="#fff"/><circle cx="79.8" cy="49" r="2" fill="#fff"/>' +
      '<circle cx="48.6" cy="53" r=".9" fill="#fff" opacity=".85"/><circle cx="76.6" cy="53" r=".9" fill="#fff" opacity=".85"/>' +
      '<path d="M44 42q6-3 11-1M73 41q6-2 11 1" stroke="#c88945" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M58 64q6-6 12 0 0 6-6 7-6-1-6-7z" fill="#3b2b23"/>' +
      '<ellipse cx="61" cy="65" rx="2" ry="1.2" fill="#fff" opacity=".55"/>';
    var sparkle = '<path d="M22 33l2-4 2 4 4 2-4 2-2 4-2-4-4-2z" fill="#8c9a63" opacity=".8"/>';
    var body;
    if (kind === 'sit') {
      body = '<g class="cb-tail"><path d="M92 106c16-2 24-14 20-26-2-6-9-7-12-3 6 4 7 10 2 14-5 4-10 4-14 3z" fill="url(#' + u + 'Fur2)" stroke="#c88945" stroke-width="1"/></g>' +
        '<g class="cb-body"><ellipse cx="64" cy="98" rx="31" ry="28" fill="url(#' + u + 'Fur)"/>' +
        '<ellipse cx="64" cy="106" rx="21" ry="21" fill="#fff0d4"/>' +
        '<ellipse cx="47" cy="121" rx="12" ry="8" fill="url(#' + u + 'Fur2)"/><ellipse cx="81" cy="121" rx="12" ry="8" fill="url(#' + u + 'Fur2)"/>' +
        '<ellipse cx="47" cy="124" rx="7" ry="4" fill="#fff0d4"/><ellipse cx="81" cy="124" rx="7" ry="4" fill="#fff0d4"/>' +
        '<path d="M42 84q22 12 44 0" stroke="url(#' + u + 'Collar)" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<circle cx="64" cy="92" r="5" fill="#8c9a63" stroke="#fff" stroke-width="1.2"/><circle cx="64" cy="92" r="1.7" fill="#fff"/></g>' +
        '<g class="cb-head">' + face +
        '<g class="cb-tongue"><path d="M59 72q5 4 10 0 1 12-5 14-6-2-5-14z" fill="#f08f95" stroke="#d9737c" stroke-width=".8"/><path d="M64 77v7" stroke="#d9737c" stroke-width=".8"/></g>' +
        '<path d="M64 71v3" stroke="#3b2b23" stroke-width="1.4"/>' + sparkle + '</g>';
    } else {
      body = '<g class="cb-tail"><path d="M92 88c14-8 22-22 16-33-3-5-10-5-12-1 7 4 8 11 3 16-5 5-11 6-17 5z" fill="url(#' + u + 'Fur2)" stroke="#c88945" stroke-width="1"/></g>' +
        '<g class="cb-body"><ellipse cx="64" cy="92" rx="32" ry="24" fill="url(#' + u + 'Fur)"/>' +
        '<ellipse cx="64" cy="98" rx="21" ry="16" fill="#fff0d4"/>' +
        '<rect x="38" y="104" width="13" height="26" rx="6.5" fill="url(#' + u + 'Fur2)"/><rect x="55" y="106" width="13" height="24" rx="6.5" fill="url(#' + u + 'Fur)"/>' +
        '<rect x="72" y="106" width="13" height="24" rx="6.5" fill="url(#' + u + 'Fur)"/><rect x="87" y="104" width="13" height="26" rx="6.5" fill="url(#' + u + 'Fur2)"/>' +
        '<ellipse cx="44.5" cy="129" rx="8" ry="4.5" fill="#fff0d4"/><ellipse cx="61.5" cy="129" rx="8" ry="4.5" fill="#fff0d4"/>' +
        '<ellipse cx="78.5" cy="129" rx="8" ry="4.5" fill="#fff0d4"/><ellipse cx="93.5" cy="129" rx="8" ry="4.5" fill="#fff0d4"/>' +
        '<path d="M40 76q24 13 48 0" stroke="url(#' + u + 'Collar)" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<circle cx="64" cy="84" r="5" fill="#8c9a63" stroke="#fff" stroke-width="1.2"/><circle cx="64" cy="84" r="1.7" fill="#fff"/></g>' +
        '<g class="cb-head">' + face +
        '<path d="M64 70v3M64 73q-6 7-12 1M64 73q6 7 12 1" stroke="#3b2b23" stroke-width="1.6" fill="none" stroke-linecap="round"/>' + sparkle + '</g>';
    }
    return '<svg viewBox="0 0 128 140" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + defs + body + '</svg>';
  }

  var chatHTML = '<aside class="chatbot collapsed" id="jhChatbot" aria-label="客服助手">' +
    '<section class="chat-panel" id="chatPanel">' +
      '<header class="chat-head"><span class="cb-ava">' + dogSVG('stand', 'cbava') + '</span>' +
        '<div><b data-i18n="chat.title">小鴻 · 客服助手</b><small class="cb-status"><i></i><span data-i18n="chat.status">線上 · 示範模式</span></small></div>' +
        '<div class="cb-tools"><button class="chat-icon" id="chatMax" type="button" aria-label="放大" title="放大 / 縮小">⤢</button><button class="chat-icon chat-close" id="chatClose" type="button" aria-label="關閉">✕</button></div></header>' +
      '<div class="chat-body" id="chatBody"><div class="chat-msg bot" data-i18n="chat.welcome"></div></div>' +
      '<div class="chat-quick">' +
        '<button type="button" data-chat-q="1" data-i18n="chat.q1"></button>' +
        '<button type="button" data-chat-q="2" data-i18n="chat.q2"></button>' +
        '<button type="button" data-chat-q="3" data-i18n="chat.q3"></button>' +
        '<button type="button" data-chat-q="4" data-i18n="chat.q4"></button></div>' +
      '<form class="chat-foot" id="chatForm"><input id="chatInput" type="text" autocomplete="off" data-i18n-ph="chat.placeholder" placeholder="輸入你的問題…">' +
        '<button type="submit" data-i18n-ph="chat.send" aria-label="送出訊息">➤</button></form>' +
    '</section>' +
    '<button class="chatbot-bubble" id="chatToggle" type="button" aria-label="開啟客服助手" aria-expanded="false" aria-controls="chatPanel">' + dogSVG('sit', 'cbbub') + '</button>' +
  '</aside>';
  document.body.insertAdjacentHTML('beforeend', chatHTML);
  applyLang(currentLang);

  var cb = document.getElementById('jhChatbot');
  var cbToggle = document.getElementById('chatToggle');
  var cbClose = document.getElementById('chatClose');
  var cbInput = document.getElementById('chatInput');
  var cbBody = document.getElementById('chatBody');
  var cbForm = document.getElementById('chatForm');

  function setChatOpen(open) {
    cb.classList.toggle('collapsed', !open);
    cbToggle.innerHTML = dogSVG(open ? 'stand' : 'sit', 'cbbub');
    cbToggle.setAttribute('aria-expanded', String(open));
    cbToggle.setAttribute('aria-label', t(open ? 'chat.close' : 'chat.open'));
    if (open) {
      if (!cb.classList.contains('fullscreen')) {
        var panelH = cb.querySelector('.chat-panel').offsetHeight || 420;
        var need = panelH + 22;
        if (cb.offsetTop < need) applyChatPos(cb.offsetLeft, Math.min(need, window.innerHeight - 100));
      }
      cbInput.focus(); cbBody.scrollTop = cbBody.scrollHeight;
    }
    try { localStorage.setItem('jh-chat-open', open ? '1' : '0'); } catch (e) {}
  }
  var cbSaved = false;
  try { cbSaved = localStorage.getItem('jh-chat-open') === '1'; } catch (e) {}
  setChatOpen(cbSaved);

  var chatMax = document.getElementById('chatMax');
  function chatClamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function applyChatPos(x, y) {
    cb.style.left = chatClamp(x, 6, Math.max(6, window.innerWidth - 100)) + 'px';
    cb.style.top = chatClamp(y, 6, Math.max(6, window.innerHeight - 100)) + 'px';
    cb.style.right = 'auto'; cb.style.bottom = 'auto';
  }
  var savedPos = null;
  try { savedPos = JSON.parse(localStorage.getItem('jh-chat-pos') || 'null'); } catch (e) {}
  applyChatPos(savedPos && savedPos.x != null ? savedPos.x : window.innerWidth - 112,
    savedPos && savedPos.y != null ? savedPos.y : window.innerHeight - 112);
  window.addEventListener('resize', function () { if (!cb.classList.contains('fullscreen')) applyChatPos(cb.offsetLeft, cb.offsetTop); }, { passive: true });
  var dragEl = null, dragStart = null, dragMoved = false;
  function startChatDrag(e, el) {
    if (cb.classList.contains('fullscreen') || (el !== cbToggle && e.target.closest('button'))) return;
    dragEl = el; dragMoved = false;
    dragStart = { x: e.clientX, y: e.clientY, left: cb.offsetLeft, top: cb.offsetTop };
    el.classList.add('dragging');
    if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function moveChatDrag(e) {
    if (!dragEl) return;
    var dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) dragMoved = true;
    applyChatPos(dragStart.left + dx, dragStart.top + dy);
  }
  function endChatDrag() {
    if (!dragEl) return;
    dragEl.classList.remove('dragging');
    if (dragMoved) {
      cb.dataset.dragged = '1';
      try { localStorage.setItem('jh-chat-pos', JSON.stringify({ x: cb.offsetLeft, y: cb.offsetTop })); } catch (e) {}
      window.setTimeout(function () { cb.dataset.dragged = ''; }, 120);
    }
    dragEl = null;
  }
  var chatHead = cb.querySelector('.chat-head');
  cbToggle.addEventListener('pointerdown', function (e) { startChatDrag(e, cbToggle); });
  cbToggle.addEventListener('pointermove', moveChatDrag);
  cbToggle.addEventListener('pointerup', endChatDrag);
  cbToggle.addEventListener('pointercancel', endChatDrag);
  chatHead.addEventListener('pointerdown', function (e) { startChatDrag(e, chatHead); });
  chatHead.addEventListener('pointermove', moveChatDrag);
  chatHead.addEventListener('pointerup', endChatDrag);
  chatHead.addEventListener('pointercancel', endChatDrag);
  function setChatFullscreen(on) {
    cb.classList.toggle('fullscreen', on);
    cb.classList.remove('collapsed');
    cbToggle.setAttribute('aria-expanded', 'true');
    if (chatMax) { chatMax.textContent = on ? '⤡' : '⤢'; chatMax.setAttribute('aria-label', on ? t('chat.min') : t('chat.max')); }
    if (on) cbInput.focus();
    try { localStorage.setItem('jh-chat-full', on ? '1' : '0'); } catch (e) {}
  }
  if (chatMax) chatMax.addEventListener('click', function (e) { e.stopPropagation(); setChatFullscreen(!cb.classList.contains('fullscreen')); });
  cbToggle.addEventListener('click', function () { if (cb.dataset.dragged === '1') return; setChatOpen(cb.classList.contains('collapsed')); });
  cbClose.addEventListener('click', function () { if (cb.classList.contains('fullscreen')) setChatFullscreen(false); setChatOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !cb.classList.contains('collapsed')) { if (cb.classList.contains('fullscreen')) setChatFullscreen(false); setChatOpen(false); }
  });
  var cbFullSaved = false;
  try { cbFullSaved = localStorage.getItem('jh-chat-full') === '1'; } catch (e) {}
  if (cbFullSaved) setChatFullscreen(true);

  function addChatMsg(who, text) {
    var d = document.createElement('div');
    d.className = 'chat-msg ' + who;
    d.textContent = text;
    cbBody.appendChild(d);
    cbBody.scrollTop = cbBody.scrollHeight;
  }
  function replyChat(qnum) {
    var question = qnum ? t('chat.q' + qnum) : cbInput.value.trim();
    if (!question) return;
    addChatMsg('user', question);
    if (qnum) addChatMsg('bot', t('chat.a' + qnum));
    else {
      var v = question.toLowerCase();
      if (/訂單|order|查詢|track/.test(v)) addChatMsg('bot', t('chat.a2'));
      else if (/產品|product|保健|寵物|pet|狗|貓/.test(v)) addChatMsg('bot', t('chat.a1'));
      else if (/合作|通路|代工|oem|送禮|gift/.test(v)) addChatMsg('bot', t('chat.a3'));
      else addChatMsg('bot', t('chat.unknown'));
    }
    cbInput.value = '';
  }
  var qBtns = cb.querySelectorAll('[data-chat-q]');
  for (var qb = 0; qb < qBtns.length; qb++) qBtns[qb].addEventListener('click', function () { replyChat(this.getAttribute('data-chat-q')); });
  if (cbForm) cbForm.addEventListener('submit', function (e) { e.preventDefault(); replyChat(0); });

  /* ---------- Hero 立體貓咪（線條＋節點，隨滑鼠開合旋轉） ---------- */
  var catCanvas = document.getElementById('bioCanvas');
  if (catCanvas && catCanvas.getContext && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cc = catCanvas.getContext('2d');
    var cw = 0, ch = 0, cdpr = 1, craf = 0, cvisible = true;
    var cmx = 0, cmy = 0, ctmx = 0, ctmy = 0;
    window.addEventListener('pointermove', function (e) {
      ctmx = (e.clientX / window.innerWidth - .5) * 2;
      ctmy = (e.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });

    var CAT_V = [
      [-.86,-.14,.02],[-.80,-.50,.04],[-.54,-.80,.06],[-.22,-.94,.08],[.22,-.94,.08],[.54,-.80,.06],
      [.80,-.50,.04],[.86,-.14,.02],[.74,.34,.02],[.40,.68,.06],[0,.82,.10],[-.40,.68,.06],[-.74,.34,.02],
      [-.74,-1.08,.00],[-.44,-.74,.12],[.74,-1.08,.00],[.44,-.74,.12],
      [-.34,-.18,.44],[.34,-.18,.44],[0,.16,.58],[0,.36,.50],
      [-.58,.12,.18],[.58,.12,.18],[-1.28,.30,.02],[-1.20,.54,.02],[1.28,.30,.02],[1.20,.54,.02],
      [-.28,-.24,.52],[.40,-.24,.52]
    ];
    var CAT_E = [];
    for (var ei = 0; ei < 12; ei++) CAT_E.push([ei, ei + 1]);
    CAT_E.push([12, 0]);
    CAT_E.push([2, 13], [13, 14], [14, 3], [5, 15], [15, 16], [16, 4]);
    CAT_E.push([14, 17], [16, 18], [17, 19], [18, 19], [19, 20], [20, 21], [20, 22], [17, 21], [18, 22]);
    CAT_E.push([21, 23], [21, 24], [22, 25], [22, 26]);

    function catResize() {
      var rect = catCanvas.getBoundingClientRect();
      cdpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = Math.max(rect.width, 1); ch = Math.max(rect.height, 1);
      catCanvas.width = Math.round(cw * cdpr); catCanvas.height = Math.round(ch * cdpr);
      cc.setTransform(cdpr, 0, 0, cdpr, 0, 0);
    }
    function catDraw() {
      if (!cvisible) { craf = window.requestAnimationFrame(catDraw); return; }
      cc.clearRect(0, 0, cw, ch);
      var now = Date.now();
      cmx += (ctmx - cmx) * .055; cmy += (ctmy - cmy) * .055;
      var yaw = now * .00010 + cmx * 1.15;
      var pitch = cmy * .62;
      var cy1 = Math.cos(yaw), sy1 = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var open = 1 + cmx * .26;
      var ear = 1 + cmx * .55;
      var wh = 1 + cmx * .90;
      var cx = cw * .5 + cmx * 22, cy = ch * .52 + cmy * 18;
      var radius = Math.min(cw * .30, ch * .46);
      var px = [], py = [], pz = [];

      for (var i = 0; i < CAT_V.length; i++) {
        var v = CAT_V[i], x = v[0], y = v[1], z = v[2];
        if (i === 13) { x *= ear; y = y * (1 + cmy * .35); }
        if (i === 15) { x *= ear; y = y * (1 + cmy * .35); }
        if (i === 14) { x *= ear; }
        if (i === 16) { x *= ear; }
        if (i === 23 || i === 24) { x *= wh; y = y * (1 - cmy * .25); }
        if (i === 25 || i === 26) { x *= wh; y = y * (1 - cmy * .25); }
        x *= open; y *= open;
        var x1 = x * cy1 - z * sy1, z1 = x * sy1 + z * cy1;
        var y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        var persp = 2.7 / (3.0 + z2);
        px[i] = cx + x1 * radius * persp;
        py[i] = cy + y1 * radius * persp;
        pz[i] = z2;
      }

      // 連線：薄荷／苔綠玻璃線，深度決定亮度
      for (var e = 0; e < CAT_E.length; e++) {
        var u = CAT_E[e][0], v2 = CAT_E[e][1];
        var depth = (pz[u] + pz[v2] + 2) / 4;
        var alpha = (.10 + depth * .42).toFixed(3);
        cc.strokeStyle = e >= 24 && e <= 27 ? 'rgba(63,141,127,' + (.16 + depth * .40).toFixed(3) + ')'
          : 'rgba(63,141,127,' + alpha + ')';
        cc.lineWidth = e >= 24 && e <= 27 ? 1.1 : 1.5;
        cc.beginPath(); cc.moveTo(px[u], py[u]); cc.lineTo(px[v2], py[v2]); cc.stroke();
      }

      // 節點：前面大而亮，後面小而淡
      for (var n = 0; n < CAT_V.length; n++) {
        var d = (pz[n] + 1) / 2;
        var r = Math.max(.6, 1.6 + d * 3.2);
        cc.fillStyle = (n === 19) ? 'rgba(210,106,76,' + (.55 + d * .4).toFixed(3) + ')'
          : 'rgba(63,141,127,' + (.24 + d * .58).toFixed(3) + ')';
        cc.beginPath(); cc.arc(px[n], py[n], r, 0, Math.PI * 2); cc.fill();
      }

      // 眼睛：深色橢圓＋高光
      for (var q = 0; q < 2; q++) {
        var ee = q === 0 ? 17 : 18, hi = q === 0 ? 27 : 28;
        var ed = (pz[ee] + 1) / 2, er = Math.max(2.4, 5 + ed * 5);
        cc.fillStyle = 'rgba(31,45,42,' + (.55 + ed * .42).toFixed(3) + ')';
        cc.beginPath(); cc.ellipse(px[ee], py[ee], er * .82, er, 0, 0, Math.PI * 2); cc.fill();
        cc.fillStyle = 'rgba(255,255,255,.9)';
        cc.beginPath(); cc.arc(px[hi], py[hi], Math.max(1, 1.8 + ed * 1.6), 0, Math.PI * 2); cc.fill();
      }

      // 鼻子：暖陶三角
      cc.fillStyle = 'rgba(210,106,76,.86)';
      cc.beginPath(); cc.moveTo(px[19], py[19] - 3);
      cc.lineTo(px[19] - 5, py[19] + 3); cc.lineTo(px[19] + 5, py[19] + 3); cc.closePath(); cc.fill();

      // 核心呼吸光暈
      var pulse = .07 + .035 * Math.sin(now * .0008);
      var g = cc.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.35);
      g.addColorStop(0, 'rgba(63,141,127,' + pulse.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(63,141,127,0)');
      cc.fillStyle = g; cc.beginPath(); cc.arc(cx, cy, radius * 1.35, 0, Math.PI * 2); cc.fill();

      craf = window.requestAnimationFrame(catDraw);
    }
    catResize(); catDraw();
    window.addEventListener('resize', catResize, { passive: true });
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) { cvisible = entries[0].isIntersecting; }, { threshold: .01 });
      cio.observe(catCanvas);
    }
    window.addEventListener('beforeunload', function () { window.cancelAnimationFrame(craf); });
  }

  /* ---------- Hero 真實點陣世界地圖（多邊形大陸＋連線） ---------- */
  var mapCanvas = document.getElementById('globalMap');
  if (mapCanvas && mapCanvas.getContext && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var mctx = mapCanvas.getContext('2d');
    var mw = 0, mh = 0, mdpr = 1, mapLayer = document.createElement('canvas');
    var mraf = 0, mvisible = true;
    var CONTINENTS = [
      [[-168,65],[-150,70],[-130,61],[-116,50],[-101,49],[-86,30],[-80,25],[-95,18],[-106,23],[-118,33],[-131,50],[-152,58]],
      [[-52,82],[-22,78],[-26,68],[-48,60],[-60,70]],
      [[-79,10],[-61,9],[-46,-4],[-35,-8],[-40,-22],[-52,-34],[-61,-50],[-70,-54],[-73,-40],[-78,-14]],
      [[-10,36],[0,44],[10,46],[20,40],[28,41],[30,55],[18,60],[5,58],[-6,50]],
      [[-17,35],[10,37],[32,31],[42,12],[50,10],[40,-15],[30,-30],[18,-35],[10,-28],[0,-10],[-10,5]],
      [[28,40],[45,42],[60,55],[90,75],[120,72],[140,60],[136,46],[121,23],[106,10],[96,5],[80,8],[70,20],[55,25],[45,34]],
      [[68,24],[80,22],[88,20],[82,8],[75,8]],
      [[95,15],[110,10],[120,5],[116,-6],[105,-7],[100,5]],
      [[113,-22],[130,-12],[145,-18],[150,-30],[140,-38],[120,-35],[113,-28]],
      [[130,32],[140,36],[142,42],[137,38]]
    ];
    var nodes = [
      [121.5, 25], [139.7, 35.7], [103.8, 1.3], [55.3, 25.2], [8.7, 50.1],
      [-0.1, 51.5], [-74, 40.7], [-118, 34], [151, -33.8], [-46.6, -23.5]
    ];
    function inPoly(lon, lat, poly) {
      var inside = false;
      for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
        if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }
    function isLand(lon, lat) {
      for (var a = 0; a < CONTINENTS.length; a++) if (inPoly(lon, lat, CONTINENTS[a])) return true;
      return false;
    }
    function project(lon, lat) { return [(lon + 180) / 360 * mw, (82 - lat) / 146 * mh]; }
    function buildMap() {
      mapLayer.width = Math.round(mw * mdpr); mapLayer.height = Math.round(mh * mdpr);
      var lc = mapLayer.getContext('2d');
      lc.setTransform(mdpr, 0, 0, mdpr, 0, 0);
      lc.clearRect(0, 0, mw, mh);
      // 淡大陸底色，讓地圖輪廓清楚
      for (var c = 0; c < CONTINENTS.length; c++) {
        var poly = CONTINENTS[c];
        lc.beginPath();
        for (var q = 0; q < poly.length; q++) {
          var pt = project(poly[q][0], poly[q][1]);
          if (q === 0) lc.moveTo(pt[0], pt[1]); else lc.lineTo(pt[0], pt[1]);
        }
        lc.closePath();
        lc.fillStyle = 'rgba(63,141,127,.07)'; lc.fill();
        lc.strokeStyle = 'rgba(63,141,127,.16)'; lc.lineWidth = 1; lc.stroke();
      }
      var step = mw < 700 ? 9 : 7;
      for (var y = 12; y <= mh - 12; y += step) {
        for (var x = step / 2; x < mw; x += step) {
          var lon = x / mw * 360 - 180, lat = 82 - y / mh * 146;
          if (!isLand(lon, lat)) continue;
          var edge = 1 - Math.abs(x - mw / 2) / mw;
          lc.fillStyle = 'rgba(47,122,112,' + (.46 + edge * .34).toFixed(3) + ')';
          lc.beginPath(); lc.arc(x, y, mw < 700 ? 1.5 : 1.9, 0, Math.PI * 2); lc.fill();
        }
      }
      lc.strokeStyle = 'rgba(140,154,99,.12)'; lc.lineWidth = 1;
      for (var gx = 0; gx <= 6; gx++) { var px = mw * gx / 6; lc.beginPath(); lc.moveTo(px, 0); lc.lineTo(px, mh); lc.stroke(); }
      for (var gy = 0; gy <= 4; gy++) { var py = mh * gy / 4; lc.beginPath(); lc.moveTo(0, py); lc.lineTo(mw, py); lc.stroke(); }
    }
    function resizeMap() {
      var rect = mapCanvas.getBoundingClientRect();
      mdpr = Math.min(window.devicePixelRatio || 1, 2);
      mw = Math.max(rect.width, 1); mh = Math.max(rect.height, 1);
      mapCanvas.width = Math.round(mw * mdpr); mapCanvas.height = Math.round(mh * mdpr);
      mctx.setTransform(mdpr, 0, 0, mdpr, 0, 0);
      buildMap();
    }
    function drawMap() {
      if (!mvisible) { mraf = window.requestAnimationFrame(drawMap); return; }
      mctx.clearRect(0, 0, mw, mh);
      mctx.drawImage(mapLayer, 0, 0, mw, mh);
      var t = Date.now() * .00030;
      var hub = project(nodes[0][0], nodes[0][1]);
      for (var i = 1; i < nodes.length; i++) {
        var p = project(nodes[i][0], nodes[i][1]);
        var mx = (hub[0] + p[0]) / 2, my = (hub[1] + p[1]) / 2 - Math.abs(p[0] - hub[0]) * .18;
        mctx.strokeStyle = 'rgba(210,106,76,.42)'; mctx.lineWidth = 1.2;
        mctx.beginPath(); mctx.moveTo(hub[0], hub[1]); mctx.quadraticCurveTo(mx, my, p[0], p[1]); mctx.stroke();
        var u = (t + i * .13) % 1, iu = 1 - u;
        var qx = iu * iu * hub[0] + 2 * iu * u * mx + u * u * p[0];
        var qy = iu * iu * hub[1] + 2 * iu * u * my + u * u * p[1];
        mctx.fillStyle = 'rgba(140,154,99,.95)';
        mctx.shadowColor = 'rgba(140,154,99,.9)'; mctx.shadowBlur = 10;
        mctx.beginPath(); mctx.arc(qx, qy, 2.4, 0, Math.PI * 2); mctx.fill();
        mctx.shadowBlur = 0;
      }
      for (var n = 0; n < nodes.length; n++) {
        var q = project(nodes[n][0], nodes[n][1]);
        var pulse = 2 + Math.sin(t * 2 + n) * 1.1;
        mctx.fillStyle = n === 0 ? 'rgba(210,106,76,.95)' : 'rgba(47,122,112,.8)';
        mctx.beginPath(); mctx.arc(q[0], q[1], 2.6, 0, Math.PI * 2); mctx.fill();
        mctx.strokeStyle = n === 0 ? 'rgba(210,106,76,.4)' : 'rgba(47,122,112,.3)';
        mctx.beginPath(); mctx.arc(q[0], q[1], 4 + pulse, 0, Math.PI * 2); mctx.stroke();
      }
      mraf = window.requestAnimationFrame(drawMap);
    }
    resizeMap(); drawMap();
    window.addEventListener('resize', resizeMap, { passive: true });
    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (entries) { mvisible = entries[0].isIntersecting; }, { threshold: .01 });
      mio.observe(mapCanvas);
    }
    window.addEventListener('beforeunload', function () { window.cancelAnimationFrame(mraf); });
  }
})();

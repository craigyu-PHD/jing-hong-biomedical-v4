/* 精鴻生醫 v7 — 雙語、互動、懸浮下拉、3D 分子＋流光、全身拉布拉多、國際訂購 */
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
      'nav.cases': '實例分享', 'nav.order': '訂單系統', 'nav.contact': '合作洽詢',
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
      'msg.loginOk': '登入成功（示範）：身份已識別。', 'msg.loginFail': '示範帳號為 demo / demo123；未連接後端。',
      'msg.orderOk': '（示範）· 狀態：已出貨，配送中。', 'msg.inquiry': '已產生詢問稿（示範），請另行透過正式聯絡方式送出。'
    },
    en: {
      'top.note': 'JING HONG BIOMEDICAL · Nature × Science × Sustainability',
      'ticker.tag': 'LATEST', 'ticker.a': 'New site live — human wellness and ANUBIS pet care shown side by side',
      'ticker.b': '11/26 sample update: bilingual switch and order portal added', 'ticker.c': 'Open for retail, OEM and corporate gifting inquiries',
      'ticker.d': 'Traceable sourcing · Quality documents · Third-party testing',
      'nav.story': 'Our Story', 'nav.news': 'News', 'nav.products': 'Products', 'nav.craft': 'Science & Quality',
      'nav.cases': 'Case Studies', 'nav.order': 'Order Portal', 'nav.contact': 'Contact Us',
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
      'msg.loginOk': 'Login successful (demo): role identified.', 'msg.loginFail': 'Demo account is demo / demo123; no back end connected.',
      'msg.orderOk': '(demo) · Status: shipped, in transit.', 'msg.inquiry': 'Inquiry draft generated (demo); send it through the official contact channel.'
    }
  };

  var HTML_KEYS = {
    'news.sideTitle': 1, 'story.title': 1, 'craft.title': 1, 'portal.title': 1,
    'cp.h1': 1, 'op.h1': 1,
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

  /* ---------- 懸浮下拉選單：依功能列表自動生成 ---------- */
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
      for (var di = 0; di < items.length; di++) {
        var link = document.createElement('a');
        link.href = items[di][1];
        link.innerHTML = '<i></i><span data-i18n="' + items[di][0] + '">' + items[di][0] + '</span><span>↗</span>';
        dd.appendChild(link);
      }
      item.appendChild(dd);
      caret.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var parent = this.parentNode;
        var willOpen = !parent.classList.contains('open');
        var all = document.querySelectorAll('.nav-item.open');
        for (var q = 0; q < all.length; q++) all[q].classList.remove('open');
        parent.classList.toggle('open', willOpen);
      });
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item')) {
        var opened = document.querySelectorAll('.nav-item.open');
        for (var i = 0; i < opened.length; i++) opened[i].classList.remove('open');
      }
    });
  }
  applyLang(currentLang);

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

  /* ---------- 客服機器人：狗狗形象，預留 API／轉真人 ---------- */
  var DOG_SVG = '<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs>' +
      '<linearGradient id="cbFur" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f0d4a3"/><stop offset=".55" stop-color="#d9a45c"/><stop offset="1" stop-color="#b57e3c"/></linearGradient>' +
      '<linearGradient id="cbFur2" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8c48a"/><stop offset="1" stop-color="#a97035"/></linearGradient>' +
      '<radialGradient id="cbCheek"><stop stop-color="#e8a98d"/><stop offset="1" stop-color="#e8a98d" stop-opacity="0"/></radialGradient>' +
    '</defs>' +
    '<g class="cb-tail"><path d="M34 100c-16-2-24-14-20-26 2-7 9-9 13-5-6 4-7 11-2 15 6 5 13 5 18 3z" fill="url(#cbFur2)" stroke="#a97035" stroke-width="1"/></g>' +
    '<g class="cb-body">' +
      '<ellipse cx="60" cy="86" rx="34" ry="38" fill="url(#cbFur)"/>' +
      '<ellipse cx="60" cy="96" rx="21" ry="26" fill="url(#cbFur2)" opacity=".85"/>' +
      '<ellipse cx="43" cy="112" rx="12" ry="9" fill="url(#cbFur2)"/>' +
      '<ellipse cx="77" cy="112" rx="12" ry="9" fill="url(#cbFur2)"/>' +
      '<ellipse cx="43" cy="116" rx="7" ry="4" fill="#f3dcb4"/>' +
      '<ellipse cx="77" cy="116" rx="7" ry="4" fill="#f3dcb4"/>' +
    '</g>' +
    '<g class="cb-head">' +
      '<ellipse cx="60" cy="45" rx="29" ry="27" fill="url(#cbFur)"/>' +
      '<g class="cb-ear-l"><path d="M35 33c-12-4-19 7-16 22 2 12 11 18 18 13 5-4 5-12 3-19z" fill="url(#cbFur2)" stroke="#a97035" stroke-width="1"/><path d="M33 38c-7 1-11 8-10 16" stroke="#a97035" stroke-width="1.2" fill="none" opacity=".55"/></g>' +
      '<g class="cb-ear-r"><path d="M85 33c12-4 19 7 16 22-2 12-11 18-18 13-5-4-5-12-3-19z" fill="url(#cbFur2)" stroke="#a97035" stroke-width="1"/><path d="M87 38c7 1 11 8 10 16" stroke="#a97035" stroke-width="1.2" fill="none" opacity=".55"/></g>' +
      '<ellipse cx="60" cy="58" rx="20" ry="15" fill="#f6e3c3"/>' +
      '<circle cx="42" cy="56" r="9" fill="url(#cbCheek)"/><circle cx="78" cy="56" r="9" fill="url(#cbCheek)"/>' +
      '<circle class="cb-eye" cx="51" cy="43" r="3.3" fill="#100d0c"/>' +
      '<circle class="cb-eye" cx="70" cy="43" r="3.3" fill="#100d0c"/>' +
      '<circle cx="52" cy="42" r="1" fill="#fff"/><circle cx="71" cy="42" r="1" fill="#fff"/>' +
      '<path d="M46 36q5-3 9-1M66 35q5-2 9 1" stroke="#a97035" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="60.5" cy="54" rx="6" ry="4.6" fill="#100d0c"/>' +
      '<ellipse cx="58.5" cy="52.5" rx="1.6" ry="1" fill="#fff" opacity=".55"/>' +
      '<path d="M60.5 58.5v4M60.5 62.5q-5 5-9 1M60.5 62.5q5 5 9 1" stroke="#100d0c" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M37 30q23-16 46 0" stroke="#70807e" stroke-width="2.2" fill="none" opacity=".7"/>' +
      '<rect x="82" y="28" width="7" height="5" rx="2" fill="#70807e"/>' +
      '<circle cx="85.5" cy="30.5" r="1.4" fill="#a19c65"/>' +
      '<path d="M39 78q21 11 42 0" stroke="#a75743" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="60" cy="86" r="4.6" fill="#a19c65"/><circle cx="60" cy="86" r="2.2" fill="#f2efe9"/>' +
    '</g>' +
  '</svg>';

  var chatHTML = '<aside class="chatbot collapsed" id="jhChatbot" aria-label="客服助手">' +
    '<section class="chat-panel" id="chatPanel">' +
      '<header class="chat-head"><span class="cb-ava">' + DOG_SVG + '</span>' +
        '<div><b data-i18n="chat.title">小鴻 · 客服助手</b><small class="cb-status"><i></i><span data-i18n="chat.status">線上 · 示範模式</span></small></div>' +
        '<button class="chat-close" id="chatClose" type="button" aria-label="關閉">✕</button></header>' +
      '<div class="chat-body" id="chatBody"><div class="chat-msg bot" data-i18n="chat.welcome"></div></div>' +
      '<div class="chat-quick">' +
        '<button type="button" data-chat-q="1" data-i18n="chat.q1"></button>' +
        '<button type="button" data-chat-q="2" data-i18n="chat.q2"></button>' +
        '<button type="button" data-chat-q="3" data-i18n="chat.q3"></button>' +
        '<button type="button" data-chat-q="4" data-i18n="chat.q4"></button></div>' +
      '<form class="chat-foot" id="chatForm"><input id="chatInput" type="text" autocomplete="off" data-i18n-ph="chat.placeholder" placeholder="輸入你的問題…">' +
        '<button type="submit" data-i18n-ph="chat.send" aria-label="送出訊息">➤</button></form>' +
    '</section>' +
    '<button class="chatbot-bubble" id="chatToggle" type="button" aria-label="開啟客服助手" aria-expanded="false" aria-controls="chatPanel">' + DOG_SVG + '</button>' +
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
    cbToggle.setAttribute('aria-expanded', String(open));
    cbToggle.setAttribute('aria-label', t(open ? 'chat.close' : 'chat.open'));
    if (open) { cbInput.focus(); cbBody.scrollTop = cbBody.scrollHeight; }
    try { localStorage.setItem('jh-chat-open', open ? '1' : '0'); } catch (e) {}
  }
  var cbSaved = false;
  try { cbSaved = localStorage.getItem('jh-chat-open') === '1'; } catch (e) {}
  setChatOpen(cbSaved);

  cbToggle.addEventListener('click', function () { setChatOpen(cb.classList.contains('collapsed')); });
  cbClose.addEventListener('click', function () { setChatOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !cb.classList.contains('collapsed')) setChatOpen(false);
  });

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

  /* ---------- Hero 3D 分子網絡（Protera-style molecular visual） ---------- */
  var canvas = document.getElementById('bioCanvas');
  if (canvas && canvas.getContext && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = canvas.getContext('2d');
    var pts = [], w = 0, h = 0, dpr = 1, raf = 0, visible = true;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(rect.width, 1); h = Math.max(rect.height, 1);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = w < 700 ? 34 : 72;
      pts = [];
      for (var i = 0; i < count; i++) {
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        var r = Math.random() * .78 + .22;
        pts.push({
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
          spin: (Math.random() - .5) * .00028,
          tint: i % 7
        });
      }
    }

    function draw() {
      if (!visible) { raf = window.requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      var t = Date.now();
      var a = t * .00013;
      var cos = Math.cos(a), sin = Math.sin(a);
      var radius = Math.min(w, h) * .40;
      var cx = w * (w < 900 ? .5 : .74), cy = h * .5;
      var sx = [], sy = [], sz = [], i, j;

      for (i = 0; i < pts.length; i++) {
        var p = pts[i];
        var yaw = a + p.z * 1.6;
        var X = p.x * Math.cos(yaw) - p.z * Math.sin(yaw);
        var Z = p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
        var Y = p.y * Math.cos(p.z * .8) - p.z * Math.sin(p.z * .8);
        var scale = 2.4 / (2.9 + Z);
        sx[i] = cx + X * radius * scale;
        sy[i] = cy + Y * radius * scale;
        sz[i] = Z;
      }

      // 鍵結：3D 距離相近的原子相連，透明玻璃感
      for (i = 0; i < pts.length; i++) for (j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dz = pts[i].z - pts[j].z;
        var d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < .22) {
          var alpha = .16 * (1 - d2 / .22);
          ctx.strokeStyle = 'rgba(112,128,126,' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(sx[i], sy[i]); ctx.lineTo(sx[j], sy[j]); ctx.stroke();
        }
      }

      // 原子：陶土／鼠尾草／苔綠三色，透視決定大小與亮度
      for (i = 0; i < pts.length; i++) {
        var depth = (sz[i] + 1) / 2;
        var r2 = (1.1 + depth * 2.1);
        ctx.fillStyle = pts[i].tint === 0 ? 'rgba(167,87,67,' + (.30 + depth * .38).toFixed(3) + ')'
          : pts[i].tint === 1 ? 'rgba(161,156,101,' + (.26 + depth * .36).toFixed(3) + ')'
          : 'rgba(112,128,126,' + (.22 + depth * .34).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(sx[i], sy[i], r2, 0, Math.PI * 2); ctx.fill();
      }

      // 核心光暈：緩慢呼吸
      var pulse = .06 + .03 * Math.sin(t * .0009);
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * .95);
      g.addColorStop(0, 'rgba(167,87,67,' + pulse.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(167,87,67,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, radius * .95, 0, Math.PI * 2); ctx.fill();

      raf = window.requestAnimationFrame(draw);
    }

    resize(); draw();
    window.addEventListener('resize', resize, { passive: true });
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0.01 });
      vio.observe(canvas);
    }
    window.addEventListener('beforeunload', function () { window.cancelAnimationFrame(raf); });
  }
})();

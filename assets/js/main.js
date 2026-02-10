document.addEventListener('DOMContentLoaded', () => {
  // 年号
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // 右ドロワー開閉
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('backdrop');
  const toggleBtn = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.drawer-close');
  const tabs = document.querySelectorAll('.tab-list a.tab');

  function openDrawer(){
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    toggleBtn?.setAttribute('aria-expanded','true');
    backdrop?.removeAttribute('hidden');
    // フォーカスをメニューへ
    drawer.querySelector('.drawer-close')?.focus();
    document.body.style.overflow='hidden';
  }
  function closeDrawer(){
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    toggleBtn?.setAttribute('aria-expanded','false');
    backdrop?.setAttribute('hidden','');
    document.body.style.overflow='';
  }

  

  toggleBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeDrawer();
  });
  tabs.forEach(a => a.addEventListener('click', closeDrawer));

  // BackToTop
  const toTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (!toTop) return;
    if (window.scrollY > 200) toTop.classList.add('show');
    else toTop.classList.remove('show');
  };
  if (toTop) {
    window.addEventListener('scroll', onScroll, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  }

  // ホームの来訪カウンター
  const vcEl=document.getElementById('visitorCount');
  if(vcEl){
    const ns='wakakitan-fes-2026';
    const key='home';
    const sessKey=`vc_${ns}_${key}`;
    const endpoint=(sessionStorage.getItem(sessKey))
      ?`https://api.countapi.xyz/get/${ns}/${key}`
      :`https://api.countapi.xyz/hit/${ns}/${key}`;
    fetch(endpoint).then(r=>r.json()).then(data=>{
      if(data && typeof data.value==='number'){
        vcEl.textContent=data.value.toLocaleString('ja-JP');
      } else {
        vcEl.textContent='—';
      }
    }).catch(()=> vcEl.textContent='—');
    sessionStorage.setItem(sessKey,'1');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('flipcd');
  if (root) initFlipCountdown(root);
});


// === Countdown with 3-digit Days ===
(function(){
  const root = document.querySelector('.countdown');
  if(!root) return;

  const deadlineStr = root.getAttribute('data-deadline');
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  // 要素参照
  const d1 = root.querySelector('.days-1');
  const d2 = root.querySelector('.days-2');
  const d3 = root.querySelector('.days-3');
  const h1 = root.querySelector('.hours-1');
  const h2 = root.querySelector('.hours-2');
  const m1 = root.querySelector('.min-1');
  const m2 = root.querySelector('.min-2');
  const s1 = root.querySelector('.sec-1');
  const s2 = root.querySelector('.sec-2');

  const pad2 = n => String(n).padStart(2,'0');
  const pad3 = n => String(n).padStart(3,'0'); // 日は3桁

  function setDigit(figEl, val){
    figEl.querySelector('.top').textContent = val;
    figEl.querySelector('.bottom').textContent = val;
    figEl.querySelector('.top-back span').textContent = val;
    figEl.querySelector('.bottom-back span').textContent = val;
  }
  function flip(figEl, val){
    const cur = figEl.querySelector('.top').textContent.trim();
    if(cur === String(val)) return;
    figEl.querySelector('.top-back span').textContent = val;
    figEl.querySelector('.bottom-back span').textContent = val;
    figEl.classList.remove('flip'); void figEl.offsetWidth;
    figEl.classList.add('flip');
    setTimeout(()=>{ setDigit(figEl, val); figEl.classList.remove('flip'); }, 800);
  }

  function compute(dl){
    const now = new Date();
    const diff = Math.max(0, dl - now);
    const sec = Math.floor(diff/1000);
    const days    = Math.floor(sec / 86400);
    const hours   = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return { days, hours, minutes, seconds, done: diff<=0 };
  }

  function paint(d,h,m,s){
    const DD = pad3(d), HH = pad2(h), MM = pad2(m), SS = pad2(s);
    setDigit(d1, DD[0]); setDigit(d2, DD[1]); setDigit(d3, DD[2]);
    setDigit(h1, HH[0]); setDigit(h2, HH[1]);
    setDigit(m1, MM[0]); setDigit(m2, MM[1]);
    setDigit(s1, SS[0]); setDigit(s2, SS[1]);
  }

  // 初期表示
  let init = compute(deadline);
  paint(init.days, init.hours, init.minutes, init.seconds);

  // 更新ループ
  const timer = setInterval(()=>{
    const c = compute(deadline);
    const DD = pad3(c.days), HH = pad2(c.hours), MM = pad2(c.minutes), SS = pad2(c.seconds);
    flip(d1, DD[0]); flip(d2, DD[1]); flip(d3, DD[2]);
    flip(h1, HH[0]); flip(h2, HH[1]);
    flip(m1, MM[0]); flip(m2, MM[1]);
    flip(s1, SS[0]); flip(s2, SS[1]);
    if (c.done){ clearInterval(timer); }
  }, 1000);
})();

// === Drawer character: per-page swap ===
document.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('drawerCharacter');
  if (!img) return;

  // body に設定した data-page からページ種別を取得
  const page = (document.body.dataset.page || '').toLowerCase();

  // ページ → 画像パスのマップ（必要なものだけ用意してOK）
  const charMap = {
    'home'     : 'assets/img/drkitakuma.png',
    'about'    : 'assets/img/kitakumaver2.png',
    'fest'     : 'assets/img/feskitakuma.PNG',
    'camp'     : 'assets/img/gasshukukitakuma.PNG',
    'kitakan'  : 'assets/img/kouhoukitakuma.PNG',
    'tickets'  : 'assets/img/soumukitakuma.PNG',
    'committee': 'assets/img/kitakuma.png',
    'mypage'   : 'assets/img/kouhoukitakuma.PNG',
  };

  const src = charMap[page] || 'assets/img/drkitakuma.png';
  img.src = src;
  img.alt = (page ? `${page}のキャラクター` : 'キャラクター');
});

//実行委員紹介ページのカード
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach(card => {
    const closeBtn = card.querySelector('.close-btn');

    // カード全体クリックで裏面へ（すでに反転なら何もしない）
    card.addEventListener('click', (e) => {
      if (e.target.closest('.close-btn')) return;
      if (card.classList.contains('is-flipped')) return; // ←追加
      card.classList.add('is-flipped');
      card.setAttribute('aria-expanded','true');
    });

    // ×で戻す
    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.remove('is-flipped');
      card.setAttribute('aria-expanded','false');
    });

    // Escでも戻す（任意）
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Escape'){
        card.classList.remove('is-flipped');
        card.setAttribute('aria-expanded','false');
      }
    });
  });
});

// ===== Coming Soon: typewriter effect =====
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('cs-title');
  if (!el) return;

  // reduced motion の場合は即表示して終了
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fullText = el.textContent.trim(); // 例: "Coming Soon"

  if (prefersReduced) {
    el.textContent = fullText;
    return;
  }

  // タイプ開始準備
  el.textContent = '';
  el.classList.add('typing');

  // 速度設定（ミリ秒）。速くしたい: 60 / ゆっくり: 120〜150
  const STEP = 110;

  let i = 0;
  const tick = () => {
    if (i <= fullText.length) {
      el.textContent = fullText.slice(0, i);
      i++;
      setTimeout(tick, STEP);
    } else {
      // 完了後、カーソルだけ少し残してから外す（好みで）
      setTimeout(() => el.classList.remove('typing'), 600);
    }
  };
  tick();
});

// === キャラクター紹介ページ用：ページ内スクロール & ナビ強調 ===
document.addEventListener('DOMContentLoaded', () => {
  // .characters-page が無ければ何もしない（他ページに影響しないように）
  const charPage = document.querySelector('.characters-page');
  if (!charPage) return;

  const buttons  = charPage.querySelectorAll('.char-nav button');
  const sections = charPage.querySelectorAll('.char-section');

  if (!buttons.length || !sections.length) return;

  // アクティブ切り替え用の関数
  function setActiveButton(targetId) {
    buttons.forEach(btn => {
      const isTarget = btn.dataset.target === targetId;
      btn.classList.toggle('is-active', isTarget);
    });
  }

  // クリックしたとき：スクロール + ハイライト変更
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.dataset.target;
      const section = document.querySelector(targetSelector);
      if (!section) return;

      const rect   = section.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 90; // ヘッダー分だけずらす

      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });

      // クリック時点でもハイライト変更
      setActiveButton(targetSelector);
    });
  });

  // スクロール量に応じて「今見ているキャラ」のボタンをハイライト
  function handleScroll() {
    const y = window.scrollY;
    let activeId = null;

    sections.forEach(sec => {
      const top    = sec.offsetTop - 120;           // ヘッダーぶん調整
      const bottom = top + sec.offsetHeight;
      if (y >= top && y < bottom) {
        activeId = '#' + sec.id;
      }
    });

    if (activeId) {
      setActiveButton(activeId);
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // ページ読み込み直後にも一回判定
});


// 発表者団体、横スクロール
const stickySections = [...document.querySelectorAll('.contents')];

window.addEventListener('scroll', () => {
  for (let i = 0; i < stickySections.length; i++) {
    transform(stickySections[i]);
  }
});

function transform(section) {
  const offsetTop = section.parentElement.offsetTop;
  const scrollSection = section.querySelector('.horizontal_scroll');

  const scrollWidth = scrollSection.scrollWidth;
  const windowWidth = window.innerWidth;
  const maxScroll = scrollWidth;

  const picture = section.parentElement;
  const totalHeight = picture.offsetHeight;

  let rawProgress = (window.scrollY - offsetTop) / totalHeight;
  let progress = Math.min(Math.max(rawProgress, 0), 1);

  // デバッグログ
  console.log({
    scrollY: window.scrollY,
    offsetTop,
    totalHeight,
    rawProgress,
    progress,
    maxScroll
  });
  scrollSection.style.transform = `translateX(${-maxScroll * progress}px)`;
}

//発表者団体、スライドショー
// スライドショーの要素を取得
const slides = document.querySelectorAll('.slideshow img');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

// 現在のスライドインデックス
let currentIndex = 0;

// 画像を切り替える関数
const showSlide = (index) => {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index); // 現在のスライドにactiveクラスを付与
  });
};

// 自動スライドの間隔
const autoSlideInterval = 3000; // 3秒

// 自動スライドをスタート
let autoSlide = setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length; // 次のスライドに移動
  showSlide(currentIndex);
}, autoSlideInterval);

// 「次へ」ボタンのクリックイベント
nextButton.addEventListener('click', () => {
  clearInterval(autoSlide); // 自動スライドを一時停止
  currentIndex = (currentIndex + 1) % slides.length; // 次のスライドに移動
  showSlide(currentIndex);
  autoSlide = setInterval(() => { // 再度自動スライドを開始
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, autoSlideInterval);
});

// 「前へ」ボタンのクリックイベント
prevButton.addEventListener('click', () => {
  clearInterval(autoSlide); // 自動スライドを一時停止
  currentIndex = (currentIndex - 1 + slides.length) % slides.length; // 前のスライドに移動
  showSlide(currentIndex);
  autoSlide = setInterval(() => { // 再度自動スライドを開始
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, autoSlideInterval);
});



// マイページ
/* =========================
   MyPage JS
   ========================= */

/** ★ここを必ず変更：GAS WebアプリURL（.../exec） */
const API_URL = "https://script.google.com/macros/s/AKfycbzwVsaiwS87J1NnnwAWtL80eBwwjfCV0dRz7MbVYbst2o2ikGFIc8sZPQ5Gio6BhaBwfw/exec";

/** ★地図の切り替え：部屋エリアコード → 画像パス */
const mapByArea = {
  "A": "assets/img/maps/area_a.webp",
  "B": "assets/img/maps/area_b.webp",
  "GYM": "assets/img/maps/gym.webp",
  // 例： "C": "assets/img/maps/area_c.webp",
};

function $(id) {
  return document.getElementById(id);
}

function setText(id, value, fallback = "—") {
  const el = $(id);
  if (!el) return;
  const v = (value === null || value === undefined || String(value).trim() === "") ? fallback : String(value);
  el.textContent = v;
}

function show(el, yes) {
  if (!el) return;
  el.hidden = !yes;
}

async function fetchUserById(id) {
  const url = `${API_URL}?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: "GET" });
  // GASがHTMLを返してしまう等の事故に備えて text→json
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: "invalid response", raw: text };
  }
}

function renderUser(data) {
  // 表示項目（あなたのDBの列名に合わせてGASが返すキーを想定）
  setText("nickname", data.nickname);
  setText("branch", data.branch);
  setText("grade", data.grade);

  setText("bus", data.bus, "後日案内");
  setText("course", data.course || data.themeCourse || "", "—");
  setText("courseGroup", data.courseGroup);
  setText("freeCourse", data.freeCourse);

  setText("room", data.room, "後日案内");

  // 個別連絡
  const msg = (data.message || "").toString().trim();
  const msgEl = $("message");
  if (msgEl) {
    msgEl.textContent = msg;
    show(msgEl, !!msg);
  }

  // 部屋地図（roomAreaがある人だけ表示）
  const area = (data.roomArea || "").toString().trim().toUpperCase();
  const mapSrc = mapByArea[area];
  const mapEl = $("roomMap");
  const noteEl = $("mapNote");

  if (mapEl && mapSrc) {
    mapEl.src = mapSrc;
    show(mapEl, true);
    show(noteEl, true);

    // タップで拡大（別タブで開く）
    mapEl.style.cursor = "pointer";
    mapEl.onclick = () => window.open(mapSrc, "_blank", "noopener");
  } else {
    show(mapEl, false);
    show(noteEl, false);
  }
}

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();

  const loginBtn = $("loginBtn");
  const loginId = $("loginId");
  const loginError = $("loginError");

  const loginBox = $("loginBox");
  const mypageContent = $("mypageContent");

  const saveBtn = $("saveImageBtn");
  const logoutBtn = $("logoutBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const id = (loginId?.value || "").trim();
      if (loginError) loginError.textContent = "";

      if (!id) {
        if (loginError) loginError.textContent = "IDを入力してください";
        return;
      }

      const data = await fetchUserById(id);

      if (data.error) {
        // よくあるエラー表示
        if (loginError) {
          if (data.error === "not found") loginError.textContent = "IDが見つかりません";
          else if (data.error === "ID missing") loginError.textContent = "IDを入力してください";
          else loginError.textContent = `エラー：${data.error}`;
        }
        return;
      }

      // 表示反映
      renderUser(data);

      // ログイン状態を保存（任意：次回入力省略）
      localStorage.setItem("mypage_id", id);

      show(loginBox, false);
      show(mypageContent, true);
    });
  }

  // ページ読み込み時に自動ログイン（任意）
  const savedId = localStorage.getItem("mypage_id");
  if (savedId && loginId) {
    loginId.value = savedId;
  }

  // 画像として保存
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const target = $("mypage-capture");
      if (!target || typeof html2canvas !== "function") return;

      // iOS含め、画像が入る場合は useCORS が重要
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const a = document.createElement("a");
      const yyyyMMdd = new Date().toISOString().slice(0, 10);
      a.href = canvas.toDataURL("image/png");
      a.download = `mypage_${yyyyMMdd}.png`;
      a.click();
    });
  }

  // ログアウト（localStorageを消してログイン画面に戻す）
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("mypage_id");
      show(mypageContent, false);
      show(loginBox, true);
      if (loginId) loginId.value = "";
      if (loginError) loginError.textContent = "";
    });
  }
});


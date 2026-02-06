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
// HTML内のすべての画像を取得
const slides = document.querySelectorAll('.slideshow img');
// 現在のスライドインデックスを初期化
let currentIndex = 0;
// 画像を切り替える関数
const changeImage = () => {
  slides[currentIndex].classList.remove('active'); // 現在の画像を非表示
  currentIndex = (currentIndex + 1) % slides.length; // 次の画像のインデックスを計算
  slides[currentIndex].classList.add('active'); // 次の画像を表示
};
// 3秒ごとに画像を切り替える
setInterval(() => changeImage(), 3000);
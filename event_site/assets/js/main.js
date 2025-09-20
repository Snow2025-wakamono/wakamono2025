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

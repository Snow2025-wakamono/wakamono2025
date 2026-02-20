/* ===== MyPage ===== */
/* ここだけ必ず自分のGAS exec URLに差し替え */
const API_URL = "https://script.google.com/macros/s/AKfycbxWHsfZGtV6o1SG8nj97MXCUusKBe7hVDhI7m4-tVJ7n3n2wqNQZGk6l5BtX2QKkQdmmg/exec";

/* ---------- helpers ---------- */
function setText(id, value){
  const el = document.getElementById(id);
  if(!el) return;
  const v = (value === null || value === undefined || String(value).trim() === "") ? "—" : value;
  el.textContent = v;
}

function fetchUser(id){
  return new Promise((resolve)=>{
    const cb = "cb_" + Date.now() + "_" + Math.random().toString(16).slice(2);
    window[cb] = (data) => { resolve(data); cleanup(); };

    const script = document.createElement("script");
    script.onerror = () => { resolve({ error: "jsonp failed" }); cleanup(); };

    function cleanup(){
      try{ delete window[cb]; }catch(e){}
      if(script.parentNode) script.parentNode.removeChild(script);
    }

    script.src = `${API_URL}?id=${encodeURIComponent(id)}&callback=${encodeURIComponent(cb)}`;
    document.body.appendChild(script);
  });
}

/* ---------- timetable: group-based ---------- */
function normalizeThemeGroup(raw){
  const s = (raw ?? "").toString().trim().toUpperCase();
  const m = s.match(/[A-L]/);
  return m ? m[0] : "";
}

function buildTimetableSlidesByGroup(themeGroupRaw){
  const wrap = document.getElementById("ttSlides");
  const hint = document.getElementById("ttHint");
  if(!wrap) return;

  const g = normalizeThemeGroup(themeGroupRaw);

  // A〜L 以外は共通へ
  const base = (g >= "A" && g <= "L")
    ? `assets/img/mypage/timetable/${g}`
    : `assets/img/mypage/timetable/COMMON`;

  if(hint){
    hint.textContent = g
      ? `あなたのグループ：${g}（専用タイムテーブル）`
      : `グループ未設定（共通タイムテーブル）`;
  }

  const imgs = [1,2,3,4,5,6].map(n => `${base}/tt${n}.webp`);

  wrap.innerHTML = `
    <div class="mp-slide is-active">
      <img src="${imgs[0]}" alt="タイムテーブル 1">
      <img src="${imgs[1]}" alt="タイムテーブル 2">
    </div>
    <div class="mp-slide">
      <img src="${imgs[2]}" alt="タイムテーブル 3">
      <img src="${imgs[3]}" alt="タイムテーブル 4">
    </div>
    <div class="mp-slide">
      <img src="${imgs[4]}" alt="タイムテーブル 5">
      <img src="${imgs[5]}" alt="タイムテーブル 6">
    </div>
  `;
}

/* ---------- slider ---------- */
function initTimetableSlider(){
  const slidesWrap = document.getElementById("ttSlides");
  if(!slidesWrap) return;

  const slides = Array.from(slidesWrap.querySelectorAll(".mp-slide"));
  const prev = document.getElementById("ttPrev");
  const next = document.getElementById("ttNext");
  const dotsWrap = document.getElementById("ttDots");

  if(!slides.length) return;

  let idx = slides.findIndex(s => s.classList.contains("is-active"));
  if(idx < 0) idx = 0;

  if(dotsWrap){
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const d = document.createElement("span");
      d.className = "mp-dot" + (i===idx ? " is-active" : "");
      d.addEventListener("click", ()=>{ idx=i; render(); });
      dotsWrap.appendChild(d);
    });
  }

  const render = () => {
    slides.forEach((s,i)=>s.classList.toggle("is-active", i===idx));
    if(dotsWrap){
      Array.from(dotsWrap.children).forEach((d,i)=>d.classList.toggle("is-active", i===idx));
    }
  };

  const go = (delta) => {
    idx = (idx + delta + slides.length) % slides.length;
    render();
  };

  prev?.addEventListener("click", ()=>go(-1));
  next?.addEventListener("click", ()=>go(+1));

  // swipe
  let startX = null;
  slidesWrap.addEventListener("touchstart", (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  slidesWrap.addEventListener("touchend", (e)=>{
    if(startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;
    if(Math.abs(dx) < 40) return;
    go(dx > 0 ? -1 : 1);
  }, {passive:true});

  render();
}

/* ---------- save as image ---------- */
function initSaveButton(){
  const btn = document.getElementById("saveBtn");
  const target = document.getElementById("mypageContent");
  if(!btn || !target) return;

  btn.addEventListener("click", async ()=>{
    try{
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = "作成中…";

      if(typeof html2canvas === "undefined"){
        alert("画像保存ライブラリが読み込めていません");
        btn.disabled = false;
        btn.textContent = old;
        return;
      }

      const canvas = await html2canvas(target, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true
      });

      const dataUrl = canvas.toDataURL("image/png");

      // iOS Safari fallback: open new tab
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if(isIOS){
        const w = window.open();
        if(w) w.document.write(`<img src="${dataUrl}" style="width:100%;height:auto;display:block">`);
      }else{
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "mypage.png";
        a.click();
      }

      btn.textContent = old;
      btn.disabled = false;

    }catch(err){
      console.error(err);
      alert("画像保存に失敗しました。スクショで代替してください。");
      btn.disabled = false;
      btn.textContent = "画像として保存";
    }
  });
}

/* ---------- main ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  const loginBtn = document.getElementById("loginBtn");
  const loginId = document.getElementById("loginId");
  const loginError = document.getElementById("loginError");

  if(!loginBtn || !loginId) return;

  loginBtn.addEventListener("click", async ()=>{
    loginError.textContent = "";
    const id = (loginId.value || "").trim();
    if(!id){
      loginError.textContent = "IDを入力してください";
      return;
    }

    loginBtn.disabled = true;
    const oldText = loginBtn.textContent;
    loginBtn.textContent = "読み込み中…";

    const data = await fetchUser(id);

    loginBtn.disabled = false;
    loginBtn.textContent = oldText;

    if(data.error){
      loginError.textContent = (data.error === "not found") ? "IDが見つかりません" : `エラー：${data.error}`;
      return;
    }

    // show
    document.getElementById("loginBox").hidden = true;
    document.getElementById("mypageContent").hidden = false;

    // fill
    setText("nickname", data.nickname);
    setText("branch", data.branch);
    setText("grade", data.grade);
    setText("bus", data.bus);

    setText("freeAssign", data.freeAssign);
    setText("themeCourse", data.themeCourse);
    setText("themeGroup", data.themeGroup);

    setText("freeRoom", data.freeRoom);
    setText("themeRoom", data.themeRoom);
    setText("stayRoom", data.stayRoom);

    // timetable: group based
    buildTimetableSlidesByGroup(data.themeGroup);
    initTimetableSlider();

    // save button
    initSaveButton();
  });

  document.getElementById("logoutBtn")?.addEventListener("click", ()=>location.reload());
});
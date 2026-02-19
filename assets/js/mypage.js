const API_URL = "https://script.google.com/macros/s/AKfycbxWHsfZGtV6o1SG8nj97MXCUusKBe7hVDhI7m4-tVJ7n3n2wqNQZGk6l5BtX2QKkQdmmg/exec";

function set(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = (value === null || value === undefined || String(value).trim() === "") ? "—" : value;
}

function fetchUser(id) {
  return new Promise((resolve) => {
    const cb = "cb_" + Date.now() + "_" + Math.random().toString(16).slice(2);

    window[cb] = (data) => {
      resolve(data);
      cleanup();
    };

    const script = document.createElement("script");
    script.onerror = () => {
      resolve({ error: "jsonp failed" });
      cleanup();
    };

    function cleanup() {
      try { delete window[cb]; } catch {}
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    script.src = `${API_URL}?id=${encodeURIComponent(id)}&callback=${encodeURIComponent(cb)}`;
    document.body.appendChild(script);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[mypage] loaded"); // ← これが出ないならJSが読み込めてない

  const loginBtn = document.getElementById("loginBtn");
  const loginId = document.getElementById("loginId");
  const loginError = document.getElementById("loginError");

  if (!loginBtn || !loginId) {
    console.error("[mypage] loginBtn/loginId not found. HTMLに要素がありません。");
    return;
  }

  loginBtn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    loginError && (loginError.textContent = "");

    const id = (loginId.value || "").trim();
    if (!id) {
      if (loginError) loginError.textContent = "IDを入力してください";
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "読み込み中…";

    const data = await fetchUser(id);

    loginBtn.disabled = false;
    loginBtn.textContent = "ログイン";

    if (data.error) {
      if (loginError) {
        loginError.textContent =
          (data.error === "not found") ? "IDが見つかりません" :
          (data.error === "jsonp failed") ? "通信に失敗しました（URL/公開設定/CORS）" :
          `エラー：${data.error}`;
      }
      console.error("[mypage] error:", data);
      return;
    }

    // 表示切り替え
    const loginBox = document.getElementById("loginBox");
    const content = document.getElementById("mypageContent");
    if (loginBox) loginBox.hidden = true;
    if (content) content.hidden = false;

    // 書き込み
    set("nickname", data.nickname);
    set("branch", data.branch);
    set("grade", data.grade);
    set("bus", data.bus);
    set("freeAssign", data.freeAssign);
    set("themeCourse", data.themeCourse);
    set("themeGroup", data.themeGroup);
    set("freeRoom", data.freeRoom);
    set("themeRoom", data.themeRoom);
    set("stayRoom", data.stayRoom);
  });

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => location.reload());
});
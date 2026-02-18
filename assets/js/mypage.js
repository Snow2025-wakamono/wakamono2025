const API_URL = "https://script.google.com/macros/s/AKfycbxWHsfZGtV6o1SG8nj97MXCUusKBe7hVDhI7m4-tVJ7n3n2wqNQZGk6l5BtX2QKkQdmmg/exec";

const loginBtn = document.getElementById("loginBtn");
const loginId = document.getElementById("loginId");
const loginError = document.getElementById("loginError");

loginBtn.onclick = async () => {

  loginError.textContent = "";
  const id = loginId.value.trim();

  if (!id) {
    loginError.textContent = "IDを入力してください";
    return;
  }

  const data = await fetchUser(id);

  if (data.error) {
    loginError.textContent = "IDが見つかりません";
    return;
  }

  // 表示切替
  document.getElementById("loginBox").hidden = true;
  document.getElementById("mypageContent").hidden = false;

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
};

document.getElementById("logoutBtn").onclick = () => location.reload();

function set(id, value){
  document.getElementById(id).textContent = value || "—";
}

/* JSONP通信 */
function fetchUser(id){
  return new Promise(resolve=>{
    const cb = "cb_"+Date.now();
    window[cb] = data=>{
      resolve(data);
      script.remove();
      delete window[cb];
    };

    const script=document.createElement("script");
    script.src=`${API_URL}?id=${id}&callback=${cb}`;
    document.body.appendChild(script);
  });
}
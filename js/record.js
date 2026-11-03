// record.js — 把写作/冥想/心情记录写入个人中心（登录后自动，未登录仅提示）
(function(){
  var API = "/api/records";
  function token(){ return localStorage.getItem("ve_token"); }

  function toast(msg){
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:84px;transform:translateX(-50%);background:rgba(31,92,64,.92);color:#fff;padding:10px 18px;border-radius:20px;font-size:13px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,.2)";
    document.body.appendChild(t);
    setTimeout(function(){ t.remove(); }, 2600);
  }

  function send(type, text){
    var tk = token();
    if(!tk){ toast("登录后自动记录到个人中心"); return Promise.resolve(false); }
    return fetch(API, {method:"POST", headers:{"Content-Type":"application/json","x-token":tk},
      body: JSON.stringify({type:type, text:text})})
      .then(function(r){return r.json();}).then(function(res){
        if(res.ok){ toast("已记录到个人中心"); } else { toast(res.error || "记录失败"); }
        return !!(res && res.ok);
      });
  }

  window.veRecord = {
    writing:   function(title, text){ return send("writing",   title + (text ? " · " + text : "")); },
    meditation:function(duration, note){ return send("meditation", "冥想 " + duration + " 分钟" + (note ? " · " + note : "")); },
    mood:      function(emoji, note){ return send("mood", emoji + (note ? " " + note : "")); }
  };
})();

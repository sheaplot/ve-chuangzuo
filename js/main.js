/* =========================================================
   ve创作 — 沉浸式创作流交互（纯原生 JavaScript，无框架无库）

   步骤顺序：
   step-0（入口）→ step-mood（情绪）→ step-place（发生地）
   → step-time（时间）→ step-angle（切入）→ step-writing（写作正文）

   样式约定：
   .step 默认隐藏 / .step.active 显示 / 选项 .selected 高亮
   ========================================================= */

(function () {
  "use strict";

  // 打开页面即上报一次访问（不影响前端功能，失败静默）
  fetch("/api/visit").catch(function () {});

  // 步骤顺序（与 HTML 中的 section id 对应）
  const STEP_ORDER = [
    "step-0",
    "step-mood",
    "step-place",
    "step-time",
    "step-angle",
    "step-writing"
  ];

  // 状态对象：统一管理当前步骤与四项选择
  const state = {
    stepIndex: 0,
    mood: "",
    place: "",
    time: "",
    angle: "",
    story: ""
  };

  // 四个选项屏的配置：按钮组 / 自定义胶囊输入框
  const screens = [
    {
      key: "mood",
      stepId: "step-mood",
      buttons: Array.from(document.querySelectorAll(".mood-btn")),
      customInput: document.getElementById("mood-custom-input")
    },
    {
      key: "place",
      stepId: "step-place",
      buttons: Array.from(document.querySelectorAll(".place-btn")),
      customInput: document.getElementById("place-custom-input")
    },
    {
      key: "time",
      stepId: "step-time",
      buttons: Array.from(document.querySelectorAll(".time-btn")),
      customInput: document.getElementById("time-custom-input")
    },
    {
      key: "angle",
      stepId: "step-angle",
      buttons: Array.from(document.querySelectorAll(".angle-btn")),
      customInput: document.getElementById("angle-custom-input")
    }
  ];

  const startBtn = document.getElementById("start-create-btn");
  const saveBtn = document.getElementById("save-btn");
  const publishBtn = document.getElementById("publish-btn");
  const storyText = document.getElementById("story-text");
  const aiHint = document.getElementById("ai-hint");
  const suggestionsBox = document.getElementById("ai-suggestions");
  const suggestionTip = document.getElementById("ai-suggestion-tip");
  const refreshBtn = document.getElementById("ai-refresh");

  let advanceTimer = null;

  // 步骤 id -> 索引
  function stepIndexOf(stepId) {
    return STEP_ORDER.indexOf(stepId);
  }

  // 去掉 emoji，只保留中文/字母/数字作为选项值（如 "🌿平静" -> "平静"）
  function optionValue(btn) {
    const text = (btn.textContent || "").trim();
    const cleaned = text.replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "").trim();
    return cleaned || text;
  }

  // 切换步骤：移除当前屏的 active，给目标屏加 active
  function goStep(index) {
    const clamped = Math.max(0, Math.min(STEP_ORDER.length - 1, index));
    const current = document.querySelector(".step.active");
    if (current) current.classList.remove("active");

    const target = document.getElementById(STEP_ORDER[clamped]);
    if (target) target.classList.add("active");

    state.stepIndex = clamped;

    // 进入创作流后隐藏首页落地区，保持沉浸；回到入口屏再显示
    document.body.classList.toggle("flow-active", clamped !== 0);

    if (clamped === 0) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    // 进入写作屏时，生成示例 AI 引导语与写作提示
    if (clamped === STEP_ORDER.length - 1) {
      renderAiHint();
      renderSuggestions();
    }
  }

  // 返回上一屏（保留已选状态）
  function goBack() {
    clearTimeout(advanceTimer);
    if (state.stepIndex > 0) goStep(state.stepIndex - 1);
  }

  // 选择一项：清除同组（含自定义输入框）的 selected，再高亮当前项
  function selectOption(screen, btn, value) {
    screen.buttons.forEach(function (b) {
      b.classList.remove("selected");
    });
    if (screen.customInput) screen.customInput.classList.remove("selected");

    if (btn) {
      if (btn.classList) btn.classList.add("selected");
      if (btn.setAttribute) btn.setAttribute("aria-pressed", "true");
    }
    state[screen.key] = value;
  }

  // 自定义输入生效：清空固定选项的高亮，把输入框本身标为已选
  function selectCustom(screen, value) {
    screen.buttons.forEach(function (b) {
      b.classList.remove("selected");
      if (b.setAttribute) b.setAttribute("aria-pressed", "false");
    });
    if (screen.customInput) screen.customInput.classList.add("selected");
    state[screen.key] = value;
  }

  // 固定选项点击后，约 300ms 自动进入下一屏
  function scheduleAdvance(fromIndex) {
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(function () {
      if (state.stepIndex === fromIndex) goStep(fromIndex + 1);
    }, 300);
  }

  // 为每屏（除入口屏）创建"← 上一步"按钮
  function createBackButtons() {
    STEP_ORDER.slice(1).forEach(function (stepId) {
      const section = document.getElementById(stepId);
      if (!section) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "back-btn";
      btn.textContent = "← 上一步";
      btn.style.cssText =
        "align-self: flex-start; margin-bottom: 20px; padding: 6px 0; " +
        "border: 0; background: none; color: var(--muted); " +
        "font-family: inherit; font-size: 0.9rem; line-height: 1.6; cursor: pointer;";

      btn.addEventListener("click", goBack);
      section.prepend(btn);
    });
  }

  // 绑定四个选项屏的交互
  function bindScreens() {
    screens.forEach(function (screen) {
      const fromIndex = stepIndexOf(screen.stepId);

      // 固定选项：单选高亮 + 记录 + 延迟进入下一屏
      screen.buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          selectOption(screen, btn, optionValue(btn));
          scheduleAdvance(fromIndex);
        });
      });

      // 自定义输入：回车确认，记录后进入下一屏
      if (screen.customInput) {
        screen.customInput.addEventListener("keydown", function (e) {
          if (e.key !== "Enter") return;

          const value = screen.customInput.value.trim();
          if (!value) return;

          selectCustom(screen, value);
          goStep(fromIndex + 1);
        });
      }
    });
  }

  // 生成 AI 引导语（进入写作屏时调用）
  function renderAiHint() {
    if (!aiHint) return;

    const mood = state.mood || "……";
    const place = state.place || "某个地方";
    const time = state.time || "某个时刻";
    const angle = state.angle || "某个角度";

    const sentence =
      "你此刻感到" + mood + "，故事发生在" + place +
      "——那是" + time + "的事。想从" + angle +
      "讲起，试试从那个让你改变的决定性时刻开始写。";

    aiHint.textContent = "";

    const p = document.createElement("p");
    p.textContent = sentence;

    // 底部保留示例说明
    const note = document.createElement("p");
    note.className = "ai-hint-note";
    note.style.cssText = "margin-top: 12px; color: var(--muted); font-size: 0.82rem; line-height: 1.7;";
    note.textContent = "AI 引导示例，正式版将接入真实 AI";

    aiHint.append(p);
    aiHint.append(note);
  }

  // ---------- 写作中的 AI 提示按钮 ----------
  const SUGGESTION_POOL = [
    { label: "补一个未解释的细节", tip: "在刚才那句话后面，加一个具体的细节：一个动作、一种气味，或一个数字，先不要解释它。" },
    { label: "换一个意外视角", tip: "试着从对方、旁观者，或一个物件的视角重写这一段。" },
    { label: "加一句当时的对话", tip: "写一句你当时听到或说出的话，不用解释，让读者自己感受。" },
    { label: "从一帧画面写起", tip: "先写你看到的一个静止画面，再让动作发生。" },
    { label: "删掉一句解释", tip: "找一句解释性的句子，删掉它，让细节自己说话。" },
    { label: "让一个人物做选择", tip: "给故事里的人一个具体选择：留下还是离开？说还是不说？" },
    { label: "写写身体的感觉", tip: "写一个身体感受：心跳、手心、呼吸、温度。" },
    { label: "把时间停住", tip: "选一个瞬间，放慢它，用三句话写同一秒。" },
    { label: "从一个物件开始", tip: "写一个出现在故事里的物件，它可能藏着一段记忆。" },
    { label: "加一个反转", tip: "在结尾前加一个出乎意料但合理的变化。" },
    { label: "写写气味或声音", tip: "加入一种气味或声音，让场景有现场感。" },
    { label: "写一句没说出口的话", tip: "写一句主角当时没说出口的话。" }
  ];
  const SHORT_SUGGESTIONS = [
    { label: "先写一个具体画面", tip: "不要先解释背景，直接写你看到的一个画面：光线、位置、一个人。" },
    { label: "从今天的一件小事开始", tip: "写下今天发生的一个小瞬间，哪怕只有一句话。" },
    { label: "只写三句话", tip: "先只写三句话：发生了什么、你做了什么、你当时怎么想。" }
  ];
  const LONG_SUGGESTIONS = [
    { label: "收束到一个画面", tip: "结尾不要总结道理，回到一个具体的画面或动作。" },
    { label: "把最想说的那句提前", tip: "找到全篇最有力的一句话，试着把它挪到开头。" },
    { label: "删掉最后一段", tip: "试着删掉最后一段，看看故事是不是反而更完整。" }
  ];
  const DIALOGUE_SUGGESTIONS = [
    { label: "加一句当时的对话", tip: "写一句真实的对话，不用写谁说，让语气自己交代人物。" },
    { label: "写一句没说出口的话", tip: "写一句主角当时没说出口的话，放在心里也好。" }
  ];
  const PERSPECTIVE_SUGGESTIONS = [
    { label: "换一个意外视角", tip: "把'我'换成对方，或换成一个旁观者，重写其中一段。" },
    { label: "写写对方的表情", tip: "写一个对方的表情或动作，不解释它代表什么。" }
  ];

  let suggestionTimer = null;
  let lastSuggestionLength = -1;

  function suggestionCandidates(text) {
    let list = SUGGESTION_POOL.slice();
    if (text.length < 80) list = list.concat(SHORT_SUGGESTIONS);
    if (text.length > 180) list = list.concat(LONG_SUGGESTIONS);
    if (!/[“”"「」]/.test(text)) list = list.concat(DIALOGUE_SUGGESTIONS);
    if (/我/.test(text)) list = list.concat(PERSPECTIVE_SUGGESTIONS);

    const seen = {};
    return list.filter(function (item) {
      if (seen[item.label]) return false;
      seen[item.label] = true;
      return true;
    });
  }

  function renderSuggestions() {
    if (!suggestionsBox) return;
    const text = storyText ? storyText.value : "";
    const pool = suggestionCandidates(text).sort(function () { return Math.random() - 0.5; });
    const picked = pool.slice(0, 3);

    suggestionsBox.innerHTML = "";
    picked.forEach(function (item) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ai-suggestion";
      btn.textContent = item.label;
      btn.addEventListener("click", function () {
        if (suggestionTip) suggestionTip.textContent = "提示：" + item.tip;
        if (storyText) storyText.focus();
      });
      suggestionsBox.appendChild(btn);
    });
    if (suggestionTip) suggestionTip.textContent = "";
    lastSuggestionLength = text.length;
  }

  function scheduleSuggestions() {
    clearTimeout(suggestionTimer);
    suggestionTimer = setTimeout(function () {
      const len = storyText ? storyText.value.length : 0;
      if (lastSuggestionLength < 0 || Math.abs(len - lastSuggestionLength) >= 10) {
        renderSuggestions();
      }
    }, 900);
  }

  // 把毫秒时间差转成人类可读的相对时间（如 "刚才"、"2小时前"、"3天前"）
  function formatRelativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "刚才";
    const min = Math.floor(diff / 60);
    if (min < 60) return min + "分钟前";
    const hour = Math.floor(min / 60);
    if (hour < 24) return hour + "小时前";
    const day = Math.floor(hour / 24);
    if (day < 7) return day + "天前";
    return Math.floor(day / 7) + "周前";
  }

  // 保存草稿 / 发布到社群：全部只写入浏览器本地，不上传服务器
  // 保存到本地草稿（跳转前兜底，避免内容丢失）
  function persistLocalDraft(story) {
    const draft = {
      mood: state.mood,
      place: state.place,
      time: state.time,
      angle: state.angle,
      story: story
    };
    try {
      localStorage.setItem("ve-draft", JSON.stringify(draft));
    } catch (err) {}
  }

  function firstLineOf(story) {
    return story.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean)[0] || "未命名创作";
  }

  function recordWriting(story) {
    if (window.veRecord && typeof veRecord.writing === "function") {
      const p = veRecord.writing(firstLineOf(story), story.length + " 字");
      return p && typeof p.then === "function" ? p : Promise.resolve();
    }
    return Promise.resolve();
  }

  // 去保存：写入本地草稿；已登录时同时记到个人中心
  function saveStory() {
    const story = storyText ? storyText.value.trim() : "";
    if (!story) {
      alert("先写点什么再保存");
      return;
    }

    persistLocalDraft(story);

    if (!localStorage.getItem("ve_token")) {
      showToast("已保存为草稿（只在这台设备上）");
      return;
    }

    recordWriting(story).then(function () {
      window.location.href = "profile.html";
    });
  }

  // 去发布：游客也能发布（只写本机，用于完整演示流程）；已登录会额外记录到个人中心
  function publishStory() {
    const story = storyText ? storyText.value.trim() : "";
    if (!story) {
      alert("先写点什么再发布");
      return;
    }

    persistLocalDraft(story);

    const moodBtn = document.querySelector(".mood-btn.selected");
    const mood = moodBtn ? moodBtn.textContent.trim() : "😌平静";
    const nickname = localStorage.getItem("ve_user") || "匿名旅人";

    try {
      const posts = JSON.parse(localStorage.getItem("ve-posts") || "[]");
      posts.unshift({
        nickname: nickname,
        me: true,
        mood: mood,
        story: story,
        time: formatRelativeTime(new Date()),
        likes: 0,
        comments: 0,
        liked: false,
        followed: false,
        createdAt: new Date().getTime()
      });
      localStorage.setItem("ve-posts", JSON.stringify(posts));
    } catch (err) {}

    if (localStorage.getItem("ve_token")) {
      recordWriting(story).then(function () {
        showToast("已发布到社群（本机演示）");
        setTimeout(function () {
          window.location.href = "community.html";
        }, 700);
      });
      return;
    }

    showToast("已发布到社群（本机演示）");
    setTimeout(function () {
      window.location.href = "community.html";
    }, 700);
  }

  // 轻提示（toast）
  let toastTimer = null;

  function showToast(message) {
    let toast = document.getElementById("ve-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "ve-toast";
      toast.style.cssText =
        "position: fixed; left: 50%; bottom: 48px; transform: translate(-50%, 14px); " +
        "padding: 10px 18px; border-radius: 999px; background: #2b2b2b; color: #ffffff; " +
        "font-size: 0.85rem; line-height: 1.6; box-shadow: 0 10px 30px rgba(43, 43, 43, 0.18); " +
        "opacity: 0; transition: opacity .3s ease, transform .3s ease; " +
        "pointer-events: none; z-index: 100;";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%, 0)";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translate(-50%, 14px)";
    }, 2600);
  }

  // 读取 URL 参数：mood 存在时自动进入情绪屏并高亮对应按钮
  function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const moodParam = params.get("mood");
    if (!moodParam) return;

    const moodScreen = screens[0];
    const target = moodScreen.buttons.find(function (btn) {
      return optionValue(btn) === moodParam;
    });

    // 找不到对应情绪则忽略
    if (!target) return;

    selectOption(moodScreen, target, moodParam);
    goStep(1);
  }

  // 开始创作：进入情绪屏
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      goStep(1);
    });
  }

  // 回到入口：移除当前屏 active，给 step-0 加 active，并滚动到页面顶部
  const backHomeBtn = document.getElementById("back-home-btn");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", function () {
      clearTimeout(advanceTimer);
      goStep(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 保存 / 发布按钮
  if (saveBtn) {
    saveBtn.addEventListener("click", saveStory);
  }
  if (publishBtn) {
    publishBtn.addEventListener("click", publishStory);
  }
  if (refreshBtn) {
    refreshBtn.addEventListener("click", renderSuggestions);
  }

  // 正文内容同步进状态，并根据文本刷新 AI 提示
  if (storyText) {
    storyText.addEventListener("input", function () {
      state.story = storyText.value;
      scheduleSuggestions();
    });
  }

  // ---------- 故事卡：把正文画成一张竖版图，可保存带走 ----------
  const cardBtn = document.getElementById("story-card-btn");
  const cardModal = document.getElementById("story-card-modal");
  const cardCanvas = document.getElementById("story-card-canvas");
  const cardClose = document.getElementById("story-card-close");
  const cardDownload = document.getElementById("story-card-download");

  function wrapCjk(ctx, text, maxWidth) {
    const out = [];
    String(text).split(/\r?\n/).forEach(function (para) {
      if (!para) {
        out.push("");
        return;
      }
      let line = "";
      for (let i = 0; i < para.length; i++) {
        const ch = para[i];
        const test = line + ch;
        if (line && ctx.measureText(test).width > maxWidth) {
          out.push(line);
          line = ch;
        } else {
          line = test;
        }
      }
      if (line) out.push(line);
    });
    return out;
  }

  function drawStoryCard() {
    if (!cardCanvas) return;
    const ctx = cardCanvas.getContext("2d");
    if (!ctx) return;

    const W = cardCanvas.width;
    const H = cardCanvas.height;
    const SANS = '"Inter","PingFang SC","Microsoft YaHei",sans-serif';
    const SERIF = '"Noto Serif SC","Songti SC","STSong","SimSun",Georgia,serif';

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#e4e2d9";
    ctx.lineWidth = 2;
    ctx.strokeRect(54, 54, W - 108, H - 108);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#547356";
    ctx.font = "600 28px " + SANS;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "6px";
    ctx.fillText("ve创作 · 茻人故事", 108, 172);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    const meta = [state.mood, state.place].filter(Boolean).join(" · ");
    if (meta) {
      ctx.fillStyle = "#6f6e65";
      ctx.font = "400 26px " + SANS;
      ctx.fillText(meta, 108, 218);
    }

    const story = (storyText ? storyText.value : "").trim();
    ctx.font = '400 44px ' + SERIF;
    let lines = wrapCjk(ctx, story, W - 216);
    const maxLines = 9;
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/[，。、；：,.]$/, "") + "……";
    }

    // 文字块在正文区域里垂直居中，短故事不显得空
    const areaTop = 420;
    const areaBottom = 1150;
    const blockH = lines.length * 76;
    let y = areaTop + Math.max(0, (areaBottom - areaTop - blockH) / 2) + 54;

    // 引号贴着正文上方，避免短文本时悬在半空
    ctx.fillStyle = "#edf3ed";
    ctx.font = '600 120px Georgia, "Songti SC", serif';
    ctx.fillText("\u201C", 96, y - 64);

    ctx.font = '400 44px ' + SERIF;
    ctx.fillStyle = "#2b2b2b";
    lines.forEach(function (line) {
      ctx.fillText(line, 108, y);
      y += 76;
    });

    ctx.strokeStyle = "#e4e2d9";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(108, H - 210);
    ctx.lineTo(W - 108, H - 210);
    ctx.stroke();

    ctx.fillStyle = "#6f6e65";
    ctx.font = "400 24px " + SANS;
    ctx.fillText("茻新计划 · 在线原型", 108, H - 150);

    const now = new Date();
    const dateStr = now.getFullYear() + "." + String(now.getMonth() + 1).padStart(2, "0");
    ctx.textAlign = "right";
    ctx.fillText(dateStr, W - 108, H - 150);

    ctx.textAlign = "left";
    ctx.fillStyle = "#547356";
    ctx.font = "600 24px " + SANS;
    ctx.fillText("一个讲故事的空间", 108, H - 106);
  }

  function openCard() {
    if (!cardModal) return;
    const story = storyText ? storyText.value.trim() : "";
    if (!story) {
      alert("先写几句，再做故事卡");
      if (storyText) storyText.focus();
      return;
    }
    drawStoryCard();
    cardModal.hidden = false;
    cardModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (cardClose) cardClose.focus();
  }

  function closeCard() {
    if (!cardModal) return;
    cardModal.hidden = true;
    cardModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (cardBtn) cardBtn.focus();
  }

  function downloadCard() {
    if (!cardCanvas) return;
    const finish = function (blobOrUrl) {
      const a = document.createElement("a");
      a.download = "ve-story-card-" + Date.now() + ".png";
      a.href = blobOrUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    if (cardCanvas.toBlob) {
      cardCanvas.toBlob(function (blob) {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        finish(url);
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      }, "image/png");
    } else {
      finish(cardCanvas.toDataURL("image/png"));
    }
    showToast("故事卡已保存");
  }

  if (cardBtn) cardBtn.addEventListener("click", openCard);
  if (cardClose) cardClose.addEventListener("click", closeCard);
  if (cardDownload) cardDownload.addEventListener("click", downloadCard);
  if (cardModal) {
    cardModal.addEventListener("click", function (e) {
      if (e.target === cardModal) closeCard();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !cardModal.hidden) closeCard();
    });
  }

  // 首页落地区的「开始写我的故事」：回到顶部并直接进入创作流
  const ctaStart = document.getElementById("cta-start");
  if (ctaStart) {
    ctaStart.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "auto" });
      goStep(1);
    });
  }

  createBackButtons();
  bindScreens();
  initFromUrl();
})();

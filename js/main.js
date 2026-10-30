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

  // 四个选项屏的配置：按钮组 / 自定义按钮 / 自定义输入框
  const screens = [
    {
      key: "mood",
      stepId: "step-mood",
      buttons: Array.from(document.querySelectorAll(".mood-btn")),
      customBtn: document.getElementById("mood-custom-btn"),
      customInput: document.getElementById("mood-custom-input")
    },
    {
      key: "place",
      stepId: "step-place",
      buttons: Array.from(document.querySelectorAll(".place-btn")),
      customBtn: document.querySelector("#step-place .custom-option"),
      customInput: document.getElementById("place-custom-input")
    },
    {
      key: "time",
      stepId: "step-time",
      buttons: Array.from(document.querySelectorAll(".time-btn")),
      customBtn: document.querySelector("#step-time .custom-option"),
      customInput: document.getElementById("time-custom-input")
    },
    {
      key: "angle",
      stepId: "step-angle",
      buttons: Array.from(document.querySelectorAll(".angle-btn")),
      customBtn: document.querySelector("#step-angle .custom-option"),
      customInput: document.getElementById("angle-custom-input")
    }
  ];

  const startBtn = document.getElementById("start-create-btn");
  const saveBtn = document.getElementById("save-btn");
  const storyText = document.getElementById("story-text");
  const aiHint = document.getElementById("ai-hint");
  const goCommunityBtn = document.getElementById("go-community-btn");

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

    // 进入写作屏时，生成示例 AI 引导语
    if (clamped === STEP_ORDER.length - 1) renderAiHint();
  }

  // 返回上一屏（保留已选状态）
  function goBack() {
    clearTimeout(advanceTimer);
    if (state.stepIndex > 0) goStep(state.stepIndex - 1);
  }

  // 选择一项：清除同组（含自定义按钮）的 selected，再高亮当前项
  function selectOption(screen, btn, value) {
    screen.buttons.forEach(function (b) {
      b.classList.remove("selected");
    });
    if (screen.customBtn) screen.customBtn.classList.remove("selected");

    btn.classList.add("selected");
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

      // 自定义按钮：显示并聚焦输入框
      if (screen.customBtn && screen.customInput) {
        screen.customBtn.addEventListener("click", function () {
          screen.customInput.hidden = false;
          screen.customInput.focus();
        });
      }

      // 自定义输入：回车确认，记录后进入下一屏
      if (screen.customInput) {
        screen.customInput.addEventListener("keydown", function (e) {
          if (e.key !== "Enter") return;

          const value = screen.customInput.value.trim();
          if (!value) return;

          if (screen.customBtn) {
            selectOption(screen, screen.customBtn, value);
          } else {
            state[screen.key] = value;
          }
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
  function saveDraft() {
    if (storyText) state.story = storyText.value;

    const scope = document.querySelector('input[name="publish-scope"]:checked').value;

    if (scope === "community") {
      const post = {
        nickname: "匿名旅人",
        me: true,
        mood: state.mood || "平静",
        story: state.story,
        time: formatRelativeTime(new Date()),
        likes: 0,
        comments: 0,
        liked: false,
        followed: false,
        createdAt: new Date().getTime()
      };

      try {
        const posts = JSON.parse(localStorage.getItem("ve-posts") || "[]");
        posts.unshift(post);
        localStorage.setItem("ve-posts", JSON.stringify(posts));
        showToast("已发布到社群 🎉");
        if (goCommunityBtn) goCommunityBtn.hidden = false;
      } catch (err) {
        showToast("发布失败，请检查浏览器隐私设置");
      }
    } else {
      const draft = {
        mood: state.mood,
        place: state.place,
        time: state.time,
        angle: state.angle,
        story: state.story
      };

      try {
        localStorage.setItem("ve-draft", JSON.stringify(draft));
        showToast("已保存为草稿");
        if (goCommunityBtn) goCommunityBtn.hidden = true;
      } catch (err) {
        showToast("草稿保存失败，请检查浏览器隐私设置");
      }
    }
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

  // 保存草稿按钮
  if (saveBtn) {
    saveBtn.addEventListener("click", saveDraft);
  }

  // 正文内容同步进状态
  if (storyText) {
    storyText.addEventListener("input", function () {
      state.story = storyText.value;
    });
  }

  createBackButtons();
  bindScreens();
  initFromUrl();
})();

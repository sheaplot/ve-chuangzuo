/* =========================================================
   ve创作 — 冥想页交互（纯原生 JavaScript，无框架无库）

   功能：
   1. 冥想模式：呼吸练习 / 4-7-8 深呼吸 / 身体扫描
   2. 呼吸节奏：吸气 4s -> 屏息 4s -> 呼气 6s 循环（默认模式）
   3. 时长选择：3 个胶囊单选高亮，决定总时长（默认 3 分钟）
   4. 开始 / 暂停 / 重置
   5. 倒计时结束：显示结束区，呼吸圆回初始
   6. "去写作" -> index.html（沉浸式创作流）
   ========================================================= */

(function () {
  "use strict";

  // 冥想模式配置：每种模式包含一组引导阶段
  // breath      呼吸练习：吸气 4s -> 屏息 4s -> 呼气 6s
  // breath478  4-7-8 深呼吸：吸气 4s -> 屏息 7s -> 呼气 8s
  // body        身体扫描：从脚到头逐段放松
  const MODES = {
    breath: [
      { name: "吸气", duration: 4000, from: 1, to: 1.25, text: "吸气…" },
      { name: "屏息", duration: 4000, from: 1.25, to: 1.25, text: "屏息…" },
      { name: "呼气", duration: 6000, from: 1.25, to: 1, text: "呼气…" }
    ],
    breath478: [
      { name: "吸气", duration: 4000, from: 1, to: 1.2, text: "吸气…（4 秒）" },
      { name: "屏息", duration: 7000, from: 1.2, to: 1.2, text: "屏息…（7 秒）" },
      { name: "呼气", duration: 8000, from: 1.2, to: 1, text: "呼气…（8 秒）" }
    ],
    body: [
      { name: "放松", duration: 4000, from: 1, to: 1, text: "从脚趾开始……" },
      { name: "放松", duration: 4000, from: 1, to: 1, text: "放松小腿……" },
      { name: "放松", duration: 4000, from: 1, to: 1, text: "让腹部沉下来……" },
      { name: "放松", duration: 4000, from: 1, to: 1, text: "让胸口放松……" },
      { name: "放松", duration: 6000, from: 1, to: 1, text: "放松肩膀与颈部……" },
      { name: "放松", duration: 4000, from: 1, to: 1, text: "放松面部肌肉……" },
      { name: "放松", duration: 4000, from: 1, to: 1, text: "让头部安静下来……" }
    ]
  };

  let currentPhases = MODES.breath;
  let currentMode = "breath";

  const breathCircle = document.getElementById("breath-circle");
  const breathText = document.getElementById("breath-text");
  const timerText = document.getElementById("timer-text");
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const resetBtn = document.getElementById("reset-btn");
  const sessionEnd = document.getElementById("session-end");
  const feelingInput = document.getElementById("feeling-input");
  const writeLink = document.querySelector("#session-end a");

  // 用一个状态对象管理冥想页状态
  const state = {
    duration: 3,          // 默认 3 分钟
    phaseIndex: 0,        // 当前阶段：0 吸气 / 1 屏息 / 2 呼气
    phaseStart: 0,        // 阶段开始时间戳
    remaining: 3 * 60,    // 剩余秒数
    running: false,       // 是否在运行
    paused: false         // 是否已暂停
  };

  let rafId = null;
  let lastTs = 0;
  let pauseStartedAt = 0;

  const formatTime = function (seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  };

  function renderTimer() {
    if (timerText) {
      timerText.textContent = formatTime(Math.max(0, Math.floor(state.remaining)));
    }
  }

  function renderBreathText() {
    if (!breathText) return;
    if (!state.running && !state.paused) {
      breathText.textContent = "准备好了吗？";
      return;
    }
    const phase = currentPhases[state.phaseIndex];
    breathText.textContent = phase ? phase.text : "准备好了吗？";
  }

  function setBreathScale() {
    if (!breathCircle) return;
    const phase = currentPhases[state.phaseIndex];
    const elapsed = performance.now() - state.phaseStart;
    const t = Math.min(elapsed, phase.duration) / phase.duration;
    const scale = phase.from + (phase.to - phase.from) * t;
    breathCircle.style.transform = "scale(" + scale + ")";
  }

  function endSession() {
    state.running = false;
    state.paused = false;
    pauseStartedAt = 0;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (breathCircle) {
      breathCircle.style.transform = "scale(1)";
      breathCircle.classList.remove("breath-inhale", "breath-hold", "breath-exhale");
    }
    state.phaseIndex = 0;
    if (breathText) breathText.textContent = "准备好了吗？";
    renderTimer();
    if (sessionEnd) sessionEnd.hidden = false;
  }

  const tick = function (ts) {
    if (!state.running || state.paused) {
      return;
    }
    if (lastTs) {
      state.remaining -= (ts - lastTs) / 1000;
      if (state.remaining <= 0) {
        endSession();
        return;
      }
    }
    lastTs = ts;

    const phase = currentPhases[state.phaseIndex];
    const elapsed = ts - state.phaseStart;
    if (elapsed >= phase.duration) {
      state.phaseIndex = (state.phaseIndex + 1) % currentPhases.length;
      state.phaseStart = ts;
      renderBreathText();
    }

    setBreathScale();
    renderTimer();

    rafId = requestAnimationFrame(tick);
  };

  function start() {
    if (!state.running) {
      // 首次开始：重置时长与阶段，并启动动画循环
      state.duration = state.duration || 3;
      state.remaining = state.duration * 60;
      state.phaseIndex = 0;
      state.phaseStart = performance.now();
      state.running = true;
      state.paused = false;
      pauseStartedAt = 0;
      if (sessionEnd) sessionEnd.hidden = true;
      if (breathCircle) {
        breathCircle.style.transform = "scale(1)";
        breathCircle.classList.remove("breath-inhale", "breath-hold", "breath-exhale");
      }
      renderBreathText();
      renderTimer();

      // 关键：启动 requestAnimationFrame 循环，否则倒计时和呼吸阶段不会推进
      lastTs = performance.now();
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      rafId = requestAnimationFrame(tick);
      return;
    }

    // 运行中且处于暂停状态时，点击开始则继续
    if (state.paused) {
      resume();
    }
  }

  // 从暂停恢复：把阶段起点后移暂停时长，避免恢复瞬间跳阶段
  function resume() {
    state.paused = false;
    if (pauseStartedAt) {
      state.phaseStart += performance.now() - pauseStartedAt;
      pauseStartedAt = 0;
    }
    lastTs = performance.now();
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    if (state.paused) {
      resume();
    } else {
      state.paused = true;
      pauseStartedAt = performance.now();
    }
  }

  function reset() {
    state.running = false;
    state.paused = false;
    state.phaseIndex = 0;
    state.remaining = state.duration * 60;
    pauseStartedAt = 0;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (breathCircle) {
      breathCircle.style.transform = "scale(1)";
      breathCircle.classList.remove("breath-inhale", "breath-hold", "breath-exhale");
    }
    renderBreathText();
    renderTimer();
  }

  if (startBtn) startBtn.addEventListener("click", start);
  if (pauseBtn) pauseBtn.addEventListener("click", pause);
  if (resetBtn) resetBtn.addEventListener("click", reset);

  // 去写作：跳转到 index.html（沉浸式创作流）
  if (writeLink) {
    writeLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "index.html";
    });
  }

  // 记录：把此刻的感受保存在本机浏览器
  const recordBtn = document.getElementById("record-btn");
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

  function recordFeeling() {
    const feeling = feelingInput ? feelingInput.value.trim() : "";
    const entry = {
      feeling: feeling,
      duration: state.duration,
      finishedAt: new Date().toISOString()
    };

    try {
      const key = "ve-meditation-notes";
      let list = [];

      try {
        list = JSON.parse(localStorage.getItem(key) || "[]");
      } catch (e) {
        list = [];
      }
      if (!Array.isArray(list)) list = [];

      list.unshift(entry);
      localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
      showToast("已记录在本机浏览器（未上传任何服务器）");
    } catch (err) {
      showToast("记录失败，请检查浏览器隐私设置");
    }
  }

  if (recordBtn) recordBtn.addEventListener("click", recordFeeling);

  // 时长选择：3 个胶囊单选高亮，决定总时长
  const durationOptions = Array.from(document.querySelectorAll(".duration-option"));
  durationOptions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const value = parseInt(btn.getAttribute("data-duration"), 10);
      state.duration = isNaN(value) ? 3 : value;
      durationOptions.forEach(function (b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
      // 未开始时，同步更新倒计时显示
      if (!state.running) {
        state.remaining = state.duration * 60;
        renderTimer();
      }
    });
  });

  // 冥想模式切换：切换后重置阶段状态，回到引导初始
  const breathModeButtons = document.querySelectorAll(".breath-mode-option");
  breathModeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const mode = btn.getAttribute("data-mode");
      if (!MODES[mode]) return;
      currentMode = mode;
      currentPhases = MODES[mode];
      state.phaseIndex = 0;
      state.phaseStart = 0;
      breathModeButtons.forEach(function (b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
      if (breathCircle) {
        breathCircle.style.transform = "scale(1)";
        breathCircle.classList.remove("breath-inhale", "breath-hold", "breath-exhale");
      }
      renderBreathText();
      renderTimer();
    });
  });

  // 默认选中 3 分钟
  const defaultOption = document.querySelector('.duration-option[data-duration="3"]');
  if (defaultOption) defaultOption.classList.add("selected");

  renderTimer();
  renderBreathText();
})();

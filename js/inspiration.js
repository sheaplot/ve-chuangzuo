/* =========================================================
   ve创作 — 时空灵感页交互（纯原生 JavaScript，无框架无库）

   功能：
   1. 瀑布流渲染：首屏随机铺开 8~10 张卡片（随机抽取，短期不重复）
   2. 无限滚动：滚动到接近底部自动追加 6~8 张，来自当前分类故事池
   3. 分类筛选：点某个分类重新随机铺开该分类卡片；一个分类刷完一轮后
      末尾显示“故事持续收录中，去别的分类看看吧 🌿”
   4. 回到顶部：滚动一定距离后出现，点击滚回页面顶部
   ========================================================= */

(function () {
  "use strict";

  const grid = document.querySelector(".story-grid");
  const sentinel = document.getElementById("story-sentinel");
  const filterWrap = document.querySelector(".category-filter");
  const backBtn = document.getElementById("back-to-top");
  if (!grid || !sentinel) return;

  // ---------- 分类筛选条（从固定白名单 CATEGORIES 生成，外加"全部"） ----------
  const allCatBtn =
    '<button type="button" class="category-btn selected" data-cat="">全部</button>';
  const catBtnsHtml = CATEGORIES.map(function (cat) {
    return '<button type="button" class="category-btn" data-cat="' + cat + '">' + cat + "</button>";
  }).join("");
  filterWrap.innerHTML = allCatBtn + catBtnsHtml;

  // ---------- 状态 ----------
  let currentCat = "";        // "" 表示全部
  let shownIds = new Set();   // 本轮已显示的故事 id（防短期重复）

  // ---------- 工具 ----------
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function shuffle(arr) {
    return arr.slice().sort(function () { return Math.random() - 0.5; });
  }

  // 把一个故事对象渲染成卡片 HTML（结构与原 HTML 一致，保留徽标、外链、写作链接）
  function storyCardHtml(s) {
    var sourcesHtml = "";
    if (s.sources && s.sources.length) {
      sourcesHtml = '<ul class="story-sources" aria-label="资料来源">' +
        s.sources.map(function (src) {
          return '<li><a href="' + src.url + '" target="_blank" rel="noopener">' + src.name + "</a></li>";
        }).join("") + "</ul>";
    }
    var tagsHtml = (s.tags || []).map(function (t) {
      return "<li>" + t + "</li>";
    }).join("");
    return (
      '<figure class="story-figure">' +
      '<img src="' + s.image + '" alt="' + (s.alt || s.title) + '" loading="lazy">' +
      (s.caption ? '<figcaption>' + s.caption + "</figcaption>" : "") +
      '</figure>' +
      '<p class="story-badge story-badge-real">真实故事</p>' +
      '<h3>' + s.title + '</h3>' +
      '<p>' + s.desc + '</p>' +
      '<ul class="story-tags" aria-label="故事标签">' + tagsHtml + "</ul>" +
      '<a class="story-link-primary" href="' + s.link + '" target="_blank" rel="noopener">阅读完整故事</a>' +
      sourcesHtml +
      '<a href="index.html">以此为灵感，开始写作</a>'
    );
  }

  function appendCard(s) {
    var el = document.createElement("article");
    el.className = "story-card story-card-real";
    el.innerHTML = storyCardHtml(s);
    grid.appendChild(el);
    shownIds.add(s.id);
  }

  // 渲染一批卡片（count 张），永不结束
  function renderBatch(count) {
    var pool = shuffle(
      STORIES.filter(function (s) {
        return (!currentCat || s.category === currentCat) && !shownIds.has(s.id);
      })
    );

    // 若本分类已全部展示过，清空记录，重新洗牌，永不结束
    if (pool.length === 0) {
      shownIds = new Set();
      pool = shuffle(
        STORIES.filter(function (s) {
          return !currentCat || s.category === currentCat;
        })
      );
    }

    var take = pool.slice(0, count);
    take.forEach(appendCard);
    take.forEach(function (s) { shownIds.add(s.id); });

    // 重新挂载哨兵观察者，确保下次滚动到底部仍能触发加载（永不结束）
    if (typeof observer !== "undefined" && observer && sentinel) {
      observer.unobserve(sentinel);
      observer.observe(sentinel);
    }
  }

  // 重置并重新随机铺开（分类切换或首屏）
  function resetAndRender() {
    shownIds = new Set();
    grid.innerHTML = "";
    sentinel.style.display = "";
    renderBatch(randInt(8, 10));
  }

  // ---------- 分类筛选点击 ----------
  filterWrap.addEventListener("click", function (e) {
    var btn = e.target.closest(".category-btn");
    if (!btn) return;
    filterWrap.querySelectorAll(".category-btn").forEach(function (b) {
      b.classList.remove("selected");
    });
    btn.classList.add("selected");
    currentCat = btn.getAttribute("data-cat") || "";
    resetAndRender();
  });

  // ---------- 无限滚动 ----------
  if (!("IntersectionObserver" in window)) {
    resetAndRender();
    return;
  }
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          renderBatch(randInt(6, 8));
        }
      });
    },
    { rootMargin: "600px 0px" }
  );
  observer.observe(sentinel);

  // 页面最底部常驻提示（浅灰小字，不打断滑动）
  var endNote = document.createElement("p");
  endNote.className = "story-hint";
  endNote.textContent = "故事持续收录中…";
  grid.parentNode.insertBefore(endNote, sentinel);

  // 首屏渲染
  resetAndRender();

  // ---------- 回到顶部按钮 ----------
  if (backBtn) {
    window.addEventListener("scroll", function () {
      backBtn.classList.toggle("visible", window.scrollY > 300);
    });
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

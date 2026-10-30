/* =========================================================
   ve创作 — 社群页交互（纯原生 JavaScript，无框架无库）

   功能：
   1. 帖子流：把 localStorage ve-posts（写作页发布的）排在预置帖子最前面，标注"我"
   2. 互动本地模拟（localStorage）：
      - 点赞可切换（数字 ±1）
      - 关注按钮可切换（+关注 ↔ 已关注）
      - 评论框输入后显示在该帖子下
   3. 全部只写入浏览器本地，不上传任何服务器
   ========================================================= */

(function () {
  "use strict";

  const grid = document.querySelector(".post-grid");
  if (!grid) return;

  // ---------- 工具 ----------
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ---------- 预置帖子 ----------
  const PRESET_POSTS = [
    {
      id: "p1",
      nickname: "林间小鹿",
      mood: "🌿平静",
      time: "2小时前",
      text: "成为植物性饮食的第365天。最意外的收获不是身体变轻，而是走在菜市场，会自然地想'这个摊位的青菜今天真新鲜'。",
      likes: 32,
      comments: 5
    },
    {
      id: "p2",
      nickname: "可可西里的风",
      mood: "🌱期待",
      time: "昨天",
      text: "看完藏羚羊的故事，想起去年在青藏线看到的那群精灵。保护不是口号，是有人在零下二十度守了二十年。",
      likes: 58,
      comments: 12
    },
    {
      id: "p3",
      nickname: "一只橘子",
      mood: "💭思念",
      time: "3天前",
      text: "写给十年前的自己：你当时担心一个人扛不住，现在我替你说——你做到了。",
      likes: 127,
      comments: 34
    },
    {
      id: "p4",
      nickname: "城市菜园",
      mood: "🌞愉悦",
      time: "5天前",
      text: "在阳台种了罗勒，第一次做青酱给邻居尝。她说'这味道像夏天'。",
      likes: 45,
      comments: 8
    },
    {
      id: "p5",
      nickname: "路过的人",
      mood: "🕯️感激",
      time: "1周前",
      text: "今天做完慈心冥想，把'愿所有生命平安'默念了三遍给楼下的猫，它居然蹭了蹭我的腿。",
      likes: 89,
      comments: 15
    }
  ];

  // ---------- 获取全部帖子（本地发布的在前，预置在后） ----------
  function getAllPosts() {
    const localPosts = [];
    try {
      const stored = JSON.parse(localStorage.getItem("ve-posts") || "[]");
      stored.forEach(function (p) {
        localPosts.push({
          id: "local-" + (p.createdAt || Date.now()),
          nickname: p.nickname || "匿名旅人",
          mood: p.mood || "🌿平静",
          time: p.time || "刚才",
          text: p.story || "",
          likes: p.likes || 0,
          comments: p.comments || 0,
          me: true
        });
      });
    } catch (e) {
      // localStorage 不可用时忽略
    }
    return localPosts.concat(PRESET_POSTS);
  }

  // ---------- 互动状态表（localStorage） ----------
  function getInteractions() {
    try {
      return JSON.parse(localStorage.getItem("ve-community-interactions") || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveInteractions(map) {
    try {
      localStorage.setItem("ve-community-interactions", JSON.stringify(map));
    } catch (e) {
      // 忽略写入失败
    }
  }

  // ---------- 渲染单条帖子 ----------
  function renderPost(post) {
    const id = post.id;
    const inter = getInteractions()[id] || {};
    const liked = inter.liked === true;
    const followed = inter.followed === true;
    const likes = inter.likes !== undefined ? inter.likes : (post.likes || 0);
    const storedComments = Array.isArray(inter.comments) ? inter.comments : [];
    const baseCommentCount = post.comments || 0;
    const displayCommentCount = storedComments.length > 0 ? storedComments.length : baseCommentCount;

    const initial = post.nickname ? String(post.nickname).charAt(0) : "？";
    const meBadge = post.me ? '<span class="post-me">我</span>' : '';

    const el = document.createElement("article");
    el.className = "post-card";
    el.innerHTML =
      '<div class="post-header">' +
      '  <div class="avatar">' + escapeHtml(initial) + '</div>' +
      '  <div class="post-meta">' +
      '    <div class="post-name">' + escapeHtml(post.nickname) + meBadge + '</div>' +
      '    <div class="post-time">' + escapeHtml(post.time) + '</div>' +
      '  </div>' +
      '  <button type="button" class="post-follow" data-follow="' + followed + '">' +
      (followed ? "已关注" : "+关注") + '</button>' +
      '</div>' +
      '<div class="post-mood story-badge">' + escapeHtml(post.mood) + '</div>' +
      '<p class="post-text">' + escapeHtml(post.text) + '</p>' +
      '<div class="post-actions">' +
      '  <button type="button" class="post-like" data-liked="' + liked + '">' +
      (liked ? "♥ " : "♡ ") + '<span class="like-count">' + likes + '</span></button>' +
      '  <span class="post-comment-count">评论 ' + displayCommentCount + '</span>' +
      '  <button type="button" class="post-comment-toggle">评论</button>' +
      '  <div class="comment-box" hidden>' +
      '    <textarea class="comment-input" placeholder="写下评论…"></textarea>' +
      '    <button type="button" class="comment-send">发送</button>' +
      '    <div class="comment-list"></div>' +
      '  </div>' +
      '</div>' +
      '</article>';

    grid.appendChild(el);

    // DOM 引用
    const likeBtn = el.querySelector(".post-like");
    const likeCount = el.querySelector(".like-count");
    const followBtn = el.querySelector(".post-follow");
    const toggleBtn = el.querySelector(".post-comment-toggle");
    const commentBox = el.querySelector(".comment-box");
    const input = el.querySelector(".comment-input");
    const sendBtn = el.querySelector(".comment-send");
    const commentList = el.querySelector(".comment-list");
    const commentCount = el.querySelector(".post-comment-count");

    // 当前帖子的评论数组副本（与 localStorage 同步）
    let comments = storedComments.length > 0 ? storedComments.slice() : null;

    function renderComments() {
      commentList.innerHTML = "";
      const list = comments || [];
      list.forEach(function (c) {
        const div = document.createElement("div");
        div.className = "comment-item";
        div.textContent = escapeHtml(c.nickname || "匿名") + "：" + escapeHtml(c.text);
        commentList.appendChild(div);
      });
      commentCount.textContent = "评论 " + (list.length > 0 ? list.length : baseCommentCount);
    }
    renderComments();

    // 点赞：切换 liked，数字 ±1（每次重新读最新状态，避免闭包值过期）
    likeBtn.addEventListener("click", function () {
      const map = getInteractions();
      const cur = map[id] || {};
      const curLiked = cur.liked === true;
      const curLikes = cur.likes !== undefined ? cur.likes : (post.likes || 0);
      const newLiked = !curLiked;
      const newLikes = newLiked ? curLikes + 1 : Math.max(0, curLikes - 1);
      map[id] = { liked: newLiked, likes: newLikes, followed: cur.followed === true, comments: comments };
      saveInteractions(map);
      likeBtn.dataset.liked = newLiked;
      likeBtn.innerHTML = (newLiked ? "♥ " : "♡ ") + '<span class="like-count">' + newLikes + "</span>";
    });

    // 关注：切换 +关注 ↔ 已关注（每次重新读最新状态）
    followBtn.addEventListener("click", function () {
      const map = getInteractions();
      const cur = map[id] || {};
      const newFollowed = !(cur.followed === true);
      map[id] = { liked: cur.liked === true, likes: cur.likes !== undefined ? cur.likes : (post.likes || 0), followed: newFollowed, comments: comments };
      saveInteractions(map);
      followBtn.dataset.follow = newFollowed;
      followBtn.textContent = newFollowed ? "已关注" : "+关注";
    });

    // 评论展开 / 收起
    toggleBtn.addEventListener("click", function () {
      const hidden = commentBox.hidden;
      commentBox.hidden = !hidden;
      if (!hidden) input.focus();
    });

    // 发送评论
    sendBtn.addEventListener("click", function () {
      const text = input.value.trim();
      if (!text) return;
      const newList = (comments || []).concat({ nickname: "匿名旅人", text: text });
      const map = getInteractions();
      map[id] = { liked: liked, likes: likes, followed: followed, comments: newList };
      saveInteractions(map);
      comments = newList;
      input.value = "";
      renderComments();
    });
  }

  // ---------- 初始渲染 ----------
  getAllPosts().forEach(renderPost);
})();

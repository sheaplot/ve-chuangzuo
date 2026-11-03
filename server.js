const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const VISITORS_FILE = path.join(__dirname, "visitors.json");
const USERS_FILE = path.join(__dirname, "users.json");
const RECORDS_FILE = path.join(__dirname, "records.json");

app.use(express.static(__dirname));
app.use(express.json());

function readJson(file, fallback) {
  if (fs.existsSync(file)) {
    try { return JSON.parse(fs.readFileSync(file, "utf-8")); } catch (e) {}
  }
  return fallback;
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function hashPassword(pw, salt) {
  return crypto.scryptSync(String(pw), salt, 64).toString("hex");
}

// 会话：token -> 用户名（内存表，重启需重新登录，演示够用）
const sessions = {};
function auth(req, res, next) {
  const token = req.headers["x-token"];
  const user = token && sessions[token];
  if (!user) return res.status(401).json({ ok: false, error: "未登录" });
  req.username = user;
  next();
}

// ---------- 访客地图 ----------
app.get("/api/visit", async (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim()
         || req.socket.remoteAddress;
  try {
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,city,country,lat,lon`);
    const g = await r.json();
    if (g.status !== "success") return res.json({ ok: false, reason: g.message });
    const lat = Math.round(parseFloat(g.lat) * 100) / 100;
    const lng = Math.round(parseFloat(g.lon) * 100) / 100;
    const key = lat + "," + lng;
    const data = readJson(VISITORS_FILE, {});
    if (!data[key]) data[key] = { city: g.city, country: g.country, lat, lng, count: 0 };
    data[key].count += 1;
    writeJson(VISITORS_FILE, data);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false });
  }
});
app.get("/api/visitors", (req, res) => res.json(readJson(VISITORS_FILE, {})));

// ---------- 注册 / 登录 ----------
app.post("/api/register", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (!username || password.length < 4) {
    return res.json({ ok: false, error: "用户名不能为空，密码至少 4 位" });
  }
  const users = readJson(USERS_FILE, {});
  if (users[username]) return res.json({ ok: false, error: "用户名已存在" });
  const salt = crypto.randomBytes(8).toString("hex");
  users[username] = { salt, hash: hashPassword(password, salt), createdAt: Date.now() };
  writeJson(USERS_FILE, users);
  const token = crypto.randomBytes(24).toString("hex");
  sessions[token] = username;
  res.json({ ok: true, token, username });
});

app.post("/api/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  const users = readJson(USERS_FILE, {});
  const u = users[username];
  if (!u || hashPassword(password, u.salt) !== u.hash) {
    return res.json({ ok: false, error: "用户名或密码错误" });
  }
  const token = crypto.randomBytes(24).toString("hex");
  sessions[token] = username;
  res.json({ ok: true, token, username });
});

// ---------- 记录：冥想 / 写作 / 心情 ----------
app.post("/api/records", auth, (req, res) => {
  const type = ["meditation", "writing", "mood"].includes(req.body.type) ? req.body.type : null;
  if (!type) return res.json({ ok: false, error: "记录类型无效" });
  const text = String(req.body.text || "").trim();
  if (!text) return res.json({ ok: false, error: "内容不能为空" });
  const records = readJson(RECORDS_FILE, {});
  records[req.username] = records[req.username] || [];
  const rec = {
    id: crypto.randomBytes(8).toString("hex"),
    type, text,
    date: req.body.date || new Date().toISOString().slice(0, 10),
    createdAt: Date.now()
  };
  records[req.username].push(rec);
  writeJson(RECORDS_FILE, records);
  res.json({ ok: true, record: rec });
});

app.get("/api/records", auth, (req, res) => {
  const records = readJson(RECORDS_FILE, {});
  res.json({ ok: true, records: records[req.username] || [] });
});

app.delete("/api/records/:id", auth, (req, res) => {
  const records = readJson(RECORDS_FILE, {});
  records[req.username] = (records[req.username] || []).filter(r => r.id !== req.params.id);
  writeJson(RECORDS_FILE, records);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`ve创作 running at http://localhost:${PORT}`));

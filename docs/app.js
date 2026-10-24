const HISTORY_STORAGE = "ielts-gym-history";
const DRAFT_PREFIX = "ielts-gym-draft:";

const $ = (id) => document.getElementById(id);
let current = null;
let timerHandle = null;

function readStorage(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

function loadHistory() {
  try { return JSON.parse(readStorage(HISTORY_STORAGE, "[]")); } catch { return []; }
}

function isoDate(d) {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function computeStreak(items) {
  const days = new Set(items.map((i) => i.date));
  let streak = 0;
  const d = new Date();
  if (!days.has(isoDate(d))) d.setDate(d.getDate() - 1); // today not done yet keeps yesterday's streak
  while (days.has(isoDate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function renderExercises() {
  const done = new Set(loadHistory().map((i) => i.id));
  const list = $("exercise-list");
  list.innerHTML = "";
  for (const ex of window.EXERCISES) {
    const btn = document.createElement("button");
    btn.className = "exercise" + (current === ex ? " selected" : "");
    btn.innerHTML = "<strong></strong><small></small>";
    btn.querySelector("strong").textContent = `${done.has(ex.id) ? "✓ " : ""}${ex.title}`;
    btn.querySelector("small").textContent = `${ex.type} · ${ex.minutes}′ · ${ex.date}`;
    btn.addEventListener("click", () => openExercise(ex));
    list.appendChild(btn);
  }
}

function renderHistory() {
  const items = loadHistory();
  const list = $("history");
  list.innerHTML = "";
  if (!items.length) list.innerHTML = '<li class="note">Chưa có bài nào.</li>';
  for (const item of items.slice(0, 10)) {
    const li = document.createElement("li");
    li.textContent = `${item.date} · ${item.type} · ${item.title}`;
    list.appendChild(li);
  }
  $("streak").textContent = `🔥 Chuỗi ${computeStreak(items)} ngày`;
}

function startTimer() {
  clearInterval(timerHandle);
  const start = Date.now();
  timerHandle = setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    $("timer").textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }, 1000);
}

function openExercise(ex) {
  current = ex;
  $("task-meta").textContent = `${ex.type} · ${ex.date}`;
  $("task-title").textContent = ex.title;
  $("task-instructions").textContent = ex.instructions;
  $("task-text").textContent = ex.task_text;
  $("task-time").textContent = ex.minutes;
  $("answer").value = readStorage(DRAFT_PREFIX + ex.id, "");
  $("word-count").textContent = `${countWords($("answer").value)} từ`;
  $("reference").textContent = ex.reference_answer;
  $("reference-box").classList.add("hidden");
  $("task-panel").classList.remove("hidden");
  $("message").textContent = "";
  renderExercises();
  startTimer();
  $("answer").focus();
}

function copyForGrading() {
  if (!current) return;
  const text = `Chấm bài tập "${current.title}" (id: ${current.id}, dạng: ${current.type})

Đề: ${current.instructions}

${current.task_text}

Bài của tôi (${countWords($("answer").value)} từ, ${$("timer").textContent}):

${$("answer").value.trim()}
`;
  navigator.clipboard.writeText(text).then(
    () => ($("message").textContent = "Đã copy. Dán vào Claude Code để được chấm."),
    () => ($("message").textContent = "Không copy được, hãy chọn và copy thủ công."),
  );
}

function markDone() {
  if (!current) return;
  const items = loadHistory().filter((i) => !(i.id === current.id && i.date === isoDate(new Date())));
  items.unshift({ id: current.id, date: isoDate(new Date()), type: current.type, title: current.title });
  writeStorage(HISTORY_STORAGE, JSON.stringify(items.slice(0, 100)));
  clearInterval(timerHandle);
  renderHistory();
  renderExercises();
  $("message").textContent = "Đã lưu vào lịch sử.";
}

function init() {
  renderExercises();
  renderHistory();
  $("reveal").addEventListener("click", () => $("reference-box").classList.toggle("hidden"));
  $("copy").addEventListener("click", copyForGrading);
  $("done").addEventListener("click", markDone);
  $("answer").addEventListener("input", () => {
    $("word-count").textContent = `${countWords($("answer").value)} từ`;
    if (current) writeStorage(DRAFT_PREFIX + current.id, $("answer").value);
  });
}

init();

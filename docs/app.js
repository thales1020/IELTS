const HISTORY_STORAGE = "ielts-gym-history";
const DRAFT_PREFIX = "ielts-gym-draft:";

const MAX_LISTED = 40;

const $ = (id) => document.getElementById(id);

// Real exam prompts become full-length writing tasks; they have no model answer, only the source video.
const FORUM = (window.FORUM_PROMPTS || []).map((p) => ({
  id: p.id,
  date: "",
  group: `forum${p.task}`,
  type: `Đề thật Task ${p.task}`,
  title: p.prompt.length > 110 ? `${p.prompt.slice(0, 110)}…` : p.prompt,
  instructions: p.task === 2
    ? "Viết bài Task 2 ít nhất 250 từ trong 40 phút."
    : "Viết bài Task 1 ít nhất 150 từ trong 20 phút. Biểu đồ/bản đồ xem trong video nguồn.",
  minutes: p.task === 2 ? 40 : 20,
  task_text: p.uncertain
    ? `${p.prompt}

(Đề chép từ ảnh chụp video, có thể thiếu chữ, hãy đối chiếu với video.)`
    : p.prompt,
  reference_answer: "",
  video: p.video,
  source: p.video_title,
}));
const ALL = [...window.EXERCISES.map((ex) => ({ ...ex, group: "drill" })), ...FORUM];
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

function filteredExercises() {
  const group = $("filter").value;
  const query = $("search").value.trim().toLowerCase();
  return ALL.filter((ex) =>
    (group === "all" || ex.group === group) &&
    (!query || `${ex.title} ${ex.task_text} ${ex.type}`.toLowerCase().includes(query)));
}

function renderExercises() {
  const done = new Set(loadHistory().map((i) => i.id));
  const matches = filteredExercises();
  $("list-count").textContent = matches.length > MAX_LISTED
    ? `Hiển thị ${MAX_LISTED}/${matches.length} đề. Dùng ô tìm kiếm hoặc nút Ngẫu nhiên để xem thêm.`
    : `${matches.length} đề`;
  const list = $("exercise-list");
  list.innerHTML = "";
  for (const ex of matches.slice(0, MAX_LISTED)) {
    const btn = document.createElement("button");
    btn.className = "exercise" + (current === ex ? " selected" : "");
    btn.innerHTML = "<strong></strong><small></small>";
    btn.querySelector("strong").textContent = `${done.has(ex.id) ? "✓ " : ""}${ex.title}`;
    btn.querySelector("small").textContent = ex.source
      ? `${ex.type} · ${ex.source}`
      : `${ex.type} · ${ex.minutes}′ · ${ex.date}`;
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
  $("task-meta").textContent = ex.date ? `${ex.type} · ${ex.date}` : ex.type;
  $("task-title").textContent = ex.title;
  $("task-instructions").textContent = ex.instructions;
  $("task-text").textContent = ex.task_text;
  $("task-time").textContent = ex.minutes;
  $("answer").value = readStorage(DRAFT_PREFIX + ex.id, "");
  $("word-count").textContent = `${countWords($("answer").value)} từ`;
  $("reference").textContent = ex.reference_answer;
  $("reference-box").classList.add("hidden");
  $("reveal").classList.toggle("hidden", !ex.reference_answer);
  $("video-box").classList.toggle("hidden", !ex.video);
  if (ex.video) {
    $("video-link").href = ex.video;
    $("video-link").textContent = `${ex.source} (YouTube)`;
  }
  $("task-panel").classList.remove("hidden");
  $("message").textContent = "";
  renderExercises();
  startTimer();
  $("task-panel").scrollIntoView({ behavior: "smooth" });
  $("answer").focus({ preventScroll: true });
}

function copyForGrading() {
  if (!current) return;
  const text = `Chấm bài "${current.title}" (id: ${current.id}, dạng: ${current.type})

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
  $("filter").addEventListener("change", renderExercises);
  $("search").addEventListener("input", renderExercises);
  $("random").addEventListener("click", () => {
    const matches = filteredExercises();
    if (matches.length) openExercise(matches[Math.floor(Math.random() * matches.length)]);
  });
  $("reveal").addEventListener("click", () => $("reference-box").classList.toggle("hidden"));
  $("copy").addEventListener("click", copyForGrading);
  $("done").addEventListener("click", markDone);
  $("answer").addEventListener("input", () => {
    $("word-count").textContent = `${countWords($("answer").value)} từ`;
    if (current) writeStorage(DRAFT_PREFIX + current.id, $("answer").value);
  });
}

init();

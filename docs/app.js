const HISTORY_STORAGE = "ielts-gym-history";
const DRAFT_PREFIX = "ielts-gym-draft:";

const MAX_LISTED = 40;

const $ = (id) => document.getElementById(id);

// Real exam prompts are split into small steps so a weaker writer can practise one part at a time
// instead of always writing the full essay.
const TASK2_STEPS = [
  {
    key: "analyse",
    name: "1. Phân tích đề",
    minutes: 3,
    instructions: "Xác định dạng đề, từ khoá và câu hỏi phải trả lời. Viết tiếng Việt cũng được.",
    scaffold: "Dạng đề (opinion / discussion / adv-disadv / problem-solution / 2 câu hỏi):\nTừ khoá chính:\nĐề hỏi gì (viết lại bằng lời của mình):\nQuan điểm của tôi:\n",
  },
  {
    key: "ideas",
    name: "2. Lên ý",
    minutes: 5,
    instructions: "Tìm 2 ý chính, mỗi ý có 1 lý do và 1 ví dụ cụ thể. Ghi ngắn gọn, tiếng Việt cũng được.",
    scaffold: "Ý 1:\n  Vì sao:\n  Ví dụ:\nÝ 2:\n  Vì sao:\n  Ví dụ:\n",
  },
  {
    key: "intro",
    name: "3. Mở bài",
    minutes: 7,
    instructions: "Viết mở bài 2 câu bằng tiếng Anh: (1) paraphrase đề, (2) nêu rõ quan điểm và 2 ý chính.",
    scaffold: "",
  },
  {
    key: "body",
    name: "4. Một thân bài",
    minutes: 12,
    instructions: "Viết 1 đoạn thân bài (~100 từ): câu chủ đề → giải thích → ví dụ cụ thể → câu kết đoạn.",
    scaffold: "",
  },
  {
    key: "full",
    name: "5. Cả bài",
    minutes: 40,
    instructions: "Viết bài Task 2 hoàn chỉnh, ít nhất 250 từ trong 40 phút.",
    scaffold: "",
  },
];
const TASK1_STEPS = [
  {
    key: "analyse",
    name: "1. Phân tích + overview",
    minutes: 5,
    instructions: "Mở video xem biểu đồ. Ghi ra 2 đặc điểm nổi bật nhất (xu hướng chính, cao nhất / thấp nhất).",
    scaffold: "Loại biểu đồ:\nĐơn vị / thời gian:\nĐặc điểm nổi bật 1:\nĐặc điểm nổi bật 2:\n",
  },
  {
    key: "intro",
    name: "2. Mở bài + overview",
    minutes: 8,
    instructions: "Viết câu paraphrase đề và đoạn overview 1–2 câu bằng tiếng Anh, chưa cần số liệu.",
    scaffold: "",
  },
  {
    key: "full",
    name: "3. Cả bài",
    minutes: 20,
    instructions: "Viết bài Task 1 hoàn chỉnh, ít nhất 150 từ trong 20 phút. Biểu đồ/bản đồ xem trong video nguồn.",
    scaffold: "",
  },
];

const FORUM = (window.FORUM_PROMPTS || []).map((p) => ({
  id: p.id,
  date: "",
  group: `forum${p.task}`,
  type: `Đề thật Task ${p.task}`,
  title: p.prompt.length > 110 ? `${p.prompt.slice(0, 110)}…` : p.prompt,
  steps: p.task === 2 ? TASK2_STEPS : TASK1_STEPS,
  task_text: p.uncertain
    ? `${p.prompt}\n\n(Đề chép từ ảnh chụp video, có thể thiếu chữ, hãy đối chiếu với video.)`
    : p.prompt,
  reference_answer: "",
  video: p.video,
  source: p.video_title,
}));
const ALL = [...window.EXERCISES.map((ex) => ({ ...ex, group: "drill" })), ...FORUM];
let current = null;
let currentStep = null;
let timerHandle = null;

// Drills have no steps; treat the whole exercise as a single step.
function stepsOf(ex) {
  return ex.steps || [{ key: "", name: "", minutes: ex.minutes, instructions: ex.instructions, scaffold: "" }];
}

function draftKey() {
  return DRAFT_PREFIX + current.id + (currentStep.key ? `:${currentStep.key}` : "");
}

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

function renderStepTabs() {
  const tabs = $("step-tabs");
  tabs.innerHTML = "";
  if (!current.steps) return;
  for (const step of current.steps) {
    const btn = document.createElement("button");
    btn.className = "ghost" + (step === currentStep ? " active" : "");
    btn.textContent = `${step.name} · ${step.minutes}′`;
    btn.addEventListener("click", () => openStep(step));
    tabs.appendChild(btn);
  }
}

function openStep(step) {
  currentStep = step;
  renderStepTabs();
  $("task-instructions").textContent = step.instructions;
  $("task-time").textContent = step.minutes;
  $("answer").value = readStorage(draftKey(), step.scaffold);
  $("word-count").textContent = `${countWords($("answer").value)} từ`;
  $("message").textContent = "";
  startTimer();
  $("answer").focus({ preventScroll: true });
}

function openExercise(ex) {
  current = ex;
  $("task-meta").textContent = ex.date ? `${ex.type} · ${ex.date}` : ex.type;
  $("task-title").textContent = ex.title;
  $("task-text").textContent = ex.task_text;
  $("reference").textContent = ex.reference_answer;
  $("reference-box").classList.add("hidden");
  $("reveal").classList.toggle("hidden", !ex.reference_answer);
  $("video-box").classList.toggle("hidden", !ex.video);
  if (ex.video) {
    $("video-link").href = ex.video;
    $("video-link").textContent = `${ex.source} (YouTube)`;
  }
  $("task-panel").classList.remove("hidden");
  renderExercises();
  $("task-panel").scrollIntoView({ behavior: "smooth" });
  openStep(stepsOf(ex)[0]);
}

function copyForGrading() {
  if (!current) return;
  const stepLabel = currentStep.name ? `, bước: ${currentStep.name}` : "";
  const text = `Chấm bài "${current.title}" (id: ${current.id}, dạng: ${current.type}${stepLabel})

Yêu cầu: ${currentStep.instructions}

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
  const type = currentStep.name ? `${current.type} · ${currentStep.name}` : current.type;
  const items = loadHistory().filter((i) => !(i.id === current.id && i.type === type && i.date === isoDate(new Date())));
  items.unshift({ id: current.id, date: isoDate(new Date()), type, title: current.title });
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
    if (current) writeStorage(draftKey(), $("answer").value);
  });
}

init();

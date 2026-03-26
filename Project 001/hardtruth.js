const questions = [
  { q: "You wake up on a Monday with no obligations. How do you spend the day?", options: ["Scroll and rest", "Do something fun", "Work on a personal project", "Work toward long-term goals"], domain: "Purpose & Direction" },

  { q: "Someone asks what you're working toward in life. You feel...", options: ["Uncomfortable", "Uncertain", "Somewhat clear", "Very clear"], domain: "Purpose & Direction" },

  { q: "Thinking about your life 10 years from now, you feel...", options: ["Anxious", "Unsure", "Cautiously optimistic", "Excited and clear"], domain: "Purpose & Direction" },

  { q: "How often do you make decisions based on your values?", options: ["Rarely", "Sometimes", "Often", "Consistently"], domain: "Purpose & Direction" },

  { q: "A friend in distress calls you at night. You...", options: ["Ignore", "Text later", "Answer briefly", "Give full attention"], domain: "Relationships" },

  { q: "When a relationship becomes toxic, you...", options: ["Stay and complain", "Think about leaving", "Avoid directly", "Address it directly"], domain: "Relationships" },

  { q: "How often do you express appreciation to others?", options: ["Rarely", "Occasionally", "Sometimes", "Regularly"], domain: "Relationships" },

  { q: "In conflict, you usually...", options: ["Avoid", "Talk to others", "Delay honesty", "Address directly"], domain: "Relationships" },

  { q: "When facing a big risky opportunity, you...", options: ["Avoid", "Overthink and back out", "Partially engage", "Evaluate and act"], domain: "Fear & Avoidance" },

  { q: "To avoid difficult emotions, you tend to...", options: ["Distract heavily", "Stay busy", "Use habits/substances", "Allow and process"], domain: "Fear & Avoidance" },

  { q: "Being alone makes you feel...", options: ["Anxious", "Restless", "Neutral", "At peace"], domain: "Fear & Avoidance" },

  { q: "When receiving criticism, you...", options: ["Defensive", "Hurt", "Reflect partially", "Reflect and act"], domain: "Fear & Avoidance" },

  { q: "At the end of the week, you feel...", options: ["Regretful", "Slight regret", "Mixed", "Fulfilled"], domain: "Time & Priorities" },

  { q: "You procrastinate because...", options: ["Fear", "Busyness", "Waiting for timing", "Other priorities"], domain: "Time & Priorities" },

  { q: "Your screen time is...", options: ["Mostly unproductive", "Somewhat useful", "Half useful", "Mostly intentional"], domain: "Time & Priorities" },

  { q: "If you kept only 3 activities, you'd realize...", options: ["Wasteful habits", "Filler activities", "Mixed usage", "Aligned life"], domain: "Time & Priorities" },

  { q: "How honest are you about your flaws?", options: ["Avoid them", "Partial awareness", "Aware but inactive", "Actively working"], domain: "Self-Honesty & Growth" },

  { q: "How often do you update your beliefs?", options: ["Rarely", "Years ago", "Occasionally", "Frequently"], domain: "Self-Honesty & Growth" },

  { q: "Your approach to personal growth is...", options: ["None", "Passive", "Some effort", "Structured"], domain: "Self-Honesty & Growth" },

  { q: "When someone points out a blind spot, you...", options: ["Reject it", "Withdraw", "Consider but don’t act", "Reflect and act"], domain: "Self-Honesty & Growth" }
];

// STATE
let currentQ = 0;

// ✅ changed: store multiple selections per question
let userAnswers = Array.from({ length: questions.length }, () => []);

let domainScores = {
  "Purpose & Direction": 0,
  "Relationships": 0,
  "Fear & Avoidance": 0,
  "Time & Priorities": 0,
  "Self-Honesty & Growth": 0
};

// DOM
const qNumberEl = document.getElementById("qNumber");
const qTextEl = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");
const resultsCard = document.getElementById("resultsCard");

const progressBar = document.getElementById("quizProgress");
const progressText = document.getElementById("progressText");
const mickey = document.getElementById("mickeyIcon");

// Buttons
const prevBtn = document.createElement("button");
prevBtn.textContent = "Previous";
prevBtn.className = "nav-btn";

const nextBtn = document.createElement("button");
nextBtn.textContent = "Next";
nextBtn.className = "nav-btn";

document.querySelector(".quiz-wrap").appendChild(prevBtn);
document.querySelector(".quiz-wrap").appendChild(nextBtn);

// ================= PROGRESS =================
function updateProgress() {
  const completed = currentQ + 1;
  const total = questions.length;

  const percent = (completed / total) * 100;

  progressBar.style.width = percent + "%";
  mickey.style.left = `calc(${percent}% - 10px)`;
  progressText.textContent = `${completed} / ${total}`;
}

// ================= RENDER =================
function renderQuestion() {
  const q = questions[currentQ];

  qNumberEl.textContent = currentQ + 1;
  qTextEl.textContent = q.q;
  optionsGrid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";

    const letter = document.createElement("span");
    letter.className = "opt-letter";
    letter.textContent = String.fromCharCode(65 + idx);

    const text = document.createElement("span");
    text.textContent = opt;

    btn.appendChild(letter);
    btn.appendChild(text);

    // ✅ highlight multiple selections
    if (userAnswers[currentQ].includes(idx)) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectOption(idx, q.domain);

    optionsGrid.appendChild(btn);
  });

  prevBtn.style.display = currentQ === 0 ? "none" : "inline-block";
  nextBtn.textContent = currentQ === questions.length - 1 ? "Finish" : "Next";

  updateProgress();
}

// ================= SELECT (MULTI-SELECT LOGIC) =================
function selectOption(idx, domain) {
  const selected = userAnswers[currentQ];
  const index = selected.indexOf(idx);

  if (index === -1) {
    // add selection
    selected.push(idx);
    domainScores[domain] += (idx + 1);
  } else {
    // remove selection
    selected.splice(index, 1);
    domainScores[domain] -= (idx + 1);
  }

  renderQuestion();
}

// ================= NAVIGATION =================
prevBtn.onclick = () => {
  if (currentQ > 0) currentQ--;
  renderQuestion();
};

nextBtn.onclick = () => {
  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    showResults();
  }
};

// ================= RESULTS =================
function getArchetype(scorePercent) {
  if (scorePercent >= 75) return "Disciplined Architect";
  if (scorePercent >= 50) return "Growing Builder";
  if (scorePercent >= 30) return "Aware Explorer";
  return "Unfocused Drifter";
}

function showResults() {
  document.querySelector(".quiz-wrap").style.display = "none";
  resultsCard.style.display = "block";

  const totalScore = Object.values(domainScores).reduce((a, b) => a + b, 0);

  const maxScore = questions.length * 4;
  const percent = totalScore / maxScore;

  // Ring
  const circle = document.querySelector(".ring-fill");
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference * (1 - percent);

  // Archetype
  document.getElementById("archetype").textContent =
    getArchetype(percent * 100);

  // Breakdown
  const breakdown = document.getElementById("domainBreakdown");
  breakdown.innerHTML = Object.entries(domainScores)
    .map(([d, s]) => `<p>${d}: ${s}</p>`)
    .join("");

  // Strong / Weak
  const sorted = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);

  document.getElementById("strongDomain").textContent = sorted[0][0];
  document.getElementById("weakDomain").textContent =
    sorted[sorted.length - 1][0];
}

// INIT
renderQuestion();
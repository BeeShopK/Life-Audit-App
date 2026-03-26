// LifeApp Quiz Data
const quizzes = [
  { title: "The Mirror Test", subtitle: "Self-Awareness Quiz", questions: [
      { text: "Do you recognize yourself in the mirror?", options: ["Yes","No"], answer: 0 },
      { text: "Can you identify your emotions?", options: ["Always","Sometimes","Never"], answer: 0 }
  ]},
  { title: "The Connection Code", subtitle: "Relationships Quiz", questions: [
      { text: "Do you find it easy to make friends?", options: ["Yes","No"], answer: 0 },
      { text: "Do you communicate your feelings effectively?", options: ["Yes","No"], answer: 0 }
  ]},
  { title: "The Hard Truth", subtitle: "Life Audit", questions: [
      { text: "Do you track your personal growth regularly?", options: ["Yes","No"], answer: 0 },
      { text: "Do you reflect on your decisions?", options: ["Yes","No"], answer: 0 }
  ]},
  { title: "The Purpose Audit", subtitle: "Career Quiz", questions: [
      { text: "Do you feel fulfilled in your current career?", options: ["Yes","No"], answer: 0 },
      { text: "Do you have clear long-term goals?", options: ["Yes","No"], answer: 0 }
  ]},
  { title: "The Inner Weather", subtitle: "Mental Wellbeing Quiz", questions: [
      { text: "Do you feel stressed often?", options: ["Yes","No"], answer: 1 },
      { text: "Do you meditate or practice mindfulness?", options: ["Yes","No"], answer: 0 }
  ]}
];

// DOM References
const quizGrid = document.getElementById("quizGrid");
const quizWrap = document.getElementById("quizWrap");
const questionCard = document.getElementById("questionCard");
const resultsCard = document.getElementById("resultsCard");
const qNumber = document.getElementById("qNumber");
const qText = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");
const quizProgress = document.getElementById("quizProgress");
const progressText = document.getElementById("progressText");
const scoreRing = document.getElementById("scoreRing");
const resultsDesc = document.getElementById("resultsDesc");
const retryBtn = document.getElementById("retryBtn");
const backQuiz = document.getElementById("backQuiz");

let currentQuiz = null;
let currentQ = 0;
let score = 0;

// Generate Quiz Cards
function loadQuizzes() {
  quizzes.forEach((quiz, idx) => {
    const card = document.createElement("div");
    card.className = "domain-card";
    card.style.setProperty("--dc-color","var(--pri-lt)");
    card.innerHTML = `
      <div class="dc-icon">📝</div>
      <div class="dc-title">${quiz.title}</div>
      <div class="dc-subtitle">${quiz.subtitle}</div>
      <button class="dc-btn">Start Quiz</button>
    `;
    card.querySelector(".dc-btn").addEventListener("click", () => startQuiz(idx));
    quizGrid.appendChild(card);
  });
}

// Start Quiz
function startQuiz(index) {
  currentQuiz = quizzes[index];
  currentQ = 0;
  score = 0;
  quizGrid.style.display = "none";
  quizWrap.style.display = "block";
  questionCard.style.display = "block";
  resultsCard.style.display = "none";
  showQuestion();
}

// Show Question
function showQuestion() {
  const q = currentQuiz.questions[currentQ];
  qNumber.textContent = `Question ${currentQ + 1}`;
  qText.textContent = q.text;
  optionsGrid.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => selectOption(i));
    optionsGrid.appendChild(btn);
  });
  updateProgress();
}

// Select Option
function selectOption(index) {
  const q = currentQuiz.questions[currentQ];
  if(index === q.answer) score++;
  currentQ++;
  if(currentQ < currentQuiz.questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

// Update Progress
function updateProgress() {
  const total = currentQuiz.questions.length;
  const percent = ((currentQ) / total) * 100;
  quizProgress.style.width = percent + "%";
  progressText.textContent = `${currentQ} / ${total}`;
}

// Show Results
function showResults() {
  questionCard.style.display = "none";
  resultsCard.style.display = "block";
  const total = currentQuiz.questions.length;
  scoreRing.textContent = `${score} / ${total}`;
  resultsDesc.textContent = `You scored ${score} out of ${total}!`;
}

// Retry & Back
retryBtn.addEventListener("click", () => startQuiz(quizzes.indexOf(currentQuiz)));
backQuiz.addEventListener("click", () => {
  quizWrap.style.display = "none";
  quizGrid.style.display = "grid";
});

// Init
loadQuizzes();
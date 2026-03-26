const questions = [
  // Emotional Resilience (1–5)
  {
    q: "When life deals you a significant setback, how do you typically respond?",
    options: [
      "I shut down or fall apart for an extended time",
      "I struggle badly but eventually surface without learning much",
      "I grieve appropriately and recover, though it takes longer than I'd like",
      "I process it fully, extract what I can learn, and move forward with clarity"
    ],
    domain: "Emotional Resilience"
  },
  {
    q: "How quickly do you recover from emotional distress — arguments, disappointments, failures?",
    options: [
      "Very slowly — I carry things for weeks or months",
      "Slowly — it takes significant time and energy",
      "Reasonably — I usually work through it within days",
      "Well — I have real recovery tools and use them consistently"
    ],
    domain: "Emotional Resilience"
  },
  {
    q: "When you feel overwhelmed, your most common response is to...",
    options: [
      "Shut down, withdraw, or numb out completely",
      "Panic or spiral into catastrophic thinking",
      "Push through without addressing the root cause",
      "Acknowledge the overwhelm, identify the trigger, and take small deliberate steps"
    ],
    domain: "Emotional Resilience"
  },
  {
    q: "How often does anxiety or worry significantly affect your daily functioning?",
    options: [
      "Almost daily — it's a major limiting force in my life",
      "Frequently — several times a week",
      "Occasionally — it shows up but I manage it",
      "Rarely — I have effective practices that keep anxiety manageable"
    ],
    domain: "Emotional Resilience"
  },
  {
    q: "How well do you handle situations that are outside your control?",
    options: [
      "Very poorly — I fixate on what I can't change",
      "Poorly — I know I should let go but find it very hard",
      "Reasonably well — I remind myself of the distinction but still struggle sometimes",
      "Well — I've internalized the distinction between what I can and can't control"
    ],
    domain: "Emotional Resilience"
  },

  // Stress & Coping (6–10)
  {
    q: "Which best describes your primary coping mechanism when under significant stress?",
    options: [
      "Avoidance, numbing, or substances",
      "Complaining or venting without resolution",
      "Distraction that provides temporary relief but no resolution",
      "Active coping — processing, problem-solving, and self-care strategies"
    ],
    domain: "Stress & Coping"
  },
  {
    q: "How aware are you of your personal stress triggers?",
    options: [
      "Not at all — I'm usually caught off guard",
      "Somewhat — I notice after the fact",
      "Mostly aware but haven't fully mapped them",
      "Highly aware — I know my triggers and manage exposure intentionally"
    ],
    domain: "Stress & Coping"
  },
  {
    q: "How often do you reach a state of genuine rest and mental recovery?",
    options: [
      "Almost never — I'm perpetually stressed",
      "Rarely — once or twice a month",
      "Sometimes — several times a week",
      "Regularly — recovery time is protected"
    ],
    domain: "Stress & Coping"
  },
  {
    q: "Do you have healthy coping strategies you use consistently under stress?",
    options: [
      "No — I cope reactively and poorly",
      "I know what to do but rarely apply it",
      "Sometimes but not reliably",
      "Yes — I consistently use a healthy toolkit"
    ],
    domain: "Stress & Coping"
  },
  {
    q: "How often does stress from one area of life affect others?",
    options: [
      "Almost always",
      "Often",
      "Sometimes",
      "Rarely"
    ],
    domain: "Stress & Coping"
  },

  // Thought Patterns (11–15)
  {
    q: "How often do you engage in negative self-talk?",
    options: [
      "Constantly",
      "Frequently",
      "Occasionally",
      "Rarely"
    ],
    domain: "Thought Patterns"
  },
  {
    q: "How often does your thinking spiral into worst-case scenarios?",
    options: [
      "Very often",
      "Often",
      "Sometimes",
      "Rarely"
    ],
    domain: "Thought Patterns"
  },
  {
    q: "How clearly can you distinguish useful thoughts from noise?",
    options: [
      "I can't — I believe most thoughts",
      "I know the theory but struggle",
      "Sometimes",
      "Well — I have metacognitive awareness"
    ],
    domain: "Thought Patterns"
  },
  {
    q: "How do you respond to your own failures or mistakes?",
    options: [
      "Shame and rumination",
      "Harsh self-criticism",
      "Disappointment with partial processing",
      "Self-compassion and corrective action"
    ],
    domain: "Thought Patterns"
  },
  {
    q: "How often do you compare yourself to others in damaging ways?",
    options: [
      "Constantly",
      "Frequently",
      "Sometimes",
      "Rarely"
    ],
    domain: "Thought Patterns"
  },

  // Mental Health Investment (16–20)
  {
    q: "Do you have an active mental health practice?",
    options: [
      "No",
      "Tried but not consistent",
      "Occasional",
      "Consistent and structured"
    ],
    domain: "Mental Health Investment"
  },
  {
    q: "How comfortable are you discussing mental health with trusted people?",
    options: [
      "Very uncomfortable",
      "Uncomfortable",
      "Somewhat comfortable",
      "Comfortable"
    ],
    domain: "Mental Health Investment"
  },
  {
    q: "How proactively do you protect your mental health?",
    options: [
      "Only in crisis",
      "Think about it but don’t act",
      "Some preventive steps",
      "Proactive and intentional"
    ],
    domain: "Mental Health Investment"
  },
  {
    q: "How well do you sleep and how does it affect you?",
    options: [
      "Poor sleep is chronic",
      "Inconsistent",
      "Generally okay",
      "Strong sleep hygiene"
    ],
    domain: "Mental Health Investment"
  },
  {
    q: "Overall, how would you rate your mental wellbeing today?",
    options: [
      "Struggling significantly",
      "Below average",
      "Average",
      "Good to strong"
    ],
    domain: "Mental Health Investment"
  }
];

let currentQ = 0;
let userAnswers = Array(questions.length).fill(null);

const domainScores = {
  "Emotional Resilience": 0,
  "Stress & Coping": 0,
  "Thought Patterns": 0,
  "Mental Health Investment": 0
};

const qNumberEl = document.getElementById("qNumber");
const qTextEl = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const resultsCard = document.getElementById("resultsCard");
const totalScoreEl = document.getElementById("totalScore");
const breakdownEl = document.getElementById("breakdown");
const archetypeEl = document.getElementById("archetype");

function renderQuestion() {
  const q = questions[currentQ];

  qNumberEl.textContent = currentQ + 1;
  qTextEl.textContent = q.q;
  optionsGrid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");

    btn.textContent = String.fromCharCode(65 + idx) + ". " + opt;

    if (userAnswers[currentQ] === idx) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectOption(idx, q.domain);

    optionsGrid.appendChild(btn);
  });

  prevBtn.style.display = currentQ === 0 ? "none" : "inline-block";
  nextBtn.textContent = currentQ === questions.length - 1 ? "Finish" : "Next";
}

function selectOption(idx, domain) {
  const prev = userAnswers[currentQ];

  if (prev !== null) {
    domainScores[domain] -= (prev + 1);
  }

  userAnswers[currentQ] = idx;
  domainScores[domain] += (idx + 1);

  renderQuestion();
}

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

function showResults() {
  document.querySelector(".quiz-wrap").style.display = "none";
  resultsCard.style.display = "block";

  const total = Object.values(domainScores).reduce((a, b) => a + b, 0);
  totalScoreEl.textContent = `Total Score: ${total} / 80`;

  breakdownEl.innerHTML = Object.entries(domainScores)
    .map(([d, s]) => `<div>${d}: ${s} / 20</div>`)
    .join("");

  let archetype = "";

  if (total <= 39) archetype = "The Fragile Mind";
  else if (total <= 54) archetype = "The Coping Survivor";
  else if (total <= 69) archetype = "The Aware Processor";
  else archetype = "The Mentally Grounded";

  archetypeEl.innerHTML = `<h3>${archetype}</h3>`;
}

renderQuestion();
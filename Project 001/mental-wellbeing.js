const questions = [
  {
    q: "When life deals you a significant setback, how do you typically respond?",
    options: [
      { text: "I shut down or fall apart for an extended time", score: 1 },
      { text: "I struggle badly but eventually surface without learning much", score: 2 },
      { text: "I grieve appropriately and recover, though it takes longer than I'd like", score: 3 },
      { text: "I process it fully, extract what I can learn, and move forward with clarity", score: 4 }
    ],
    domain: "Emotional Resilience"
  },

  {
    q: "How quickly do you recover from emotional distress?",
    options: [
      { text: "Very slowly — weeks or months", score: 1 },
      { text: "Slowly — significant time", score: 2 },
      { text: "Reasonably — within days", score: 3 },
      { text: "Well — I recover consistently", score: 4 }
    ],
    domain: "Emotional Resilience"
  },

  {
    q: "Which best describes your coping under stress?",
    options: [
      { text: "Avoidance or numbing", score: 1 },
      { text: "Venting without resolution", score: 2 },
      { text: "Temporary distraction", score: 3 },
      { text: "Active problem-solving and healthy coping", score: 4 }
    ],
    domain: "Stress & Coping"
  },

  {
    q: "How often do you engage in negative self-talk?",
    options: [
      { text: "Constantly", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Occasionally", score: 3 },
      { text: "Rarely", score: 4 }
    ],
    domain: "Thought Patterns"
  },

  {
    q: "Do you have an active mental health practice?",
    options: [
      { text: "No", score: 1 },
      { text: "Tried but inconsistent", score: 2 },
      { text: "Occasional", score: 3 },
      { text: "Consistent and structured", score: 4 }
    ],
    domain: "Mental Health Investment"
  }
];

let currentQ = parseInt(localStorage.getItem("mw_currentQ"));
if (isNaN(currentQ)) currentQ = 0;

let answers = JSON.parse(localStorage.getItem("mw_answers")) || {};
let reviewing = localStorage.getItem("mw_reviewing") === "true";

const qNumber = document.getElementById("qNumber");
const qText = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function saveState(){
  localStorage.setItem("mw_answers", JSON.stringify(answers));
  localStorage.setItem("mw_currentQ", currentQ);
  localStorage.setItem("mw_reviewing", reviewing);
}

// RENDER QUESTION
function render(){

  if(reviewing){
    renderReview();
    return;
  }

  const q = questions[currentQ];

  qNumber.textContent = currentQ + 1;
  qText.textContent = q.q;

  optionsGrid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${["A","B","C","D"][idx]}. ${opt.text}`;

    if(answers[currentQ]?.includes(opt.score)){
      btn.classList.add("selected");
    }

    btn.onclick = () => toggleOption(opt.score);

    optionsGrid.appendChild(btn);
  });

  prevBtn.style.display = currentQ === 0 ? "none" : "block";
  nextBtn.textContent = currentQ === questions.length - 1 ? "Review" : "Next";

  saveState();
}

// MULTI-SELECT
function toggleOption(score){

  if(!answers[currentQ]) answers[currentQ] = [];

  if(answers[currentQ].includes(score)){
    answers[currentQ] = answers[currentQ].filter(s => s !== score);
  } else {
    answers[currentQ].push(score);
  }

  saveState();
  render();
}

// NAVIGATION
prevBtn.onclick = () => {
  if(currentQ > 0){
    currentQ--;
    render();
  }
};

nextBtn.onclick = () => {

  if(!reviewing){
    if(currentQ < questions.length - 1){
      currentQ++;
      render();
    } else {
      reviewing = true;
      render();
    }
  } else {
    showResults();
  }

};

// REVIEW SCREEN
function renderReview(){
  qText.textContent = "Review Your Answers";
  qNumber.textContent = "";

  optionsGrid.innerHTML = "";

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "review-item";

    const selected = (answers[i] || [])
      .map(score => ["A","B","C","D"][score-1])
      .join(", ");

    div.innerHTML = `
      <p><b>Q${i+1}:</b> ${q.q}</p>
      <p><b>Answer:</b> ${selected || "None"}</p>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Edit";
    btn.onclick = () => {
      reviewing = false;
      currentQ = i;
      render();
    };

    div.appendChild(btn);
    optionsGrid.appendChild(div);
  });

  prevBtn.style.display = "none";
  nextBtn.textContent = "Submit";

  saveState();
}

// RESULTS
function showResults(){

  document.querySelector(".quiz-wrap").style.display = "none";
  document.getElementById("resultsCard").style.display = "block";

  let domainScores = {
    "Emotional Resilience": 0,
    "Stress & Coping": 0,
    "Thought Patterns": 0,
    "Mental Health Investment": 0
  };

  let total = 0;

  questions.forEach((q, i) => {

    let arr = answers[i] || [];

    let avg = 0;
    if(arr.length > 0){
      avg = arr.reduce((a,b)=>a+b,0) / arr.length;
    }

    domainScores[q.domain] += avg;
    total += avg;

  });

  total = Math.round(total);

  document.getElementById("totalScore").textContent = `Total Score: ${total} / 80`;

  let archetype = "";

  if(total <= 39) archetype = "The Fragile Mind";
  else if(total <= 54) archetype = "The Coping Survivor";
  else if(total <= 69) archetype = "The Aware Processor";
  else archetype = "The Mentally Grounded";

  document.getElementById("archetype").innerHTML = `<h3>${archetype}</h3>`;

  const breakdown = document.getElementById("breakdown");
  breakdown.innerHTML = "";

  for(let d in domainScores){
    breakdown.innerHTML += `<div>${d}: ${Math.round(domainScores[d])}</div>`;
  }

  localStorage.removeItem("mw_answers");
  localStorage.removeItem("mw_currentQ");
  localStorage.removeItem("mw_reviewing");
}

// INIT
render();
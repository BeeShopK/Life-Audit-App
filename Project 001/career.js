const questions = [
  // A. Clarity & Direction
  {
    q: "How clearly defined is your career vision — what you're building toward professionally?",
    options: [
      "I have no clear vision",
      "I have vague ideas but nothing specific",
      "I have a direction but not a concrete plan",
      "I have a clear vision with a defined roadmap I'm actively executing"
    ],
    domain: "Clarity & Direction"
  },
  {
    q: "How often do you feel that your work is genuinely meaningful to you?",
    options: [
      "Almost never — it's purely transactional",
      "Rarely — occasional moments but mostly obligation",
      "Sometimes — there's meaning in parts of it",
      "Often — I've aligned my career with what I genuinely care about"
    ],
    domain: "Clarity & Direction"
  },
  {
    q: "Do you know what you're uniquely good at professionally — your real edge?",
    options: [
      "No — I haven't thought deeply about it",
      "I have a rough idea but couldn't articulate it clearly",
      "I know some of my strengths but not the full picture",
      "Yes — I know my edge clearly and actively position myself around it"
    ],
    domain: "Clarity & Direction"
  },
  {
    q: "How aligned is your current role with your long-term career goals?",
    options: [
      "Not at all — I'm in a dead end",
      "Loosely aligned but the fit is poor",
      "Somewhat aligned but I'm not progressing as fast as I want",
      "Strongly aligned — my current work is building directly toward where I want to go"
    ],
    domain: "Clarity & Direction"
  },
  {
    q: "How often do you proactively think about your career development — not just your current job?",
    options: [
      "Never — I just focus on getting through each day",
      "Rarely — only when something forces the question",
      "Occasionally — I think about it but don't act much",
      "Regularly — career development is a deliberate ongoing practice"
    ],
    domain: "Clarity & Direction"
  },

  // B. Performance & Work Habits
  {
    q: "How would you describe your daily work habits and productivity?",
    options: [
      "Chaotic — I'm reactive and frequently distracted",
      "Inconsistent — I have bursts of productivity followed by periods of waste",
      "Generally okay but not operating near my potential",
      "Strong — I have deliberate systems and I execute with consistency"
    ],
    domain: "Performance & Work Habits"
  },
  {
    q: "How do you respond when you receive constructive criticism about your work?",
    options: [
      "Defensive — I take it personally",
      "Hurt but I push past it",
      "I accept it intellectually but struggle to act on it",
      "I welcome it, reflect on it honestly, and incorporate it into my practice"
    ],
    domain: "Performance & Work Habits"
  },
  {
    q: "How often do you do deep, focused work — uninterrupted, high-concentration output — in a typical week?",
    options: [
      "Almost never — I'm constantly interrupted or distracted",
      "Once or twice a week at most",
      "A few times a week but not consistently",
      "Daily or near-daily — it's a protected, non-negotiable part of my work"
    ],
    domain: "Performance & Work Habits"
  },
  {
    q: "Do you take ownership of your results — both successes and failures — without deflection?",
    options: [
      "I tend to attribute failures to external factors",
      "I acknowledge my role but soften it",
      "Mostly yes, though I slip into deflection under pressure",
      "Yes — full ownership is a core professional value I hold myself to"
    ],
    domain: "Performance & Work Habits"
  },
  {
    q: "How do you approach skill development in your field?",
    options: [
      "I learn only when I'm forced to",
      "I learn occasionally when something relevant comes up",
      "I have a loose ongoing learning habit",
      "I invest deliberately in skill development with a clear growth plan"
    ],
    domain: "Performance & Work Habits"
  },

  // C. Ambition & Growth
  {
    q: "How ambitious are you about your career — honestly?",
    options: [
      "Not very — I want stability more than growth",
      "I have ambition but don't act on it consistently",
      "Moderately — I pursue growth but play it safe",
      "Highly — I push myself deliberately and pursue meaningful stretch goals"
    ],
    domain: "Ambition & Growth"
  },
  {
    q: "When a career opportunity arises that excites but intimidates you, you typically...",
    options: [
      "Pass on it — the risk feels too high",
      "Hesitate so long that it disappears",
      "Pursue it cautiously with a lot of hedging",
      "Go for it — I'm comfortable with the discomfort of real growth"
    ],
    domain: "Ambition & Growth"
  },
  {
    q: "How proactively do you build your professional network and reputation?",
    options: [
      "I don't — I rely on chance encounters",
      "Occasionally when I feel I need something",
      "Somewhat — I maintain existing relationships but don't build new ones much",
      "Actively — I invest in relationships and visibility as a deliberate career strategy"
    ],
    domain: "Ambition & Growth"
  },
  {
    q: "How honestly do you assess the gap between your current capability and where you want to be professionally?",
    options: [
      "I avoid the comparison — it's discouraging",
      "I think about it but feel powerless to close it",
      "I'm aware of it and working on it inconsistently",
      "I assess it clearly and build specific plans to close the gap"
    ],
    domain: "Ambition & Growth"
  },
  {
    q: "Are you in a career that makes use of your strongest abilities?",
    options: [
      "No — I feel seriously underutilized or mismatched",
      "Partially — some skills are used, others are wasted",
      "Mostly — though some strengths don't have an outlet",
      "Yes — my work gives my best abilities a real arena"
    ],
    domain: "Ambition & Growth"
  },

  // D. Work-Life Integration
  {
    q: "How well does your career currently support your life outside of work?",
    options: [
      "Poorly — work dominates and damages other areas of my life",
      "It's a complicated tension — I'm not winning at either",
      "Reasonably well — some friction but manageable",
      "Well — I've designed a working life that supports rather than consumes me"
    ],
    domain: "Work-Life Integration"
  },
  {
    q: "How often do you feel burned out, depleted, or resentful about your work?",
    options: [
      "Almost constantly",
      "Frequently",
      "Occasionally",
      "Rarely — I've built sustainable rhythms into how I work"
    ],
    domain: "Work-Life Integration"
  },
  {
    q: "Do you feel financially fairly compensated relative to the value you deliver?",
    options: [
      "No — I'm significantly undervalued and accept it",
      "No — but I haven't done anything about it",
      "Roughly fair but I know I could advocate for more",
      "Yes — or I'm actively taking steps to correct the gap"
    ],
    domain: "Work-Life Integration"
  },
  {
    q: "How clear is the boundary between your professional and personal life?",
    options: [
      "No boundary — work leaks into everything",
      "Weak boundary — I try but work consistently wins",
      "Reasonable boundary that I maintain most of the time",
      "Clear, protected boundary that I uphold deliberately"
    ],
    domain: "Work-Life Integration"
  },
  {
    q: "If you were completely honest, do you feel proud of the professional life you're building?",
    options: [
      "No — I feel disappointed or ashamed when I think about it",
      "Not really — I've settled in ways I regret",
      "Somewhat — I'm building something but it's not what I really want",
      "Yes — I'm proud of the direction I'm heading even if the journey is hard"
    ],
    domain: "Work-Life Integration"
  }
];

let currentQ = 0;
let reviewing = false;

let answers = JSON.parse(localStorage.getItem("answers")) ||
  Array(questions.length).fill(null).map(()=>[]);

// ELEMENTS
const qText = document.getElementById("qText");
const qNumber = document.getElementById("qNumber");
const optionsGrid = document.getElementById("optionsGrid");
const progress = document.getElementById("quizProgress");
const progressText = document.getElementById("progressText");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function save(){
  localStorage.setItem("answers", JSON.stringify(answers));
}

function render(){

  if(reviewing){
    renderReview();
    return;
  }

  let q = questions[currentQ];

  qText.textContent = q.q;
  qNumber.textContent = `Question ${currentQ+1} / ${questions.length}`;

  optionsGrid.innerHTML = "";

  q.options.forEach((opt,i)=>{
    let btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `${["A","B","C","D"][i]}. ${opt}`;

    if(answers[currentQ].includes(i+1)){
      btn.classList.add("selected");
    }

    btn.onclick = ()=>{
      if(answers[currentQ].includes(i+1)){
        answers[currentQ] = answers[currentQ].filter(v=>v!==i+1);
      } else {
        answers[currentQ].push(i+1);
      }
      save();
      render();
    };

    optionsGrid.appendChild(btn);
  });

  progress.style.width = ((currentQ+1)/questions.length)*100 + "%";
  progressText.textContent = `${currentQ+1} / ${questions.length}`;

  prevBtn.style.display = currentQ === 0 ? "none" : "block";
  nextBtn.textContent = currentQ === questions.length-1 ? "Review" : "Next";
}

function renderReview(){
  qText.textContent = "Review Your Answers";
  qNumber.textContent = "";

  optionsGrid.innerHTML = "";

  questions.forEach((q,i)=>{
    let div = document.createElement("div");
    div.className = "review-item";

    let selected = answers[i].map(v=>["A","B","C","D"][v-1]).join(", ");

    let btn = document.createElement("button");
    btn.textContent = "Edit";
    btn.onclick = ()=>{
      reviewing = false;
      currentQ = i;
      render();
    };

    div.innerHTML = `
      <p><b>Q${i+1}:</b> ${q.q}</p>
      <p><b>Answer:</b> ${selected || "None"}</p>
    `;

    div.appendChild(btn);
    optionsGrid.appendChild(div);
  });

  prevBtn.style.display = "none";
  nextBtn.textContent = "Submit";
}

prevBtn.onclick = ()=>{
  currentQ--;
  render();
};

nextBtn.onclick = ()=>{

  if(!reviewing){
    if(currentQ < questions.length-1){
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

function showResults(){

  document.querySelector(".quiz-wrap").style.display="none";
  document.getElementById("resultsCard").style.display="block";

  let domainScores = {
    "Clarity & Direction":0,
    "Performance & Work Habits":0,
    "Ambition & Growth":0,
    "Work-Life Integration":0
  };

  let total = 0;

  answers.forEach((ansArr,i)=>{
    let avg = ansArr.length ? ansArr.reduce((a,b)=>a+b)/ansArr.length : 0;
    domainScores[questions[i].domain] += avg;
    total += avg;
  });

  total = Math.round(total);

  document.getElementById("scoreText").textContent = `Score: ${total}/80`;

  let archetype = "";
  if(total<=39) archetype="Coasting Employee";
  else if(total<=54) archetype="Underperforming Potential";
  else if(total<=69) archetype="Rising Professional";
  else archetype="Deliberate Career Builder";

  document.getElementById("archetype").textContent = archetype;

  renderChart(domainScores);
  document.getElementById("analysis").innerHTML = generateAnalysis(domainScores,total);

  localStorage.removeItem("answers");
}

function renderChart(domainScores){
  let container = document.getElementById("domainBreakdown");
  container.innerHTML="";

  for(let d in domainScores){
    let score = Math.round(domainScores[d]);

    let div = document.createElement("div");
    div.innerHTML = `
      <p>${d} (${score}/20)</p>
      <div class="bar"><div class="fill" style="width:${(score/20)*100}%"></div></div>
    `;

    container.appendChild(div);
  }
}

function generateAnalysis(domainScores,total){

  let sorted = Object.entries(domainScores).sort((a,b)=>b[1]-a[1]);

  return `
    <h3>Insights</h3>
    <p><b>Strongest Area:</b> ${sorted[0][0]}</p>
    <p><b>Weakest Area:</b> ${sorted[sorted.length-1][0]}</p>
    <p>Your overall profile suggests ${archetypeSummary(total)}.</p>
  `;
}

function archetypeSummary(total){
  if(total<=39) return "low clarity and direction — focus on defining goals.";
  if(total<=54) return "emerging potential with inconsistent execution.";
  if(total<=69) return "good progress with room to refine focus.";
  return "strong alignment, discipline, and career maturity.";
}

render();
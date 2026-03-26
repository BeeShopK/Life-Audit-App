// === QUESTIONS ===
const questions = [
  // Communication & Honesty
  {q: "When you have a problem with someone close to you, your usual response is...", options:["Say nothing","Tell others but not them","Hint indirectly","Address it clearly with them"], domain:"Communication & Honesty"},
  {q: "How honest are you with the people closest to you about your feelings?", options:["Rarely share","Some honesty","Mostly honest","Completely honest"], domain:"Communication & Honesty"},
  {q: "When someone hurts you, your usual response is...", options:["Pretend nothing happened","Withdraw silently","Bring it up later","Address it calmly soon"], domain:"Communication & Honesty"},
  {q: "How often do you actively listen without planning a reply?", options:["Rarely","Sometimes","Often","Almost always"], domain:"Communication & Honesty"},
  {q: "When you need support, how easily do you ask?", options:["Almost never","Hint but struggle","Can ask but feel guilty","Ask openly"], domain:"Communication & Honesty"},
  // Boundaries & Respect
  {q: "How well do you enforce your personal boundaries?", options:["No boundaries","Cave under pushback","Enforce but feel guilty","Enforce clearly & consistently"], domain:"Boundaries & Respect"},
  {q: "When someone repeatedly crosses a boundary, you...", options:["Say nothing","Get angry","Bring up but accept","Have serious conversation"], domain:"Boundaries & Respect"},
  {q: "How often do you say yes when you mean no?", options:["Very often","Often","Occasionally","Rarely"], domain:"Boundaries & Respect"},
  {q: "Do people respect your time and energy?", options:["Mostly no","Some do","Mostly yes","Yes"], domain:"Boundaries & Respect"},
  {q: "How do you respond when disrespected?", options:["Ignore","Complain to others","Address eventually","Name it directly"], domain:"Boundaries & Respect"},
  // Depth & Investment
  {q: "How many deep, mutual relationships do you have?", options:["None","One or two","A small number","Several"], domain:"Depth & Investment"},
  {q: "How often do you invest proactively in your relationships?", options:["Rarely","Sometimes","Often","Regularly"], domain:"Depth & Investment"},
  {q: "When someone is struggling, how present are you?", options:["Brief acknowledgment","Check once","Support initially then fade","Consistently present"], domain:"Depth & Investment"},
  {q: "How comfortable are you with vulnerability?", options:["Very uncomfortable","Uncomfortable","Somewhat comfortable","Comfortable"], domain:"Depth & Investment"},
  {q: "Are your important relationships growing?", options:["Deteriorating","Stable","Mostly stable","Growing"], domain:"Depth & Investment"},
  // Conflict & Repair
  {q: "After a conflict, you usually...", options:["Wait","Apologize quickly","Partial conversation later","Work through fully"], domain:"Conflict & Repair"},
  {q: "How often do you hold grudges?", options:["Often","Sometimes","Occasionally","Rarely"], domain:"Conflict & Repair"},
  {q: "Can you genuinely apologize?", options:["No","Yes, but with 'but'","Mostly yes","Yes, fully"], domain:"Conflict & Repair"},
  {q: "How do you handle anger from someone you care about?", options:["Shut down","Get anxious","Try to listen","Stay calm and respond"], domain:"Conflict & Repair"},
  {q: "Overall, your relationships are...", options:["Chaotic","Surface-level","Mostly healthy","Strong"], domain:"Conflict & Repair"},
];

// === STATE ===
let currentQ = 0;
let userAnswers = [];
let domainScores = {
  "Communication & Honesty":0,
  "Boundaries & Respect":0,
  "Depth & Investment":0,
  "Conflict & Repair":0
};

// DOM Elements
const qNumberEl = document.getElementById("qNumber");
const qTextEl = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");
const quizProgress = document.getElementById("quizProgress");
const progressText = document.getElementById("progressText");
const mickeyIcon = document.getElementById("mickeyIcon");
const resultsCard = document.getElementById("resultsCard");
const archetypeEl = document.getElementById("archetype");
const domainBreakdownEl = document.getElementById("domainBreakdown");
const strongDomainEl = document.getElementById("strongDomain");
const weakDomainEl = document.getElementById("weakDomain");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const backQuizzes = document.getElementById("backQuizzes");

// ==== FUNCTIONS ====
function renderQuestion(){
  const q = questions[currentQ];
  qNumberEl.textContent = currentQ+1;
  qTextEl.textContent = q.q;
  optionsGrid.innerHTML = "";
  
  q.options.forEach((opt, idx)=>{
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt;
    if(userAnswers[currentQ]===idx) btn.classList.add("selected");
    btn.addEventListener("click", ()=>{
      userAnswers[currentQ] = idx;
      domainScores[q.domain] = calculateDomainScore(q.domain);
      renderQuestion();
    });
    optionsGrid.appendChild(btn);
  });

  const progressPercent = ((currentQ+1)/questions.length)*100;
  quizProgress.style.width = progressPercent+"%";
  mickeyIcon.style.left = `calc(${progressPercent}% - 12px)`;
  progressText.textContent = `${currentQ+1} / ${questions.length}`;

  prevBtn.style.display = currentQ===0 ? "none" : "inline-block";
  nextBtn.textContent = currentQ===questions.length-1 ? "Finish" : "Next";
}

function calculateDomainScore(domain){
  let score=0;
  questions.forEach((q,i)=>{
    if(q.domain===domain && userAnswers[i]!=null) score+=userAnswers[i]+1;
  });
  return score;
}

prevBtn.addEventListener("click", ()=>{
  if(currentQ>0){ currentQ--; renderQuestion(); }
});

nextBtn.addEventListener("click", ()=>{
  if(currentQ<questions.length-1){ currentQ++; renderQuestion(); }
  else{ showResults(); }
});

function showResults(){
  document.querySelector(".quiz-wrap").style.display="none";
  resultsCard.style.display="block";

  const sortedDomains = Object.entries(domainScores).sort((a,b)=>b[1]-a[1]);
  strongDomainEl.textContent = sortedDomains[0][0];
  weakDomainEl.textContent = sortedDomains[sortedDomains.length-1][0];

  domainBreakdownEl.innerHTML="";
  Object.entries(domainScores).forEach(([domain, score])=>{
    const p=document.createElement("p");
    p.textContent=`${domain}: ${score}`;
    domainBreakdownEl.appendChild(p);
  });

  // Simple archetype logic
  const totalScore = Object.values(domainScores).reduce((a,b)=>a+b,0);
  let archetype="";
  if(totalScore<=39) archetype="The Isolated";
  else if(totalScore<=54) archetype="The Cautious Connector";
  else if(totalScore<=69) archetype="The Invested Partner";
  else archetype="The Deep Connector";
  archetypeEl.textContent = archetype;
}

// Back to quizzes
backQuizzes.addEventListener("click", ()=>{ window.location.href="quizzes.html"; });

// Initial render
renderQuestion();
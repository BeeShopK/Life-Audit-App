const questions = [
  // Health & Energy
  {q:"How would you honestly describe your physical health and energy levels day-to-day?", options:["Chronically low energy — I'm often exhausted","Inconsistent — some good days, many low ones","Generally okay but not thriving","Strong and consistent — I invest in my physical health deliberately"], domain:"Health & Energy"},
  {q:"How intentional are you about sleep, nutrition, and exercise?", options:["I barely think about them","I think about them but rarely follow through","I'm consistent in one or two areas but not all three","All three are active, ongoing priorities with real habits behind them"], domain:"Health & Energy"},
  {q:"When your body shows signs of stress or illness, you typically...", options:["Ignore it until it becomes a crisis","Address the symptom but not the root cause","Slow down temporarily but return to the same patterns","Treat it as a signal and examine what needs to change systemically"], domain:"Health & Energy"},
  {q:"How often does physical fatigue or poor health limit what you can do in your life?", options:["Almost daily","Several times a week","Occasionally","Rarely — my health is a foundation I protect"], domain:"Health & Energy"},
  {q:"What best describes your relationship with your own body?", options:["Neglectful — I treat it as an afterthought","Transactional — I maintain it only when forced to","Aware but not fully disciplined","Respectful — I treat it as the most important asset I have"], domain:"Health & Energy"},

  // Financial Health
  {q:"How clearly do you understand your current financial situation — income, expenses, savings, debts?", options:["I actively avoid looking at it","I have a rough idea but not real clarity","I know the basics but lack a real plan","I have a clear picture and an active financial plan"], domain:"Financial Health"},
  {q:"How aligned is your spending with what you actually value?", options:["Most of my spending contradicts what I say I value","Some alignment but a lot of unconscious spending","Mostly aligned but with some areas of waste","Strongly aligned — I spend deliberately and review regularly"], domain:"Financial Health"},
  {q:"What is your current relationship with financial stress?", options:["It's a constant source of anxiety that I try not to think about","It comes and goes — I handle crises but don't plan ahead","Low-level but present — I manage but don't feel secure","Minimal — I've built enough security to not be controlled by financial fear"], domain:"Financial Health"},
  {q:"Are you actively building toward financial goals (savings, investment, debt reduction)?", options:["No — I live paycheck to paycheck or close to it","I have vague goals but no real action","I'm making some progress but not with a clear system","Yes — I have specific goals and consistent actions toward them"], domain:"Financial Health"},
  {q:"How often do you let financial fear drive major life decisions?", options:["Very often — it controls most of my choices","Often — it significantly shapes what I pursue or avoid","Sometimes — it's a factor but not the dominant one","Rarely — I make financial decisions from a place of clarity, not fear"], domain:"Financial Health"},

  // Environment & Lifestyle Design
  {q:"Does your physical environment (home, workspace) support the life you want to live?", options:["No — it's chaotic and draining","Partially — some spaces work but overall it's not intentional","Mostly yes but there are areas I've neglected","Yes — I've deliberately designed my environment to support my goals"], domain:"Environment & Lifestyle Design"},
  {q:"How intentional are you about how your days are structured?", options:["My days are largely unstructured and reactive","I have some loose routines but often go off track","I have structure but don't always protect it","My days are designed intentionally and I protect that structure"], domain:"Environment & Lifestyle Design"},
  {q:"How much of your lifestyle — where you live, who you spend time with, how you spend your hours — is a deliberate choice?", options:["Most of it just happened — I didn't choose it consciously","Some things were chosen but a lot is default","More deliberate than average but still some unconsidered areas","Almost all of it is a conscious design choice I revisit regularly"], domain:"Environment & Lifestyle Design"},
  {q:"Does the company you keep most of the time — socially and professionally — raise or drain you?", options:["Mostly draining — I feel worse after most social interactions","Mixed — some elevate me, others drain me significantly","Mostly positive with a few draining relationships I tolerate","Elevating — I've curated my circle deliberately"], domain:"Environment & Lifestyle Design"},
  {q:"How often do you audit different areas of your life to see what's working and what isn't?", options:["Never — I just react to problems as they come","Rarely — maybe once in a few years","Occasionally — usually after a crisis","Regularly — I do intentional life reviews on a consistent schedule"], domain:"Environment & Lifestyle Design"},

  // Purpose & Fulfillment
  {q:"At the end of a typical day, how often do you feel genuinely fulfilled?", options:["Almost never","Rarely — a few days a month at most","Sometimes — a few days a week","Often — most days have meaningful moments I feel good about"], domain:"Purpose & Fulfillment"},
  {q:"Is there a significant gap between the life you're living and the life you actually want?", options:["Yes — it feels enormous and I don't know how to close it","Yes — substantial, and I've been ignoring it","Some gap — I'm moving in the right direction but slowly","Minimal — I'm largely living aligned with what I want"], domain:"Purpose & Fulfillment"},
  {q:"How often do you do things that make you lose track of time because you're so engaged?", options:["Almost never — most of what I do feels like obligation","Rarely — maybe once a month","Sometimes — a few times a week","Regularly — I've built real flow activities into my life"], domain:"Purpose & Fulfillment"},
  {q:"When you look at your life as a whole, which area is causing the most quiet suffering?", options:["Multiple areas are broken and I'm overwhelmed","One or two significant areas I've been avoiding","One area I'm aware of and slowly addressing","No major area of quiet suffering — I address problems as they arise"], domain:"Purpose & Fulfillment"},
  {q:"If you could change one thing about your life that would improve everything else, would you know what it is?", options:["No — everything feels scattered and unclear","I have a vague sense but can't name it precisely","Yes — I know what it is but haven't acted on it","Yes — I know it clearly and I'm actively working on it"], domain:"Purpose & Fulfillment"}
];

let currentQ = 0;
let userAnswers = [];
let domainScores = {
  "Health & Energy": 0,
  "Financial Health": 0,
  "Environment & Lifestyle Design": 0,
  "Purpose & Fulfillment": 0
};

const qNumberEl = document.getElementById("qNumber");
const qTextEl = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");
const resultsCard = document.getElementById("resultsCard");
const archetypeEl = document.getElementById("archetype");

function renderQuestion() {
  const q = questions[currentQ];
  qNumberEl.textContent = `Question ${currentQ + 1} of ${questions.length}`;
  qTextEl.textContent = q.q;
  optionsGrid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("option-btn");
    if(userAnswers[currentQ] === idx) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      userAnswers[currentQ] = idx;
      domainScores[q.domain] = calculateDomainScore(q.domain);

      if(currentQ < questions.length - 1){
        currentQ++;
        renderQuestion();
      } else {
        showResults();
      }
    });
    optionsGrid.appendChild(btn);
  });
}

function calculateDomainScore(domain){
  return questions
    .filter((q,i) => q.domain === domain && userAnswers[i] != null)
    .reduce((sum, q, i) => sum + (userAnswers[i] + 1), 0);
}

function showResults(){
  document.querySelector(".quiz-wrap").style.display = "none";
  resultsCard.style.display = "block";

  const totalScore = userAnswers.reduce((acc,val) => acc + (val+1), 0);
  let archetype = "";
  if(totalScore <= 39) archetype = "The Drifting Life";
  else if(totalScore <= 54) archetype = "The Aware but Stuck";
  else if(totalScore <= 69) archetype = "The Active Redesigner";
  else archetype = "The Intentional Life";

  archetypeEl.textContent = `Score: ${totalScore}/80 — ${archetype}`;
}

renderQuestion();
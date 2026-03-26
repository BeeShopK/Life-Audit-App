// === QUESTIONS ===
const questions = [
  // Communication & Honesty
  {q: "When you have a problem with someone close to you, your first instinct is to...", options:["Say nothing and hope it resolves itself","Tell other people about it but not the person involved","Hint at the issue without being direct","Address it clearly, kindly, and directly with the person"], domain:"Communication & Honesty"},
  {q: "How honest are you with the people closest to you about your real feelings?", options:["I rarely share my true feelings with anyone","I'm honest about some things but hide the deeper stuff","Mostly honest, though I hold back when I'm scared of the reaction","Genuinely honest — I've built relationships where I can say hard things"], domain:"Communication & Honesty"},
  {q: "When someone says something that hurts you, your usual response is to...", options:["Pretend it didn't bother me and suppress it","Get cold or withdraw without explaining why","Bring it up later when it becomes too much to ignore","Address it calmly and specifically soon after it happens"], domain:"Communication & Honesty"},
  {q: "How often do you actively listen — without planning your reply — when someone is talking to you?", options:["Rarely — I'm usually thinking of what to say next","Sometimes, when the topic interests me a lot","Often, but I drift when the conversation gets long","Almost always — I genuinely prioritize understanding before responding"], domain:"Communication & Honesty"},
  {q: "When you need help or support, how easily do you ask for it?", options:["I almost never ask — I deal with things alone","I hint but struggle to ask directly","I can ask but feel guilty or vulnerable about it","I ask openly when I need support and let people show up for me"], domain:"Communication & Honesty"},

  // Boundaries & Respect
  {q: "How well do you enforce your personal boundaries in close relationships?", options:["I don't really have clear boundaries","I have them but cave when people push back","I enforce them most of the time but feel guilty","I enforce them clearly, consistently, and without excessive guilt"], domain:"Boundaries & Respect"},
  {q: "When someone repeatedly crosses a boundary you've expressed, you...", options:["Say nothing and absorb it","Get angry but don't change anything","Bring it up again but ultimately accept the behavior","Have a serious conversation about consequences and follow through if needed"], domain:"Boundaries & Respect"},
  {q: "How often do you say yes when you mean no in your relationships?", options:["Very often — I struggle to disappoint people","Often — I prioritize others' comfort over my own needs","Occasionally — mostly when I feel guilty","Rarely — I've learned to say no without over-explaining or apologizing"], domain:"Boundaries & Respect"},
  {q: "Do the people in your close circle respect your time, energy, and emotional needs?", options:["Mostly no — I attract people who take without giving","Some do but I tolerate the ones who don't","Mostly yes, though some relationships are draining","Yes — I've deliberately chosen relationships built on mutual respect"], domain:"Boundaries & Respect"},
  {q: "How do you respond when someone in your life disrespects you publicly or privately?", options:["I ignore it to keep the peace","I complain to others but don't confront them","I address it eventually but downplay how it affected me","I name it clearly and directly, regardless of the discomfort"], domain:"Boundaries & Respect"},

  // Depth & Investment
  {q: "How many relationships in your life would you describe as genuinely deep and mutual?", options:["None — all my relationships are fairly surface-level","One or two but they're not fully mutual","A small number — I'm working on deepening more","Several — I've invested in deep, reciprocal connections"], domain:"Depth & Investment"},
  {q: "How often do you proactively invest in the people you care about (not just responding when they reach out)?", options:["Rarely — I mostly wait for others to initiate","Sometimes, when I remember or feel guilty","Often, though inconsistently","Regularly — I make effort a deliberate practice"], domain:"Depth & Investment"},
  {q: "When a friend or partner is going through something hard, how present are you?", options:["I acknowledge it briefly and move on","I check in once but don't follow up","I'm supportive initially but fade as time goes on","I stay consistently present for as long as they need it"], domain:"Depth & Investment"},
  {q: "How comfortable are you with vulnerability — sharing your fears, failures, or insecurities with people you trust?", options:["Very uncomfortable — I keep everything contained","Uncomfortable — I share small things but keep the big stuff hidden","Somewhat comfortable but I ration my vulnerability","Comfortable — I see vulnerability as the foundation of real connection"], domain:"Depth & Investment"},
  {q: "Are your most important relationships growing, stable, or slowly deteriorating?", options:["Most are slowly deteriorating and I don't know why","They're stable but have been stuck at the same depth for years","Mostly stable with some growth","Growing — I actively invest in deepening the connections that matter"], domain:"Depth & Investment"},

  // Conflict & Repair
  {q: "After a significant conflict with someone you care about, what do you typically do?", options:["Wait for them to come to me — I won't make the first move","Apologize quickly to end the discomfort, even if I'm not really wrong","Give it time and then have a partial conversation","Work through it properly, take accountability for my part, and repair fully"], domain:"Conflict & Repair"},
  {q: "How often do you hold prolonged grudges or silent resentments in close relationships?", options:["Often — I accumulate resentments without addressing them","Sometimes — I can hold things for weeks or months","Occasionally — I work through it eventually","Rarely — I resolve issues quickly and don't let resentment build"], domain:"Conflict & Repair"},
  {q: "Can you genuinely apologize — without defending yourself — when you've hurt someone?", options:["No — I always add a justification","I apologize but usually include a 'but'","Mostly yes, though I sometimes minimize the impact","Yes — I can apologize cleanly, specifically, and without conditions"], domain:"Conflict & Repair"},
  {q: "How do you handle it when someone you care about is angry with you?", options:["I shut down or become defensive immediately","I get anxious and over-apologize to make the tension go away","I try to listen but struggle not to get defensive","I stay calm, seek to understand their perspective, and respond thoughtfully"], domain:"Conflict & Repair"},
  {q: "Which best describes the overall pattern in your close relationships?", options:["Chaotic — frequent misunderstandings and unresolved conflict","Surface-level — we get along but never address real issues","Mostly healthy with some recurring friction","Strong — built on honesty, repair, and mutual investment"], domain:"Conflict & Repair"}
];

// === STATE ===
let currentQ = 0;
let userAnswers = [];
let domainScores = {
  "Communication & Honesty": 0,
  "Boundaries & Respect": 0,
  "Depth & Investment": 0,
  "Conflict & Repair": 0
};

// === DOM ELEMENTS ===
const qNumberEl = document.getElementById("qNumber");
const qTextEl = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");
const resultsCard = document.getElementById("resultsCard");
const archetypeEl = document.getElementById("archetype");

// === RENDER QUESTION ===
function renderQuestion() {
  const q = questions[currentQ];
  qNumberEl.textContent = currentQ + 1;
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

// === CALCULATE DOMAIN SCORE ===
function calculateDomainScore(domain) {
  return questions
    .filter((q,i) => q.domain === domain && userAnswers[i] != null)
    .reduce((sum, q, i) => sum + (userAnswers[i] + 1), 0);
}

// === SHOW RESULTS ===
function showResults() {
  document.querySelector(".quiz-wrap").style.display = "none";
  resultsCard.style.display = "block";

  const totalScore = userAnswers.reduce((acc,val) => acc + (val+1), 0);

  // Determine archetype based on score
  let archetype = "";
  if(totalScore <= 39) archetype = "The Isolated";
  else if(totalScore <= 54) archetype = "The Cautious Connector";
  else if(totalScore <= 69) archetype = "The Invested Partner";
  else archetype = "The Deep Connector";

  archetypeEl.textContent = `Score: ${totalScore}/80 — ${archetype}`;
}

// === INITIAL RENDER ===
renderQuestion();
const questions = [
  // Emotional Awareness
  {q: "When you feel a strong negative emotion, your first instinct is to...", options:["Ignore it and distract yourself","React immediately without analyzing it","Notice it but not sure what it means","Identify the emotion, its trigger, and what it needs"], domain:"Emotional Awareness"},
  {q: "How often do you reflect on why you reacted a certain way in a situation?", options:["Almost never — I move on quickly","Occasionally, when something really bothers me","Often, but I don't always find useful answers","Regularly — reflection is a deliberate part of how I process experiences"], domain:"Emotional Awareness"},
  {q: "When someone close to you points out an emotional pattern they've noticed in you, you typically...", options:["Dismiss it — they're projecting","Feel uncomfortable and change the subject","Acknowledge it but forget it quickly","Take it seriously and reflect on whether it's true"], domain:"Emotional Awareness"},
  {q: "How accurately can you describe what you're feeling at any given moment?", options:["I mostly just feel 'fine' or 'bad'","I can tell if I'm happy or sad but not much more","I can usually name the emotion but not always trace its source","I can identify nuanced emotions and understand what's driving them"], domain:"Emotional Awareness"},
  {q: "You experience a sudden mood shift. Your response is to...", options:["Ignore it and wait for it to pass","Blame something or someone external","Notice it but feel confused about the cause","Pause, investigate the trigger, and respond intentionally"], domain:"Emotional Awareness"},
  // Values & Identity
  {q: "If someone asked you to list your top five personal values without Googling, you would...", options:["Struggle to name even two confidently","List some general ones but not sure they're really mine","Name a few that feel genuine but need more thought","Name them immediately — I know them and actively live by them"], domain:"Values & Identity"},
  {q: "How often do your daily choices actually align with what you say you value most?", options:["Rarely — there's a big gap","Sometimes — I'm inconsistent","Often — though some areas fall short","Almost always — I hold myself accountable to my values"], domain:"Values & Identity"},
  {q: "When you make a decision you later regret, the most common root cause is...", options:["I ignored my gut entirely","I was influenced too much by what others wanted","I acted on short-term comfort over long-term values","Rarely happens — I make values-aligned decisions consistently"], domain:"Values & Identity"},
  {q: "How clearly can you describe who you are to a stranger — beyond your job or social roles?", options:["I wouldn't know where to start","I'd describe my roles and hobbies but not much deeper","I have a sense of self but struggle to articulate it clearly","I can clearly describe my character, values, and worldview"], domain:"Values & Identity"},
  {q: "When external pressures conflict with your personal identity, you usually...", options:["Conform entirely to avoid conflict","Partly conform while feeling resentful","Push back occasionally but cave under sustained pressure","Hold your ground and articulate your position without hostility"], domain:"Values & Identity"},
  // Patterns & Blind Spots
  {q: "Are you aware of any recurring negative patterns in your life (relationships, work, habits)?", options:["No — things just happen to me","I suspect some patterns exist but haven't examined them","I'm aware of a few patterns but haven't fully addressed them","Yes — I've identified my patterns and actively work to change them"], domain:"Patterns & Blind Spots"},
  {q: "When the same type of problem keeps showing up in your life, your first thought is...", options:["I'm just unlucky","Others around me keep causing this","There might be something in my behavior, but I'm not sure what","I examine my own role first and look for the pattern to break"], domain:"Patterns & Blind Spots"},
  {q: "How comfortable are you sitting with uncertainty about who you are or what you want?", options:["Very uncomfortable — I avoid the question","Uncomfortable — I settle for surface-level answers","Somewhat okay but I rush toward false certainty","Comfortable — I treat self-discovery as an ongoing, open process"], domain:"Patterns & Blind Spots"},
  {q: "How often do you catch yourself behaving in a way that contradicts your stated values?", options:["I don't notice when it happens","Sometimes, but I rationalize it quickly","Occasionally — I notice but struggle to change it","Often enough to keep working on it — I see it as useful feedback"], domain:"Patterns & Blind Spots"},
  {q: "When someone describes your behavior in a way you didn't expect, you feel...", options:["Defensive and dismissive","Confused and uneasy","Curious but unsure what to do with the information","Genuinely interested — I use it to update my self-understanding"], domain:"Patterns & Blind Spots"},
  // Growth Orientation
  {q: "How do you respond when you discover a significant gap between who you are and who you want to be?", options:["Shame and avoidance","Frustration with no clear plan","Motivation to change but lack of consistent follow-through","Clear-eyed acceptance followed by intentional action"], domain:"Growth Orientation"},
  {q: "Do you have a practice — journaling, therapy, meditation, reflection — for deepening self-knowledge?", options:["No and I've never considered it","I've tried but never stuck with anything","I have occasional practices but nothing consistent","Yes — I have a regular, meaningful self-reflection practice"], domain:"Growth Orientation"},
  {q: "When you achieve a goal, how much time do you spend understanding why it worked?", options:["None — I move straight to the next thing","Very little — I just feel good and move on","Some, but not systematically","A deliberate amount — I extract lessons to replicate what worked"], domain:"Growth Orientation"},
  {q: "How well do you understand your own decision-making process?", options:["I don't really know how I make decisions","I think I know but I'm often surprised by my own choices","I understand some of my decision patterns","I understand my tendencies, biases, and what influences my decisions well"], domain:"Growth Orientation"},
  {q: "Self-awareness for you is best described as...", options:["Something other people talk about but I haven't prioritized","Interesting in theory but hard to apply practically","A work in progress — I'm building it slowly","A core life practice — I invest in it deliberately and consistently"], domain:"Growth Orientation"}
];

// === STATE & STORAGE ===
let currentQ = 0;
let userAnswers = [];
let domainScores = {
  "Emotional Awareness":0,
  "Values & Identity":0,
  "Patterns & Blind Spots":0,
  "Growth Orientation":0
};

// DOM
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

// Navigation
const prevBtn = document.createElement("button");
prevBtn.textContent = "Previous";
prevBtn.classList.add("nav-btn");
const nextBtn = document.createElement("button");
nextBtn.textContent = "Next";
nextBtn.classList.add("nav-btn");
document.querySelector(".quiz-wrap").appendChild(prevBtn);
document.querySelector(".quiz-wrap").appendChild(nextBtn);

// ==== FUNCTIONS ====
function renderQuestion(){
  const q = questions[currentQ];
  qNumberEl.textContent = currentQ+1;
  qTextEl.textContent = q.q;
  optionsGrid.innerHTML = "";
  q.options.forEach((opt,idx)=>{
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt;
    if(userAnswers[currentQ]===idx) btn.classList.add("selected");
    btn.addEventListener("click",()=>{
      userAnswers[currentQ]=idx;
      domainScores[q.domain] = calculateDomainScore(q.domain);
      renderQuestion();
    });
    optionsGrid.appendChild(btn);
  });
  const progressPercent = ((currentQ+1)/questions.length)*100;
  quizProgress.style.width = progressPercent+"%";
  mickeyIcon.style.left = `calc(${progressPercent}% - 12px)`;
  progressText.textContent = `${currentQ+1} / ${questions.length}`;
  prevBtn.style.display = currentQ===0?"none":"inline-block";
  nextBtn.textContent = currentQ===questions.length-1?"Finish":"Next";
}

function calculateDomainScore(domain){
  let score=0;
  questions.forEach((q,i)=>{
    if(q.domain===domain && userAnswers[i]!=null) score+=userAnswers[i]+1;
  });
  return score;
}

// Navigation
prevBtn.addEventListener("click
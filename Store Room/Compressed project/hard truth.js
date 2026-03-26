// Hard Truth Quiz Data
const quizData = [
  {domain:"Purpose & Direction", text:"You wake up on a Monday with no obligations. How do you spend the day?", options:["Scroll through social media and rest — I deserve a break","I'd try something fun but probably not very meaningful","I'd work on a personal project or something I've been putting off","I'd spend it doing something aligned with my long-term goals"]},
  {domain:"Purpose & Direction", text:"Someone asks: 'What are you working toward in life?' You honestly feel...", options:["Uncomfortable — I haven't really thought about it","Vague — I have some ideas but nothing concrete","Clear on some areas but not the full picture","Confident — I have a clear sense of direction and purpose"]},
  {domain:"Purpose & Direction", text:"When you imagine your life 10 years from now, what's your first feeling?", options:["Anxiety or dread — I try not to think about it","Uncertainty — I hope things just work out","Cautious optimism — I'm working toward something but not sure I'll get there","Excitement and clarity — I have a vision I'm actively building toward"]},
  {domain:"Purpose & Direction", text:"How often do you make decisions based on what you truly want vs. what others expect?", options:["I mostly follow what others expect of me","I occasionally do what I want but usually conform","I often make my own choices, though I sometimes second-guess myself","I consistently make choices aligned with my own values, regardless of pressure"]},
  
  {domain:"Relationships", text:"A close friend calls you at midnight clearly distressed. You...", options:["Ignore the call and respond in the morning — it's late","Text back asking if they're okay rather than call","Pick up and listen, but keep it brief","Pick up and give them your full attention for as long as they need"]},
  {domain:"Relationships", text:"You notice that a relationship in your life has become toxic. What do you do?", options:["I stay and complain to others about it","I think about leaving but come up with reasons to stay","I gradually distance myself without a direct conversation","I address it honestly and make a clear decision about whether to stay or go"]},
  {domain:"Relationships", text:"How often do you tell the important people in your life how much they mean to you?", options:["Rarely or never — it's awkward","Only when it's a special occasion","When it feels natural, but not proactively","Regularly — I make a conscious effort to show appreciation"]},
  {domain:"Relationships", text:"When you are in conflict with someone you care about, your default is to...", options:["Avoid the topic entirely and hope it fades","Vent to other people instead of the person involved","Bring it up eventually but struggle to be fully honest","Address it directly, calmly, and as soon as possible"]},

  {domain:"Fear & Avoidance", text:"A big opportunity could change your life but involves real risk. You...", options:["Don't pursue it — the risk isn't worth it","Research it extensively but eventually talk yourself out of it","Take a small step toward it but stop before fully committing","Assess the risk honestly and pursue it if it aligns with your goals"]},
  {domain:"Fear & Avoidance", text:"What do you most often use to avoid sitting with difficult emotions?", options:["Screens, social media, or entertainment for hours","Keeping constantly busy so I never have quiet time","Food, substances, or other physical distractions","I generally allow myself to feel things and process them"]},
  {domain:"Fear & Avoidance", text:"When you are completely alone and quiet, how do you feel?", options:["Uncomfortable or anxious — I always need noise or distraction","A bit restless, but I manage","Okay most of the time, though some things come up","At peace — I enjoy and use solitude well"]},
  {domain:"Fear & Avoidance", text:"How do you handle feedback or criticism about your character or decisions?", options:["I get defensive and dismiss it","I feel hurt but ignore it","I think about it but struggle to act on it","I reflect seriously, separate the useful parts, and act accordingly"]},

  {domain:"Time & Priorities", text:"At the end of a typical week, how do you feel about how you spent your time?", options:["Mostly like I wasted it on things that don't matter","A bit of regret — I could have been more intentional","Satisfied with some things but aware of what I let slip","Largely fulfilled — my time mostly aligned with what matters to me"]},
  {domain:"Time & Priorities", text:"Something important to you keeps getting pushed to 'later.' The real reason is...", options:["Fear that I'll fail or not be good enough","I'm genuinely too busy — there aren't enough hours","I'm waiting for the right conditions before I start","I've prioritized other things — and I know I need to change that"]},
  {domain:"Time & Priorities", text:"How much of your screen/media time do you feel is genuinely enriching?", options:["Honestly, almost none of it is enriching","Maybe 10–20% is genuinely useful or meaningful","Around half is valuable and half is just habit","Most of it is intentional — I'm fairly mindful of how I consume media"]},
  {domain:"Time & Priorities", text:"If you could only keep three things you currently do with your time, what would that reveal?", options:["That I mostly spend time on things I don't even value","That a lot of what I do is filler I've never questioned","That I have a mix of meaningful and wasted time","That most of what I do is aligned with who I want to be"]},

  {domain:"Self-Honesty & Growth", text:"How honest are you with yourself about your biggest flaws?", options:["I prefer not to think about them","I'm aware of some but avoid looking at others","I know most of them but struggle to change them","I examine them regularly and actively work on them"]},
  {domain:"Self-Honesty & Growth", text:"The last time you changed a deeply held belief because of new evidence — how long ago was that?", options:["I can't remember — I rarely change my core views","Several years ago","Within the last year or two","Recently — I regularly update my thinking based on what I learn"]},
  {domain:"Self-Honesty & Growth", text:"Which best describes your relationship with personal growth?", options:["I'm not actively working on myself right now","I think about it but rarely take concrete steps","I'm working on specific areas but not very systematically","Personal growth is a consistent, structured part of my life"]},
  {domain:"Self-Honesty & Growth", text:"Someone who knows you well honestly describes your biggest blind spot. Your reaction?", options:["Anger — they don't fully understand me","Hurt and withdrawal — I'd need time to recover","I'd appreciate it but likely not change much","Genuine curiosity and gratitude — I'd take it seriously and act on it"]}
];

let currentQ = 0;
const totalQ = quizData.length;
const scores = [];
const domainScores = {};

// Elements
const quizProgress = document.getElementById("quizProgress");
const qNumber = document.getElementById("qNumber");
const qText = document.getElementById("qText");
const optionsGrid = document.getElementById("optionsGrid");
const progressText = document.getElementById("progressText");
const resultsCard = document.getElementById("resultsCard");
const ringFill = document.querySelector(".ring-fill");
const finalScore = document.getElementById("finalScore");
const archetypeEl = document.getElementById("archetype");
const domainBreakdown = document.getElementById("domainBreakdown");
const strongDomain = document.getElementById("strongDomain");
const weakDomain = document.getElementById("weakDomain");
const mickey = document.getElementById("mickeyIcon");

function loadQuestion(){
  const q = quizData[currentQ];
  qNumber.textContent = currentQ + 1;
  qText.textContent = q.text;
  optionsGrid.innerHTML = "";
  q.options.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65+i)}</span> ${opt}`;
    btn.addEventListener("click",()=> selectOption(i+1,q.domain,btn));
    optionsGrid.appendChild(btn);
  });
  updateProgress();
}

function selectOption(score, domain, btn){
  btn.classList.add("selected");
  scores.push(score);
  domainScores[domain] = (domainScores[domain] || 0) + score;
  currentQ++;
  if(currentQ < totalQ) loadQuestion();
  else showResults();
}

function updateProgress(){
  const percent = (currentQ/totalQ)*100;
  quizProgress.style.width = percent + "%";
  const trackWidth = quizProgress.parentElement.offsetWidth;
  mickey.style.left = `${(percent/100)*trackWidth}px`;
  progressText.textContent = `${currentQ} / ${totalQ}`;
}

function showResults(){
  document.querySelector(".quiz-wrap").style.display="none";
  resultsCard.style.display="block";

  const totalScore = scores.reduce((a,b)=>a+b,0);
  finalScore.innerHTML = totalScore+"<small>%</small>";
  const dashOffset = 339.292 - (339.292 * totalScore / 80);
  ringFill.style.strokeDashoffset = dashOffset;

  // Determine archetype
  let archetype="";
  if(totalScore<=39) archetype="The Drifter";
  else if(totalScore<=54) archetype="The Seeker";
  else if(totalScore<=69) archetype="The Builder";
  else archetype="The Architect";
  archetypeEl.textContent = archetype;

  // Domain Breakdown
  let breakdownHtml="<ul>";
  let strongest= {domain:"",score:-1}, weakest={domain:"",score:1000};
  for(let d in domainScores){
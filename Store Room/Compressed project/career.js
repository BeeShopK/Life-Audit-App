const questions = [
  // Clarity
  {q:"How clearly defined is your career vision?",options:["No vision","Vague ideas","Some direction","Clear roadmap"],domain:"Clarity"},
  {q:"How meaningful is your work?",options:["Never","Rarely","Sometimes","Often"],domain:"Clarity"},
  {q:"Do you know your strengths?",options:["No","Rough idea","Some","Clear"],domain:"Clarity"},
  {q:"Role alignment?",options:["None","Loose","Some","Strong"],domain:"Clarity"},
  {q:"Career thinking?",options:["Never","Rarely","Sometimes","Regular"],domain:"Clarity"},

  // Performance
  {q:"Work habits?",options:["Chaotic","Inconsistent","Okay","Strong"],domain:"Performance"},
  {q:"Criticism response?",options:["Defensive","Hurt","Accept","Improve"],domain:"Performance"},
  {q:"Deep work?",options:["Never","Rare","Some","Daily"],domain:"Performance"},
  {q:"Ownership?",options:["Blame","Partial","Mostly","Full"],domain:"Performance"},
  {q:"Skill growth?",options:["Forced","Occasional","Loose","Planned"],domain:"Performance"},

  // Ambition
  {q:"Ambition?",options:["Low","Inconsistent","Moderate","High"],domain:"Ambition"},
  {q:"Risk?",options:["Avoid","Delay","Cautious","Go"],domain:"Ambition"},
  {q:"Networking?",options:["None","Occasional","Maintain","Active"],domain:"Ambition"},
  {q:"Skill gap?",options:["Avoid","Stuck","Trying","Plan"],domain:"Ambition"},
  {q:"Using strengths?",options:["No","Partial","Mostly","Fully"],domain:"Ambition"},

  // Work-life
  {q:"Balance?",options:["Poor","Conflict","Manage","Good"],domain:"Work"},
  {q:"Burnout?",options:["Constant","Frequent","Occasional","Rare"],domain:"Work"},
  {q:"Pay?",options:["Low","No action","Fair","Good"],domain:"Work"},
  {q:"Boundaries?",options:["None","Weak","Okay","Strong"],domain:"Work"},
  {q:"Pride?",options:["No","Not really","Some","Yes"],domain:"Work"}
];

let currentQ = 0;
let answers = new Array(20).fill(null);

const qText = document.getElementById("qText");
const qNumber = document.getElementById("qNumber");
const optionsGrid = document.getElementById("optionsGrid");
const progress = document.getElementById("quizProgress");
const progressText = document.getElementById("progressText");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function render(){
  let q = questions[currentQ];
  qText.textContent = q.q;
  qNumber.textContent = currentQ+1;

  optionsGrid.innerHTML="";

  q.options.forEach((opt,i)=>{
    let btn = document.createElement("button");
    btn.className="option-btn";
    btn.innerHTML = `<b>${["A","B","C","D"][i]}</b>. ${opt}`;

    if(answers[currentQ]===i+1) btn.classList.add("selected");

    btn.onclick=()=>{
      answers[currentQ]=i+1;
      render();
    };

    optionsGrid.appendChild(btn);
  });

  progress.style.width = ((currentQ+1)/20)*100+"%";
  progressText.textContent = `${currentQ+1} / 20`;

  prevBtn.style.display = currentQ===0?"none":"block";
  nextBtn.textContent = currentQ===19?"Finish":"Next";
}

prevBtn.onclick=()=>{
  currentQ--;
  render();
};

nextBtn.onclick=()=>{
  if(answers[currentQ]==null){
    alert("Select an answer");
    return;
  }

  if(currentQ<19){
    currentQ++;
    render();
  } else {
    showResults();
  }
};

function showResults(){
  document.querySelector(".quiz-wrap").style.display="none";
  document.getElementById("resultsCard").style.display="block";

  let domainScores={Clarity:0,Performance:0,Ambition:0,Work:0};

  answers.forEach((ans,i)=>{
    domainScores[questions[i].domain]+=ans;
  });

  let total = answers.reduce((a,b)=>a+b,0);

  document.getElementById("scoreText").textContent = `Score: ${total}/80`;

  let archetype="";
  if(total<=39) archetype="Coasting Employee";
  else if(total<=54) archetype="Underperforming Potential";
  else if(total<=69) archetype="Rising Professional";
  else archetype="Deliberate Career Builder";

  document.getElementById("archetype").textContent = archetype;

  let max=0,min=999,strong="",weak="",html="";
  for(let d in domainScores){
    let s=domainScores[d];
    html+=`<p>${d}: ${s}/20</p>`;
    if(s>max){max=s;strong=d;}
    if(s<min){min=s;weak=d;}
  }

  document.getElementById("domainBreakdown").innerHTML=html;
  document.getElementById("strongDomain").textContent=strong;
  document.getElementById("weakDomain").textContent=weak;
}

render();
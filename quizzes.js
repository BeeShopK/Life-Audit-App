// App.js — Full Life Audit App
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─── CONSTANTS ───────────────────────────────────────────
const CATS = {
  SELF: { label: "Self-Awareness", color: "#D4872A" },
  REL: { label: "Relationships", color: "#C94F4F" },
  CAREER: { label: "Career & Purpose", color: "#3A78C9" },
  MENTAL: { label: "Mental Wellbeing", color: "#3A9E6A" },
};

const MOODS = ["🌤 Okay", "☀️ Good", "🌧 Low", "⛈ Struggling", "🌈 Great"];

// ─── SEED QUIZZES ───────────────────────────────────────
const SEED_QUIZZES = [
  {
    id: "q1",
    title: "The Mirror Test",
    category: "SELF",
    description: "How well do you know yourself?",
    questions: [
      { id: "q1_1", question: "When you fail at something important, your honest first response is…", options: [{ text: "Own it fully", score: 4 },{ text: "Feel bad then reflect", score: 3 },{ text: "Blame external factors", score: 2 },{ text: "Move on quickly", score: 1 }]},
      { id: "q1_2", question: "Can you name your top three personal values?", options: [{ text: "Yes, immediately", score: 4 },{ text: "Roughly", score: 2 },{ text: "Hard to recall", score: 1 },{ text: "Never defined", score: 1 }]},
      { id: "q1_3", question: "Your emotional reactions — how well do you understand them?", options: [{ text: "Trace most reactions", score: 4 },{ text: "Some understanding", score: 3 },{ text: "React first, understand later", score: 1 },{ text: "Don't analyze", score: 1 }]},
      { id: "q1_4", question: "The version you show the world vs. who you are alone — how different?", options: [{ text: "Very similar", score: 4 },{ text: "A bit different", score: 3 },{ text: "Quite different", score: 1 },{ text: "Unsure", score: 2 }]},
      { id: "q1_5", question: "Decisions — long-term alignment vs. short-term comfort?", options: [{ text: "Mostly long-term", score: 4 },{ text: "Half and half", score: 2 },{ text: "Mostly short-term", score: 1 },{ text: "Don't think in those terms", score: 1 }]}
    ],
    bands: [
      { range: [5,9], title: "The Stranger Within", color: "#C94F4F", desc: "You haven't spent much time with yourself yet.", action: "Spend 10 minutes a day in silence." },
      { range: [10,14], title: "The Occasional Mirror", color: "#D4872A", desc: "You look inward sometimes.", action: "Pick one behavior to observe this week." },
      { range: [15,17], title: "The Honest Witness", color: "#3A78C9", desc: "You have real self-knowledge.", action: "Write three things you know about yourself but haven't acted on." },
      { range: [18,20], title: "The Clear-Eyed One", color: "#3A9E6A", desc: "Rare self-awareness.", action: "Integrate your knowledge into daily living." }
    ]
  },
  // REL, CAREER, MENTAL quizzes can be seeded similarly...
];

// ─── STORAGE HELPERS ─────────────────────────────────────
async function store(key, val) { try { await localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }
async function load(key, fallback) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; } }

// ─── QUIZ FLOW ──────────────────────────────────────────
function QuizFlow({ quiz, onDone, onBack }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const q = quiz.questions[index];

  const submitAnswer = (score) => {
    const newAns = [...answers, score];
    setAnswers(newAns);
    if (index + 1 < quiz.questions.length) setIndex(index + 1);
    else {
      const total = newAns.reduce((a,b)=>a+b,0);
      const band = quiz.bands.find(b => total >= b.range[0] && total <= b.range[1]);
      onDone({ quizId: quiz.id, total, band, date: new Date().toISOString() });
    }
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2>{quiz.title}</h2>
      <p>{q.question}</p>
      {q.options.map(o => (
        <button key={o.text} onClick={()=>submitAnswer(o.score)} style={{margin:"6px"}}>{o.text}</button>
      ))}
      <p>Question {index+1}/{quiz.questions.length}</p>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────
function Dashboard({ quizzes, history, journal, onStartQuiz }) {
  return (
    <div>
      <h2>🏠 Dashboard</h2>
      <h3>Quick Stats</h3>
      <ul>
        {Object.keys(CATS).map(c => {
          const taken = history.filter(h => quizzes.find(q=>q.id===h.quizId).category===c).length;
          return <li key={c}>{CATS[c].label}: {taken} quizzes taken</li>;
        })}
      </ul>
      <h3>Quick Start</h3>
      {quizzes.map(q=>(
        <button key={q.id} onClick={()=>onStartQuiz(q)} style={{margin:"4px"}}>{q.title}</button>
      ))}
      <h3>Recent Journal</h3>
      <ul>{journal.slice(-3).map((j,i)=><li key={i}>{j.date}: {j.entry}</li>)}</ul>
    </div>
  );
}

// ─── QUIZZES PAGE ───────────────────────────────────────
function QuizzesPage({ quizzes, history, onStart }) {
  return (
    <div>
      <h2>◇ Quizzes</h2>
      {Object.keys(CATS).map(c => (
        <div key={c}>
          <h3>{CATS[c].label}</h3>
          {quizzes.filter(q=>q.category===c).map(q=>{
            const last = history.filter(h=>h.quizId===q.id).slice(-1)[0];
            return <div key={q.id}>
              <span>{q.title}</span>
              {last && <span> - Last Score: {last.total} ({last.band.title})</span>}
              <button onClick={()=>onStart(q)}>Take / Retake</button>
            </div>;
          })}
        </div>
      ))}
    </div>
  );
}

// ─── JOURNAL PAGE ───────────────────────────────────────
function JournalPage({ journal, onSave }) {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState(MOODS[0]);
  const [cat, setCat] = useState("SELF");

  const saveEntry = () => {
    const newJ = [...journal, { date: new Date().toISOString(), entry, mood, category: cat }];
    onSave(newJ);
    setEntry("");
  };

  return (
    <div>
      <h2>▭ Journal</h2>
      <textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder="Write reflection..." rows={4} cols={50}></textarea>
      <div>
        Mood: <select value={mood} onChange={e=>setMood(e.target.value)}>{MOODS.map(m=><option key={m}>{m}</option>)}</select>
        Category: <select value={cat} onChange={e=>setCat(e.target.value)}>{Object.keys(CATS).map(c=><option key={c}>{c}</option>)}</select>
        <button onClick={saveEntry}>Save Entry</button>
      </div>
      <ul>
        {journal.map((j,i)=><li key={i}>{j.date} [{j.category}] {j.mood} - {j.entry}</li>)}
      </ul>
    </div>
  );
}

// ─── PROGRESS PAGE ──────────────────────────────────────
function ProgressPage({ history }) {
  const lineData = history.map((h,i)=>({name: new Date(h.date).toLocaleDateString(), score:h.total}));
  const barData = Object.keys(CATS).map(c=>{
    const catScores = history.filter(h=>h.quizId.startsWith(c)).map(h=>h.total);
    const avg = catScores.length ? Math.round(catScores.reduce((a,b)=>a+b,0)/catScores.length) : 0;
    return { category: CATS[c].label, avg };
  });

  return (
    <div>
      <h2>◌ Progress</h2>
      <h3>Score Over Time</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={lineData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#3A78C9" />
        </LineChart>
      </ResponsiveContainer>
      <h3>Average per Category</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData}>
          <XAxis dataKey="category"/>
          <YAxis />
          <Tooltip/>
          <Bar dataKey="avg" fill="#C94F4F" />
        </BarChart>
      </ResponsiveContainer>
      <h3>Full History</h3>
      <ul>{history.map((h,i)=>(
        <li key={i}>{h.date} - {h.quizId} - {h.total} ({h.band.title})</li>
      ))}</ul>
    </div>
  );
}

// ─── ADMIN PANEL ────────────────────────────────────────
function AdminPanel({ quizzes, saveQuizzes }) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("SELF");
  const [generated, setGenerated] = useState(null);

  const generateQuiz = () => {
    // Simple placeholder AI logic
    const id = "gen_" + Date.now();
    const newQuiz = {
      id,
      title: topic,
      category,
      description: `AI-generated quiz about ${topic}`,
      questions: Array(5).fill(0).map((_,i)=>({
        id: `${id}_q${i+1}`,
        question: `Question ${i+1} about ${topic}`,
        options: [
          { text: "Option A", score: 1 },
          { text: "Option B", score: 2 },
          { text: "Option C", score: 3 },
          { text: "Option D", score: 4 },
        ]
      })),
      bands: [
        { range:[5,9], title:"Low", color:"#C94F4F", desc:"Low score", action:"Reflect more"},
        { range:[10,14], title:"Medium", color:"#D4872A", desc:"Medium", action:"Try improving"},
        { range:[15,17], title:"High", color:"#3A78C9", desc:"High", action:"Great job"},
        { range:[18,20], title:"Excellent", color:"#3A9E6A", desc:"Excellent", action:"Keep it up"}
      ]
    };
    const newList = [newQuiz, ...quizzes];
    saveQuizzes(newList);
    setGenerated(newQuiz);
  };

  const deleteQuiz = (id) => {
    const newList = quizzes.filter(q=>q.id!==id);
    saveQuizzes(newList);
  };

  return (
    <div>
      <h2>⊕ Admin Panel</h2>
      <input placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)}/>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        {Object.keys(CATS).map(c=><option key={c}>{c}</option>)}
      </select>
      <button onClick={generateQuiz}>Generate Quiz</button>
      {generated && <p>Generated quiz: {generated.title}</p>}
      <h3>Existing Quizzes</h3>
      <ul>
        {quizzes.map(q=><li key={q.id}>{q.title} [{q.category}] <button onClick={()=>deleteQuiz(q.id)}>Delete</button></li>)}
      </ul>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────
export default function LifeApp() {
  const [page, setPage] = useState("dashboard");
  const [quizzes, setQuizzes] = useState([]);
  const [journal, setJournal] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    (async () => {
      const q = await load("life_quizzes", null);
      const j = await load("life_journal", []);
      const h = await load("life_history", []);
      if (!q) { await store("life_quizzes", SEED_QUIZZES); setQuizzes(SEED_QUIZZES); } else setQuizzes(q);
      setJournal(j); setHistory(h); setLoading(false);
    })();
  }, []);

  const saveQuizzes = async (q) => { setQuizzes(q); await store("life_quizzes", q); };
  const saveJournal = async (j) => { setJournal(j); await store("life_journal", j); };
  const saveHistory = async (h) => { setHistory(h); await store("life_history", h); };

  if (loading) return <div style={{padding:"50px", textAlign:"center"}}>LOADING...</div>;
  if (activeQuiz) return <QuizFlow quiz={activeQuiz} onDone={async (result)=>{await saveHistory([result,...history]); setActiveQuiz(null); setPage("progress");}} onBack={()=>setActiveQuiz(null)} />;

  return (
    <div style={{display:"flex", minHeight:"100vh"}}>
      <div style={{width:"220px", background:"#1C1208", padding:"16px", color:"#fff"}}>
        <h2>LifeAudit</h2>
        {["dashboard","quizzes","journal","progress","admin"].map(p=>(
          <div key={p} style={{margin:"12px 0", cursor:"pointer"}} onClick={()=>setPage(p)}>{p.toUpperCase()}</div>
        ))}
      </div>
      <div style={{flex:1, padding:"30px"}}>
        {page==="dashboard" && <Dashboard quizzes={quizzes} history={history} journal={journal} onStartQuiz={setActiveQuiz} />}
        {page==="quizzes" && <QuizzesPage quizzes={quizzes} history={history} onStart={setActiveQuiz} />}
        {page==="journal" && <JournalPage journal={journal} onSave={saveJournal} />}
        {page==="progress" && <ProgressPage history={history} />}
        {page==="admin" && <AdminPanel quizzes={quizzes} saveQuizzes={saveQuizzes} />}
      </div>
    </div>
  );
}
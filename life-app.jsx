import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATS = {
  SELF:   { label: "Self-Awareness",        color: "#D4872A", bg: "#FDF3E7", icon: "◈" },
  REL:    { label: "Relationships",          color: "#C94F4F", bg: "#FCF0F0", icon: "◎" },
  CAREER: { label: "Career & Purpose",       color: "#3A78C9", bg: "#EEF4FD", icon: "◇" },
  MENTAL: { label: "Mental Wellbeing",       color: "#3A9E6A", bg: "#EDF7F3", icon: "◉" },
};

const MOODS = ["🌤 Okay", "☀️ Good", "🌧 Low", "⛈ Struggling", "🌈 Great"];

const SEED_QUIZZES = [
  {
    id: "q1", title: "The Mirror Test", category: "SELF",
    description: "How well do you actually know yourself — beyond the story you tell?",
    questions: [
      { id: "q1_1", question: "When you fail at something important, your honest first response is…",
        options: [{ text: "Own it fully and look for what I caused", score: 4 },{ text: "Feel bad, then eventually look inward", score: 3 },{ text: "Focus on what went wrong externally", score: 2 },{ text: "Move on quickly without much reflection", score: 1 }]},
      { id: "q1_2", question: "Can you name your top three personal values right now — without thinking long?",
        options: [{ text: "Yes, immediately — I live by them consciously", score: 4 },{ text: "Roughly, but they shift depending on my mood", score: 2 },{ text: "I'd have to think hard about it", score: 1 },{ text: "I've never really defined them", score: 1 }]},
      { id: "q1_3", question: "Your emotional reactions — how well do you understand where they come from?",
        options: [{ text: "I trace most reactions to their root causes", score: 4 },{ text: "Some — I'm working on it", score: 3 },{ text: "I react first and understand later, sometimes never", score: 1 },{ text: "My emotions just happen — I don't analyze them", score: 1 }]},
      { id: "q1_4", question: "The version of yourself you show the world vs. who you are alone — how different are they?",
        options: [{ text: "Very similar — I don't perform much", score: 4 },{ text: "A bit different — I manage impressions at work/socially", score: 3 },{ text: "Quite different — I wear a lot of masks", score: 1 },{ text: "I'm not sure I know who I am when no one's watching", score: 2 }]},
      { id: "q1_5", question: "How often do you make decisions that align with your long-term self vs. your short-term comfort?",
        options: [{ text: "Mostly long-term — I have strong self-discipline", score: 4 },{ text: "About half and half — I'm inconsistent", score: 2 },{ text: "Mostly short-term — the now feels too real", score: 1 },{ text: "I don't think in those terms much", score: 1 }]},
    ],
    bands: [
      { range: [5,9],   title: "The Stranger Within", color: "#C94F4F", desc: "You haven't spent much time with yourself yet. The person you know best might be the surface version.", action: "Spend 10 minutes a day in silence. Not meditation — just sitting with yourself." },
      { range: [10,14], title: "The Occasional Mirror", color: "#D4872A", desc: "You look inward sometimes, but usually when life forces you to. Self-awareness is a skill you're beginning to build.", action: "Pick one behavior this week that you know isn't serving you. Just watch it — don't fix it yet." },
      { range: [15,17], title: "The Honest Witness", color: "#3A78C9", desc: "You have real self-knowledge. You can name your patterns, your triggers, your contradictions. Most people never get here.", action: "Write down three things you know about yourself that you haven't fully acted on yet." },
      { range: [18,20], title: "The Clear-Eyed One", color: "#3A9E6A", desc: "Rare. You know yourself with unusual depth — the gifts, the damage, the gaps. That clarity is a foundation, not a destination.", action: "Your work now is integration: living what you know, not just knowing it." },
    ],
  },
  {
    id: "q2", title: "The Connection Code", category: "REL",
    description: "Who are you really in relationships — and what patterns are running on repeat?",
    questions: [
      { id: "q2_1", question: "When a relationship (any kind) feels off, you typically…",
        options: [{ text: "Name it directly and work through it", score: 4 },{ text: "Drop hints and hope they catch on", score: 2 },{ text: "Distance yourself until it resolves or dies", score: 1 },{ text: "Internally stew but maintain the surface", score: 1 }]},
      { id: "q2_2", question: "How honest are you in your closest relationships about what you actually need?",
        options: [{ text: "Very — I ask for what I need without shame", score: 4 },{ text: "Sometimes — depends on how safe I feel", score: 3 },{ text: "Rarely — I'd rather manage alone", score: 1 },{ text: "Never — asking for things feels dangerous", score: 1 }]},
      { id: "q2_3", question: "What happens inside you when someone you love disappoints you?",
        options: [{ text: "I feel it, name it to them, and move through it", score: 4 },{ text: "I feel it but usually absorb it quietly", score: 2 },{ text: "I pull back and reassess the relationship", score: 2 },{ text: "I file it away and trust a little less", score: 1 }]},
      { id: "q2_4", question: "The boundaries you have in relationships — are they conscious choices or invisible walls?",
        options: [{ text: "Conscious — I know what I will and won't accept", score: 4 },{ text: "A mix — some thought-through, some reactive", score: 3 },{ text: "Mostly invisible walls I've never examined", score: 1 },{ text: "I don't really have clear limits — I just endure", score: 1 }]},
      { id: "q2_5", question: "The love or care you give to others — do you give it to yourself too?",
        options: [{ text: "Yes — self-compassion is real for me", score: 4 },{ text: "Working on it — easier to give than receive", score: 3 },{ text: "Rarely — I hold myself to a much harsher standard", score: 1 },{ text: "Not at all — self-care feels indulgent or fake", score: 1 }]},
    ],
    bands: [
      { range: [5,9],   title: "The Defended One", color: "#C94F4F", desc: "Walls built for protection now block connection. Your patterns in relationships are older than the people in them.", action: "Tell one person this week something real about how you're doing — not the safe answer." },
      { range: [10,14], title: "The Selective Connector", color: "#D4872A", desc: "You can connect deeply — but only when you feel safe. You're growing, but safety can become another word for control.", action: "Identify one relationship where you've been withholding. Make one move toward honesty." },
      { range: [15,17], title: "The Intentional Partner", color: "#3A78C9", desc: "You bring real presence to relationships. You communicate, you reflect, and you hold others with genuine care.", action: "Ask someone who knows you well: 'What's one thing I could do better in how I show up for you?'" },
      { range: [18,20], title: "The Open-Hearted", color: "#3A9E6A", desc: "You love and connect with unusual maturity. You know that real intimacy requires courage, and you've chosen it.", action: "Your gift now: help someone in your life feel truly seen this week." },
    ],
  },
  {
    id: "q3", title: "The Purpose Audit", category: "CAREER",
    description: "Is your work aligned with who you are — or just what happened to you?",
    questions: [
      { id: "q3_1", question: "On a typical Monday morning, the dominant feeling heading to work is…",
        options: [{ text: "Genuine energy — I care about what I'm doing", score: 4 },{ text: "Okay — it's fine, mostly", score: 2 },{ text: "A quiet dread I've learned to manage", score: 1 },{ text: "Autopilot — I stopped feeling much about it", score: 1 }]},
      { id: "q3_2", question: "Could you explain to a stranger why the work you do matters — and believe it?",
        options: [{ text: "Yes, clearly and with conviction", score: 4 },{ text: "Somewhat — I've thought about it but it's vague", score: 2 },{ text: "Not really — I do it for the income", score: 1 },{ text: "I've never thought of my work as 'mattering'", score: 1 }]},
      { id: "q3_3", question: "Your career path — was it consciously chosen, or did you drift into it?",
        options: [{ text: "Consciously chosen and continuously re-evaluated", score: 4 },{ text: "Started by drift, but I've shaped it since", score: 3 },{ text: "Mostly drift with occasional choices", score: 1 },{ text: "I'm not sure I've ever actually chosen — things just happened", score: 1 }]},
      { id: "q3_4", question: "If money were the same, would you do something radically different?",
        options: [{ text: "No — I'd choose exactly this or something very close", score: 4 },{ text: "I'd tweak it significantly but stay in the same world", score: 3 },{ text: "Yes — completely different path", score: 1 },{ text: "I don't even know what I'd want if money didn't matter", score: 2 }]},
      { id: "q3_5", question: "When you imagine your working life in 10 years — what do you feel?",
        options: [{ text: "Excited — I'm building toward something real", score: 4 },{ text: "Hopeful but uncertain", score: 3 },{ text: "Flat — I don't let myself imagine it", score: 1 },{ text: "Anxious — I'm not sure where I'm heading", score: 1 }]},
    ],
    bands: [
      { range: [5,9],   title: "The Drifter", color: "#C94F4F", desc: "Your career is something that happened to you. You've been going through motions without a compass. That can change — but only with intention.", action: "Write one sentence: 'If I wasn't afraid, I would be doing ___.' Don't edit it." },
      { range: [10,14], title: "The Pragmatist", color: "#D4872A", desc: "You're functional and probably capable — but you've traded meaning for security. The deal is familiar, but is it worth it?", action: "Spend 30 minutes this week doing something work-adjacent that you actually enjoy — even if it earns nothing." },
      { range: [15,17], title: "The Aligned Professional", color: "#3A78C9", desc: "Your work connects to who you are in meaningful ways. You've done the harder work of choosing — not just accepting.", action: "Name one area where your work could be more deeply aligned with your values. What would one step look like?" },
      { range: [18,20], title: "The Purposeful Builder", color: "#3A9E6A", desc: "You've found — or built — work that feels like yours. That's genuinely rare. Guard it, deepen it, share it.", action: "Who in your circle is still drifting? Offer them one honest conversation about what purpose has meant for you." },
    ],
  },
  {
    id: "q4", title: "The Inner Weather", category: "MENTAL",
    description: "How are you really doing — below the surface of 'I'm fine'?",
    questions: [
      { id: "q4_1", question: "Your baseline emotional state most days is honestly…",
        options: [{ text: "Generally stable with normal ups and downs", score: 4 },{ text: "Okay on the surface, more turbulent underneath", score: 2 },{ text: "Carrying a low-level heaviness most of the time", score: 1 },{ text: "I've stopped checking — it's easier not to know", score: 1 }]},
      { id: "q4_2", question: "When something emotionally hard happens, your body and mind typically need…",
        options: [{ text: "Time I actually give myself — I rest and process", score: 4 },{ text: "Time I don't usually give — I push through", score: 2 },{ text: "Distraction — I avoid stillness when things hurt", score: 1 },{ text: "Nothing — I don't really acknowledge it and it passes", score: 1 }]},
      { id: "q4_3", question: "The way you talk to yourself when you struggle — would you speak that way to someone you love?",
        options: [{ text: "Yes — I'm relatively kind to myself", score: 4 },{ text: "Somewhat — I'm working on being less harsh", score: 3 },{ text: "No — I'm significantly harder on myself than others", score: 1 },{ text: "No — and I think I deserve to be", score: 1 }]},
      { id: "q4_4", question: "Do you have at least one person in your life you can be completely honest with about your mental state?",
        options: [{ text: "Yes — and I actually use that relationship", score: 4 },{ text: "Yes, but I protect them from the real depth", score: 2 },{ text: "Sort of — but not really completely honest", score: 2 },{ text: "No — I carry it alone", score: 1 }]},
      { id: "q4_5", question: "Your coping mechanisms — are they building you up or holding you steady while you decay?",
        options: [{ text: "Building me — my habits genuinely support my health", score: 4 },{ text: "Mostly holding steady — functional but not growing", score: 3 },{ text: "Some are helpful, some are avoidance in disguise", score: 2 },{ text: "Mostly avoidance — I know it, I haven't changed it", score: 1 }]},
    ],
    bands: [
      { range: [5,9],   title: "The Carrying One", color: "#C94F4F", desc: "You're holding more than you're letting anyone see. That weight is real and it's been real for a while. You don't have to carry it alone.", action: "Tell one person — just one — that you're not doing as well as you seem. That's the first step." },
      { range: [10,14], title: "The Functional Sufferer", color: "#D4872A", desc: "From the outside, everything looks fine. Inside, there's a quiet heaviness you've learned to work around. That's not wellness — that's endurance.", action: "Identify one coping behavior you use that you know isn't actually helping. Just name it honestly." },
      { range: [15,17], title: "The Tending One", color: "#3A78C9", desc: "You're doing real work on your inner life. You're not just surviving — you're paying attention. That makes a difference.", action: "Add one small restorative practice to your week — something that costs nothing but gives you back to yourself." },
      { range: [18,20], title: "The Grounded One", color: "#3A9E6A", desc: "You have a genuine, sustainable relationship with your inner world. You're not perfect — you're present. That's rarer than it sounds.", action: "Consider becoming a resource for someone who's struggling. You have something real to offer." },
    ],
  },
];

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
async function store(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch(e) {}
}
async function load(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function LifeApp() {
  const [page, setPage] = useState("dashboard");
  const [quizzes, setQuizzes] = useState([]);
  const [journal, setJournal] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [navOpen, setNavOpen] = useState(true);

  useEffect(() => {
    (async () => {
      const q = await load("life_quizzes", null);
      const j = await load("life_journal", []);
      const h = await load("life_history", []);
      if (!q) {
        await store("life_quizzes", SEED_QUIZZES);
        setQuizzes(SEED_QUIZZES);
      } else setQuizzes(q);
      setJournal(j);
      setHistory(h);
      setLoading(false);
    })();
  }, []);

  const saveQuizzes = async (q) => { setQuizzes(q); await store("life_quizzes", q); };
  const saveJournal = async (j) => { setJournal(j); await store("life_journal", j); };
  const saveHistory = async (h) => { setHistory(h); await store("life_history", h); };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F2", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"32px", marginBottom:"12px" }}>◈</div>
        <div style={{ fontFamily:"Georgia,serif", color:"#8B7355", fontSize:"14px", letterSpacing:"2px" }}>LOADING YOUR SPACE...</div>
      </div>
    </div>
  );

  if (activeQuiz) return (
    <QuizFlow quiz={activeQuiz} onDone={async (result) => {
      const h = [result, ...history];
      await saveHistory(h);
      setActiveQuiz(null);
      setPage("progress");
    }} onBack={() => setActiveQuiz(null)} />
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#FAF7F2", fontFamily:"'Georgia', serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        * { box-sizing: border-box; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#F0EBE3} ::-webkit-scrollbar-thumb{background:#C4B49A;border-radius:2px}
        .nav-item:hover{background:rgba(212,135,42,0.08)!important;color:#1A1208!important}
        .card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.1)!important}
        .btn-primary:hover{background:#B86F1A!important}
        .btn-ghost:hover{background:rgba(212,135,42,0.1)!important}
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: navOpen ? "220px" : "60px", background:"#1C1208", flexShrink:0, display:"flex", flexDirection:"column", transition:"width 0.3s ease", overflow:"hidden", position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding: navOpen ? "24px 20px 20px" : "24px 0 20px", textAlign: navOpen ? "left" : "center", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:"8px" }}>
          <div style={{ fontSize: navOpen ? "20px" : "22px", color:"#D4872A", fontWeight:"bold", letterSpacing: navOpen ? "-0.5px" : "0", whiteSpace:"nowrap" }}>
            {navOpen ? "◈ LifeAudit" : "◈"}
          </div>
          {navOpen && <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", letterSpacing:"2px", marginTop:"4px" }}>YOUR INNER SPACE</div>}
        </div>

        <nav style={{ flex:1, padding:"8px 8px" }}>
          {[
            { id:"dashboard", icon:"▦", label:"Dashboard" },
            { id:"quizzes",   icon:"◇", label:"Quizzes" },
            { id:"journal",   icon:"▭", label:"Journal" },
            { id:"progress",  icon:"◌", label:"Progress" },
            { id:"admin",     icon:"⊕", label:"Admin" },
          ].map(n => (
            <button key={n.id} className="nav-item" onClick={() => setPage(n.id)} style={{
              display:"flex", alignItems:"center", gap:"12px", width:"100%", padding: navOpen ? "10px 12px" : "10px 0", justifyContent: navOpen ? "flex-start" : "center",
              background: page===n.id ? "rgba(212,135,42,0.15)" : "transparent",
              border: page===n.id ? "1px solid rgba(212,135,42,0.3)" : "1px solid transparent",
              borderRadius:"8px", color: page===n.id ? "#D4872A" : "rgba(255,255,255,0.45)",
              fontSize:"13px", cursor:"pointer", transition:"all 0.2s", marginBottom:"2px",
              whiteSpace:"nowrap",
            }}>
              <span style={{ fontSize:"15px", flexShrink:0 }}>{n.icon}</span>
              {navOpen && <span>{n.label}</span>}
            </button>
          ))}
        </nav>

        <button onClick={() => setNavOpen(v=>!v)} style={{ padding:"16px", background:"transparent", border:"none", color:"rgba(255,255,255,0.25)", cursor:"pointer", fontSize:"16px", transition:"color 0.2s" }}
          onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.6)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.25)"}>
          {navOpen ? "◀" : "▶"}
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflowY:"auto", minWidth:0 }}>
        {page === "dashboard" && <Dashboard quizzes={quizzes} journal={journal} history={history} onStartQuiz={setActiveQuiz} onNavigate={setPage} />}
        {page === "quizzes"   && <QuizzesPage quizzes={quizzes} history={history} onStart={setActiveQuiz} />}
        {page === "journal"   && <JournalPage journal={journal} onSave={saveJournal} />}
        {page === "progress"  && <ProgressPage history={history} />}
        {page === "admin"     && <AdminPage quizzes={quizzes} onSave={saveQuizzes} />}
      </main>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ quizzes, journal, history, onStartQuiz, onNavigate }) {
  const recent = history.slice(0, 3);
  const cats = Object.keys(CATS);
  const catScores = cats.map(c => {
    const entries = history.filter(h => h.category === c);
    if (!entries.length) return { cat: c, avg: 0, count: 0 };
    const avg = entries.reduce((a, e) => a + (e.score / e.maxScore) * 100, 0) / entries.length;
    return { cat: c, avg: Math.round(avg), count: entries.length };
  });

  return (
    <div style={{ padding:"40px", animation:"fadeUp 0.4s ease" }}>
      <div style={{ marginBottom:"36px" }}>
        <h1 style={{ fontSize:"32px", color:"#1C1208", margin:"0 0 6px", fontWeight:"normal" }}>Good to see you.</h1>
        <p style={{ color:"#8B7355", margin:0, fontSize:"15px" }}>
          {history.length === 0 ? "Your journey starts here. Take your first quiz." : `${history.length} quiz${history.length>1?"zes":""} completed · ${journal.length} journal entr${journal.length===1?"y":"ies"}`}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"16px", marginBottom:"36px" }}>
        {[
          { label:"Quizzes Taken", value:history.length, icon:"◇", color:"#D4872A" },
          { label:"Journal Entries", value:journal.length, icon:"▭", color:"#C94F4F" },
          { label:"Topics Explored", value:new Set(history.map(h=>h.category)).size, icon:"◈", color:"#3A78C9" },
          { label:"Available Quizzes", value:quizzes.length, icon:"◉", color:"#3A9E6A" },
        ].map(s => (
          <div key={s.label} className="card-hover" style={{ background:"#fff", borderRadius:"12px", padding:"20px", border:"1px solid #EDE8E0", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:"22px", marginBottom:"10px", color:s.color }}>{s.icon}</div>
            <div style={{ fontSize:"28px", fontWeight:"bold", color:"#1C1208", marginBottom:"4px" }}>{s.value}</div>
            <div style={{ fontSize:"11px", color:"#A09070", letterSpacing:"1px" }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px", marginBottom:"32px" }}>
        {/* Category overview */}
        <div style={{ background:"#fff", borderRadius:"12px", padding:"24px", border:"1px solid #EDE8E0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin:"0 0 20px", fontSize:"14px", color:"#1C1208", letterSpacing:"1px" }}>CATEGORY OVERVIEW</h3>
          {catScores.map(({ cat, avg, count }) => (
            <div key={cat} style={{ marginBottom:"14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                <span style={{ fontSize:"12px", color:"#5A4A30" }}>{CATS[cat].icon} {CATS[cat].label}</span>
                <span style={{ fontSize:"11px", color:"#A09070" }}>{count > 0 ? `${avg}%` : "Not started"}</span>
              </div>
              <div style={{ height:"5px", background:"#F0EBE3", borderRadius:"3px" }}>
                <div style={{ width:`${avg}%`, height:"100%", background:CATS[cat].color, borderRadius:"3px", transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div style={{ background:"#fff", borderRadius:"12px", padding:"24px", border:"1px solid #EDE8E0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin:"0 0 20px", fontSize:"14px", color:"#1C1208", letterSpacing:"1px" }}>RECENT ACTIVITY</h3>
          {recent.length === 0 ? (
            <div style={{ color:"#C4B49A", fontSize:"13px", textAlign:"center", padding:"24px 0" }}>No activity yet.<br/>Take your first quiz!</div>
          ) : recent.map(r => (
            <div key={r.id} style={{ display:"flex", gap:"12px", alignItems:"flex-start", marginBottom:"14px", paddingBottom:"14px", borderBottom:"1px solid #F5F0EA" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:CATS[r.category]?.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0, color:CATS[r.category]?.color }}>{CATS[r.category]?.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"13px", color:"#1C1208", marginBottom:"2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.quizTitle}</div>
                <div style={{ fontSize:"11px", color:"#A09070" }}>{r.resultTitle} · {Math.round((r.score/r.maxScore)*100)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick-start quizzes */}
      <div style={{ background:"#fff", borderRadius:"12px", padding:"24px", border:"1px solid #EDE8E0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <h3 style={{ margin:0, fontSize:"14px", color:"#1C1208", letterSpacing:"1px" }}>START A QUIZ</h3>
          <button className="btn-ghost" onClick={()=>onNavigate("quizzes")} style={{ fontSize:"12px", color:"#D4872A", background:"transparent", border:"none", cursor:"pointer", letterSpacing:"1px", padding:"4px 8px", borderRadius:"6px" }}>VIEW ALL →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"12px" }}>
          {quizzes.slice(0,4).map(q => (
            <button key={q.id} className="card-hover" onClick={()=>onStartQuiz(q)} style={{
              background:CATS[q.category]?.bg, border:`1px solid ${CATS[q.category]?.color}30`,
              borderRadius:"10px", padding:"16px", textAlign:"left", cursor:"pointer", transition:"all 0.2s",
              boxShadow:"0 2px 6px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize:"18px", marginBottom:"8px", color:CATS[q.category]?.color }}>{CATS[q.category]?.icon}</div>
              <div style={{ fontSize:"13px", fontWeight:"bold", color:"#1C1208", marginBottom:"4px" }}>{q.title}</div>
              <div style={{ fontSize:"11px", color:"#8B7355" }}>{q.questions.length} questions</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QUIZZES PAGE ─────────────────────────────────────────────────────────────
function QuizzesPage({ quizzes, history, onStart }) {
  const [filter, setFilter] = useState("ALL");
  const cats = ["ALL", ...Object.keys(CATS)];
  const filtered = filter === "ALL" ? quizzes : quizzes.filter(q => q.category === filter);
  const takenIds = new Set(history.map(h => h.quizId));

  return (
    <div style={{ padding:"40px", animation:"fadeUp 0.4s ease" }}>
      <h1 style={{ fontSize:"28px", color:"#1C1208", margin:"0 0 6px", fontWeight:"normal" }}>Quizzes</h1>
      <p style={{ color:"#8B7355", margin:"0 0 28px", fontSize:"14px" }}>Each quiz is a mirror. Answer honestly.</p>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"28px", flexWrap:"wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={()=>setFilter(c)} style={{
            padding:"7px 16px", borderRadius:"20px", fontSize:"12px", cursor:"pointer", transition:"all 0.2s", letterSpacing:"1px",
            background: filter===c ? (c==="ALL" ? "#1C1208" : CATS[c]?.color) : "transparent",
            color: filter===c ? "#fff" : "#8B7355",
            border: filter===c ? "none" : "1px solid #DDD5C8",
          }}>
            {c === "ALL" ? "ALL" : `${CATS[c].icon} ${CATS[c].label.toUpperCase()}`}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"20px" }}>
        {filtered.map(q => {
          const taken = takenIds.has(q.id);
          const catH = history.filter(h => h.quizId === q.id);
          const lastScore = catH[0] ? Math.round((catH[0].score/catH[0].maxScore)*100) : null;
          return (
            <div key={q.id} className="card-hover" style={{ background:"#fff", borderRadius:"14px", border:"1px solid #EDE8E0", overflow:"hidden", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ height:"5px", background:CATS[q.category]?.color }} />
              <div style={{ padding:"22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                  <span style={{ fontSize:"22px", color:CATS[q.category]?.color }}>{CATS[q.category]?.icon}</span>
                  {taken && <span style={{ fontSize:"10px", color:"#3A9E6A", background:"#EDF7F3", padding:"3px 8px", borderRadius:"10px", letterSpacing:"1px" }}>TAKEN {lastScore}%</span>}
                </div>
                <h3 style={{ margin:"0 0 6px", fontSize:"17px", color:"#1C1208", fontWeight:"normal" }}>{q.title}</h3>
                <p style={{ margin:"0 0 16px", fontSize:"13px", color:"#8B7355", lineHeight:1.6 }}>{q.description}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"11px", color:"#C4B49A", letterSpacing:"1px" }}>{q.questions.length} QUESTIONS</span>
                  <button className="btn-primary" onClick={()=>onStart(q)} style={{
                    background:"#D4872A", color:"#fff", border:"none", borderRadius:"8px",
                    padding:"8px 18px", fontSize:"12px", cursor:"pointer", transition:"background 0.2s", letterSpacing:"0.5px",
                  }}>
                    {taken ? "RETAKE →" : "BEGIN →"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── QUIZ FLOW ────────────────────────────────────────────────────────────────
function QuizFlow({ quiz, onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const [fade, setFade] = useState(true);
  const cat = CATS[quiz.category];
  const q = quiz.questions[step];
  const progress = (step / quiz.questions.length) * 100;

  const next = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (step + 1 < quiz.questions.length) {
      setFade(false);
      setTimeout(() => { setAnswers(newAnswers); setSelected(null); setStep(s=>s+1); setFade(true); }, 280);
    } else {
      const total = newAnswers.reduce((a,b) => a+b, 0);
      const band = quiz.bands.find(b => total >= b.range[0] && total <= b.range[1]) || quiz.bands[0];
      const r = { id: Date.now()+"", quizId: quiz.id, quizTitle: quiz.title, category: quiz.category, score: total, maxScore: quiz.questions.length * 4, resultTitle: band.title, band, completedAt: new Date().toISOString() };
      setResult(r);
      setDone(true);
    }
  };

  if (done && result) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F2", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fadeUp 0.5s ease" }}>
      <div style={{ maxWidth:"580px", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:result.band.color+"20", border:`2px solid ${result.band.color}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:"24px", color:result.band.color }}>{cat.icon}</div>
          <div style={{ fontSize:"11px", color:cat.color, letterSpacing:"3px", marginBottom:"8px" }}>{cat.label.toUpperCase()} · {Math.round((result.score/result.maxScore)*100)}%</div>
          <h1 style={{ fontSize:"34px", color:"#1C1208", margin:"0 0 10px", fontWeight:"normal" }}>{result.band.title}</h1>
          <div style={{ height:"4px", width:"60px", background:result.band.color, borderRadius:"2px", margin:"0 auto 20px" }} />
          <p style={{ color:"#5A4A30", fontSize:"15px", lineHeight:1.8, margin:"0 0 28px" }}>{result.band.desc}</p>
        </div>

        <div style={{ background:"#fff", borderRadius:"12px", padding:"22px", border:`1px solid ${result.band.color}30`, marginBottom:"20px" }}>
          <div style={{ fontSize:"10px", color:result.band.color, letterSpacing:"3px", marginBottom:"10px" }}>YOUR ONE MOVE</div>
          <p style={{ color:"#1C1208", fontSize:"14px", lineHeight:1.7, margin:0 }}>{result.band.action}</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
          <button onClick={onBack} className="btn-ghost" style={{ padding:"13px", border:"1px solid #DDD5C8", borderRadius:"10px", background:"transparent", cursor:"pointer", color:"#8B7355", fontSize:"13px", transition:"all 0.2s" }}>← Back</button>
          <button onClick={()=>onDone(result)} className="btn-primary" style={{ padding:"13px", border:"none", borderRadius:"10px", background:"#D4872A", cursor:"pointer", color:"#fff", fontSize:"13px", transition:"all 0.2s" }}>Save & View Progress →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F2", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"Georgia,serif" }}>
      <div style={{ maxWidth:"600px", width:"100%", opacity:fade?1:0, transition:"opacity 0.28s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <button onClick={onBack} style={{ background:"transparent", border:"none", color:"#C4B49A", cursor:"pointer", fontSize:"13px" }}>← Exit</button>
          <span style={{ fontSize:"11px", color:"#C4B49A", letterSpacing:"2px" }}>{step+1}/{quiz.questions.length}</span>
        </div>
        <div style={{ height:"3px", background:"#EDE8E0", borderRadius:"2px", marginBottom:"36px" }}>
          <div style={{ width:`${progress}%`, height:"100%", background:cat.color, borderRadius:"2px", transition:"width 0.5s ease" }} />
        </div>

        <div style={{ marginBottom:"8px", fontSize:"11px", color:cat.color, letterSpacing:"3px" }}>{cat.label.toUpperCase()}</div>
        <h2 style={{ fontSize:"22px", color:"#1C1208", fontWeight:"normal", lineHeight:1.5, marginBottom:"32px" }}>{q.question}</h2>

        <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"32px" }}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={()=>setSelected(opt.score)} style={{
              background: selected===opt.score ? cat.bg : "#fff",
              border: selected===opt.score ? `1px solid ${cat.color}60` : "1px solid #EDE8E0",
              borderRadius:"10px", padding:"15px 18px", textAlign:"left", cursor:"pointer",
              color: selected===opt.score ? "#1C1208" : "#5A4A30",
              fontSize:"14px", lineHeight:1.55, transition:"all 0.18s",
              transform: selected===opt.score ? "translateX(6px)" : "none",
              borderLeft: selected===opt.score ? `3px solid ${cat.color}` : "1px solid #EDE8E0",
            }}>
              <span style={{ color: selected===opt.score ? cat.color : "#C4B49A", marginRight:"10px", fontSize:"12px" }}>{String.fromCharCode(65+i)}.</span>
              {opt.text}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <button onClick={next} disabled={selected===null} className="btn-primary" style={{
            background: selected!==null ? cat.color : "#EDE8E0",
            color: selected!==null ? "#fff" : "#C4B49A",
            border:"none", borderRadius:"10px", padding:"13px 32px", fontSize:"13px",
            cursor: selected!==null ? "pointer" : "not-allowed", transition:"all 0.2s", letterSpacing:"1px",
          }}>
            {step+1===quiz.questions.length ? "FINISH" : "NEXT →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── JOURNAL PAGE ─────────────────────────────────────────────────────────────
function JournalPage({ journal, onSave }) {
  const [modal, setModal] = useState(false);
  const [entry, setEntry] = useState({ title:"", content:"", mood:MOODS[0], category:"SELF" });
  const [view, setView] = useState(null);

  const save = async () => {
    if (!entry.content.trim()) return;
    const newEntry = { ...entry, id: Date.now()+"", createdAt: new Date().toISOString() };
    await onSave([newEntry, ...journal]);
    setEntry({ title:"", content:"", mood:MOODS[0], category:"SELF" });
    setModal(false);
  };

  return (
    <div style={{ padding:"40px", animation:"fadeUp 0.4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"28px" }}>
        <div>
          <h1 style={{ fontSize:"28px", color:"#1C1208", margin:"0 0 6px", fontWeight:"normal" }}>Journal</h1>
          <p style={{ color:"#8B7355", margin:0, fontSize:"14px" }}>Reflection is the beginning of change.</p>
        </div>
        <button className="btn-primary" onClick={()=>setModal(true)} style={{ background:"#D4872A", color:"#fff", border:"none", borderRadius:"10px", padding:"11px 22px", fontSize:"13px", cursor:"pointer", transition:"all 0.2s" }}>
          + New Entry
        </button>
      </div>

      {journal.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 20px", color:"#C4B49A" }}>
          <div style={{ fontSize:"36px", marginBottom:"12px" }}>▭</div>
          <div style={{ fontSize:"15px", marginBottom:"8px", color:"#8B7355" }}>Your journal is empty.</div>
          <div style={{ fontSize:"13px" }}>Write your first reflection.</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"16px" }}>
          {journal.map(j => (
            <div key={j.id} className="card-hover" onClick={()=>setView(j)} style={{ background:"#fff", borderRadius:"12px", border:"1px solid #EDE8E0", padding:"20px", cursor:"pointer", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", borderTop:`3px solid ${CATS[j.category]?.color || "#D4872A"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px" }}>
                <span style={{ fontSize:"18px" }}>{j.mood.split(" ")[0]}</span>
                <span style={{ fontSize:"10px", color:"#C4B49A", letterSpacing:"1px" }}>{new Date(j.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 style={{ margin:"0 0 8px", fontSize:"15px", color:"#1C1208", fontWeight:"normal" }}>{j.title || "Untitled"}</h3>
              <p style={{ margin:0, fontSize:"12px", color:"#8B7355", lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{j.content}</p>
              <div style={{ marginTop:"12px", fontSize:"10px", color:CATS[j.category]?.color, letterSpacing:"1px" }}>{CATS[j.category]?.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Write modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"20px" }}>
          <div style={{ background:"#FAF7F2", borderRadius:"16px", padding:"32px", maxWidth:"560px", width:"100%", maxHeight:"90vh", overflowY:"auto", animation:"fadeUp 0.3s ease" }}>
            <h2 style={{ margin:"0 0 24px", fontSize:"20px", color:"#1C1208", fontWeight:"normal" }}>New Journal Entry</h2>

            <input value={entry.title} onChange={e=>setEntry(v=>({...v,title:e.target.value}))} placeholder="Title (optional)"
              style={{ width:"100%", padding:"12px", border:"1px solid #DDD5C8", borderRadius:"8px", fontSize:"14px", background:"#fff", color:"#1C1208", outline:"none", marginBottom:"12px", fontFamily:"Georgia,serif" }} />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
              <select value={entry.mood} onChange={e=>setEntry(v=>({...v,mood:e.target.value}))}
                style={{ padding:"10px", border:"1px solid #DDD5C8", borderRadius:"8px", fontSize:"13px", background:"#fff", color:"#1C1208", cursor:"pointer" }}>
                {MOODS.map(m=><option key={m}>{m}</option>)}
              </select>
              <select value={entry.category} onChange={e=>setEntry(v=>({...v,category:e.target.value}))}
                style={{ padding:"10px", border:"1px solid #DDD5C8", borderRadius:"8px", fontSize:"13px", background:"#fff", color:"#1C1208", cursor:"pointer" }}>
                {Object.entries(CATS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>

            <textarea value={entry.content} onChange={e=>setEntry(v=>({...v,content:e.target.value}))} placeholder="Write freely. No one is watching."
              style={{ width:"100%", minHeight:"180px", padding:"14px", border:"1px solid #DDD5C8", borderRadius:"8px", fontSize:"14px", background:"#fff", color:"#1C1208", outline:"none", resize:"vertical", lineHeight:1.7, fontFamily:"Georgia,serif", marginBottom:"20px" }} />

            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={()=>setModal(false)} className="btn-ghost" style={{ flex:1, padding:"12px", border:"1px solid #DDD5C8", borderRadius:"10px", background:"transparent", cursor:"pointer", color:"#8B7355", fontSize:"13px" }}>Cancel</button>
              <button onClick={save} className="btn-primary" style={{ flex:2, padding:"12px", border:"none", borderRadius:"10px", background:"#D4872A", cursor:"pointer", color:"#fff", fontSize:"13px" }}>Save Entry</button>
            </div>
          </div>
        </div>
      )}

      {/* View entry modal */}
      {view && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"20px" }} onClick={()=>setView(null)}>
          <div style={{ background:"#FAF7F2", borderRadius:"16px", padding:"32px", maxWidth:"560px", width:"100%", maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <span style={{ fontSize:"10px", color:CATS[view.category]?.color, letterSpacing:"2px" }}>{CATS[view.category]?.label.toUpperCase()}</span>
              <span style={{ fontSize:"11px", color:"#C4B49A" }}>{new Date(view.createdAt).toLocaleDateString()} · {view.mood}</span>
            </div>
            <h2 style={{ margin:"0 0 20px", fontWeight:"normal", color:"#1C1208", fontSize:"22px" }}>{view.title || "Untitled"}</h2>
            <p style={{ color:"#5A4A30", lineHeight:1.9, fontSize:"15px", whiteSpace:"pre-wrap" }}>{view.content}</p>
            <button onClick={()=>setView(null)} style={{ marginTop:"24px", background:"transparent", border:"1px solid #DDD5C8", borderRadius:"8px", padding:"10px 20px", cursor:"pointer", color:"#8B7355", fontSize:"13px" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
function ProgressPage({ history }) {
  const chartData = history.slice().reverse().map((h, i) => ({
    name: `#${i+1}`, score: Math.round((h.score/h.maxScore)*100), quiz: h.quizTitle, cat: h.category,
  }));

  const catData = Object.keys(CATS).map(c => {
    const entries = history.filter(h=>h.category===c);
    return { name: CATS[c].icon+" "+CATS[c].label.split(" ")[0], avg: entries.length ? Math.round(entries.reduce((a,e)=>a+(e.score/e.maxScore)*100,0)/entries.length) : 0, count: entries.length, color: CATS[c].color };
  });

  return (
    <div style={{ padding:"40px", animation:"fadeUp 0.4s ease" }}>
      <h1 style={{ fontSize:"28px", color:"#1C1208", margin:"0 0 6px", fontWeight:"normal" }}>Progress</h1>
      <p style={{ color:"#8B7355", margin:"0 0 32px", fontSize:"14px" }}>Your journey mapped over time.</p>

      {history.length < 2 ? (
        <div style={{ textAlign:"center", padding:"80px 20px", background:"#fff", borderRadius:"16px", border:"1px solid #EDE8E0" }}>
          <div style={{ fontSize:"36px", marginBottom:"12px" }}>◌</div>
          <div style={{ fontSize:"15px", color:"#8B7355" }}>Complete at least 2 quizzes to see your progress chart.</div>
        </div>
      ) : (
        <>
          <div style={{ background:"#fff", borderRadius:"14px", padding:"28px", border:"1px solid #EDE8E0", marginBottom:"24px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin:"0 0 20px", fontSize:"13px", color:"#1C1208", letterSpacing:"1px" }}>SCORE OVER TIME</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{top:5,right:10,bottom:5,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#C4B49A"}} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{fontSize:11,fill:"#C4B49A"}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #EDE8E0",borderRadius:"8px",fontSize:"12px"}} formatter={(v,n,p)=>[`${v}% · ${p.payload.quiz}`,""]} />
                <Line type="monotone" dataKey="score" stroke="#D4872A" strokeWidth={2.5} dot={{r:4,fill:"#D4872A",strokeWidth:0}} activeDot={{r:6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:"#fff", borderRadius:"14px", padding:"28px", border:"1px solid #EDE8E0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin:"0 0 20px", fontSize:"13px", color:"#1C1208", letterSpacing:"1px" }}>AVERAGE BY CATEGORY</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catData} margin={{top:5,right:10,bottom:5,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#8B7355"}} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{fontSize:11,fill:"#C4B49A"}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #EDE8E0",borderRadius:"8px",fontSize:"12px"}} formatter={v=>[`${v}% avg`,""]} />
                <Bar dataKey="avg" radius={[6,6,0,0]}>
                  {catData.map((entry,i) => <rect key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* History list */}
          <div style={{ background:"#fff", borderRadius:"14px", padding:"28px", border:"1px solid #EDE8E0", marginTop:"24px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin:"0 0 20px", fontSize:"13px", color:"#1C1208", letterSpacing:"1px" }}>FULL HISTORY</h3>
            {history.map((h, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"12px 0", borderBottom:"1px solid #F5F0EA" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"8px", background:CATS[h.category]?.bg, display:"flex", alignItems:"center", justifyContent:"center", color:CATS[h.category]?.color, fontSize:"16px", flexShrink:0 }}>{CATS[h.category]?.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"14px", color:"#1C1208" }}>{h.quizTitle}</div>
                  <div style={{ fontSize:"11px", color:"#A09070", marginTop:"2px" }}>{h.resultTitle} · {new Date(h.completedAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"18px", fontWeight:"bold", color:CATS[h.category]?.color }}>{Math.round((h.score/h.maxScore)*100)}%</div>
                  <div style={{ fontSize:"10px", color:"#C4B49A" }}>{h.score}/{h.maxScore}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ quizzes, onSave }) {
  const [view, setView] = useState("list"); // list | create | edit
  const [editing, setEditing] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ title:"", category:"SELF", description:"", questions:[], bands:[] });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCat, setAiCat] = useState("SELF");
  const [msg, setMsg] = useState("");

  const deleteQuiz = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    await onSave(quizzes.filter(q=>q.id!==id));
    setMsg("Quiz deleted.");
    setTimeout(()=>setMsg(""),2000);
  };

  const generateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{
            role:"user",
            content:`Create a 5-question life quiz about: "${aiTopic}" for the category: ${CATS[aiCat].label}.
Return ONLY valid JSON, no markdown, no extra text. Format:
{
  "title": "short quiz title",
  "description": "one sentence quiz description",
  "questions": [
    {
      "id": "gen_1",
      "question": "question text",
      "options": [
        {"text":"answer text","score":4},
        {"text":"answer text","score":3},
        {"text":"answer text","score":2},
        {"text":"answer text","score":1}
      ]
    }
  ],
  "bands": [
    {"range":[5,9],"title":"result title","color":"#C94F4F","desc":"2 sentence description","action":"specific one-move action step"},
    {"range":[10,14],"title":"result title","color":"#D4872A","desc":"description","action":"action step"},
    {"range":[15,17],"title":"result title","color":"#3A78C9","desc":"description","action":"action step"},
    {"range":[18,20],"title":"result title","color":"#3A9E6A","desc":"description","action":"action step"}
  ]
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const quiz = { ...parsed, id:"gen_"+Date.now(), category:aiCat };
      await onSave([...quizzes, quiz]);
      setMsg(`✓ "${parsed.title}" added!`);
      setAiTopic("");
      setTimeout(()=>setMsg(""),3000);
    } catch(e) {
      setMsg("Error generating quiz. Try again.");
      setTimeout(()=>setMsg(""),3000);
    }
    setAiLoading(false);
  };

  return (
    <div style={{ padding:"40px", animation:"fadeUp 0.4s ease" }}>
      <h1 style={{ fontSize:"28px", color:"#1C1208", margin:"0 0 6px", fontWeight:"normal" }}>Admin Panel</h1>
      <p style={{ color:"#8B7355", margin:"0 0 32px", fontSize:"14px" }}>Manage quizzes. Add new content anytime.</p>

      {msg && <div style={{ background:"#EDF7F3", border:"1px solid #3A9E6A40", borderRadius:"8px", padding:"12px 16px", marginBottom:"20px", fontSize:"13px", color:"#3A9E6A" }}>{msg}</div>}

      {/* AI Generator */}
      <div style={{ background:"#fff", borderRadius:"14px", padding:"28px", border:"1px solid #EDE8E0", marginBottom:"28px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
          <span style={{ fontSize:"20px" }}>✦</span>
          <h3 style={{ margin:0, fontSize:"15px", color:"#1C1208" }}>Generate Quiz with AI</h3>
          <span style={{ fontSize:"10px", color:"#D4872A", background:"#FDF3E7", padding:"2px 8px", borderRadius:"10px", letterSpacing:"1px" }}>POWERED BY CLAUDE</span>
        </div>
        <p style={{ color:"#8B7355", fontSize:"13px", margin:"0 0 18px" }}>Describe a topic and Claude will generate a full 5-question quiz with result bands — instantly.</p>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder='e.g. "fear of commitment" or "work-life balance"'
            style={{ flex:"1 1 240px", padding:"11px 14px", border:"1px solid #DDD5C8", borderRadius:"8px", fontSize:"13px", color:"#1C1208", outline:"none", background:"#FAF7F2", fontFamily:"Georgia,serif" }}
            onKeyDown={e=>e.key==="Enter"&&generateWithAI()} />
          <select value={aiCat} onChange={e=>setAiCat(e.target.value)}
            style={{ padding:"11px 14px", border:"1px solid #DDD5C8", borderRadius:"8px", fontSize:"13px", background:"#FAF7F2", color:"#1C1208", cursor:"pointer" }}>
            {Object.entries(CATS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <button onClick={generateWithAI} disabled={aiLoading||!aiTopic.trim()} className="btn-primary" style={{
            background: (!aiLoading&&aiTopic.trim()) ? "#D4872A" : "#EDE8E0",
            color: (!aiLoading&&aiTopic.trim()) ? "#fff" : "#C4B49A",
            border:"none", borderRadius:"8px", padding:"11px 22px", fontSize:"13px",
            cursor:(!aiLoading&&aiTopic.trim())?"pointer":"not-allowed", transition:"all 0.2s", whiteSpace:"nowrap",
          }}>
            {aiLoading ? "Generating..." : "Generate Quiz →"}
          </button>
        </div>
      </div>

      {/* Quiz list */}
      <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #EDE8E0", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #F5F0EA", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ margin:0, fontSize:"13px", color:"#1C1208", letterSpacing:"1px" }}>ALL QUIZZES ({quizzes.length})</h3>
        </div>
        {quizzes.map(q => (
          <div key={q.id} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"16px 24px", borderBottom:"1px solid #F5F0EA" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"8px", background:CATS[q.category]?.bg, display:"flex", alignItems:"center", justifyContent:"center", color:CATS[q.category]?.color, fontSize:"16px", flexShrink:0 }}>{CATS[q.category]?.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"14px", color:"#1C1208" }}>{q.title}</div>
              <div style={{ fontSize:"11px", color:"#A09070", marginTop:"2px" }}>{CATS[q.category]?.label} · {q.questions.length} questions</div>
            </div>
            <button onClick={()=>deleteQuiz(q.id)} style={{ background:"transparent", border:"1px solid #FADBD8", color:"#C94F4F", borderRadius:"6px", padding:"6px 12px", fontSize:"11px", cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.target.style.background="#FCF0F0"}} onMouseLeave={e=>{e.target.style.background="transparent"}}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

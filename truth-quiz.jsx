import { useState, useEffect, useRef } from "react";

const questions = [
  // SELF-AWARENESS
  {
    id: 1,
    category: "SELF",
    label: "Self-Awareness",
    question: "When you lose an argument, what actually happens inside you?",
    options: [
      { text: "I genuinely reflect and consider they might be right", score: 4 },
      { text: "I pretend to accept it but secretly still think I'm right", score: 2 },
      { text: "I get quiet and stew about it for hours", score: 1 },
      { text: "I immediately start building a counter-argument", score: 2 },
    ],
  },
  {
    id: 2,
    category: "SELF",
    label: "Self-Awareness",
    question: "How often do you do things you actually want vs. things you do for approval?",
    options: [
      { text: "Mostly what I want — I've stopped seeking approval", score: 4 },
      { text: "A mix, but I'm aware when I'm seeking approval", score: 3 },
      { text: "More approval-seeking than I'd like to admit", score: 2 },
      { text: "Almost everything I do has an audience in my head", score: 1 },
    ],
  },
  {
    id: 3,
    category: "SELF",
    label: "Self-Awareness",
    question: "The bad thing that keeps happening to you — honestly, what causes it?",
    options: [
      { text: "Mostly my own patterns and choices — I own that", score: 4 },
      { text: "A bit of both — me and circumstances", score: 3 },
      { text: "Bad luck and other people, mostly", score: 1 },
      { text: "I haven't really thought about it that deeply", score: 2 },
    ],
  },
  {
    id: 4,
    category: "SELF",
    label: "Self-Awareness",
    question: "When someone criticizes you, your first reaction is...",
    options: [
      { text: "To genuinely ask: 'Is there truth in this?'", score: 4 },
      { text: "Defend first, reflect later — if at all", score: 2 },
      { text: "Shut down and go quiet", score: 2 },
      { text: "Question their motives for saying it", score: 1 },
    ],
  },
  {
    id: 5,
    category: "SELF",
    label: "Self-Awareness",
    question: "Your biggest flaw — can you name it in one sentence right now?",
    options: [
      { text: "Yes, easily — I've faced it and work on it constantly", score: 4 },
      { text: "I have a vague idea but it shifts depending on my mood", score: 2 },
      { text: "I know it but I'm not ready to fully face it yet", score: 2 },
      { text: "I genuinely don't think I have one glaring flaw", score: 1 },
    ],
  },

  // RELATIONSHIP HONESTY
  {
    id: 6,
    category: "REL",
    label: "Relationships",
    question: "Think of your closest relationship. What do you never say out loud?",
    options: [
      { text: "I say most hard things — discomfort doesn't stop me", score: 4 },
      { text: "A few things, but they're small and not worth it", score: 3 },
      { text: "Several things I've been holding for months or years", score: 1 },
      { text: "I swallow a lot to keep the peace", score: 1 },
    ],
  },
  {
    id: 7,
    category: "REL",
    label: "Relationships",
    question: "Have you ever stayed in a relationship (any kind) longer than you should have?",
    options: [
      { text: "No — I leave when I know it's over", score: 4 },
      { text: "Once, and I learned from it", score: 3 },
      { text: "Yes — fear of being alone kept me there", score: 1 },
      { text: "I'm probably in one of those situations right now", score: 1 },
    ],
  },
  {
    id: 8,
    category: "REL",
    label: "Relationships",
    question: "What role do you actually play in conflicts with people you love?",
    options: [
      { text: "I contribute to it — I've done real work to understand how", score: 4 },
      { text: "Sometimes I escalate but I'm working on it", score: 3 },
      { text: "Usually I'm the reasonable one, they're the problem", score: 1 },
      { text: "I avoid conflict so I don't really have a role", score: 2 },
    ],
  },
  {
    id: 9,
    category: "REL",
    label: "Relationships",
    question: "Would the people closest to you say you really listen — or just wait to talk?",
    options: [
      { text: "They'd say I genuinely listen and remember details", score: 4 },
      { text: "Mixed — depends on my mood or stress level", score: 2 },
      { text: "Honestly they'd probably say I cut them off a lot", score: 1 },
      { text: "I think I listen but I've never actually asked them", score: 2 },
    ],
  },
  {
    id: 10,
    category: "REL",
    label: "Relationships",
    question: "Who in your life deserves a real apology that you haven't given yet?",
    options: [
      { text: "No one — I deal with these things as they come", score: 4 },
      { text: "One person — and I know exactly what for", score: 3 },
      { text: "A few people, but the moment never feels right", score: 1 },
      { text: "Several — but I've buried it so deep I rarely think about it", score: 1 },
    ],
  },

  // LIFE AUDIT
  {
    id: 11,
    category: "LIFE",
    label: "Life Audit",
    question: "The life you're living right now — is it actually yours?",
    options: [
      { text: "Yes — I've consciously chosen my direction", score: 4 },
      { text: "Mostly, but some parts are for others' expectations", score: 3 },
      { text: "Honestly, no — I drifted into this without deciding", score: 1 },
      { text: "I used to know what I wanted. Now I'm not sure.", score: 2 },
    ],
  },
  {
    id: 12,
    category: "LIFE",
    label: "Life Audit",
    question: "The thing you keep saying you'll do 'when the time is right' —",
    options: [
      { text: "I've started already, even imperfectly", score: 4 },
      { text: "I have a real plan and a real deadline", score: 3 },
      { text: "It's been 'coming soon' for over a year", score: 1 },
      { text: "If I'm honest, I might never do it", score: 2 },
    ],
  },
  {
    id: 13,
    category: "LIFE",
    label: "Life Audit",
    question: "How much of your day do you spend numbing yourself vs. actually living?",
    options: [
      { text: "Very little — I'm fairly present and intentional", score: 4 },
      { text: "Some scrolling/TV but I'm aware of it", score: 3 },
      { text: "A significant chunk — more than I'm comfortable admitting", score: 1 },
      { text: "Numbing is basically my default state", score: 1 },
    ],
  },
  {
    id: 14,
    category: "LIFE",
    label: "Life Audit",
    question: "If you died tomorrow, what would you be most angry you never did?",
    options: [
      { text: "Nothing major — I'm living with intention", score: 4 },
      { text: "One big thing — and I'm actively working on it", score: 3 },
      { text: "Several things. The list is uncomfortable.", score: 1 },
      { text: "I don't let myself think about this question", score: 1 },
    ],
  },
  {
    id: 15,
    category: "LIFE",
    label: "Life Audit",
    question: "Be honest — are you growing, or are you just busy?",
    options: [
      { text: "Growing — I can point to real change in the last 12 months", score: 4 },
      { text: "Slowly growing, but not as fast as I want", score: 3 },
      { text: "Busy, mostly. Not much has actually changed.", score: 1 },
      { text: "I've been in the same place emotionally for years", score: 1 },
    ],
  },
];

const results = [
  {
    range: [15, 28],
    title: "DEEP IN THE FOG",
    subtitle: "You're not ready for the truth yet — and that itself is the truth.",
    color: "#ff3b30",
    description: "You avoid discomfort with the discipline of an Olympic athlete. Self-reflection feels threatening, so you've built walls — busyness, blame, routine — that keep real questions out. This isn't a character flaw. It's a defense mechanism that once protected you. But it's now costing you your real life.",
    self: "You mistake being busy for being self-aware. Your blind spots are running the show.",
    rel: "People around you feel things they can't say to you. That silence is a signal.",
    life: "You're waiting for a 'right time' that will never come on its own.",
    call: "Do one uncomfortable honest thing this week. Just one.",
  },
  {
    range: [29, 39],
    title: "HALF AWAKE",
    subtitle: "You know the truth. You just haven't committed to it yet.",
    color: "#ff9500",
    description: "You have moments of genuine clarity — flashes where you see yourself and your life with striking honesty. But you keep the lights on just long enough to feel good about yourself, then reach for the dimmer switch. You're not asleep. You're not fully awake. You're hovering.",
    self: "You can name your flaws in theory, but resist them in practice.",
    rel: "You're better at seeing others' patterns than your own role in things.",
    life: "You know what needs to change. The gap is courage, not knowledge.",
    call: "Stop gathering insight. Start making the decision you've been circling.",
  },
  {
    range: [40, 50],
    title: "BRUTALLY HONEST",
    subtitle: "You see clearly. Now comes the harder part — acting on it.",
    color: "#34c759",
    description: "You've done real work on yourself. You can look in the mirror without flinching, own your role in conflicts, and name what's not working in your life. That's genuinely rare. The question now isn't awareness — it's whether your actions match what you know. Knowledge without action is just sophisticated avoidance.",
    self: "Your self-awareness is real. Watch that it doesn't become a substitute for change.",
    rel: "You're honest in relationships. Make sure you're also kind — they're not the same thing.",
    life: "You know your direction. What's stopping the full leap?",
    call: "Close the gap between what you know and what you do.",
  },
  {
    range: [51, 60],
    title: "UNCOMFORTABLY REAL",
    subtitle: "You've burned the comfortable lies. Most people never get here.",
    color: "#0a84ff",
    description: "You carry a rare and heavy gift: the inability to lie to yourself for long. You've looked at the ugly parts — your patterns, your role in failures, your unlived life — and you haven't looked away. That kind of honesty is costly. It means fewer easy comforts, less self-deception, and higher standards for yourself. It's also the only real foundation for a life worth living.",
    self: "You know who you are — the good and the damage. That's power.",
    rel: "Your honesty can feel like a challenge to people still in their comfort zones.",
    life: "You're not waiting. You're building. Keep going.",
    call: "The work now is depth, not discovery. Go deeper into what you already know.",
  },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TruthQuiz() {
  const [screen, setScreen] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [categoryScores, setCategoryScores] = useState({ SELF: 0, REL: 0, LIFE: 0 });
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 60);
    return () => clearTimeout(t);
  }, [current, screen]);

  useEffect(() => {
    if (questions[current]) {
      setShuffledOpts(shuffle(questions[current].options));
    }
  }, [current]);

  // Glitch effect on intro
  useEffect(() => {
    if (screen !== "intro") return;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3500);
    return () => clearInterval(interval);
  }, [screen]);

  const handleNext = () => {
    if (selected === null) return;
    const newScores = [...scores, selected];
    setScores(newScores);

    const q = questions[current];
    const cat = q.category;
    setCategoryScores(prev => ({ ...prev, [cat]: prev[cat] + selected }));

    if (current + 1 < questions.length) {
      setSelected(null);
      setCurrent(current + 1);
    } else {
      const total = newScores.reduce((a, b) => a + b, 0);
      const res = results.find(r => total >= r.range[0] && total <= r.range[1]);
      setResult(res || results[1]);
      setScreen("result");
    }
  };

  const restart = () => {
    setCurrent(0);
    setScores([]);
    setSelected(null);
    setResult(null);
    setCategoryScores({ SELF: 0, REL: 0, LIFE: 0 });
    setScreen("intro");
  };

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const catColors = { SELF: "#ff3b30", REL: "#ff9500", LIFE: "#0a84ff" };
  const catLabels = { SELF: "SELF-AWARENESS", REL: "RELATIONSHIPS", LIFE: "LIFE AUDIT" };

  const base = {
    minHeight: "100vh",
    background: "#0c0c0c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Courier New', Courier, monospace",
    position: "relative",
    overflow: "hidden",
  };

  const scanlines = {
    position: "fixed",
    inset: 0,
    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
    pointerEvents: "none",
    zIndex: 0,
  };

  // INTRO
  if (screen === "intro") {
    return (
      <div style={base}>
        <div style={scanlines} />
        <style>{`
          @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.85} }
          @keyframes glitch {
            0%{transform:translateX(0)} 20%{transform:translateX(-3px) skewX(-1deg)} 
            40%{transform:translateX(3px) skewX(1deg)} 60%{transform:translateX(-2px)} 
            80%{transform:translateX(2px)} 100%{transform:translateX(0)}
          }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes redpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,59,48,0)} 50%{box-shadow:0 0 30px 4px rgba(255,59,48,0.15)} }
        `}</style>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "580px", width: "100%", animation: "fadeUp 0.6s ease forwards" }}>
          <div style={{ borderLeft: "3px solid #ff3b30", paddingLeft: "20px", marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", color: "#ff3b30", letterSpacing: "4px", marginBottom: "14px", animation: "flicker 4s infinite" }}>
              ⚠ UNFILTERED · NO COMFORT · NO FILTER
            </div>
            <h1 style={{
              fontSize: "clamp(36px, 8vw, 64px)",
              color: "#fff",
              margin: 0,
              lineHeight: 0.95,
              letterSpacing: "-2px",
              fontFamily: "'Georgia', serif",
              fontWeight: "bold",
              animation: glitch ? "glitch 0.12s ease" : "none",
            }}>
              THE<br />
              <span style={{ color: "#ff3b30" }}>BRUTAL</span><br />
              TRUTH
            </h1>
          </div>

          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.8, marginBottom: "36px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "36px" }}>
            15 questions. No easy options. No flattering interpretations.<br />
            This quiz will look at three things you probably avoid:<br />
            <span style={{ color: "#ff3b30" }}>who you really are</span>,{" "}
            <span style={{ color: "#ff9500" }}>how you show up to others</span>, and{" "}
            <span style={{ color: "#0a84ff" }}>whether your life is actually yours</span>.
          </p>

          <div style={{ display: "flex", gap: "16px", marginBottom: "40px", flexWrap: "wrap" }}>
            {[["SELF", "#ff3b30", "5 questions"], ["REL", "#ff9500", "5 questions"], ["LIFE", "#0a84ff", "5 questions"]].map(([k, c, sub]) => (
              <div key={k} style={{ flex: 1, minWidth: "120px", padding: "14px 16px", border: `1px solid ${c}30`, borderTop: `2px solid ${c}` }}>
                <div style={{ fontSize: "10px", color: c, letterSpacing: "3px", marginBottom: "4px" }}>{catLabels[k]}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{sub}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setScreen("quiz")}
            style={{
              background: "#ff3b30",
              color: "#fff",
              border: "none",
              padding: "16px 40px",
              fontSize: "13px",
              letterSpacing: "3px",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              fontWeight: "bold",
              transition: "all 0.2s",
              animation: "redpulse 3s infinite",
            }}
            onMouseEnter={e => { e.target.style.background = "#ff1a0a"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.background = "#ff3b30"; e.target.style.transform = "translateY(0)"; }}
          >
            I CAN HANDLE THE TRUTH →
          </button>
          <div style={{ marginTop: "16px", fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px" }}>
            ~5 min · Answer alone · No sugarcoating
          </div>
        </div>
      </div>
    );
  }

  // QUIZ
  if (screen === "quiz") {
    const catColor = catColors[q.category];
    return (
      <div style={base}>
        <div style={scanlines} />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          .opt-btn:hover { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.9) !important; }
        `}</style>
        <div style={{
          position: "relative", zIndex: 1, maxWidth: "620px", width: "100%",
          opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.35s ease",
        }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "10px", color: catColor, letterSpacing: "3px" }}>{catLabels[q.category]}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>
              {current + 1} / {questions.length}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: "2px", background: "rgba(255,255,255,0.07)", marginBottom: "40px" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: catColor, transition: "width 0.5s ease" }} />
          </div>

          {/* Question */}
          <div style={{ borderLeft: `3px solid ${catColor}`, paddingLeft: "20px", marginBottom: "36px" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px", marginBottom: "12px" }}>
              Q{String(current + 1).padStart(2, "0")}
            </div>
            <h2 style={{ fontSize: "22px", color: "#fff", fontFamily: "'Georgia', serif", fontWeight: "normal", lineHeight: 1.4, margin: 0 }}>
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
            {shuffledOpts.map((opt, i) => {
              const isSelected = selected === opt.score && shuffledOpts[shuffledOpts.findIndex(o => o.score === selected && o.text === (scores.length > current ? "" : opt.text))]?.text === opt.text;
              const isPickedText = selected !== null && shuffledOpts.findIndex(o => o.text === opt.text) === shuffledOpts.findIndex(o => o.score === selected);
              // simpler: track by index
              const sel = typeof selected === 'object' ? false : false;
              return (
                <OptionBtn
                  key={i}
                  index={i}
                  text={opt.text}
                  catColor={catColor}
                  selectedIdx={selected}
                  onSelect={() => setSelected(i)}
                />
              );
            })}
          </div>

          {/* Next */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {questions.map((_, i) => (
                <div key={i} style={{ width: i === current ? "16px" : "6px", height: "6px", background: i < current ? catColor : i === current ? "#fff" : "rgba(255,255,255,0.1)", borderRadius: "3px", transition: "all 0.3s" }} />
              ))}
            </div>
            <button
              onClick={() => {
                if (selected === null) return;
                const optScore = shuffledOpts[selected].score;
                const newScores = [...scores, optScore];
                setScores(newScores);
                if (current + 1 < questions.length) {
                  setSelected(null);
                  setCurrent(current + 1);
                } else {
                  const total = newScores.reduce((a, b) => a + b, 0);
                  const res = results.find(r => total >= r.range[0] && total <= r.range[1]);
                  setResult(res || results[1]);
                  setScreen("result");
                }
              }}
              disabled={selected === null}
              style={{
                background: selected !== null ? catColor : "transparent",
                color: selected !== null ? "#fff" : "rgba(255,255,255,0.2)",
                border: selected !== null ? "none" : "1px solid rgba(255,255,255,0.1)",
                padding: "12px 28px",
                fontSize: "11px",
                letterSpacing: "3px",
                cursor: selected !== null ? "pointer" : "not-allowed",
                fontFamily: "'Courier New', monospace",
                fontWeight: "bold",
                transition: "all 0.25s",
              }}
            >
              {current + 1 === questions.length ? "REVEAL TRUTH" : "NEXT →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESULT
  if (screen === "result" && result) {
    const total = scores.reduce((a, b) => a + b, 0);
    const maxScore = 60;
    const pct = Math.round((total / maxScore) * 100);

    // category breakdown
    const catMax = 20;
    const catTotals = { SELF: 0, REL: 0, LIFE: 0 };
    scores.forEach((s, i) => {
      catTotals[questions[i].category] += s;
    });

    return (
      <div style={base}>
        <div style={scanlines} />
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes barGrow { from{width:0} to{width:var(--w)} }
        `}</style>
        <div style={{
          position: "relative", zIndex: 1, maxWidth: "660px", width: "100%",
          opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.4s ease",
        }}>
          {/* Result header */}
          <div style={{ borderTop: `3px solid ${result.color}`, paddingTop: "28px", marginBottom: "32px" }}>
            <div style={{ fontSize: "10px", color: result.color, letterSpacing: "4px", marginBottom: "12px" }}>
              YOUR RESULT · {total}/{maxScore} POINTS
            </div>
            <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", color: "#fff", fontFamily: "'Georgia', serif", margin: "0 0 10px 0", letterSpacing: "-1px" }}>
              {result.title}
            </h1>
            <p style={{ color: result.color, fontSize: "15px", fontStyle: "italic", margin: 0, fontFamily: "'Georgia', serif" }}>
              "{result.subtitle}"
            </p>
          </div>

          {/* Score bar */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${result.color}, ${result.color}99)`, borderRadius: "3px", transition: "width 1s ease 0.3s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "10px", color: "#ff3b30", letterSpacing: "2px" }}>IN DENIAL</span>
              <span style={{ fontSize: "10px", color: "#0a84ff", letterSpacing: "2px" }}>FULLY AWAKE</span>
            </div>
          </div>

          {/* Description */}
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.85, marginBottom: "32px", borderLeft: `2px solid ${result.color}40`, paddingLeft: "16px" }}>
            {result.description}
          </p>

          {/* Category breakdown */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "3px", marginBottom: "16px" }}>BREAKDOWN BY CATEGORY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[["SELF", "#ff3b30"], ["REL", "#ff9500"], ["LIFE", "#0a84ff"]].map(([cat, color]) => {
                const catPct = Math.round((catTotals[cat] / catMax) * 100);
                return (
                  <div key={cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "10px", color, letterSpacing: "2px" }}>{catLabels[cat]}</span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{catTotals[cat]}/{catMax}</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(255,255,255,0.07)" }}>
                      <div style={{ width: `${catPct}%`, height: "100%", background: color, transition: `width 0.8s ease 0.5s` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Truth per category */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "36px" }}>
            {[
              { label: "SELF", color: "#ff3b30", text: result.self },
              { label: "RELATIONSHIPS", color: "#ff9500", text: result.rel },
              { label: "YOUR LIFE", color: "#0a84ff", text: result.life },
            ].map(item => (
              <div key={item.label} style={{ padding: "16px", border: `1px solid ${item.color}25`, borderTop: `2px solid ${item.color}` }}>
                <div style={{ fontSize: "9px", color: item.color, letterSpacing: "3px", marginBottom: "8px" }}>{item.label}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div style={{ padding: "20px", border: `1px solid ${result.color}40`, marginBottom: "28px" }}>
            <div style={{ fontSize: "9px", color: result.color, letterSpacing: "3px", marginBottom: "8px" }}>YOUR ONE MOVE</div>
            <p style={{ color: "#fff", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>{result.call}</p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={restart}
              style={{ flex: 1, background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.12)", padding: "13px", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Courier New', monospace", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.35)"; e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
            >
              RETAKE
            </button>
            <button
              onClick={() => {
                const text = `The Brutal Truth Quiz: I got "${result.title}" — "${result.subtitle}"`;
                navigator.clipboard?.writeText(text).then(() => alert("Copied!")).catch(() => {});
              }}
              style={{ flex: 2, background: result.color, color: "#fff", border: "none", padding: "13px", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Courier New', monospace", fontWeight: "bold", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.target.style.opacity = "1"; }}
            >
              SHARE RESULT ↗
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function OptionBtn({ index, text, catColor, selectedIdx, onSelect }) {
  const isSelected = selectedIdx === index;
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSelected ? `${catColor}18` : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: isSelected ? `1px solid ${catColor}70` : "1px solid rgba(255,255,255,0.07)",
        padding: "15px 18px",
        color: isSelected ? "#fff" : hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)",
        fontSize: "13px",
        fontFamily: "'Courier New', monospace",
        lineHeight: 1.55,
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.18s",
        transform: isSelected ? "translateX(6px)" : "translateX(0)",
        borderLeft: isSelected ? `3px solid ${catColor}` : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span style={{ color: isSelected ? catColor : "rgba(255,255,255,0.2)", marginRight: "12px", fontSize: "11px" }}>
        {String.fromCharCode(65 + index)}.
      </span>
      {text}
    </button>
  );
}

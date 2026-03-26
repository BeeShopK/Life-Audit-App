import { useState, useEffect } from "react";

// QUESTIONS ARRAY
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
  // ... (other SELF, REL, LIFE questions from your original code)
  
  // TRUTH DOMAIN
  {
    id: 101,
    category: "TRUTH",
    label: "Truthfulness",
    question: "When asked for feedback, do you tell the raw truth or soften it?",
    options: [
      { text: "Always the raw truth — honesty first", score: 4 },
      { text: "Mostly honest, with small adjustments", score: 3 },
      { text: "I often soften to avoid conflict", score: 2 },
      { text: "I rarely tell the truth directly", score: 1 },
    ],
  },
  {
    id: 102,
    category: "TRUTH",
    label: "Truthfulness",
    question: "Do you confront lies you notice in your environment?",
    options: [
      { text: "Always — it’s necessary", score: 4 },
      { text: "Sometimes, depending on context", score: 3 },
      { text: "Rarely — I avoid confrontation", score: 2 },
      { text: "Never — it’s easier to ignore them", score: 1 },
    ],
  },
  {
    id: 103,
    category: "TRUTH",
    label: "Truthfulness",
    question: "How often do you admit your mistakes immediately?",
    options: [
      { text: "Always, no hesitation", score: 4 },
      { text: "Most of the time, with some delay", score: 3 },
      { text: "Sometimes, only if pressed", score: 2 },
      { text: "Rarely, I try to hide them", score: 1 },
    ],
  },
  {
    id: 104,
    category: "TRUTH",
    label: "Truthfulness",
    question: "Do you avoid truths about yourself because they’re uncomfortable?",
    options: [
      { text: "Never, I face them head-on", score: 4 },
      { text: "Occasionally, but I try to confront them", score: 3 },
      { text: "Often, I delay self-reflection", score: 2 },
      { text: "Yes, I avoid them entirely", score: 1 },
    ],
  },
  {
    id: 105,
    category: "TRUTH",
    label: "Truthfulness",
    question: "When someone asks your opinion, do you say what you really think?",
    options: [
      { text: "Yes, always honest", score: 4 },
      { text: "Usually, but with caution", score: 3 },
      { text: "Sometimes, depends on the person", score: 2 },
      { text: "Rarely, I avoid conflict", score: 1 },
    ],
  },
];

// RESULTS ARRAY
const results = [
  {
    range: [15, 28],
    title: "DEEP IN THE FOG",
    subtitle: "You're not ready for the truth yet — and that itself is the truth.",
    color: "#ff3b30",
    description: "You avoid discomfort with discipline...",
    self: "You mistake being busy for being self-aware.",
    rel: "People around you feel things they can't say to you.",
    life: "You're waiting for a 'right time' that will never come.",
    truth: "You need to start facing small truths today.",
    call: "Do one uncomfortable honest thing this week.",
  },
  {
    range: [29, 39],
    title: "HALF AWAKE",
    subtitle: "You know the truth. You just haven't committed to it yet.",
    color: "#ff9500",
    description: "You have moments of clarity, but avoid full honesty...",
    self: "You can name your flaws in theory, but resist them in practice.",
    rel: "You're better at seeing others' patterns than your own.",
    life: "You know what needs to change; gap is courage, not knowledge.",
    truth: "You're aware of truths but hesitate to act on them.",
    call: "Start acting on insights you've been ignoring.",
  },
  {
    range: [40, 50],
    title: "BRUTALLY HONEST",
    subtitle: "You see clearly. Now comes the harder part — acting on it.",
    color: "#34c759",
    description: "You've done real work on yourself...",
    self: "Your self-awareness is real.",
    rel: "You're honest in relationships.",
    life: "You know your direction.",
    truth: "You face truths without flinching.",
    call: "Close the gap between knowing and doing.",
  },
  {
    range: [51, 60],
    title: "UNCOMFORTABLY REAL",
    subtitle: "You've burned the comfortable lies.",
    color: "#0a84ff",
    description: "You carry a rare and heavy gift: honesty.",
    self: "You know who you are — good and damage.",
    rel: "Your honesty can challenge others.",
    life: "You're not waiting, you're building.",
    truth: "You confront truths head-on.",
    call: "Go deeper into what you already know.",
  },
];

// HELPER FUNCTION
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// MAIN COMPONENT
export default function TruthQuiz() {
  const [screen, setScreen] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [categoryScores, setCategoryScores] = useState({ SELF: 0, REL: 0, LIFE: 0, TRUTH: 0 });
  const [glitch, setGlitch] = useState(false);

  const catColors = { SELF: "#ff3b30", REL: "#ff9500", LIFE: "#0a84ff", TRUTH: "#bf5af2" };
  const catLabels = { SELF: "SELF-AWARENESS", REL: "RELATIONSHIPS", LIFE: "LIFE AUDIT", TRUTH: "TRUTH DOMAIN" };

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 60);
    return () => clearTimeout(t);
  }, [current, screen]);

  useEffect(() => {
    if (questions[current]) setShuffledOpts(shuffle(questions[current].options));
  }, [current]);

  useEffect(() => {
    if (screen !== "intro") return;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3500);
    return () => clearInterval(interval);
  }, [screen]);

  const restart = () => {
    setCurrent(0);
    setScores([]);
    setSelected(null);
    setResult(null);
    setCategoryScores({ SELF: 0, REL: 0, LIFE: 0, TRUTH: 0 });
    setScreen("intro");
  };

  // OPTION BUTTON COMPONENT
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

  // RENDER LOGIC
  // ...use your existing quiz and result rendering logic from your previous code
  // Just make sure anywhere category colors/labels are used, TRUTH is included
}
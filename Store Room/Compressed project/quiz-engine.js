// ── quiz-engine.js ─────────────────────────────────
// Requires QUIZ_DATA to be defined on the page before this script.
// QUIZ_DATA = { id, title, subtitle, icon, color, colorLt, questions[], bands[] }
// Each question: { text, options: [str x4] }   (options scored 1–4)
// Each band:     { min, max, label, desc, advice }

(function () {
  'use strict';

  let current = 0;
  let answers  = [];

  const total = () => QUIZ_DATA.questions.length;

  // ── DOM helpers ──────────────────────────────────
  const el   = id => document.getElementById(id);
  const qs   = s  => document.querySelector(s);

  // ── Init ─────────────────────────────────────────
  function init() {
    // Apply quiz colour to CSS custom property
    document.documentElement.style.setProperty('--q-color',    QUIZ_DATA.color);
    document.documentElement.style.setProperty('--q-color-lt', QUIZ_DATA.colorLt || QUIZ_DATA.color);

    el('qdh-icon').textContent    = QUIZ_DATA.icon;
    el('qdh-title').textContent   = QUIZ_DATA.title;
    el('qdh-subtitle').textContent = QUIZ_DATA.subtitle;

    renderQuestion();
  }

  // ── Render question ───────────────────────────────
  function renderQuestion() {
    updateProgress();

    const qc = el('questionContainer');
    const q  = QUIZ_DATA.questions[current];
    const labels = ['A', 'B', 'C', 'D'];

    qc.innerHTML = `
      <div class="question-card">
        <div class="q-num">Question ${current + 1} of ${total()}</div>
        <div class="q-text">${q.text}</div>
        <div class="options-grid">
          ${q.options.map((opt, i) => `
            <button class="option-btn" data-score="${i + 1}">
              <span class="opt-letter">${labels[i]}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    qc.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qc.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const score = parseInt(btn.dataset.score);
        setTimeout(() => selectAnswer(score), 380);
      });
    });
  }

  // ── Record answer ─────────────────────────────────
  function selectAnswer(score) {
    answers.push(score);
    current++;
    if (current >= total()) {
      showResults();
    } else {
      renderQuestion();
    }
  }

  // ── Progress bar ──────────────────────────────────
  function updateProgress() {
    const pct  = Math.round((current / total()) * 100);
    const fill = el('progressFill');
    const txt  = el('progressText');
    if (fill) fill.style.width = pct + '%';
    if (txt)  txt.textContent  = `${current + 1} / ${total()}`;
  }

  // ── Results ───────────────────────────────────────
  function showResults() {
    const sum  = answers.reduce((a, b) => a + b, 0);
    const band = QUIZ_DATA.bands.find(b => sum >= b.min && sum <= b.max) || QUIZ_DATA.bands[QUIZ_DATA.bands.length - 1];
    const pct  = Math.round((sum / (total() * 4)) * 100);

    // Save to localStorage
    localStorage.setItem(`quiz_${QUIZ_DATA.id}`, JSON.stringify({
      score: sum,
      band:  band.label,
      pct,
      date:  new Date().toISOString(),
    }));

    // Hide question area
    el('questionContainer').style.display = 'none';
    el('progressText').textContent = `Complete`;
    if (el('progressFill')) el('progressFill').style.width = '100%';

    // SVG ring
    const r  = 50;
    const c  = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;

    el('resultsContainer').style.display = 'block';
    el('resultsContainer').innerHTML = `
      <div class="results-card">
        <div class="results-score-ring">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle class="ring-bg"   cx="60" cy="60" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="0"/>
            <circle class="ring-fill" cx="60" cy="60" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}" id="ringAnim"/>
          </svg>
          <div class="ring-score">${sum}<small>/${total() * 4}</small></div>
        </div>
        <div class="results-band">${QUIZ_DATA.subtitle}</div>
        <div class="results-label">${band.label}</div>
        <div class="results-desc">${band.desc}</div>
        <div class="results-advice"><strong style="color:var(--q-color);font-weight:500;">Next step:</strong><br>${band.advice}</div>
        <div class="results-actions">
          <a href="quizzes.html" class="btn btn-ghost">← All Quizzes</a>
          <a href="index.html"   class="btn btn-primary">View Dashboard</a>
          <button class="btn btn-ghost" id="retakeBtn">↺ Retake</button>
        </div>
      </div>
    `;

    // Animate ring
    requestAnimationFrame(() => {
      setTimeout(() => {
        const ring = document.getElementById('ringAnim');
        if (ring) {
          ring.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
          ring.style.strokeDashoffset = offset;
        }
      }, 150);
    });

    document.getElementById('retakeBtn').addEventListener('click', () => {
      current = 0;
      answers = [];
      el('resultsContainer').style.display = 'none';
      el('questionContainer').style.display = 'block';
      renderQuestion();
    });
  }

  // ── Start ─────────────────────────────────────────
  window.addEventListener('DOMContentLoaded', init);
})();

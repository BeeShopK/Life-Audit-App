// ── LifeApp: script.js (Refined Spotify UX) ─────────────────

// ── PAGE NAVIGATION ────────────────────────────────────────
const pages = document.querySelectorAll('.page');
const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]');

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));

  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');

  const lnk = document.querySelector(`.sidebar a[data-page="${id}"]`);
  if (lnk) lnk.parentElement.classList.add('active');

  if (id === 'quiz') renderQuizHub();
}

sidebarLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  showPage(l.dataset.page);
}));

// ── GREETING ───────────────────────────────────────────────
function setGreeting() {
  const h = new Date().getHours();
  const el = document.getElementById('timeGreet');
  if (!el) return;

  el.textContent =
    h < 12 ? 'morning' :
    h < 17 ? 'afternoon' :
             'evening';
}

// ── STREAK ─────────────────────────────────────────────────
function updateStreak() {
  const today = new Date().toDateString();
  const last  = localStorage.getItem('lastActive');
  let streak  = parseInt(localStorage.getItem('streak') || '0');

  if (last !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    streak = (last === yesterday.toDateString()) ? streak + 1 : 1;

    localStorage.setItem('streak', streak);
    localStorage.setItem('lastActive', today);
  }

  const el = document.getElementById('streakVal');
  const badge = document.getElementById('streakBadge');

  if (el) el.innerHTML = `${streak} <small>day${streak !== 1 ? 's' : ''}</small>`;

  if (badge) {
    badge.textContent =
      streak >= 7 ? `🔥 ${streak}-day streak` :
      streak > 1  ? `🔥 ${streak} days strong` :
                    '🌱 Day 1';
  }
}

// ── AFFIRMATIONS (smooth fade) ─────────────────────────────
const AFFIRMATIONS = [
  "You are not behind. You are exactly where your journey requires you to be.",
  "Self-awareness is not a destination. It's the courage to keep looking.",
  "Growth is quiet. Let it happen.",
  "Clarity comes from honesty, not speed.",
  "You’re building something real — keep going."
];

let affirmIdx = Math.floor(Math.random() * AFFIRMATIONS.length);

function rotateAffirmation() {
  const el = document.getElementById('affirmationText');
  if (!el) return;

  el.style.opacity = '0';

  setTimeout(() => {
    affirmIdx = (affirmIdx + 1) % AFFIRMATIONS.length;
    el.textContent = AFFIRMATIONS[affirmIdx];
    el.style.opacity = '1';
  }, 250);
}

function initAffirmation() {
  const el = document.getElementById('affirmationText');
  if (el) el.textContent = AFFIRMATIONS[affirmIdx];
}

// ── MOOD CHECK-IN (Spotify-like feedback) ──────────────────
function initMood() {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('moods') || '[]');

  const todayMood = saved.find(m =>
    new Date(m.time).toDateString() === today
  );

  if (todayMood) {
    showMoodSaved(todayMood.mood, todayMood.emoji);
    highlightMood(todayMood.mood);
  }

  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      const emoji = btn.dataset.emoji;

      highlightMood(mood);

      const moods = JSON.parse(localStorage.getItem('moods') || '[]');
      const index = moods.findIndex(m =>
        new Date(m.time).toDateString() === today
      );

      const entry = { mood, emoji, time: new Date().toISOString() };

      if (index >= 0) moods[index] = entry;
      else moods.push(entry);

      localStorage.setItem('moods', JSON.stringify(moods));

      showMoodSaved(mood, emoji);
      addHistory(`${emoji} Mood: ${mood}`);
    });
  });
}

function highlightMood(mood) {
  document.querySelectorAll('.mood-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.mood === mood);
  });
}

function showMoodSaved(mood, emoji) {
  const msg = document.getElementById('moodSavedMsg');
  const em  = document.getElementById('moodSavedEmoji');

  if (msg) msg.style.display = 'block';
  if (em) em.textContent = `${emoji} ${mood}`;
}

// ── DOMAIN SCORES ─────────────────────────────────────────
function loadDomainScores() {
  const domains = ['mirror','connection','hardtruth','purpose','weather'];

  domains.forEach(d => {
    const data = JSON.parse(localStorage.getItem(`quiz_${d}`) || 'null');
    const bar  = document.getElementById(`bar-${d}`);
    const lbl  = document.getElementById(`score-${d}`);

    if (data && bar && lbl) {
      const pct = Math.round((data.score / 32) * 100);

      setTimeout(() => {
        bar.style.width = pct + '%';
      }, 300);

      lbl.textContent = `${data.score}/32`;
    }
  });
}

// ── QUIZ HUB ──────────────────────────────────────────────
function renderQuizHub() {
  const grid = document.getElementById('quizGrid');
  if (!grid || grid.dataset.rendered) return;

  grid.dataset.rendered = 'true';

  grid.innerHTML = DOMAINS.map(d => {
    const saved = JSON.parse(localStorage.getItem(`quiz_${d.id}`) || 'null');

    return `
      <div class="domain-card"
        onclick="window.location.href='${d.href}'">
        <div class="dc-icon">${d.icon}</div>
        <div class="dc-title">${d.title}</div>
        <div class="dc-desc">${d.desc}</div>
        <button class="dc-btn">
          ${saved ? 'Retake' : 'Start'}
        </button>
      </div>
    `;
  }).join('');
}

// ── JOURNAL ───────────────────────────────────────────────
function initJournal() {
  const btn = document.getElementById('saveJournalBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const input = document.getElementById('journalText');
    const text = input.value.trim();

    if (!text) return;

    const journals = JSON.parse(localStorage.getItem('journals') || '[]');

    journals.push({
      text,
      time: new Date().toISOString()
    });

    localStorage.setItem('journals', JSON.stringify(journals));

    input.value = '';

    btn.textContent = 'Saved ✓';
    setTimeout(() => btn.textContent = 'Save Entry', 1500);

    addHistory(`📝 Journal entry added`);
    loadJournalStats();
  });
}

// ── HISTORY ───────────────────────────────────────────────
function addHistory(text) {
  const list = document.getElementById('historyList');
  if (!list) return;

  const li = document.createElement('li');
  li.textContent = text;

  list.prepend(li);
}

// ── DROPDOWN ──────────────────────────────────────────────
function initDropdown() {
  document.querySelectorAll('.dropdown > a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const menu = a.nextElementSibling;

      if (menu) {
        menu.style.display =
          menu.style.display === 'block' ? 'none' : 'block';
      }
    });
  });
}

// ── INIT ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  setGreeting();
  updateStreak();
  initAffirmation();
  initMood();
  loadDomainScores();
  initJournal();
  initDropdown();
});
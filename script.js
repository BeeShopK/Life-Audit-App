// ── PAGE NAVIGATION ──
const pages = document.querySelectorAll('.page');
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.addEventListener('click', e => {
    const pageId = e.currentTarget.dataset.page;
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  });
});

// ── MOOD BUTTONS ──
const moodBtns = document.querySelectorAll('.mood-btn');
moodBtns.forEach(btn => btn.addEventListener('click', () => {
  moodBtns.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const msg = document.getElementById('moodSavedMsg');
  const emoji = document.getElementById('moodSavedEmoji');
  msg.style.display = 'block';
  emoji.textContent = btn.dataset.emoji;
}));

// ── AFFIRMATIONS ──
const affirmations = [
  "You are stronger than you think.",
  "Small steps today lead to big changes tomorrow.",
  "Gratitude turns little things into blessings.",
  "Your mindset shapes your reality.",
  "Consistency beats intensity."
];
function rotateAffirmation() {
  const idx = Math.floor(Math.random() * affirmations.length);
  document.getElementById('affirmationText').textContent = affirmations[idx];
}
rotateAffirmation();

// ── JOURNAL ──
const saveBtn = document.getElementById('saveJournalBtn');
saveBtn?.addEventListener('click', () => {
  const textArea = document.getElementById('journalText');
  const val = textArea.value.trim();
  if(!val) return alert('Write something first!');
  const list = document.getElementById('recentJournalList');
  const item = document.createElement('div');
  item.className = 'jp-item';
  const date = new Date().toLocaleDateString();
  item.innerHTML = `<div class="jp-date">${date}</div><div class="jp-text">${val}</div>`;
  list.prepend(item);
  textArea.value = '';
  document.getElementById('journalCount').textContent = parseInt(document.getElementById('journalCount').textContent)+1;
});
// ── LifeApp Quizzes: quizzes.js (WORKING VERSION) ─────────

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {

  console.log("✅ quizzes.js loaded");

  // ── QUIZ CARD CLICK ─────────────────────────────
  const cards = document.querySelectorAll('.quiz-card');

  if (cards.length === 0) {
    console.error("❌ No .quiz-card elements found");
  }

  cards.forEach(card => {
    card.addEventListener('click', function () {
      const target = this.getAttribute('data-quiz');

      console.log("👉 Clicked card:", target);

      if (!target) {
        console.error("❌ No data-quiz attribute found");
        return;
      }

      // Redirect to quiz page
      window.location.href = target;
    });
  });

  // ── BACK BUTTON ─────────────────────────────────
  const backBtn = document.getElementById('backHome');

  if (!backBtn) {
    console.error("❌ #backHome button not found");
  } else {
    backBtn.addEventListener('click', function () {
      console.log("🏠 Going back to dashboard");
      window.location.href = "index.html"; // change if needed
    });
  }

  // ── LOAD QUIZ STATUS (OPTIONAL) ─────────────────
  cards.forEach(card => {
    const file = card.getAttribute('data-quiz');
    if (!file) return;

    const id = file.replace('quiz-', '').replace('.html', '');
    const saved = localStorage.getItem(`quiz_${id}`);

    if (saved) {
      const data = JSON.parse(saved);

      const badge = document.createElement('div');
      badge.className = 'quiz-status';
      badge.textContent = `✓ ${data.score}/32`;

      card.appendChild(badge);
    }
  });

});
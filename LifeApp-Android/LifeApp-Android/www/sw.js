/* LifeApp Service Worker v1.0 */
const CACHE = 'lifeapp-v1';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

/* ── INSTALL ────────────────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE ───────────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH (cache-first, network fallback) ── */
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});

/* ── PUSH NOTIFICATIONS ─────────────────── */
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'LifeApp', body: 'Time for your daily check-in ✨' };
  e.waitUntil(
    self.registration.showNotification(data.title || 'LifeApp', {
      body: data.body || 'Time for your daily check-in ✨',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'lifeapp-daily',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: './index.html' },
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

/* ── NOTIFICATION CLICK ─────────────────── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) if (c.url.includes('index.html') && 'focus' in c) return c.focus();
      return clients.openWindow('./index.html');
    })
  );
});

/* ── SCHEDULED LOCAL REMINDER ───────────── */
let reminderTimer = null;

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_REMINDER') {
    if (reminderTimer) clearTimeout(reminderTimer);
    const now = new Date();
    const [h, m] = e.data.time.split(':').map(Number);
    const next = new Date(now);
    next.setHours(h, m, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const delay = next - now;
    reminderTimer = setTimeout(() => {
      self.registration.showNotification('LifeApp Daily Check-in', {
        body: e.data.message || 'How are you doing today? Take a moment to reflect. 🌱',
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: 'lifeapp-daily',
        vibrate: [200, 100, 200],
        data: { url: './index.html' }
      });
    }, delay);
  }
  if (e.data && e.data.type === 'CANCEL_REMINDER') {
    if (reminderTimer) { clearTimeout(reminderTimer); reminderTimer = null; }
  }
});

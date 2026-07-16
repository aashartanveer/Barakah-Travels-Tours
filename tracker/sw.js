const CACHE = 'bill-tracker-v4';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Offline-first: serve from cache, update in background
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

/* ---- Reminder check (runs even when the app is closed, via periodic sync) ---- */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('billTracker', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function dbGet(key) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readonly').objectStore('kv').get(key);
    tx.onsuccess = () => resolve(tx.result);
    tx.onerror = () => reject(tx.error);
  }));
}
function dbSet(key, val) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite').objectStore('kv').put(val, key);
    tx.onsuccess = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}

function daysLeft(dateStr, now) {
  const today = new Date(now); today.setHours(0,0,0,0);
  const due = new Date(dateStr + 'T00:00:00');
  return Math.round((due - today) / 86400000);
}

async function checkAndNotify() {
  const items = (await dbGet('items')) || [];
  const notified = (await dbGet('notified')) || {};
  const todayKey = new Date().toDateString();
  let changed = false;
  for (const it of items) {
    const dl = daysLeft(it.date, Date.now());
    let msg = null;
    if (dl === 1) msg = `"${it.name}" ends/is due TOMORROW` + (it.amount ? ` (Rs ${Number(it.amount).toLocaleString()})` : '');
    else if (dl === 0) msg = `"${it.name}" is due TODAY` + (it.amount ? ` (Rs ${Number(it.amount).toLocaleString()})` : '');
    else if (dl < 0) msg = `"${it.name}" is OVERDUE by ${Math.abs(dl)} day(s)`;
    const id = it.id + '|' + it.date + '|' + dl;
    if (msg && notified[id] !== todayKey) {
      await self.registration.showNotification('⏰ Bill Tracker', {
        body: msg,
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: id
      });
      notified[id] = todayKey;
      changed = true;
    }
  }
  if (changed) await dbSet('notified', notified);
}

self.addEventListener('periodicsync', e => {
  if (e.tag === 'bill-check') e.waitUntil(checkAndNotify());
});
self.addEventListener('message', e => {
  if (e.data === 'check-reminders') e.waitUntil(checkAndNotify());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return clients.openWindow('./index.html');
  }));
});

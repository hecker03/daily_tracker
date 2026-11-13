const DEF = {
  startHour: 8,
  webhook: '',
  tasks: [
    { id: 'academics', name: 'Academics', targetMin: 180, mode: 'manual' },
    { id: 'gate', name: 'GATE', targetMin: 120, mode: 'auto', urls: [] },
    { id: 'project', name: 'Project', targetMin: 60, mode: 'manual', noLink: true },
    { id: 'paper', name: 'Research paper', targetMin: 60, mode: 'manual' },
    { id: 'leetcode', name: 'LeetCode', targetMin: 60, mode: 'auto', urls: ['leetcode.com'] },
    { id: 'github', name: 'GitHub', targetMin: 10, mode: 'auto', urls: ['github.com'] },
    { id: 'cyber', name: 'Cyber tool/concept', targetMin: 30, mode: 'manual' },
    { id: 'apti', name: 'Aptitude', targetMin: 30, mode: 'manual' }
  ]
};

let q = Promise.resolve();
const run = f => (q = q.then(f).catch(console.error));
const dayKey = () => new Date().toLocaleDateString('en-CA');
const save = s => chrome.storage.local.set(s);
const notify = (title, message) =>
  chrome.notifications.create({ type: 'basic', iconUrl: 'icon.png', title, message });

async function load() {
  const s = await chrome.storage.local.get(['config', 'days', 'running', 'links', 'lastTick', 'lastSync']);
  return {
    config: s.config || DEF, days: s.days || {}, running: s.running || {},
    links: s.links || {}, lastTick: s.lastTick || 0, lastSync: s.lastSync || 0
  };
}

function setup(cfg) {
  chrome.alarms.create('tick', { periodInMinutes: 1 });
  const t = new Date();
  t.setHours(cfg.startHour, 0, 0, 0);
  if (t.getTime() <= Date.now()) t.setDate(t.getDate() + 1);
  chrome.alarms.create('morning', { when: t.getTime(), periodInMinutes: 1440 });
}

async function activeUrl() {
  try {
    const w = await chrome.windows.getLastFocused();
    if (!w.focused) return '';
    const [t] = await chrome.tabs.query({ active: true, windowId: w.id });
    return (t && t.url) || '';
  } catch { return ''; }
}

async function tick() {
  const s = await load();
  const now = Date.now();
  const dt = s.lastTick ? Math.min((now - s.lastTick) / 1000, 90) : 0;
  s.lastTick = now;
  const day = dayKey();
  s.days[day] = s.days[day] || {};
  const url = await activeUrl();
  let force = false;

  for (const t of s.config.tasks) {
    const counting = t.mode === 'auto'
      ? (t.urls || []).some(u => url.includes(u))
      : !!s.running[t.id];
    if (!counting) continue;
    const r = (s.days[day][t.id] = s.days[day][t.id] || { sec: 0 });
    if (!r.started) { r.started = true; notify(`${t.name} started`, `Target: ${t.targetMin} min. Go.`); }
    r.sec += dt;
    if (!r.done && r.sec >= t.targetMin * 60) {
      r.done = true; force = true;
      notify(`${t.name} target reached`, `${t.targetMin} min done. Extend if you can.`);
    }
  }

  if (s.config.webhook && (force || now - s.lastSync > 300000)) {
    s.lastSync = now;
    const minutes = {};
    for (const t of s.config.tasks) minutes[t.name] = Math.round(((s.days[day][t.id] || {}).sec || 0) / 60);
    fetch(s.config.webhook, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ date: day, minutes })
    }).catch(() => {});
  }
  await save(s);
}

chrome.runtime.onInstalled.addListener(() => run(async () => { const s = await load(); await save({ config: s.config }); setup(s.config); }));
chrome.runtime.onStartup.addListener(() => run(async () => setup((await load()).config)));
chrome.alarms.onAlarm.addListener(a => {
  if (a.name === 'tick') run(tick);
  if (a.name === 'morning') notify('Your time starts now', 'Academics, GATE, project, paper, LeetCode. Begin.');
});
chrome.tabs.onActivated.addListener(() => run(tick));
chrome.tabs.onUpdated.addListener((_i, c) => { if (c.status === 'complete') run(tick); });
chrome.windows.onFocusChanged.addListener(() => run(tick));
chrome.storage.onChanged.addListener(ch => { if (ch.config) setup(ch.config.newValue); });

chrome.runtime.onMessage.addListener((m, _s, reply) => {
  run(async () => {
    if (m.type === 'toggle') {
      await tick();
      const s = await load();
      if (s.running[m.id]) delete s.running[m.id];
      else {
        s.running = { [m.id]: true };
        if (m.link) { s.links[m.id] = m.link; chrome.tabs.create({ url: m.link }); }
      }
      s.lastTick = Date.now();
      await save(s);
    }
    reply(await load());
  });
  return true;
});

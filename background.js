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

function setup(cfg) {
  const t = new Date();
  t.setHours(cfg.startHour, 0, 0, 0);
  if (t.getTime() <= Date.now()) t.setDate(t.getDate() + 1);
  chrome.alarms.create('morning', { when: t.getTime(), periodInMinutes: 1440 });
}

chrome.runtime.onInstalled.addListener(() => chrome.storage.local.set({ config: DEF }).then(() => setup(DEF)));
chrome.runtime.onStartup.addListener(async () => setup((await chrome.storage.local.get('config')).config || DEF));
chrome.alarms.onAlarm.addListener(a => {
  if (a.name === 'morning') notify('Your time starts now', 'Academics, GATE, project, paper, LeetCode. Begin.');
});

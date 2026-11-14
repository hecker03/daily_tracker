const PRESETS = {
  "general": {
    "startHour": 8,
    "webhook": "",
    "tasks": [
      {
        "id": "leetcode",
        "name": "LeetCode",
        "targetMin": 60,
        "mode": "auto",
        "urls": [
          "leetcode.com"
        ]
      },
      {
        "id": "github",
        "name": "GitHub",
        "targetMin": 30,
        "mode": "auto",
        "urls": [
          "github.com"
        ]
      },
      {
        "id": "study",
        "name": "Study",
        "targetMin": 120,
        "mode": "manual"
      },
      {
        "id": "assignments",
        "name": "Assignments",
        "targetMin": 60,
        "mode": "manual"
      }
    ]
  },
  "exam-prep": {
    "startHour": 8,
    "webhook": "",
    "tasks": [
      {
        "id": "academics",
        "name": "Academics",
        "targetMin": 180,
        "mode": "manual"
      },
      {
        "id": "exam",
        "name": "Exam prep",
        "targetMin": 120,
        "mode": "auto",
        "urls": []
      },
      {
        "id": "project",
        "name": "Project",
        "targetMin": 60,
        "mode": "manual",
        "noLink": true
      },
      {
        "id": "paper",
        "name": "Research paper",
        "targetMin": 60,
        "mode": "manual"
      },
      {
        "id": "leetcode",
        "name": "LeetCode",
        "targetMin": 60,
        "mode": "auto",
        "urls": [
          "leetcode.com"
        ]
      },
      {
        "id": "aptitude",
        "name": "Aptitude",
        "targetMin": 30,
        "mode": "manual"
      },
      {
        "id": "concept",
        "name": "Concept of the day",
        "targetMin": 30,
        "mode": "manual"
      }
    ]
  }
};

const ta = document.getElementById('c');
const msg = document.getElementById('m');
chrome.storage.local.get('config').then(({ config }) => {
  ta.value = JSON.stringify(config || PRESETS.general, null, 2);
});

document.getElementById('l').onclick = () => {
  let cur = {};
  try { cur = JSON.parse(ta.value); } catch {}
  const p = PRESETS[document.getElementById('p').value];
  ta.value = JSON.stringify({ ...p, webhook: cur.webhook || '', startHour: cur.startHour ?? p.startHour }, null, 2);
  msg.textContent = 'Loaded. Click Save to apply.';
};

document.getElementById('s').onclick = async () => {
  try {
    await chrome.storage.local.set({ config: JSON.parse(ta.value) });
    msg.textContent = 'Saved';
  } catch (e) { msg.textContent = 'Invalid JSON: ' + e.message; }
};

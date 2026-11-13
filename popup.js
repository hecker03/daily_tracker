const dayKey = () => new Date().toLocaleDateString('en-CA');
const els = {};
const get = () => chrome.runtime.sendMessage({ type: 'get' });

function paint(s) {
  const day = s.days[dayKey()] || {};
  for (const t of s.config.tasks) {
    const sec = (day[t.id] || {}).sec || 0;
    const e = els[t.id];
    e.txt.textContent = `${Math.floor(sec / 60)}/${t.targetMin} min`;
    e.bar.style.width = Math.min(100, sec / (t.targetMin * 60) * 100) + '%';
    if (e.btn) e.btn.textContent = s.running[t.id] ? 'Stop' : 'Start';
  }
}

(async () => {
  const s = await get();
  const list = document.getElementById('list');
  for (const t of s.config.tasks) {
    const d = document.createElement('div'); d.className = 't';
    d.innerHTML = `<b></b> <span></span><div class="bar"><i></i></div>`;
    d.querySelector('b').textContent = t.name;
    els[t.id] = { txt: d.querySelector('span'), bar: d.querySelector('i') };
    if (t.mode === 'manual') {
      let inp = null;
      if (!t.noLink) {
        inp = document.createElement('input');
        inp.placeholder = 'paste link (optional)';
        inp.value = s.links[t.id] || '';
        d.appendChild(inp);
      }
      const b = document.createElement('button');
      b.onclick = async () => paint(await chrome.runtime.sendMessage({ type: 'toggle', id: t.id, link: inp ? inp.value.trim() : '' }));
      els[t.id].btn = b;
      d.appendChild(b);
    }
    list.appendChild(d);
  }
  paint(s);
  setInterval(async () => paint(await get()), 5000);
  document.getElementById('opt').onclick = () => chrome.runtime.openOptionsPage();
})();

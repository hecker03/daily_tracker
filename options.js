chrome.storage.local.get('config').then(({ config }) => {
  if (config) document.getElementById('c').value = JSON.stringify(config, null, 2);
});
document.getElementById('s').onclick = async () => {
  const m = document.getElementById('m');
  try {
    await chrome.storage.local.set({ config: JSON.parse(document.getElementById('c').value) });
    m.textContent = 'Saved';
  } catch (e) { m.textContent = 'Invalid JSON: ' + e.message; }
};

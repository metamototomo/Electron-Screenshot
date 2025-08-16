const { desktopCapturer, screen } = require('electron');
const fs = require('fs');
const path = require('path');

const monitorSelect = document.getElementById('monitorSelect');
const titleInput = document.getElementById('titleInput');
const memoInput = document.getElementById('memoInput');
const captureBtn = document.getElementById('captureBtn');
const thumbnail = document.getElementById('thumbnail');

// Your screenshot save folder
const saveDir = 'C:\\TEMP\\Screenshots';
if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

// Load available monitors
async function loadMonitors() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });

  monitorSelect.innerHTML = '';
  sources.forEach((source, index) => {
    const option = document.createElement('option');
    option.value = source.id;
    option.text = `Monitor ${index + 1} - ${source.name}`;
    monitorSelect.appendChild(option);
  });
}

captureBtn.addEventListener('click', async () => {
  const selectedId = monitorSelect.value;
  const title = titleInput.value.trim().replace(/[\\/:*?"<>|]/g, '_');
  const memo = memoInput.value.trim().replace(/[\\/:*?"<>|]/g, '_');

  // Generate filename
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 15);
  const randomNum = Math.floor(100 + Math.random() * 900);
  const filename = `${timestamp}-${randomNum}-${title}-${memo}.png`;
  const filePath = path.join(saveDir, filename);

  // Capture selected monitor
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  const source = sources.find(s => s.id === selectedId);

  if (!source) {
    alert('Could not find selected monitor source.');
    return;
  }

  const image = source.thumbnail.toPNG();
  fs.writeFileSync(filePath, image);

  thumbnail.src = filePath;
  alert(`Screenshot saved: ${filePath}`);
});

loadMonitors();

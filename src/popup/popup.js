const STORAGE_KEYS = 'eyedropper-colors';

const colorsEl = document.querySelector('.colors');
const messageEl = document.querySelector('.message');

async function pickNewColor() {
  let result = null;
  try {
    const ed = new EyeDropper();
    result = await ed.open();
  } catch (e) {
    // Silently fail, the user has canceled the pick.
    document.body.innerHTML = e;
    return;
  }

  if (result) {
    const color = result.sRGBHex;
    addColor(color);
    sendToClipboard(color);
    store(color);

    await showMessageAndHide(color);
  }
}

function addColor(color) {
  const el = document.createElement('li');
  el.classList.add('color');
  el.style.backgroundColor = color;
  el.title = `${color} - click to copy to the clipboard`;
  
  const delEl = document.createElement('span');
  delEl.classList.add('del');
  delEl.title = `Click to delete this color`;
  el.appendChild(delEl);

  colorsEl.appendChild(el);

  el.addEventListener('click', async (e) => {
    const isDel = e.target.classList.contains('del');
    if (isDel) {
      el.remove();
      removeFromStore(color);
    } else {
      await sendToClipboard(color);
      await showMessageAndHide(color);
    }
  });
}

async function showMessageAndHide(color) {
  showCopiedMessage(color);
  await new Promise(r => setTimeout(r, 1000));
  window.close();
}

async function sendToClipboard(color) {
  const result = await navigator.permissions.query({ name: "clipboard-write" });
  if (result.state == "granted" || result.state == "prompt") {
    try {
      await navigator.clipboard.writeText(color);
    } catch (e) {
      // Failed to write to the clipboard.
      document.body.innerHTML = e;
    }
  }
}

function showCopiedMessage(color) {
  messageEl.textContent = `${color} copied to the clipboard!`;
  messageEl.style.display = 'flex';
}

function getStored() {
  const stored = localStorage.getItem(STORAGE_KEYS);
  if (!stored) {
    return [];
  } else {
    return JSON.parse(stored);
  }
}

function setStored(colors) {
  localStorage.setItem(STORAGE_KEYS, JSON.stringify(colors));
}

function store(color) {
  let colors = getStored();
  if (!Array.isArray(colors)) {
    colors = [];
  }

  if (!colors.includes(color)) {
    colors.push(color);
  }

  setStored(colors);
}

function removeFromStore(color) {
  let colors = getStored();
  if (!Array.isArray(colors)) {
    return;
  }

  const index = colors.findIndex(c => c === color);
  if (index > -1) {
    colors.splice(index, 1);
  }

  setStored(colors);
}

document.querySelector('button').addEventListener('click', pickNewColor);

for (const color of getStored()) {
  addColor(color);
}

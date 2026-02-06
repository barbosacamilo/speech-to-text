let currentChunk = "";
let finalChunks = [];
let isListening = false;

const textarea = document.getElementById("text");
const playOrStopBtn = document.getElementById("play-btn");
const copyBtn = document.getElementById("copy-btn");
const clearBtn = document.getElementById("clear-btn");
const errorMsg = document.getElementById("error-msg");
const langSelect = document.getElementById("lang-selector");

playOrStopBtn.addEventListener("click", start);
copyBtn.addEventListener("click", copy);
clearBtn.addEventListener("click", clear);
langSelect.addEventListener("change", setSelectedLanguage);

const sr = new SpeechRecognition();
sr.lang = "es-CO";
sr.continuous = true;
sr.interimResults = true;
sr.maxAlternatives = 1;
sr.onresult = handleSpeechRecognitionResult;

function handleSpeechRecognitionResult(event) {
  let interim = "";

  for (let i = 0; i < event.results.length; i++) {
    const res = event.results[i];
    interim += res[0].transcript;
  }

  currentChunk = interim;

  if (finalChunks.length > 0) {
    textarea.value = finalChunks.join(" ") + " " + interim;
  } else {
    textarea.value = interim;
  }
}

function start() {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  sr.start();
  isListening = true;
  currentChunk = "";
  setUIOnListeningState(true);
}

function stopListening() {
  sr.stop();
  isListening = false;
  finalChunks.push(currentChunk);
  currentChunk = "";
  setUIOnListeningState(false);
}

function setUIOnListeningState(listening) {
  textarea.disabled = listening;
  clearBtn.disabled = listening;
  copyBtn.disabled = listening;

  playOrStopBtn.textContent = listening ? "Stop" : "Start";
}

function clear() {
  if (isListening) {
    return;
  }

  if (textarea.value.length === 0) {
    return;
  }

  currentChunk = "";
  finalChunks = [];
  textarea.value = "";
  errorMsg.textContent = "";
}

async function copy() {
  if (isListening) {
    return;
  }

  if (textarea.value.length === 0) {
    return;
  }

  try {
    await navigator.clipboard.writeText(textarea.value);

    copyBtn.textContent = "Copied!";
    copyBtn.disabled = true;

    setTimeout(() => {
      copyBtn.textContent = "Copy";
      copyBtn.disabled = false;
    }, 2000);
  } catch (err) {
    console.error(err);
    errorMsg.textContent = `Failed to copy: ${err.message ?? String(err)}`;
  }
}

function setSelectedLanguage(e) {
  sr.lang = e.target.value;
}

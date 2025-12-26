// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}

// ===== VARIABLES =====
let screen = document.getElementById("screen");
let historyList = document.getElementById("historyList");
let mode = "DEG";
let expression = "";
let reset = false;
let history = [];

// ===== FONCTIONS =====
function append(v) {
  if (reset) {
    screen.textContent = "";
    expression = "";
    reset = false;
  }
  if (screen.textContent === "0") screen.textContent = "";
  screen.textContent += v;
  expression += v;
}

function clearAll() {
  screen.textContent = "0";
  expression = "";
}

function clearLast() {
  screen.textContent = screen.textContent.slice(0, -1) || "0";
  expression = expression.slice(0, -1);
}

function setMode(m) {
  mode = m;
  document.getElementById("btnDEG").classList.remove("active");
  document.getElementById("btnRAD").classList.remove("active");
  document.getElementById("btn" + m).classList.add("active");
}

function calculate() {
  try {
    let result = eval(expression.replace("π", Math.PI));
    screen.textContent = result;
    history.unshift(expression + " = " + result);
    historyList.innerHTML = history.map(h => `<li>${h}</li>`).join("");
    expression = result;
    reset = true;
  } catch {
    screen.textContent = "Erreur";
    reset = true;
  }
}

function insertPi() { append("π"); }
function insertSqrt() { append("Math.sqrt("); }
function sin() { append("Math.sin("); }
function cos() { append("Math.cos("); }
function tan() { append("Math.tan("); }
function ln() { append("Math.log("); }
function log() { append("Math.log10("); }
function appendExponent() { append("**"); }

setMode("DEG");

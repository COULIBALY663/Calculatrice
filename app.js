const screen = document.getElementById("screen");
const historyScreen = document.getElementById("historyScreen");

let mode = "DEG";
let history = [];
let resetScreen = false;
let expressionInternal = "";
const PI = Math.PI;

/* ===== BASE ===== */
function append(value) {
  if (resetScreen) {
    screen.value = "";
    expressionInternal = "";
    resetScreen = false;
  }
  if (screen.value === "0") screen.value = "";
  screen.value += value;
  expressionInternal += value;
}

function clearAll() {
  screen.value = "0";
  expressionInternal = "";
  history = [];
  historyScreen.innerHTML = "";
}

function clearLast() {
  screen.value = screen.value.slice(0, -1) || "0";
  expressionInternal = expressionInternal.slice(0, -1);
}

/* ===== MODE ===== */
function setMode(m) {
  mode = m;
  document.getElementById("btnDEG").classList.remove("active");
  document.getElementById("btnRAD").classList.remove("active");
  document.getElementById(m === "DEG" ? "btnDEG" : "btnRAD").classList.add("active");
}

/* ===== CALCUL ===== */
function calculate() {
  try {
    let expr = expressionInternal
      .replace(/π/g, PI)
      .replace(/\^/g, "**");

    let open = (expr.match(/\(/g) || []).length;
    let close = (expr.match(/\)/g) || []).length;
    expr += ")".repeat(open - close);

    let result = eval(expr);

    if (Math.abs(result) < 1e-10) result = 0;
    result = parseFloat(result.toFixed(10));

    history.push(`${screen.value} = ${result}`);
    afficherHistorique();

    screen.value = result;
    expressionInternal = result.toString();
    resetScreen = true;
  } catch {
    screen.value = "Erreur";
    resetScreen = true;
  }
}

/* ===== FONCTIONS ===== */
function insertSqrt() {
  append("√(");
  expressionInternal = expressionInternal.replace("√(", "Math.sqrt(");
}

function sin() { addFunc("sin"); }
function cos() { addFunc("cos"); }
function tan() { addFunc("tan"); }
function ln()  { addFunc("ln"); }
function log() { addFunc("log"); }

function addFunc(func) {
  if (resetScreen) {
    screen.value = "";
    expressionInternal = "";
    resetScreen = false;
  }
  screen.value += func + "(";

  if (func === "sin")
    expressionInternal += mode === "DEG" ? "Math.sin(Math.PI/180*" : "Math.sin(";
  if (func === "cos")
    expressionInternal += mode === "DEG" ? "Math.cos(Math.PI/180*" : "Math.cos(";
  if (func === "tan")
    expressionInternal += mode === "DEG" ? "Math.tan(Math.PI/180*" : "Math.tan(";
  if (func === "ln")
    expressionInternal += "Math.log(";
  if (func === "log")
    expressionInternal += "Math.log10(";
}

function insertPi() {
  append("π");
  expressionInternal += PI;
}

function appendExponent() {
  append("^");
}

/* ===== HISTORIQUE ===== */
function afficherHistorique() {
  historyScreen.innerHTML = "";
  history.slice(-10).forEach(item => {
    const div = document.createElement("div");
    div.textContent = item;
    historyScreen.appendChild(div);
  });
  historyScreen.scrollTop = historyScreen.scrollHeight;
}

/* INIT */
setMode("DEG");

let screen = document.getElementById("screen");
let historyBox = document.getElementById("screenHistory");
let mode = "DEG";
let expression = "";
let history = [];
const PI = Math.PI;

function append(v) {
  if (screen.value === "0") screen.value = "";
  screen.value += v;
  expression += v;
}

function clearAll() {
  screen.value = "0";
  expression = "";
}

function clearLast() {
  screen.value = screen.value.slice(0, -1) || "0";
  expression = expression.slice(0, -1);
}

function setMode(m) {
  mode = m;
  btnDEG.classList.remove("active");
  btnRAD.classList.remove("active");
  document.getElementById("btn" + m).classList.add("active");
}

function insertSqrt() {
  append("√(");
  expression = expression.replace("√(", "Math.sqrt(");
}

function sin(){ addTrig("sin"); }
function cos(){ addTrig("cos"); }
function tan(){ addTrig("tan"); }

function addTrig(t) {
  append(t + "(");
  expression += mode === "DEG"
    ? `Math.${t}(Math.PI/180*`
    : `Math.${t}(`;
}

function log(){ append("log("); expression += "Math.log10("; }
function ln(){ append("ln("); expression += "Math.log("; }

function insertPi() {
  append("π");
  expression += PI;
}

function appendExponent() {
  append("^");
  expression += "**";
}

function calculate() {
  try {
    let result = eval(expression);
    history.push(`${screen.value} = ${result}`);
    updateHistory();
    screen.value = result;
    expression = result.toString();
  } catch {
    screen.value = "Erreur";
    expression = "";
  }
}

function updateHistory() {
  historyBox.innerHTML = "";
  history.slice(-3).forEach(h => {
    let div = document.createElement("div");
    div.textContent = h;
    historyBox.appendChild(div);
  });
}

setMode("DEG");

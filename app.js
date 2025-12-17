let screen = document.getElementById("screen");
let screenHistory = document.getElementById("screenHistory");
let mode = "DEG";
const PI = 3.14159265359;

let history = [];
let resetScreen = false;
let expressionInternal = "";

// Ajouter un chiffre ou symbole
function append(value) {
  if (resetScreen) { screen.value=""; expressionInternal=""; resetScreen=false; }
  if(screen.value==="0") screen.value="";
  screen.value += value;
  expressionInternal += value;
}

// Effacer tout
function clearAll() {
  screen.value="0";
  expressionInternal="";
}

// Effacer dernier caractère
function clearLast() {
  if(screen.value.length>1) { screen.value=screen.value.slice(0,-1); expressionInternal=expressionInternal.slice(0,-1);}
  else { screen.value="0"; expressionInternal=""; }
}

// Changer mode DEG/RAD
function setMode(m) {
  mode=m;
  document.getElementById("btnDEG").classList.remove("active");
  document.getElementById("btnRAD").classList.remove("active");
  if(m==="DEG") document.getElementById("btnDEG").classList.add("active");
  else document.getElementById("btnRAD").classList.add("active");
}

// Calculer
function calculate() {
  try {
    let expr = expressionInternal.replace(/π/g, PI).replace(/\^/g,"**");
    let openParens = (expr.match(/\(/g)||[]).length;
    let closeParens = (expr.match(/\)/g)||[]).length;
    expr += ")".repeat(openParens - closeParens);
    let result = eval(expr);
    if(Math.abs(result)<1e-10) result=0;
    result=parseFloat(result.toFixed(10));

    // Historique
    history.push(`${screen.value} = ${result}`);
    updateHistory();

    screen.value = result;
    expressionInternal = result.toString();
    resetScreen=true;
  } catch {
    screen.value="Erreur";
    expressionInternal="";
    resetScreen=true;
  }
}

// Historique
function updateHistory() {
  screenHistory.innerHTML = history.slice(-3).join("<br>");
}

// Fonctions scientifiques
function insertSqrt() { append("Math.sqrt("); }
function sin() { append(mode==="DEG"?"Math.sin(Math.PI/180*":"Math.sin("); }
function cos() { append(mode==="DEG"?"Math.cos(Math.PI/180*":"Math.cos("); }
function tan() { append(mode==="DEG"?"Math.tan(Math.PI/180*":"Math.tan("); }
function log() { append("Math.log10("); }
function ln() { append("Math.log("); }
function insertPi() { append("π"); }
function appendExponent() { append("^"); }

setMode("DEG");

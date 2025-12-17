let screen = document.getElementById("screen");
let mode = "DEG";
const PI = 3.14;

let history = [];
let historyList = document.getElementById("historyList");
let resetScreen = false;
let expressionInternal = "";

function append(value) {
  if(resetScreen){ 
    screen.value = ""; 
    expressionInternal = ""; 
    resetScreen = false; 
  }
  if(screen.value === "0") screen.value = "";
  screen.value += value;
  expressionInternal += value;
}

function clearAll() {
  screen.value = "0";
  expressionInternal = "";
}

function clearLast() {
  if (screen.value.length > 1) {
    screen.value = screen.value.slice(0,-1);
    expressionInternal = expressionInternal.slice(0,-1);
  } else {
    screen.value = "0";
    expressionInternal = "";
  }
}

function setMode(m) {
  mode = m;
  document.getElementById("btnDEG").classList.remove("active");
  document.getElementById("btnRAD").classList.remove("active");
  document.getElementById(m === "DEG" ? "btnDEG" : "btnRAD").classList.add("active");
}

function calculate() {
  try {
    let expr = expressionInternal.replace(/π/g, PI).replace(/\^/g,"**");
    let openParens = (expr.match(/\(/g)||[]).length;
    let closeParens = (expr.match(/\)/g)||[]).length;
    expr += ")".repeat(openParens - closeParens);

    let result = eval(expr);
    if(Math.abs(result) < 1e-10) result = 0;
    result = parseFloat(result.toFixed(10));

    // Ajouter à l'historique
    history.push(`${screen.value} = ${result}`);
    afficherHistorique();

    screen.value = result;
    expressionInternal = result.toString();
    resetScreen = true;
  } catch {
    screen.value = "Erreur";
    expressionInternal = "";
    resetScreen = true;
  }
}

function afficherHistorique() {
  historyList.innerHTML = "";
  history.slice().reverse().forEach(item=>{
    let li = document.createElement("li");
    li.textContent = item;
    li.onclick = ()=>{
      let valeur = item.split("=").pop().trim();
      screen.value = valeur;
      expressionInternal = valeur;
      resetScreen = true;
    };
    historyList.appendChild(li);
  });
}

function insertSqrt() {
  append("Math.sqrt(");
  screen.value += "√(";
}

function sin() { addFunc("sin"); }
function cos() { addFunc("cos"); }
function tan() { addFunc("tan"); }
function log() { addFunc("log"); }
function ln() { addFunc("ln"); }

function addFunc(func) {
  switch(func){
    case "sin": expressionInternal += mode==="DEG" ? "Math.sin(Math.PI/180*" : "Math.sin("; break;
    case "cos": expressionInternal += mode==="DEG" ? "Math.cos(Math.PI/180*" : "Math.cos("; break;
    case "tan": expressionInternal += mode==="DEG" ? "Math.tan(Math.PI/180*" : "Math.tan("; break;
    case "ln": expressionInternal += "Math.log("; break;
    case "log": expressionInternal += "Math.log10("; break;
  }
  screen.value += func + "(";
}

function insertPi() {
  append(PI);
  screen.value += "π";
}

function appendExponent() {
  append("^");
}

setMode("DEG");

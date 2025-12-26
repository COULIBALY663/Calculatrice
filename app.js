// ===== VARIABLES =====
let screen = document.getElementById("screen");
let historyList = document.getElementById("historyList");

let mode = "DEG";
const PI = Math.PI;
let ANS = 0;

let history = [];
let resetScreen = false;
let expressionInternal = "";

// ===== AJOUT CARACTÈRE =====
function append(value){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let lastChar = expressionInternal.slice(-1);

  // Multiplication implicite : 2(3)
  if(value === "(" && lastChar && /[0-9)π]/.test(lastChar)){
    screen.textContent += "×";
    expressionInternal += "*";
  }

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += value;
  expressionInternal += value;
}

// ===== CLEAR =====
function clearAll(){
  screen.textContent = "0";
  expressionInternal = "";
  resetScreen = false;
}

function clearLast(){
  if(resetScreen) return;

  screen.textContent = screen.textContent.slice(0,-1);
  expressionInternal = expressionInternal.slice(0,-1);

  if(screen.textContent === ""){
    screen.textContent = "0";
    expressionInternal = "";
  }
}

// ===== MODE DEG / RAD =====
function setMode(m){
  mode = m;
  document.getElementById("btnDEG").classList.remove("active");
  document.getElementById("btnRAD").classList.remove("active");
  document.getElementById(m === "DEG" ? "btnDEG" : "btnRAD").classList.add("active");
}

// ===== CALCUL =====
function calculate(){
  try{
    let expr = expressionInternal
      .replace(/π/g, PI)
      .replace(/\^/g, "**");

    let openParens = (expr.match(/\(/g) || []).length;
    let closeParens = (expr.match(/\)/g) || []).length;
    if(openParens > closeParens){
      expr += ")".repeat(openParens - closeParens);
    }

    let result = Function('"use strict"; return (' + expr + ')')();

    if(!isFinite(result)) throw "Erreur";
    if(Math.abs(result) < 1e-10) result = 0;

    result = parseFloat(result.toFixed(10));
    ANS = result;

    history.push(`${screen.textContent} = ${result}`);
    if(history.length > 20) history.shift();
    afficherHistorique();

    screen.textContent = result;
    expressionInternal = result.toString();
    resetScreen = true;
  }catch{
    screen.textContent = "Erreur";
    expressionInternal = "";
    resetScreen = true;
  }
}

// ===== π =====
function insertPi(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let lastChar = expressionInternal.slice(-1);
  if(lastChar && /[0-9)]/.test(lastChar)){
    screen.textContent += "×";
    expressionInternal += "*";
  }

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += "π";
  expressionInternal += "π";
}

// ===== √ =====
function insertSqrt(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let lastChar = expressionInternal.slice(-1);
  if(lastChar && /[0-9)π]/.test(lastChar)){
    screen.textContent += "×";
    expressionInternal += "*";
  }

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += "√(";
  expressionInternal += "Math.sqrt(";
}

// ===== FONCTIONS (sin, cos, tan, ln, log) =====
function sin(){ addFunc("sin"); }
function cos(){ addFunc("cos"); }
function tan(){ addFunc("tan"); }
function ln(){ addFunc("ln"); }
function log(){ addFunc("log"); }

function addFunc(func){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let lastChar = expressionInternal.slice(-1);

  // 🔥 MULTIPLICATION IMPLICITE : 2sin → 2×sin
  if(lastChar && /[0-9)π]/.test(lastChar)){
    screen.textContent += "×";
    expressionInternal += "*";
  }

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += func + "(";

  switch(func){
    case "sin":
      expressionInternal += mode === "DEG"
        ? "Math.sin(Math.PI/180*"
        : "Math.sin(";
      break;
    case "cos":
      expressionInternal += mode === "DEG"
        ? "Math.cos(Math.PI/180*"
        : "Math.cos(";
      break;
    case "tan":
      expressionInternal += mode === "DEG"
        ? "Math.tan(Math.PI/180*"
        : "Math.tan(";
      break;
    case "ln":
      expressionInternal += "Math.log(";
      break;
    case "log":
      expressionInternal += "Math.log10(";
      break;
  }
}

// ===== EXPOSANT =====
function appendExponent(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }
  screen.textContent += "^";
  expressionInternal += "^";
}

// ===== ANS =====
function insertANS(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let lastChar = expressionInternal.slice(-1);
  if(lastChar && /[0-9)π]/.test(lastChar)){
    screen.textContent += "×";
    expressionInternal += "*";
  }

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += "ANS";
  expressionInternal += ANS;
}

// ===== HISTORIQUE =====
function afficherHistorique(){
  historyList.innerHTML = "";
  history.slice().reverse().forEach(item=>{
    let li = document.createElement("li");
    li.textContent = item;
    li.onclick = ()=>{
      let res = item.split("=").pop().trim();
      screen.textContent = res;
      expressionInternal = res;
      resetScreen = true;
    };
    historyList.appendChild(li);
  });
}

// ===== MODE PAR DÉFAUT =====
setMode("DEG");
let screen = document.getElementById("screen");
let historyList = document.getElementById("historyList");

let mode = "DEG";
const PI = Math.PI;
let ANS = 0;
let history = [];
let resetScreen = false;
let expressionInternal = "";

// ===== APPEND =====
function append(value){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  // Supprimer le 0 initial uniquement si nécessaire
  if (
    screen.textContent === "0" &&
    value !== "." &&
    value !== "," &&
    !resetScreen
  ) {
    screen.textContent = "";
    expressionInternal = "";
  }

  // Gestion virgule / point
  if(value === "," || value === "."){
    if(screen.textContent === ""){
      screen.textContent = "0";
      expressionInternal = "0";
    }
    // empêcher double point
    if(expressionInternal.endsWith(".")) return;
    value = ".";
  }

  // Multiplication implicite
  let lastChar = expressionInternal.slice(-1);
  if(value === "(" && lastChar && /[0-9)π]/.test(lastChar)){
    screen.textContent += "×";
    expressionInternal += "*";
  }

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
  screen.textContent = screen.textContent.slice(0, -1);
  expressionInternal = expressionInternal.slice(0, -1);
  if(screen.textContent === ""){
    screen.textContent = "0";
    expressionInternal = "";
  }
}

// ===== MODE =====
function toggleMode(){
  mode = (mode === "DEG") ? "RAD" : "DEG";
  document.getElementById("btnMode").textContent = mode;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnMode").textContent = mode;
});

// ===== HISTORIQUE =====
function toggleHistory(){
  let panel = document.querySelector(".history-panel");
  let checkbox = document.getElementById("toggleHistory");
  panel.style.display = checkbox.checked ? "block" : "none";
}

// ===== TAN 90 CHECK =====
function isTanUndefined(expr){
  if(mode !== "DEG") return false;
  const regex = /Math\.tan\(Math\.PI\/180\*([0-9.]+)\)/g;
  let match;
  while ((match = regex.exec(expr)) !== null) {
    const angle = parseFloat(match[1]);
    if ((angle - 90) % 180 === 0) return true;
  }
  return false;
}

// ===== CALCUL =====
function calculate(){
  try{
    let expr = expressionInternal
      .replace(/π/g, PI)
      .replace(/\^/g, "**");

    if(isTanUndefined(expr)) throw "Erreur";

    let open = (expr.match(/\(/g) || []).length;
    let close = (expr.match(/\)/g) || []).length;
    if(open > close){
      expr += ")".repeat(open - close);
    }

    let result = Function('"use strict";return(' + expr + ')')();

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
  if(screen.textContent === "0"){
    screen.textContent = "";
  }
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
  if(screen.textContent === "0"){
    screen.textContent = "";
  }
  screen.textContent += "√(";
  expressionInternal += "Math.sqrt(";
}

// ===== FONCTIONS =====
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
  if(lastChar && /[0-9)π]/.test(lastChar)){
    screen.textContent += "×";
    expressionInternal += "*";
  }
  if(screen.textContent === "0"){
    screen.textContent = "";
  }
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
  if (mode === "DEG") {
    expressionInternal += `
      (function(a){
        if (Math.abs((a % 180) - 90) < 1e-10) {
          throw "Erreur";
        }
        return Math.tan(Math.PI / 180 * a);
      })(`;
  } else {
    expressionInternal += "Math.tan(";
  }
  break;

    case "ln":
      expressionInternal += "Math.log(";
      break;
    case "log":
      expressionInternal += "Math.log10(";
      break;
  }
}

// ===== EXPONENT =====
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
  if(screen.textContent === "0"){
    screen.textContent = "";
  }
  screen.textContent += "ANS";
  expressionInternal += ANS;
}

// ===== HISTORIQUE =====
function afficherHistorique(){
  historyList.innerHTML = "";
  history.slice().reverse().forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    li.onclick = () => {
      let res = item.split("=").pop().trim();
      screen.textContent = res;
      expressionInternal = res;
      resetScreen = true;
    };
    historyList.appendChild(li);
  });
}
const toggleBtn = document.getElementById("toggleHistory");
const historyPanel = document.querySelector(".history-panel");

if (toggleBtn && historyPanel) {
  toggleBtn.addEventListener("click", () => {
    historyPanel.classList.toggle("show");

    toggleBtn.textContent = historyPanel.classList.contains("show")
      ? "❌ Cacher l’historique"
      : "📜 Afficher l’historique";
  });
}

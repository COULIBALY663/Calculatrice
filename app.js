let screen = document.getElementById("screen");
let mode = "DEG";
const PI = 3.14;

let history = [];
let historyList = document.getElementById("historyList");
let resetScreen = false;
let expressionInternal = "";

// Ajouter un chiffre ou symbole
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

// Effacer tout
function clearAll() {
  screen.value = "0";
  expressionInternal = "";
}

// Effacer dernier caractère
function clearLast() {
  if (screen.value.length > 1) {
    screen.value = screen.value.slice(0,-1);
    expressionInternal = expressionInternal.slice(0,-1);
  } else {
    screen.value = "0";
    expressionInternal = "";
  }
}

// Changer mode DEG/RAD
function setMode(m) {
  mode = m;

  // Retirer l'effet actif
  document.getElementById("btnDEG").classList.remove("active");
  document.getElementById("btnRAD").classList.remove("active");

  // Activer le bouton sélectionné
  if (m === "DEG") {
    document.getElementById("btnDEG").classList.add("active");
  } else {
    document.getElementById("btnRAD").classList.add("active");
  }
}


// Calculer l'expression
function calculate() {
  try {
    let expr = expressionInternal.replace(/π/g, PI).replace(/\^/g,"**");

    // Ajouter parenthèses fermantes automatiquement
    let openParens = (expr.match(/\(/g)||[]).length;
    let closeParens = (expr.match(/\)/g)||[]).length;
    expr += ")".repeat(openParens - closeParens);

    // Vérifier ln : argument > 0
    expr = expr.replace(/Math\.log\((.*?)\)/g, (match, p1) => {
      let val = eval(p1);
      if(val <= 0) throw "Erreur";
      return `Math.log(${val})`;
    });

    // Vérifier tan en DEG : cos(x) proche de 0 → Erreur
    if(expressionInternal.includes("Math.tan") && Math.abs(Math.cos(parseTanArgument(expr))) < 1e-10){
      throw "Erreur";
    }

    // Évaluer l’expression
    let result = eval(expr);

    // Arrondir très petites valeurs à zéro
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

// Extraire argument de tan pour vérification
function parseTanArgument(expr) {
  let match = expr.match(/Math\.tan\((.*?)\)/);
  if(match) {
    try {
      return eval(match[1]);
    } catch {
      return NaN;
    }
  }
  return NaN;
}

// Fonctions scientifiques
function insertSqrt() {
  if(resetScreen){ screen.value=""; expressionInternal=""; resetScreen=false; }
  if(screen.value === "0") screen.value = "";
  screen.value += "√(";
  expressionInternal += "Math.sqrt(";
}

function sin() { addFunc("sin"); }
function cos() { addFunc("cos"); }
function tan() { addFunc("tan"); }
function log() { addFunc("log"); }
function ln() { addFunc("ln"); }

function addFunc(func) {
  if(resetScreen){ screen.value=""; expressionInternal=""; resetScreen=false; }
  if(screen.value === "0") screen.value = "";
  screen.value += func + "(";
  switch(func){
    case "sin":
      expressionInternal += mode==="DEG" ? "Math.sin(Math.PI/180*" : "Math.sin(";
      break;
    case "cos":
      expressionInternal += mode==="DEG" ? "Math.cos(Math.PI/180*" : "Math.cos(";
      break;
    case "tan":
      expressionInternal += mode==="DEG" ? "Math.tan(Math.PI/180*" : "Math.tan(";
      break;
    case "ln":
      expressionInternal += "Math.log("; // logarithme népérien
      break;
    case "log":
      expressionInternal += "Math.log10("; // logarithme base 10
      break;
  }
}

// Ajouter π
function insertPi() {
  if(resetScreen){ screen.value=""; expressionInternal=""; resetScreen=false; }
  if(screen.value === "0") screen.value = "";
  screen.value += "π";
  expressionInternal += PI;
}

// Ajouter exposant ^
function appendExponent() {
  if(screen.value === "0") screen.value = "";
  screen.value += "^";
  expressionInternal += "^";
}

// Afficher historique
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
setMode("DEG"); // Mode par défaut
function toggleHistory() {
  const panel = document.getElementById("historyPanel");
  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

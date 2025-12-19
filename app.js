let screen = document.getElementById("screen");
let mode = "DEG";
const PI = Math.PI;

let history = [];
let historyList = document.getElementById("historyList");
let resetScreen = false;
let expressionInternal = "";
let ANS = 0;

// Fonction utilitaire pour multiplication implicite
function addImplicitMultiplication(lastChar, nextValue){
  if(!lastChar) return "";

  // Si le dernier caractère est un chiffre, une parenthèse fermante, π ou ANS
  if(/[0-9)π]/.test(lastChar)) {
    // Et si le caractère suivant est chiffre, parenthèse ouvrante, π ou fonction
    if(/^[0-9(π]/.test(nextValue) || /^(sin|cos|tan|log|ln|Math\.sqrt)/.test(nextValue)){
      return "*";
    }
  }
  return "";
}

// Ajouter un caractère ou chiffre
function append(value){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let last = expressionInternal.slice(-1);

  expressionInternal += addImplicitMultiplication(last, value);
  if(addImplicitMultiplication(last, value)) screen.textContent += "×";

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += value;
  expressionInternal += value;
}

// Tout effacer
function clearAll(){
  screen.textContent = "0";
  expressionInternal = "";
}

// Supprimer le dernier caractère
function clearLast(){
  if(screen.textContent.length > 1){
    screen.textContent = screen.textContent.slice(0,-1);
    expressionInternal = expressionInternal.slice(0,-1);
  }else{
    screen.textContent = "0";
    expressionInternal = "";
  }
}

// Définir le mode DEG/RAD
function setMode(m){
  mode = m;
  document.getElementById("btnDEG").classList.remove("active");
  document.getElementById("btnRAD").classList.remove("active");
  document.getElementById(m === "DEG" ? "btnDEG" : "btnRAD").classList.add("active");
}

// Calculer l'expression
function calculate(){
  try{
    let expr = expressionInternal.replace(/π/g, PI).replace(/\^/g,"**");

    let openParens = (expr.match(/\(/g)||[]).length;
    let closeParens = (expr.match(/\)/g)||[]).length;
    expr += ")".repeat(openParens - closeParens);

    let result = eval(expr);
    if(Math.abs(result) < 1e-10) result = 0;
    result = parseFloat(result.toFixed(10));

    ANS = result; // sauvegarde ANS

    history.push(`${screen.textContent} = ${result}`);
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

// Insérer π avec multiplication implicite
function insertPi(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let last = expressionInternal.slice(-1);

  expressionInternal += addImplicitMultiplication(last, "π");
  if(addImplicitMultiplication(last, "π")) screen.textContent += "×";

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += "π";
  expressionInternal += "π";
}

// Insérer √ avec multiplication implicite
function insertSqrt(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let last = expressionInternal.slice(-1);

  expressionInternal += addImplicitMultiplication(last, "Math.sqrt");
  if(addImplicitMultiplication(last, "Math.sqrt")) screen.textContent += "×";

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += "√(";
  expressionInternal += "Math.sqrt(";
}

// Ajouter les fonctions sin, cos, tan, log, ln
function sin(){ addFunc("sin"); }
function cos(){ addFunc("cos"); }
function tan(){ addFunc("tan"); }
function log(){ addFunc("log"); }
function ln(){ addFunc("ln"); }

function addFunc(func){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let last = expressionInternal.slice(-1);

  expressionInternal += addImplicitMultiplication(last, func);
  if(addImplicitMultiplication(last, func)) screen.textContent += "×";

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += func + "(";

  switch(func){
    case "sin":
      expressionInternal += mode==="DEG"
        ? "Math.sin(Math.PI/180*"
        : "Math.sin(";
      break;
    case "cos":
      expressionInternal += mode==="DEG"
        ? "Math.cos(Math.PI/180*"
        : "Math.cos(";
      break;
    case "tan":
      expressionInternal += mode==="DEG"
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

// Ajouter exposant ^
function appendExponent(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }
  screen.textContent += "^";
  expressionInternal += "^";
}

// Afficher l’historique
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

// Insérer ANS (dernier résultat)
function insertANS(){
  if(resetScreen){
    screen.textContent = "";
    expressionInternal = "";
    resetScreen = false;
  }

  let last = expressionInternal.slice(-1);

  expressionInternal += addImplicitMultiplication(last, "ANS");
  if(addImplicitMultiplication(last, "ANS")) screen.textContent += "×";

  if(screen.textContent === "0") screen.textContent = "";

  screen.textContent += "ANS";
  expressionInternal += ANS;
}

// Définir le mode par défaut
setMode("DEG");

/////////////////////////////////////////////////////////////////
// GAMEBOARD - data
/////////////////////////////////////////////////////////////////
const gameBoard = (() => {

  let gameBoardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let playerArray = [];
  let iaArray = [];
  let yourTurn = true;
  let gameOverBoolean = false;

  const winCombo = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ]

  function getTurn() {
    return yourTurn
  }

  function switchTurn() {
    yourTurn ? yourTurn = false : yourTurn = true;
    !gameOverBoolean && !yourTurn ? iaController.iaPlay() : null;
  }

  return {
    gameBoardArray,
    playerArray,
    iaArray,
    winCombo,
    gameOverBoolean,
    switchTurn,
    getTurn
  }
})();
/////////////////////////////////////////////////////////////////
// GAME FLOW
/////////////////////////////////////////////////////////////////
const gameFlow = (() => {

  function addMark(cell) {
    if (gameBoard.getTurn() && cell.dataset.available === "available" && !gameBoard.gameOverBoolean) {
      let crossImg = document.createElement("img");
      crossImg.src = "assets/cross.png";
      crossImg.style.width = "100%";
      crossImg.style.height = "90%";
      cell.appendChild(crossImg);
      cell.dataset.available = "notAvailable";

    } else if (!gameBoard.getTurn() && cell.dataset.available === "available" && !gameBoard.gameOverBoolean) {
      let circleImg = document.createElement("img");
      circleImg.src = "assets/circle.jpg";
      circleImg.style.width = "100%";
      circleImg.style.height = "80%";
      cell.appendChild(circleImg);
      cell.dataset.available = "notAvailable";
    } else {
      return
    }
    updateDataBoard(cell)
    checkWinner()
  }

  function updateDataBoard(cell) {
    let cellId = parseInt(cell.dataset.cellid);
    gameBoard.getTurn() ? gameBoard.playerArray.push(cellId) : gameBoard.iaArray.push(cellId);
    gameBoard.gameBoardArray = gameBoard.gameBoardArray.filter(value => value !== cellId);
  }

  function checkWinner() {
    let p = gameBoard.playerArray;
    let ia = gameBoard.iaArray;
    let w = gameBoard.winCombo;

    (gameBoard.gameBoardArray.length > 5) ? changeTurn(): compareArray();

    function compareArray() {
      let pW = w.map(arr => arr.every(element => p.indexOf(element) > -1));
      (pW.includes(true)) ? gameOver("You win"): null;
      let iaW = w.map(arr => arr.every(element => ia.indexOf(element) > -1));
      (iaW.includes(true)) ? gameOver("You loose"): null;
      !pW.includes(true) && !iaW.includes(true) && gameBoard.gameBoardArray.length === 0 ? gameOver("tie game") : null; // si aucun gagnant et plus de case valide à jouer, gameOver égalité
      !gameBoard.gameOverBoolean ? changeTurn() : null; // si aucun gagnant, changeTurn()
    };
  }

  function changeTurn() {
    displayController.toogleTurnIndication();
    gameBoard.switchTurn(); // lance iaPlay()
  }

  function gameOver(winner) {
    gameBoard.gameOverBoolean = true;
    document.getElementById('js-open-modal').click();
    document.getElementById("exampleModalLabel").textContent = `${winner} !`;
  }

  function replay() {
    document.location.reload(true);
    // setTimeOut(document.getElementById('js-btn-card').click, 1000);
  }
  return {
    addMark,
    replay
  }
})();
/////////////////////////////////////////////////////////////////
// IA CONTROLLER
/////////////////////////////////////////////////////////////////
const iaController = (() => {
  function iaPlay() {
    let bestMove = searchBestMove(); 
    setTimeout(suiteTraitement, 400);

    function suiteTraitement() {
      document.body.querySelector(`.cellGame[data-cellId='${bestMove}']`).click();
    }
  }
  function searchBestMove() {
    let validMove = gameBoard.gameBoardArray;
    let winCombo = gameBoard.winCombo;
    let currentIaBoard = gameBoard.iaArray.slice();
    let currentPlayerBoard = gameBoard.playerArray.slice();
    let winMove = [];
    
    for (let i = 0; i < validMove.length; i++) {
      
      currentIaBoard.push(validMove[i]);
      let j = winCombo.map(arr => arr.every(element => currentIaBoard.indexOf(element) > -1));
      (j.includes(true)) ? (winMove.push(validMove[i]),currentIaBoard.pop()): currentIaBoard.pop();
      
      currentPlayerBoard.push(validMove[i]);
      let h = winCombo.map(arr => arr.every(element => currentPlayerBoard.indexOf(element) > -1));
      (h.includes(true)) ? (winMove.push(validMove[i]),currentPlayerBoard.pop()) : currentPlayerBoard.pop();
    }
      console.log({winMove});
    if(winMove[0]){
      return winMove[0] 
    }else{
      return minMax(gameBoard.gameBoardArray, winCombo, gameBoard.iaArray);
    } 
  }
  
  function minMax(validMove, winCombo, currentIaBoard) {
    let nextMove, ia = [], h = [], corner = [1,3,7,9];
    if(!currentIaBoard.length && gameBoard.playerArray[0] !== 5){return 5};
    if(!currentIaBoard.length){return corner[Math.floor(Math.random() * corner.length)]};
    for (let i = 0; i < validMove.length; i++) {
      let cIa = [...currentIaBoard.slice()];
      let vM  = validMove.slice();
      for (let j = 0; j < vM.length; j++) {
        vM  = validMove.slice();
        vM.splice(j,1);
        for (let k = 0; k < vM.length; k++) {
          ia.push([...cIa,vM[i], vM[k]]);
          h.push(winCombo.map(arr => arr.every(element => ia[ia.length-1].indexOf(element) > -1)));
          if(h[h.length-1].includes(true)){nextMove = vM[i]; break}
          h = [];
        }
      }
    }
    if(!nextMove){ 
      return gameBoard.gameBoardArray[Math.floor(Math.random() * gameBoard.gameBoardArray.length)];
    }else{
      return nextMove;
    }
  }
  return {
    iaPlay
  }
})();
/////////////////////////////////////////////////////////////////
//DISPLAY CONTROLLER
/////////////////////////////////////////////////////////////////
const displayController = (() => {

  function showBoard() {
    if (document.getElementById('js-title-card').textContent !== "Good luck !") {

      const cardHeader = document.getElementById('header-wrap');
      const cardTitle = document.getElementById('js-title-card');
      const cardbtn = document.getElementById('js-btn-card');
      const board = document.getElementById("board");

      cardHeader.classList.add("activeTranslate");
      cardTitle.textContent = "Good luck !";
      cardbtn.textContent = "replay";
      setTimeout(suiteTraitement, 800);

      function suiteTraitement() {
        board.style.visibility = "visible";
      }
      displayController.overAvailableCase();
    } else {
      gameFlow.replay();
    }
  };

  function overAvailableCase() {
    const cellBoard = document.querySelectorAll("div.cellGame");
    cellBoard.forEach(cell => cell.addEventListener("mouseover",
      () => {
        cell.dataset.available === "available" && gameBoard.getTurn() ? cell.style.backgroundColor = "#089aad65" : false
      }));
    cellBoard.forEach(cell => cell.addEventListener("mouseout", () => {
      cell.style.backgroundColor = null
    }));
  }

  function toogleTurnIndication() {
    let currentTurnIndaction = document.getElementById("js-turn-text");
    currentTurnIndaction.textContent === "your turn" ? currentTurnIndaction.textContent = "ia turn" : currentTurnIndaction.textContent = "your turn";
  }
  return {
    showBoard,
    overAvailableCase,
    toogleTurnIndication
  }
})();
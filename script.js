const gameBoard = (() => {

  let gameBoardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let playerArray = [];
  let iaArray = [];
  let yourTurn = true;

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
    !yourTurn ? iaController.iaPlay() : null;
  }

  return {
    gameBoardArray,
    playerArray,
    iaArray,
    winCombo,
    switchTurn,
    getTurn
  }
})();
/////////////////////////////////////////////////////////////////
const gameFlow = (() => {

  function addMark(cell) {
    if (gameBoard.getTurn() && cell.dataset.available === "available") {
      let crossImg = document.createElement("img");
      crossImg.src = "assets/cross.png";
      crossImg.style.width = "100%";
      crossImg.style.height = "auto";
      cell.appendChild(crossImg);
      cell.dataset.available = "notAvailable";

    } else if (!gameBoard.getTurn() && cell.dataset.available === "available") {
      let circleImg = document.createElement("img");
      circleImg.src = "assets/circle.png";
      circleImg.style.width = "100%";
      circleImg.style.height = "auto";
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

    changeTurn()
  }

  function changeTurn() {
    gameBoard.switchTurn(); // lance iaPlay()
    displayController.toogleTurnIndication();
  }

  return {
    addMark
  }
})();
///////////////////////////////////////////////////////////////////
const iaController = (() => {
  function iaPlay() {
    let bestMove = gameBoard.gameBoardArray[Math.floor(Math.random() * gameBoard.gameBoardArray.length)];
    setTimeout(suiteTraitement, 800);

    function suiteTraitement() {
      document.body.querySelector(`.cellGame[data-cellId='${bestMove}']`).click();
    }
  }
  return {
    iaPlay
  }
})();
////////////////////////////////////////////////////////////////////
const displayController = (() => {

  function showBoard() {
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
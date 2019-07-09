const gameBoard = (() => {
  let gameBoardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
})();

const gameFlow = () => {

}

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
        cell.dataset.available === "available" ? cell.style.backgroundColor = "#089aad65" : false
      }));
    cellBoard.forEach(cell => cell.addEventListener("mouseout", () => {
      cell.style.backgroundColor = null
    }));
  }

  function toogleTurnIndication() {
    const currentTurnIndaction = document.getElementById("js-turn-text");
    (currentTurnIndaction.textContent === "your turn") ? currentTurnIndaction.textContent = "Ia turn": currentTurnIndaction.textContent === "your turn";
  }
  return {
    showBoard,
    overAvailableCase,
    toogleTurnIndication
  }
})();
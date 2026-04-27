let board = [];
let currentPlayer = "X";
let gameActive = false; 
let timer;
let timeLeft = 180;

const images = {
    1: { X: "images/x.png", O: "images/o.png" },
    2: { X: "images/gato.png", O: "images/perro.png" },
    3: { X: "images/sol.png", O: "images/luna.png" }
};

const names = {
    1: { X: "X", O: "O" },
    2: { X: "Gato", O: "Perro" },
    3: { X: "Sol", O: "Luna" }
};


window.onload = () => {
    createBoard();
};

function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board = Array(9).fill("");

    document.getElementById("message").textContent = "";
    document.getElementById("restartBtn").style.display = "none";

    const color1 = document.getElementById("color1").value;
    const color2 = document.getElementById("color2").value;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        cell.style.backgroundColor = (i % 2 === 0) ? color1 : color2;

        cell.addEventListener("click", () => makeMove(i, cell));
        boardDiv.appendChild(cell);
    }
}


function startGame() {
    clearInterval(timer);
    createBoard();
    gameActive = true;
    currentPlayer = "X";
    startTimer();
}

function makeMove(index, cell) {
    if (!gameActive || board[index] !== "") return;

    const set = document.getElementById("imageSet").value;

    const img = document.createElement("img");
    img.src = images[set][currentPlayer];

    cell.appendChild(img);
    board[index] = currentPlayer;

    if (checkWinner(set)) {
        gameActive = false;
        clearInterval(timer);
        showWinner(set);
        return;
    }

    if (checkDraw()) {
        gameActive = false;
        clearInterval(timer);
        showDraw();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// EMPATE
function checkDraw() {
    return board.every(cell => cell !== "");
}

//  MOSTRAR GANADOR 
function showWinner(set) {
    const msg = document.getElementById("message");
    const winnerName = names[set][currentPlayer];

    msg.textContent = `Ganó ${winnerName}`;
}


function showDraw() {
    const msg = document.getElementById("message");
    msg.textContent = "Empate";

    document.getElementById("restartBtn").style.display = "inline-block";
}

// CHECK GANADOR
function checkWinner(set) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let pattern of winPatterns) {
        const [a,b,c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWin(pattern);
            return true;
        }
    }
    return false;
}

// RESALTAR GANADOR
function highlightWin(pattern) {
    const winColor = document.getElementById("winColor").value;
    const cells = document.querySelectorAll(".cell");

    pattern.forEach(i => {
        cells[i].style.border = `5px solid ${winColor}`;
    });
}

// TIMER 
function startTimer() {
    timeLeft = 180;
    updateTimer();

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;

            document.getElementById("message").textContent = "Tiempo terminado (Empate)";
            document.getElementById("restartBtn").style.display = "inline-block";
        }
    }, 1000);
}

function updateTimer() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
}
const gameBoard = function() {
    let board = [];

    const createBoard = () => {
        for (let index = 0; index < 3; index++) {
            board.push([0, 0, 0]);   
        }
    }
    
    const reset = () => {
        board = [];
        createBoard();
    }

    const getBoard = () => {
        return board;
    }

    const updateBoard = (x, y, playerNr) => {
        board[x][y] = playerNr;
    }

    const getPositionValue = (x, y) => {
        return board[x][y];
    }

    const checkWinner = () => {
        // horizontal
        for (let i=0; i<3; i++) {
            if (board[i][0] !== 0 && board[i][0] === board[i][1] && board[i][1] === board[i][2])
                return board[i][0];
        }
        // vertical
        for (let i=0; i<3; i++) {
            if (board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i])
                return board[0][i];
        }
        // diagonal
        if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2])
            return board[0][0];
        if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[2][0] === board[1][1])
            return board[0][2];
        return false;
    }

    const checkGameOver = () => {
        if (checkWinner()) {
            return true;
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) 
                    return false;
            }            
        }
        return true;
    }

    createBoard();

    return { getBoard, updateBoard, checkWinner, checkGameOver, getPositionValue, reset }
}

function createPlayer(name, stoneType) {
    return { name, stoneType }
}

const gameManager = function() {
    const board = gameBoard();
    const player1 = createPlayer("Player 1", 1);
    const player2 = createPlayer("Player 2", 2);

    let activePlayer = player1;

    const playRound = (x, y) => {
        if (!checkValidPosition(x, y)) {
            return;
        }

        board.updateBoard(x, y, activePlayer.stoneType);

        // switch players
        activePlayer = (activePlayer === player1) ? player2 : player1;
    }

    const gameOver = () => {
        return board.checkGameOver();
    }

    const getGameWinner = () => {
        winner = board.checkWinner();
        if (winner === false) {
            return undefined;
        }
        return (winner === player1.stoneType) ? player1.name : player2.name;
    }

    const checkValidPosition = (x, y) => {
        return !board.getPositionValue(x, y);
    }

    const getBoard = () => {
        return board.getBoard();
    }

    const reset = () => {
        board.reset();
        activePlayer = player1;
    }

    const getGameOverMessage = (winner) => {
        // tie
        if (winner)
            return `${winner} won!`
        return "Tie!"
    }

    const setPlayerName = (playerNr, newName) => {
        if (playerNr === 1)
            player1.name = newName;
        else if (playerNr === 2)
            player2.name = newName;
    }

    return { playRound, gameOver, getGameWinner, reset, getGameOverMessage, getBoard, setPlayerName };
}

const displayManager = function() {
    const game = gameManager();

    const boardContainer = document.querySelector("#board-container");

    const resetButton = document.querySelector("#reset");
    const renamePlayerButtons = document.querySelectorAll(".set-name");
    const dialog = document.querySelector("dialog");
    const playerOneName = document.querySelector("#player-one-name");
    const playerTwoName = document.querySelector("#player-two-name");
    const winningMessage = document.querySelector("#win-message")

    const cells = [];

    let lockBoard = false;
    
    const createBoard = () => {
        for (let i = 0; i < 3; i++) {
            // add row
            cells.push([]);
            let row = document.createElement("div");
            row.classList.add(`row`);
            for (let j=0; j<3; j++) {
                // add cell
                let cell = document.createElement("div");
                cell.classList.add(`cell`);
                cell.id = `cell-${i}-${j}`;
                row.appendChild(cell);
                cells[i].push(cell)
            }
            boardContainer.appendChild(row);
        }
    }

    const getCellMarkerType = (value) => {
        if (value === 1)
            return "x";
        else if (value === 2)
            return "o";
        return "";
    }

    const updateBoard = () => {
        let board = game.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j=0; j<3; j++) {
                cells[i][j].textContent = getCellMarkerType(board[i][j]);
            }
        }
    }

    const resetAll = () => {
        game.reset();
        
        lockBoard = false;
        updateBoard();

        winningMessage.textContent = "";
    }

    const playGame = (x, y) => {
        game.playRound(x, y);
        updateBoard();

        if (game.gameOver()) {
            let message = game.getGameOverMessage(game.getGameWinner());
            // display
            winningMessage.textContent = message;

            lockBoard = true;
        }
    }

    boardContainer.addEventListener("click", (e) => {
        let target = e.target;

        if (target.classList.contains("cell")) {
            let [_, x, y] = target.id.split("-");
            
            if (!lockBoard)
                playGame(x, y);
        }
    });

    resetButton.addEventListener("click", e => {
        resetAll();
    });

    renamePlayerButtons.forEach(element => {
        element.addEventListener("click", (e) => {
            dialog.showModal();
            if (element.id.includes("player-one")) {
                dialog.classList.add("player-one");
            }
            else {
                dialog.classList.add("player-two");
            }
        });
    });

    dialog.addEventListener("close", e => {
        const name = document.getElementById("name").value;
        if (dialog.classList.contains("player-one")) {
            game.setPlayerName(1, name);
            playerOneName.textContent = name;
        }
        else {
            game.setPlayerName(1, name);
            playerTwoName.textContent = name;
        }

        dialog.className = "";
        dialog.querySelector("form").reset();
    });

    createBoard();

    return;
}();
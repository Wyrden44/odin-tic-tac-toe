const gameBoard = function() {
    const board = [];

    for (let index = 0; index < 3; index++) {
        board.push([0, 0, 0]);   
    }

    const getBoard = () => {
        return board;
    }

    const updateBoard = (x, y, playerNr) => {
        board[x][y] = playerNr;
    }

    const checkWinner = () => {
        // horizontal
        for (let i=0; i<3; i++) {
            if (board[i][0] === board[i][1] === board[i][2])
                return board[i][0];
        }
        // vertical
        for (let i=0; i<3; i++) {
            if (board[0][i] === board[0][i] === board[0][i])
                return board[0][i];
        }
        // diagonal
        if (board[0][0] === board[1][1] === board[2][2])
            return board[0][0];
        return false;
    }

    const checkGameOver = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) 
                    return false;
            }            
        }
        if (checkWinner()) {
            return true;
        } 
        return true;
    }

    return { getBoard, updateBoard, checkWinner, checkGameOver }
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
        board.updateBoard(x, y, activePlayer.stoneType);

        // switch players
        activePlayer = (activePlayer === player1) ? player2 : player1;
    }

    const gameOver = () => {
        return board.checkGameOver();
    }

    const getGameWinner = () => {
        return (board.checkWinner() === player1.stoneType) ? player1.name : player2.name;
    }

    const reset = () => {
        board.reset();
        activePlayer = player1;
    }

    const getGameOverMessage = (winner) => {
        // tie
        if (!winner)
            return `${Winner} won!`
        return "Tie!"
    }

    return { playRound, gameOver, getGameWinner, reset, getGameOverMessage };
}();

const displayManager = function() {
    const createBoard = () => {

    }

    const resetBoard = () => {

    }

    const updateBoard = () => {

    }

    return {};
}();
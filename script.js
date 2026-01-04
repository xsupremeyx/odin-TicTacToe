const Gameboard = (function() {
    const board = [null,null,null,null,null,null,null,null,null];
    const getBoard = () => board.slice();
    const setMark = (index,marker) => {
        if(index < 0 || index > 8) return false;
        if(isEmpty(index)){
            board[index]=marker;
            return true;
        }
        return false;
    };
    const isEmpty = (index) => (board[index] === null);
    const reset = () => board.fill(null);
    return {getBoard, setMark, isEmpty, reset};
})();

const gameController = ( function() {
    //player Factory
    const Player = (name, marker) => ({ name, marker });

    //Dependencies
    const board = Gameboard;
    const getGameBoard = () => board.getBoard();

    let activeIndex = 0;
    const players = [];
    const winIndexes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]  
    ];  //predefined critical indexes for win

    //playerMaker
    const pushPlayerDetails = (name, marker) => {
        if (marker !== "X" && marker !== "O") return false;
        if(players.length!=2){
            players.push(Player(name,marker));
            return true;
        }
        else{
            return false;
        }
    };

    const getActivePlayer = () => players[activeIndex];


    //Reset game
    const resetGame = () => {
        players.length = 0;
        board.reset();
        activeIndex = 0;
    }

    //Game initialiser
    const initGame = () => {
        resetGame();
        let name1 = "one";
        let name2 = "two";
        let marker1 = "X";
        let marker2 = "O"
        pushPlayerDetails(name1, marker1);
        pushPlayerDetails(name2, marker2);
        activeIndex = 0;
    }

    const switchPlayer = () => activeIndex = 1 - activeIndex;

    //winchecker
    const checkWin = () => {
        const currBoard = getGameBoard();
        for (const set of winIndexes) {
            let a = currBoard[set[0]]
            let b = currBoard[set[1]]
            let c = currBoard[set[2]]
            if (a === null || b === null || c === null) {
                continue;
            }
            else if ( a === b && a === c ){
                return a;
            }
        }
        //tie condition check
        for (const cell of currBoard) {
            if(cell === null){
                return 'continue';
            }
        }
        return 'tie';
    };

    //playRound Main function
    const playRound = (index) => {
        if(board.setMark(index,players[activeIndex].marker)){
            const winStatus = checkWin();
            if(winStatus === "X" || winStatus === "O"){
                const winner = players.find(p => p.marker === winStatus);
                return ({status: 'win', winner: winner});
            }
            else if (winStatus === 'tie'){
                return ({status: 'tie', winner: null});
            }
            else{
                //game continues
                switchPlayer();
                return ({status: 'continue', winner: null});
            }
        }
        else{
            return ({status: 'invalid', winner: null});
        }
    };

    return {initGame, playRound, resetGame, getGameBoard, getActivePlayer};

})();

const displayController = (function(){
    //dependencies
    let boardContainer;
    let cells = [];
    let statusBar;
    let primaryStatus;
    let secondaryStatus;
    let restartButton;
    let currentPlayer;
    let gameActive = true;

    const cacheDOM = () => {
        boardContainer = document.querySelector(".board-container");
        statusBar = document.querySelector(".status");
        primaryStatus = statusBar.querySelector(".primary");
        secondaryStatus = statusBar.querySelector(".secondary");
        restartButton = document.querySelector(".restart");
        cells = Array.from(document.querySelectorAll(".cell"));
    };

    const disableCells = () => {
        cells.forEach(cell => {
            cell.classList.add("disabled");
        });
    };

    const enableCells = () => {
        cells.forEach(cell => {
            cell.classList.remove("disabled");
        });
        gameActive = true;
    };


    const renderBoard = () => {
        const board = gameController.getGameBoard();
        for (let index = 0; index < board.length; index++) {
            cells[index].textContent = board[index] === null ? (""):(board[index]);
        }
    };

    const handleCellClick = (event) => {
        if (!gameActive) return;
        const index = +event.target.dataset.index;
        const results = gameController.playRound(index);
        console.log(results);
        if(results.status === 'tie' || results.status === 'win'){
            gameActive = false;
            disableCells();
            if(results.status === 'tie'){
                primaryStatus.textContent = "It's a tie!";
                secondaryStatus.textContent = "Click Restart to play again.";
            }
            else if (results.status === 'win') {
                primaryStatus.textContent = `Player ${results.winner.name} wins! (${results.winner.marker})`;
                secondaryStatus.textContent = "Click Restart to play again.";
            }
        }
        else if(results.status === 'continue'){
            primaryStatus.textContent = "Game On!";
            currentPlayer = gameController.getActivePlayer();
            secondaryStatus.textContent = `Player ${currentPlayer.name}'s turn (${currentPlayer.marker})`;

        }
        else if (results.status === 'invalid'){
            primaryStatus.textContent = "Invalid Move Try Again!";
            secondaryStatus.textContent = `Player ${currentPlayer.name}'s turn (${currentPlayer.marker})`;
            return;
        }
        renderBoard();
    };

    const addListenertoCells = () => {
        cells.forEach(cell => {
            cell.addEventListener("click", handleCellClick);
        });
    };

    const resetHandler = () => {
        gameController.initGame();
        enableCells();
        currentPlayer = gameController.getActivePlayer();
        primaryStatus.textContent = "Start Game!";
        secondaryStatus.textContent = `Player ${currentPlayer.name} to play first (${currentPlayer.marker})`;
        renderBoard();
    }

    const init = () => {
        cacheDOM();
        gameController.initGame();
        enableCells();
        // restartButton.addEventListener("click", init);
        currentPlayer = gameController.getActivePlayer();
        primaryStatus.textContent = "Start Game!";
        secondaryStatus.textContent = `Player ${currentPlayer.name} to play first (${currentPlayer.marker})`;
        renderBoard();
        addListenertoCells();
        restartButton.addEventListener("click", resetHandler);
    };

    return {init};
})();

displayController.init();




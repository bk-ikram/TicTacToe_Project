//shouldconsider splitting the game controller module into game and round controller modules.

function Cell(){
    //setup initial value of cell
    let cellValue = 0;

    const fillCellValue = (player) => {
        cellValue = player.value;
    };

    const fillCellToken = (player) => {
        cellValue = player.token;
    };

    const getCellValue = () => {
        return cellValue;
    };

    return {fillCellValue,fillCellToken,getCellValue}
}

function GameBoard(){
    //Create the cells on the board
    const rows = 3;
    const columns = 3;
    const boardValues = [];
    const boardTokens = [];
    for(let i = 0; i<rows; i++){
        //boardValues.push([]);
        boardValues[i] = [];
        for(let j=0; j<columns; j++){
            boardValues[i].push(Cell());
        };
    };

    for(let i = 0; i<rows; i++){
        //boardTokens.push([]);
        boardTokens[i] = [];
        for(let j=0; j<columns; j++){
            boardTokens[i].push(Cell());
        };
    };

    //return the state of the board
    const getBoardValues = () => {
        return boardValues.map((row)=>row.map((cell)=> cell.getCellValue()));
    };

    //return board tokens
    const getBoardTokens = () => {
        return boardTokens.map((row)=>row.map((cell)=> cell.getCellValue()));
    };

    //Display Board tokens
    const displayBoardTokens = () => {
        const boardWithToken = getBoardTokens();
        console.log(boardWithToken);
    };



    //Fill cell

    const fillCell = (player,row,column) => {
        if(boardValues[row][column].getCellValue()){
            console.log("value already detected there.")
            return;
        }
        boardValues[row][column].fillCellValue(player);
        boardTokens[row][column].fillCellToken(player);
    }

    return {getBoardValues,getBoardTokens,displayBoardTokens,fillCell};
}

function GameController(Player1Name = "Player 1", Player2Name = "Player 2"){
    //Initialize the players
    const players = [{player: Player1Name,token: "x", value: 1, wins: 0}
                    ,{player: Player2Name,token: "o", value: -1, wins: 0}];
    
    //Create the board
    let board = GameBoard();
    
    //Keep track of round winners
    let CurrentWinner = undefined;
    let winners = [];

    //To check if current round is over
    let IsRoundDone = false;

    //Monitor current player
    let currentPlayer = players[0];

    const switchPlayer = ()=>{
        currentPlayer = currentPlayer === players[0]? players[1] : players[0];
    }

    const getCurrentPlayer = ()=>{
        return currentPlayer;
    }

    const transpose = (matrix)=>{
        let columns = matrix.length;
        let rows = matrix[0].length;
        transposedGrid = [];
        for(let i = 0; i<rows; i++){
            transposedGrid[i] = [];
            for(let j=0; j<columns; j++){
                transposedGrid[i].push(matrix[j][i]);
            };
        }
        return transposedGrid;
    };

    const rowSums = (matrix) =>{
        return matrix.map((row) => row.reduce((tot,i) => i + tot))
    };

    const getVectorSums = (matrix) =>{
        let vectorSums =[]
        //sum up cell values across rows, columns and diagonals. Sums = -3 denotes a win for player 2, Sums = 3 denotes a win for player 1;

        //start with rows
        vectorSums.push(rowSums(matrix));

        //Then get column sums by transposing the matrix, then getting row sums
        vectorSums.push(rowSums(transpose(matrix)));

        //then the sums of each diagonal
        vectorSums.push(matrix[0][0] + matrix[1][1] + matrix[2][2]);
        vectorSums.push(matrix[0][2] + matrix[1][1] + matrix[2][0]);
        return vectorSums.flat();
    } 

    const checkForWinner = (matrix) =>{
        let vectorSums = getVectorSums(matrix);
        if(vectorSums.includes(3)){
            //Player 1
            return 1;
        }
        if(vectorSums.includes(-3)){
            //Player 2
            return 2;
        }
        //No winner
        return null;
    } 
    const checkRoundEnd = () => {
        const matrix = board.getBoardValues();
        //Check for winner
        const winner = checkForWinner(matrix);

        //If there is no winner, check if the board is full
        const isBoardFull = !matrix.flat().includes(0);

        // If there is a winner or the board is full, then the round is over
        const isRoundDone = !!winner || !!isBoardFull;
        return [isRoundDone,winner];

    }

    const getRoundEndStatus = () => {
        return IsRoundDone;
    }

    const getWinners = () => {
        return winners;
    }

    const displayRoundStatus = () =>{
        board.displayBoardTokens();
        console.log(`It is now ${getCurrentPlayer().player}'s Turn.`);

    }
    const resetRound = () =>{
        CurrentWinner = undefined;
        board = GameBoard();
    }

    const resetGame = () =>{
        resetRound();
        winners = [];
    }

    //allow player to play
    const playTurn = (row,column) => {
        board.fillCell(getCurrentPlayer(),row,column);
        let winnerAnnouncement=''
        //Check if game won or round ended
        let [isRoundDone,currentWinner] = checkRoundEnd();
        IsRoundDone = isRoundDone;
        CurrentWinner = currentWinner;

        if(IsRoundDone){
            board.displayBoardTokens();
            winners.push(CurrentWinner);
            //Check if we have a winner
            switch(CurrentWinner){
                case 1:
                    winnerAnnouncement = `${Player1Name} is the winner!`
                    break;
                case 2:
                    winnerAnnouncement = `${Player2Name} is the winner!`
                    break;
                default:
                    winnerAnnouncement = `It is a Draw!`
                    break;
            }
            console.log(winnerAnnouncement);
        }
        else{
            switchPlayer();
            displayRoundStatus();
        }
        
        
    }
    
    displayRoundStatus();
    



    

    return{playTurn,getCurrentPlayer,getRoundEndStatus, getWinners,resetRound,resetGame};

}

function ScreenController(){
    const game = GameController();
    const grid = document.querySelector(".game-grid");
    const turn = document.querySelector("player-turn");
    const 
    

}

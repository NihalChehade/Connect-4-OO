class Player {
    constructor(color) {
        this.color = color;
    }

}
class Game {
    constructor(height, width, p1, p2) {
        this.board = [];
        this.currPlayer = {player1 : p1};
        this.gameOver = false;
        this.WIDTH = width;
        this.HEIGHT = height;
        this.players = [{player1 : p1}, {player2 : p2}];
        this.makeBoard();
        this.makeHtmlBoard();
    }

    makeBoard() {
        const board = document.getElementById('board');
        board.innerHTML = "";
        for (let y = 0; y < this.HEIGHT; y++) {
            this.board.push(Array.from({ length: this.WIDTH }));
        }
    }

    makeHtmlBoard() {
        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        const handleBoundClick = this.handleClick.bind(this);
        top.addEventListener('click', handleBoundClick);

        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top);

        // make main part of board
        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }

    }

    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        console.log(Object.values(this.currPlayer)[0]);
        piece.style.backgroundColor =  Object.values(this.currPlayer)[0].color;
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    endGame(msg) {
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.handleClick);
        const annWinner=document.getElementById('Winner-Announcer');
        annWinner.innerHTML=msg;
        // alert(msg);
    
    }

    handleClick(evt) {
        if (!this.gameOver) {
            // get x from ID of clicked cell
            const x = +evt.target.id;

            // get next spot in column (if none, ignore click)
            const y = this.findSpotForCol(x);
            if (y === null) {
                return;
            }

            // place piece in board and add to HTML table
            this.board[y][x] = Object.values(this.currPlayer)[0];
            this.placeInTable(y, x);
        } else {
            alert("Game is over!, Choose new Player Colors then hit start a new game!")
        }
        // check for win
        if (this.checkForWin()) {
            document.getElementById('p1Color').value="#ff0000";
            document.getElementById('p2Color').value="#0000ff"; 
            this.gameOver = true;
            return this.endGame(`Game is over! ${ Object.keys(this.currPlayer)[0]} won!, Choose new Game Colors then hit start a new game!`);
        }

        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
            this.gameOver = true;
            return this.endGame('Tie! Try Again!');
        }
      
        // switch players
        this.currPlayer = Object.keys(this.currPlayer)[0] === Object.keys(this.players[0])[0]? this.players[1] : this.players[0];

    }

    _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < this.HEIGHT &&
                x >= 0 &&
                x < this.WIDTH &&
             
                this.board[y][x] ===  Object. values(this.currPlayer)[0]
                );
    }

    checkForWin() {
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // find winner (only checking each win-possibility as needed)
                if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {

                    return true;
                }
            }
        }
    }
}





const startBtn = document.querySelector("#btnStart");
startBtn.addEventListener('click', () => {
    const annWinner=document.getElementById('Winner-Announcer');
        annWinner.innerHTML="";
    const Player1Color=document.getElementById('p1Color').value;
    const Player2Color=document.getElementById('p2Color').value; 
    const p1 = new Player(Player1Color);
    const p2 = new Player(Player2Color);
    const newGame = new Game(6, 7, p1, p2);

    
}); 

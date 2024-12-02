let game;
class Cell {
    x;
    y;
    isFlagged = false;
    isRevealed = false;
    #adjacentMines = 0;
    #isMine = false;

    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.timerStarted = false;  
        this.timeElapsed = 0;      
        this.timerInterval = null; 

    }

    ToggleFlag() {
        if (this.isRevealed) {
            this.isFlagged = false;
            return;
        }

        let url = 'assets/flag' + Math.floor(Math.random() * 4 + 1) + '.ogg'
        new Audio(url).play();

        this.isFlagged = !this.isFlagged;
        const cell = document.getElementById(this.x + ',' + this.y);
        cell.innerHTML = this.isFlagged ? '<img src="assets/flower' + Math.floor(Math.random() * 10 + 1) + '.png" alt="Flag" class="flag">' : '';
    }

    GetIsMine() {
        return this.#isMine;
    }

    SetIsMine(bool) {
        console.log("SetIsMine " + bool);
        this.#isMine = bool;
        if (bool) {
            document.getElementById(this.x + ',' + this.y).style = 'background-image: url("assets/stone.webp")'; // TODO: Remove when done debugging
        }
        else {
            document.getElementById(this.x + ',' + this.y).style = 'background-image: url("assets/grass.jpg")'; // TODO: Remove when done debugging
        }
        
    }

    GetAdjacentMines () {
        return this.#adjacentMines;
    }

    SetAdjacentMines(num) {
        this.#adjacentMines = num;
    }
    
    DigCell() {
        this.isRevealed = true;
    } 
}

class Minesweeper {
    firstDig = true;
    firstDigCoords;
    listCells = [];

    constructor(dimension = 0, numMines = 0) {
        this.dimension = dimension;
        this.numMines = numMines;
    }

    StartTimer() {
        if(this.timerStarted = true) {
            return;
        }
        
        this.timerStarted = true;

        this.timerInterval = setInterval(() => {
            this.timerElapsed++;
            document.getElementById('timer').textContent = this.timeElapsed;
        }, 1000);
    }

    GameOver() {
        new Audio('assets/fuse.ogg').play();

        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                if (this.listCells[i][j].GetIsMine()) {
                    const cell = document.getElementById(i + ',' + j);
                    cell.style = 'background-image: url("assets/tnt.webp")'; // Show mine if the cell is a mine
                    
                }
            }
        }
    }

    Dig(x,y,userInputted) {
        if (this.listCells[x][y].isFlagged && userInputted) { // Spot is flagged
            return;
        }
        if (this.listCells[x][y].isRevealed) { // Spot is already revealed
            return;
        }
        if (this.listCells[x][y].GetIsMine() && userInputted) { // User clicks a mine
            this.GameOver();
        }
        if (this.firstDig) {
            this.firstDig = false;
            this.firstDigCoords = [x,y];
            this.InitMines();
        }

        this.StartTimer();
        this.listCells[x][y].isFlagged = false;
        this.listCells[x][y].DigCell();

        if (!this.listCells[x][y].GetIsMine()) {
            if (userInputted) {
                let url = 'assets/dig' + Math.floor(Math.random() * 4 + 1) + '.ogg'
                new Audio(url).play(); 
            }
            const cell = document.getElementById(x + ',' + y);
            cell.style = 'background-image: url("assets/dirt.webp")';
            let adjacentMines = this.listCells[x][y].GetAdjacentMines();
            cell.innerHTML = adjacentMines == 0 ? '' : adjacentMines;
        }


        if (this.listCells[x][y].GetAdjacentMines() != 0) {
            return;
        }

        // Recursively dig adjacent cells with no adjacent mines
        for (let i = x - 1; i <= x + 1; i++) {
            // Skip row if the cell is against the top or bottom boundary
            if (i < 0 || i > this.dimension - 1) { continue; }
            for (let j = y - 1; j <= y + 1; j++) {

                // Skip column if the cell is against the left or right boundary
                if (j < 0 || j > this.dimension - 1) { continue; }
                // Skip if its the current cell
                if (i == x && j == x) { continue; }

                this.Dig(i,j,false);
            }
        }
    }

    MakeGrid() {
        console.log(this.dimension)
        let str = '<table id="board">';

        for (let i = 0; i < this.dimension; i++) { // height
            str += '<tr>';
            for (let j = 0; j < this.dimension; j++) { // width
                str += '<td '
                    + 'id="' + i + ',' + j + '" '
                    + 'onclick="game.Dig(' + i + ',' + j + ',true)" '
                    + 'oncontextmenu="game.ToggleFlag(' + i + ', ' + j + ')">'
                    //+ i + ',' + j
                    + '</td>';
            }
            str += '</tr>';
        }

        document.getElementById("gameDisplay").innerHTML = `
      <div id="clock">Time: <span id="timer">0</span> seconds</div>
        ` + str + `
    <button type="button" onclick="GameInit()" class="main_button">Change Difficulty</button>`;

    }    

    // Initialize the 2d array of cells
    InitCells() {
        for (let i = 0; i < this.dimension; i++) {
            let row = [];

            for (let j = 0; j < this.dimension; j++) {
                console.log(i,j)
                let newCell = new Cell(i,j);
                row.push(newCell);
            }
            this.listCells.push(row);
        }

        console.log(this.listCells);

    }

    InitMines() {
        // Choose random positions to set as mines
        for (let i = 0; i < this.numMines; i++) {
            let x = Math.floor(Math.random() * this.dimension);
            let y = Math.floor(Math.random() * this.dimension);
    
            // Spot is already a mine; randomize again until a free spot is found
            while (this.listCells[x][y].GetIsMine() 
                    || (x >= this.firstDigCoords[0] - 1 && x <= this.firstDigCoords[0] + 1) 
                    && (y >= this.firstDigCoords[1] - 1 && y <= this.firstDigCoords[1] + 1)
                ) {
                x = Math.floor(Math.random() * this.dimension);
                y = Math.floor(Math.random() * this.dimension);
            }
    
            this.listCells[x][y].SetIsMine(true);

            // Increment the number of mines each of its neighbors has
            for (let j = x - 1; j <= x + 1; j++) {
                // Skip row if the mine is against the top or bottom boundary
                if (j < 0 || j > this.dimension - 1) { continue; }

                for (let k = y - 1; k <= y + 1; k++) {
                    // Skip column if the mine is against the left or right boundary
                    if (k < 0 || k >  this.dimension - 1) { continue; }
                    let currCount = this.listCells[j][k].GetAdjacentMines() + 1;
                    this.listCells[j][k].SetAdjacentMines(currCount);
                }
            }
        }
    }

    ToggleFlag(x,y) {
        this.StartTimer();
        event.preventDefault();
        this.listCells[x][y].ToggleFlag();
    }
}

function GameInit() {
    document.getElementById("gameDisplay").innerHTML =
      '<h1>Select Difficulty</h1>'
    + '<button type="button" onclick="StartGame(10,10)" class="main_button">Easy (10x10, 10 mines)</button><br>'
    + '<button type="button" onclick="StartGame(18,50)" class="main_button">Medium (18x18, 50 mines)</button><br>'
    + '<button type="button" onclick="StartGame(20,100)"class="main_button">Hard (20x20, 100 mines)</button><br>'
}


function StartGame(dimension, numMines) {
    game = new Minesweeper(dimension, numMines);
    game.MakeGrid();
    game.InitCells();
}
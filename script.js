var game;
var isLoggedIn = false;
var leaderboardType = "global";
var music;
var playerId = -1;

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
        //console.log("SetIsMine " + bool);
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
    timerStarted = false;
    timeElapsed = 0; 
    timerInterval = null; 
    finalTime = null;
    revealedCells = 0; 
    nonMineCells = 0;

    constructor(dimension = 0, numMines = 0) {
        this.dimension = dimension;
        this.numMines = numMines;
    }

    StartTimer() {
        if (this.timerStarted) {
            return;
        }

        this.timerStarted = true;

        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            document.getElementById('timer').textContent = this.timeElapsed; // Update timer display
        }, 1000);
    }

    StopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    GameOver() {
        this.finalTime = this.timeElapsed;
        this.StopTimer();
        this.finalTime = this.timeElapsed;
        new Audio('assets/fuse.ogg').play();

        StopBackgroundMusic();
        

        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                if (this.listCells[i][j].GetIsMine()) {
                    const cell = document.getElementById(i + ',' + j);
                    cell.style = 'background-image: url("assets/tnt.webp")'; // Show mine if the cell is a mine
                    
                }
            }
        }

        for (let i = 0; i < this.dimension; i++) { //Disable clicking on tiles after game ends
            for (let j = 0; j < this.dimension; j++) {
                const cell = document.getElementById(`${i},${j}`);
                cell.onclick = null;          
                cell.oncontextmenu = null;   
            }
        }

        let str = 
        '<h2>Game Over!</h2>'
        + '<h3>Score: ' + this.finalTime + ' second(s)</h3>'
        + '<h3>Difficulty: ';

        if (this.dimension == 10) {
            str += 'Easy';
        }
        else if (this.dimension == 18) {
            str += 'Medium';
        }
        else {
            str += 'Hard';
        }

        str += '</h3>'

        document.getElementById("clock").innerHTML = str;
        music.pause();
    }

    Win() {
        this.StopTimer(); // Stop the timer
        this.finalTime = this.timeElapsed; 
        let Score = this.finalTime;
        let Difficulty;
        StopBackgroundMusic();
    
        // Disable interactions for all cells
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                const cell = document.getElementById(`${i},${j}`);
                cell.onclick = null;          
                cell.oncontextmenu = null;   
            }
        }
    
        // Display a win message
        let str = 
            '<h2>You Win!</h2>' +
            '<h3>Score: ' + Score + ' second(s)</h3>' +
            '<h3>Difficulty: ';
    
        if (this.dimension == 10) {
            str += 'Easy';
            Difficulty = "Easy";
        } else if (this.dimension == 18) {
            str += 'Medium';
            Difficulty = "Medium";
        } else {
            str += 'Hard';
            Difficulty = "Hard";
        }
    
        str += '</h3>';
        document.getElementById("clock").innerHTML = str;

        music = new Audio('assets/victory.ogg'); 
        music.play();

        if(isLoggedIn) {
            console.log("[WIN] Saving game to database for player id: " + playerId);

            let httpRequest = new XMLHttpRequest();
            httpRequest.open("POST", `submit_score.php`);
            httpRequest.onreadystatechange = function () {
                if(httpRequest.readyState === 4) {
                    if(httpRequest.status === 200) {
                        console.log(httpRequest.responseText);
                    }
                }
            }
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            httpRequest.send("Score=" + encodeURIComponent(Score) + "&Difficulty=" + encodeURIComponent(Difficulty) + "&PlayerID=" + encodeURIComponent(playerId) + '&Result=Win');
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
            return;
        }

        if (this.firstDig) {
            this.firstDig = false;
            this.firstDigCoords = [x,y];
            this.InitMines();
        }

        this.StartTimer();
        this.listCells[x][y].isFlagged = false;
        this.listCells[x][y].DigCell();

        this.revealedCells++; 
        
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
            this.listCells[x][y].DigCell();
            if (this.revealedCells === this.nonMineCells) {
                this.Win();
            }
            return;
        }

        if (this.revealedCells === this.nonMineCells) {
            this.Win();
        }

        // Recursively dig adjacent cells with no adjacent mines
        for (let i = x - 1; i <= x + 1; i++) {
            // Skip row if the cell is against the top or bottom boundary
            if (i < 0 || i > this.dimension - 1) { continue; }
            for (let j = y - 1; j <= y + 1; j++) {

                // Skip column if the cell is against the left or right boundary
                if (j < 0 || j > this.dimension - 1) { continue; }

                this.Dig(i,j,false);
            }
        }
    }

    MakeGrid() {
        this.StopTimer();
        //console.log(this.dimension)
        let str = '<table id="board">';

        for (let i = 0; i < this.dimension; i++) { // height
            str += '<tr>';
            for (let j = 0; j < this.dimension; j++) { // width
                str += '<td '
                    + 'id="' + i + ',' + j + '" '
                    + 'onclick="game.Dig(' + i + ',' + j + ',true)" '
                    + 'oncontextmenu="game.ToggleFlag(' + i + ', ' + j + ')">'
                    + '</td>';
            }
            str += '</tr>';
        }

        str += '</table>'

        document.getElementById("gameDisplay").innerHTML =
        '<div id="clock">Time: <span id="timer">0</span> seconds</div>'
        + str
        +'<button type="button" onclick="GameInit()" class="main_button">Change Difficulty</button><br>'
        +'<button type="button" onclick="StartGame(' + this.dimension + ',' + this.numMines + ')" class="main_button">Reset</button>';

    }    

    // Initialize the 2d array of cells
    InitCells() {
        for (let i = 0; i < this.dimension; i++) {
            let row = [];

            for (let j = 0; j < this.dimension; j++) {
                //console.log(i,j)
                let newCell = new Cell(i,j);
                row.push(newCell);
            }
            this.listCells.push(row);
        }

        //console.log(this.listCells);

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

function Init(Callback) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                    CheckLogin(Callback);
                }
            }
        }
        catch (e) {
            console.log("[INIT ERROR] " + e)
        }
    }

    httpRequest.open("GET",`init_db.php`);
    httpRequest.send();
}

function CheckLogin(Callback) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log("[CHECK LOGIN] " + httpRequest.responseText)
                    let response = JSON.parse(httpRequest.responseText);

                    if (response.isLoggedIn === "true") {
                        isLoggedIn = true;
                        playerId = response.id;
                        document.getElementById("user_info").innerHTML = "Logged in as<br>" + response.username;
                        document.getElementById("login_button").innerHTML = "Sign Out";
                        document.getElementById("login_button").onclick = () => SignOut();
                        document.getElementById("login").href = '#';
                        //document.getElementById("username").innerHTML = response.username;
                    }
                    else {
                        isLoggedIn = false;
                        playerId = -1;
                        document.getElementById("user_info").innerHTML = "";
                        document.getElementById("login_button").innerHTML = "Log In";
                        document.getElementById("login_button").onclick = null;
                        document.getElementById("login").href = 'login.html';
                        //document.getElementById("username").innerHTML = "";
                    }
                }
            }
        }
        catch (e) {
            console.log("LOGIN CHECK ERROR: " + e)
        }

        if (Callback) {
            Callback();
        }
    }

    httpRequest.open("GET",`check_login.php`);
    httpRequest.send();
}

function Login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {

                    let response = JSON.parse(httpRequest.responseText)
                    console.log(response.msg);

                    if (response.success == 0) {
                        document.getElementById("login_status").innerHTML = "Invalid Password! Please try again."
                    }
                    else if (response.success == 1) {
                        document.getElementById("login_status").innerHTML = "Successfully logged in!"
                    }
                    else {
                        document.getElementById("login_status").innerHTML = "User not found!"
                    }

                    CheckLogin();
                }
            }
        }
        catch (e) {
            console.log("LOGIN ERROR: " + e)
        }
    }

    httpRequest.open("POST",`login.php`);
    httpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    httpRequest.send("username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
}

function Register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                }
            }
        }
        catch (e) {
            console.log("REGISTER ERROR: " + e)
        }
    }

    httpRequest.open("POST",`register.php`);
    httpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    httpRequest.send("username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
}

function SignOut() {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    
                    console.log(httpRequest.responseText)
                    if (httpRequest.responseText === "true") {
                        document.getElementById("login_button").innerHTML = "Log In";
                        document.getElementById("login_button").onclick = null;
                        document.getElementById("login").href = "login.html";
                        document.getElementById("user_info").innerHTML = "";
                        //document.getElementById("username").innerHTML = '#';
                    }
                }
            }
        }
        catch (e) {
            console.log("SIGNOUT ERROR: " + e)
        }
    }

    httpRequest.open("GET",`sign_out.php`);
    httpRequest.send();
}

function BackgroundMusic() {
    console.log("Starting Music.")
    music = new Audio('assets/Minecraft.mp3'); 
    music.loop = true;
    music.volume = 1.0; 
    music.play();
}

function StopBackgroundMusic() {
    console.log("Stopping Music.")
    if (music) {
        music.pause();
        music.currentTime = 0; 
    }
}

function GameInit() {
    Init();
    StopBackgroundMusic();

    document.getElementById("gameDisplay").innerHTML =
      '<h1>Select Difficulty</h1>'
    + '<button type="button" onclick="StartGame(10,10)" class="main_button">Easy (10x10, 10 mines)</button><br>'
    + '<button type="button" onclick="StartGame(18,50)" class="main_button">Medium (18x18, 50 mines)</button><br>'
    + '<button type="button" onclick="StartGame(20,100)"class="main_button">Hard (20x20, 100 mines)</button><br>'
}

function StartGame(dimension, numMines) {

    if (game) {
        console.log("Stopping timer for old game.");
        game.StopTimer();
        StopBackgroundMusic();
    }

    BackgroundMusic();
    game = new Minesweeper(dimension, numMines);
    game.nonMineCells = dimension * dimension - numMines;
    game.MakeGrid();
    game.InitCells();
}

function InitLeaderboard() {
    let callback = () => {
        let leaderboard = document.getElementById("leaderboard_display");
        leaderboardType = "global";
        let str = '';

        console.log("Logged in: " + isLoggedIn);
        if (isLoggedIn) {
            str += '<button type="button" onclick="ToggleLeaderboard()">Your Stats</button>';
        }

        let arr;

        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            try {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        console.log(httpRequest.responseText)
                        arr = JSON.parse(httpRequest.responseText);

                        str += '<table><tr>'
                        + '<th>Player</th>'
                        + '<th>Best Time</th>'
                        + '<th>Games Won</th>'
                        + '<th>Games Played</th>'
                        + '<th>Total Time Played</th>'
                        + '</tr>';

                        for (let i = 0; i < arr.length; i++) {
                            str += '<tr>'
                            + '<td>' + arr[i]["playerName"] + '</td>'
                            + '<td>' + arr[i]["bestTime"] + ' second(s)</td>'
                            + '<td>' + arr[i]["gamesWon"] + '</td>'
                            + '<td>' + arr[i]["totalGames"] + '</td>'
                            + '<td>' + arr[i]["totalTimePlayed"] + ' second(s)</td>'
                            + '</tr>';
                        }

                        str += '</table>';
                        leaderboard.innerHTML = str;
                    }
                }
            }
            catch (e) {
                console.log("SIGNOUT ERROR: " + e)
            }
        }

        httpRequest.open("GET","get_leaderboard.php");
        httpRequest.send();
    }

    Init(callback);
}
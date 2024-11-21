var mines = [];

function GameInit() {
    mines = [];
    document.getElementById("gameDisplay").innerHTML =
      '<h1>Select Difficulty</h1>'
    + '<button type="button" onclick="makeTable(10,10)" class="main_button">Easy (10x10, 10 mines)</button><br>'
    + '<button type="button" onclick="makeTable(18,50)" class="main_button">Medium (18x18, 50 mines)</button><br>'
    + '<button type="button" onclick="makeTable(20,100)"class="main_button">Hard (20x20, 100 mines)</button><br>'
}

// Make the initial table with randomized mine placement.
function makeTable(dimension, numMines) {

    // Dynamically generate table
    let str = '<table id="board">';

    for (let i = 0; i < dimension; i++) { // height
        str += '<tr>';

        for (let j = 0; j < dimension; j++) { // width
            str += '<td '
                + 'id="' + i + ',' + j + '" '
                + 'onclick="Dig(' + i + ',' + j + ')" '
                + 'oncontextmenu="Flag(event, ' + i + ', ' + j + ')">'
                + '</td>';
        }

        str += '</tr>';
    }

    str += '</table>'
    document.getElementById("gameDisplay").innerHTML = '<button type="button" onclick="GameInit()" class="main_button">Change Difficulty</button>' + str;

    RandomizeMines(dimension, numMines);
}

function RandomizeMines(dimension, numMines) {
    for (let i = 0; i < numMines; i++) {
        let x = Math.floor(Math.random() * dimension);
        let y = Math.floor(Math.random() * dimension);
        let newMine = [x,y];

        // Spot is already a mine; randomize again until a free spot is found
        while (mines.includes(newMine)) {
            console.log("Mine already exists")
            x = Math.floor(Math.random() * dimension);
            y = Math.floor(Math.random() * dimension);
            newMine = [x,y];
        }

        document.getElementById(x + ',' + y).style = 'background-image: url("assets/tnt.webp")'; // TODO: Remove when done debugging!
        mines.push(newMine);
    }

    console.log(mines);
}

// Place or remove a flag
function Flag(event,x,y){
    event.preventDefault();
    const cell = document.getElementById(x + ',' + y);
    if (cell.innerHTML == '') {
        cell.innerHTML = '<img src="assets/lily.webp" alt="Flag" height="25px">';
    }
    else {
        cell.innerHTML = '';
    }
}

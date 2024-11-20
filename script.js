function GameInit() {
    document.getElementById("gameDisplay").innerHTML =
      '<h1>Select Difficulty</h1>'
    + '<button type="button" onclick="makeTable(10)" class="main_button">Easy (10x10, 10 mines)</button><br>'
    + '<button type="button" onclick="makeTable(18)" class="main_button">Medium (18x18, 50 mines)</button><br>'
    + '<button type="button" onclick="makeTable(20)"class="main_button">Hard (20x20, 100 mines)</button><br>'
}

function makeTable(dimension) {
    let str = '<table id="board">';

    for (let i = 0; i < dimension; i++) { // height
        str += '<tr>';

        for (let j = 0; j < dimension; j++) { // width
            str += '<td '
                + 'id="' + i + ',' + j + '" '
                + 'onclick="Flag(' + i + ',' + j + ')" '
                + 'oncontextmenu="Flag(event, ' + i + ', ' + j + ')">'
                + '</td>';
        }

        str += '</tr>';
    }

    str += '</table>'
    document.getElementById("gameDisplay").innerHTML = str;
}

function Flag(event,x,y){
    event.preventDefault();
    const cell = document.getElementById(x + ',' + y);
    cell.innerHTML = '<img src="assets/lily.webp" alt="Flag" height="46px">';
}

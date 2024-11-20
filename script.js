function GameInit() {
    document.getElementById("gameDisplay").innerHTML =
      '<h1>Select Difficulty</h1>'
    + '<button type="button" onclick="makeTable(10)" class="main_button">Easy (10x10, 10 mines)</button><br>'
    + '<button type="button" onclick="makeTable(18)" class="main_button">Medium (18x18, 50 mines)</button><br>'
    + '<button type="button" onclick="makeTable(20)"class="main_button">Hard (20x20, 100 mines)</button><br>'
}

function makeTable(dimension) {
    str = '<table>'

    for (let i = 0; i < dimension; i++) { // height
        str += '<tr>'

        for (let j = 0; j < dimension; j++) { // width
            str += '<td><p>test</td>'
        }

        str += '</tr>'
    }

    str += '</table>'
    document.getElementById("gameDisplay").innerHTML = str;
}

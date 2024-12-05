<?php
    $servername = "localhost";
    $username = "csci130";
    $password = "csci130";

    $conn = new mysqli($servername, $username, $password);

    $conn->select_db('minesweeper');

    $sql = "SELECT 
            Users.userName AS playerName,
            MIN(CASE WHEN Games.result = 'Win' THEN Games.duration ELSE NULL END) AS bestTime,
            SUM(CASE WHEN Games.result = 'Win' THEN 1 ELSE 0 END) AS gamesWon,
            COUNT(Games.id) AS totalGames,
            SUM(Games.duration) AS totalTimePlayed
        FROM Users
        LEFT JOIN Games ON Users.id = Games.playerId
        GROUP BY Users.id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $obj = [];
    $entries = [];
    while ($record = $result->fetch_assoc()) {
        $entries[] =  $record;
    }

    echo json_encode($entries);

    $stmt->close();
    $conn->close();
    
?>
<?php
    $id = $_GET["playerId"];

    $servername = "localhost";
    $username = "csci130";
    $password = "csci130";

    $conn = new mysqli($servername, $username, $password);

    $conn->select_db('minesweeper');

    $sql = "SELECT
            Users.userName AS playerName,
            MIN(CASE WHEN Games.result = 'Win' THEN Games.duration ELSE 2147483647 END) AS bestTime,
            SUM(CASE WHEN Games.result = 'Win' THEN 1 ELSE 0 END) AS gamesWon,
            COUNT(Games.id) AS totalGames,
            SUM(Games.duration) AS totalTimePlayed
            FROM Users
            LEFT JOIN Games ON Users.id = Games.playerId
            WHERE Users.id = ?
            GROUP BY Users.id";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$id);
    $stmt->execute();
    $result = $stmt->get_result();

    $entries = [];
    $record = $result->fetch_assoc();
    $entries[] =  $record;

    $sql = "SELECT 
        Games.id AS gameId,
        Games.difficulty,
        Games.duration,
        Games.result,
        Users.userName AS playerName
    FROM Games
    INNER JOIN Users ON Games.playerId = Users.id
    WHERE Users.id = ?
    ORDER BY Games.id;";

    $stmt->close();


    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$id);
    $stmt->execute();
    $result = $stmt->get_result();

    $games = [];
    while ($record = $result->fetch_assoc()) {
        $games[] =  $record;
    }

    $data = [];
    $data[] = $entries;
    $data[] = $games;

    echo json_encode($data);

    $stmt->close();
    $conn->close();
?>
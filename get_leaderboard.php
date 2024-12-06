<?php
    $sortBy = isset($_GET["sort"]) ? $_GET["sort"] : "default";
    $sortOrder = isset($_GET["order"]) ? $_GET["order"] : "desc";

    $servername = "localhost";
    $username = "csci130";
    $password = "csci130";

    $conn = new mysqli($servername, $username, $password);

    $conn->select_db('minesweeper');

    if ($sortBy == 'bestTime') {
        $sql = "SELECT 
            Users.userName AS playerName,
            MIN(CASE WHEN Games.result = 'Win' THEN Games.duration ELSE 2147483647 END) AS bestTime,
            SUM(CASE WHEN Games.result = 'Win' THEN 1 ELSE 0 END) AS gamesWon,
            COUNT(Games.id) AS totalGames,
            SUM(Games.duration) AS totalTimePlayed
            FROM Users
            LEFT JOIN Games ON Users.id = Games.playerId
            GROUP BY Users.id ";

        if ($sortOrder == 'asc') {
            $sql .= 'ORDER BY bestTime ASC';
        }
        else {
            $sql .= 'ORDER BY bestTime DESC';
        }
    }   
    else if ($sortBy == 'gamesWon') {
        $sql = "SELECT 
            Users.userName AS playerName,
            MIN(CASE WHEN Games.result = 'Win' THEN Games.duration ELSE 2147483647 END) AS bestTime,
            SUM(CASE WHEN Games.result = 'Win' THEN 1 ELSE 0 END) AS gamesWon,
            COUNT(Games.id) AS totalGames,
            SUM(Games.duration) AS totalTimePlayed
            FROM Users
            LEFT JOIN Games ON Users.id = Games.playerId
            GROUP BY Users.id ";

        if ($sortOrder == 'asc') {
            $sql .= 'ORDER BY gamesWon ASC';
        }
        else {
            $sql .= 'ORDER BY gamesWon DESC';
        }
    }
    else if ($sortBy == 'gamesPlayed') {
        $sql = "SELECT 
            Users.userName AS playerName,
            MIN(CASE WHEN Games.result = 'Win' THEN Games.duration ELSE 2147483647 END) AS bestTime,
            SUM(CASE WHEN Games.result = 'Win' THEN 1 ELSE 0 END) AS gamesWon,
            COUNT(Games.id) AS totalGames,
            SUM(Games.duration) AS totalTimePlayed
            FROM Users
            LEFT JOIN Games ON Users.id = Games.playerId
            GROUP BY Users.id ";

        if ($sortOrder == 'asc') {
            $sql .= 'ORDER BY totalGames ASC';
        }
        else {
            $sql .= 'ORDER BY totalGames DESC';
        }
    }
    else if ($sortBy == 'totalTime') {
        $sql = "SELECT 
            Users.userName AS playerName,
            MIN(CASE WHEN Games.result = 'Win' THEN Games.duration ELSE 2147483647 END) AS bestTime,
            SUM(CASE WHEN Games.result = 'Win' THEN 1 ELSE 0 END) AS gamesWon,
            COUNT(Games.id) AS totalGames,
            SUM(Games.duration) AS totalTimePlayed
            FROM Users
            LEFT JOIN Games ON Users.id = Games.playerId
            GROUP BY Users.id ";

        if ($sortOrder == 'asc') {
            $sql .= 'ORDER BY totalTimePlayed ASC';
        }
        else {
            $sql .= 'ORDER BY totalTimePlayed DESC';
        }
    }
    else { // default sorting
        $sql = "SELECT 
            Users.userName AS playerName,
            MIN(CASE WHEN Games.result = 'Win' THEN Games.duration ELSE 2147483647 END) AS bestTime,
            SUM(CASE WHEN Games.result = 'Win' THEN 1 ELSE 0 END) AS gamesWon,
            COUNT(Games.id) AS totalGames,
            SUM(Games.duration) AS totalTimePlayed
            FROM Users
            LEFT JOIN Games ON Users.id = Games.playerId
            GROUP BY Users.id";
    }

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
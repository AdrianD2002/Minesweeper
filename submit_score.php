<?php
    
    if (!isset($_POST["Score"]) || !isset($_POST["Difficulty"]) || !isset($_POST["PlayerID"])) {
        echo "Fatal error, some info not received!\n";
        die();
    }
    
    $score = $_POST["Score"];
    $difficulty = $_POST["Difficulty"];
    $playerID = $_POST["PlayerID"];

    echo "Received: " . $score ." difficulty: ". $difficulty ." playerid: ". $playerID;

    $username = "csci130";
    $password = "csci130";
    $host = "localhost";

    $conn = new mysqli($host, $username, $password);

    $conn->select_db("Minesweeper");

    # 2 tables, (users, games). fields for game (id, playerID, difficulty, duration).
    $sql = "INSERT INTO games (playerID, difficulty, duration) VALUES (?,?,?);";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isi", $playerID, $difficulty, $score);
    $stmt->execute();

    $stmt->close();
    $conn->close();
    
?>
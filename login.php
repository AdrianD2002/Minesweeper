<?php
    session_start();

    $inputName = $_POST["username"];
    $inputPass = $_POST["password"];

    if ($inputName == null || $inputPass == null) {
        die("[LOGIN] Failed: null argument.\n");
    }

    $servername = "localhost";
    $username = "csci130";
    $password = "csci130";

    $conn = new mysqli($servername, $username, $password);

    $conn->select_db('minesweeper');

    // Check connection
    if ($conn->connect_error) {
        die("[LOGIN] Connection Error: " . $conn->connect_error ."\n");
    }

    $sql = "SELECT id, userName, userPass FROM Users WHERE userName = ? LIMIT 1;";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s",$inputName);

    $stmt->execute();

    $result = $stmt->get_result();

    header('Content-Type: application/json');

    if ($result->num_rows > 0) {
        $record = $result->fetch_assoc();
    } 
    else {
        die("[LOGIN] Failed: user not found.");
    }

    if ($record["userPass"] == $inputPass) {
        $_SESSION['userId'] = $record["id"];
        $_SESSION['username'] = $record["userName"];
        echo "[LOGIN] Login successful.";
    }
    else {
        echo "[LOGIN] Failed: invalid password.";
    }

    $stmt->close();
    $conn->close();

?>
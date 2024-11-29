<?php
    $inputName = $_POST["username"];
    $inputPass = $_POST["password"];

    if ($inputName == null || $inputPass == null) {
        die("[REGISTER] Failed; null argument.\n");
    }

    $servername = "localhost";
    $username = "csci130";
    $password = "csci130";

    $conn = new mysqli($servername, $username, $password);

    $conn->select_db('minesweeper');

    // Check connection
    if ($conn->connect_error) {
        die("[REGISTER] Connection Error: " . $conn->connect_error ."\n");
    }

    $sql = "SELECT userName, userPass FROM Users WHERE userName = ? LIMIT 1;";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s",$inputName);

    $stmt->execute();

    $result = $stmt->get_result();

    header('Content-Type: application/json');

    if ($result->num_rows > 0) {
        die("[REGISTER]: Failed; user already exists.");
    }

    $stmt->close();

    $sql = "INSERT INTO Users (userName, userPass) VALUES (?,?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("ss", $inputName, $inputPass);

    if($stmt->execute()) {
        echo "[REGISTRATION] Successfully registered new account.";
    }
    else {
        echo "[REGISTRATION] Failed unexpectedly.";
    }

    $stmt->close();

    $sql = "SELECT id, userName, userPass FROM Users WHERE userName = ? LIMIT 1;";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s",$inputName);

    $stmt->execute();

    $result = $stmt->get_result();

    header('Content-Type: application/json');

    if ($result->num_rows > 0) {
        $record = $result->fetch_assoc();
    } 

    if ($record["userPass"] == $inputPass) {
        $_SESSION['userId'] = $record["id"];
        $_SESSION['username'] = $record["userName"];
    }

    $conn->close();

?>
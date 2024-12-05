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
        echo json_encode(["success" => "-1", "msg" => "[LOGIN] User not found."]);
        die();
    }

    if ($record["userPass"] == $inputPass) {
        $_SESSION['userId'] = $record["id"];
        $_SESSION['username'] = $record["userName"];
        echo json_encode(["success" => "1", "msg" => "[LOGIN] Login successful."]);
    }
    else {
        echo json_encode(["success" => "0", "msg" => "[LOGIN] Invalid Password."]);;
    }

    $stmt->close();
    $conn->close();

?>
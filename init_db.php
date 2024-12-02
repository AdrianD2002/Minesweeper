<?php
    echo "[INIT DB] Checking for database.\n";

    $servername = "localhost"; // default server name
    $username = "csci130"; // user name that you created
    $password = "csci130"; // password that you created

    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("[INIT DB] Connection Error: " . $conn->connect_error ."\n");
    }

    // Check for existing database
    $sql = 'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "minesweeper"';
    $result = $conn->query($sql);

    // If it doesn't exist, create it
    if (!($result && $result->num_rows > 0)) {
        
        echo "[INIT DB] Database not found; reinitializing.\n";

         // Creation of the database
        $sql = "CREATE DATABASE minesweeper";

        $conn->query($sql);

        $conn->select_db('minesweeper');

        $sql = "CREATE TABLE Users (
            id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
            userName VARCHAR(255) NOT NULL,
            userPass VARCHAR(255) NOT NULL
        );";

        $sql .= "CREATE TABLE Games (
            id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            playerID INT(10) NOT NULL,
            difficulty INT(1) NOT NULL,
            duration INT(255) NOT NULL
        );";

        if($conn->multi_query($sql)) {
            echo "[INIT DB] Database initialized successfully.";
        }
    }
    else {
        echo "[INIT DB] Database already exists, doing nothing.";
    }

    // Close the connection
    $conn->close()
?>
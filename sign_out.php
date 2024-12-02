<?php
    session_start();

    $_SESSION = [];

    session_destroy();

    echo "true";
?>
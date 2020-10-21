<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $_SESSION['id_user'] = $_POST['id'];
    }
?>
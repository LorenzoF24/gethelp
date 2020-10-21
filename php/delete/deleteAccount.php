<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_SESSION['id_user'])) {
            $id = $_SESSION['id_user'];
            
            $stmt = $conn->prepare('DELETE FROM utilisateur
                                    WHERE id = ?');
            $stmt->execute(array($id));

            unset($_SESSION['id_user']);
            session_destroy();
        }
    }
    
    $conn = null;
?>
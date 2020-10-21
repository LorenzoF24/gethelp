<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (isset($_SESSION['id_user'])) {
            $id = $_SESSION['id_user'];

            $stmt = $conn->prepare('SELECT * FROM
            utilisateur WHERE 
            id = :id
            ');
    
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    
            $stmt->execute();
    
            $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo utf8_encode(json_encode($rs));
        } else {
            echo 'No user connected';
        }
    }
    
    $conn = null;
?>
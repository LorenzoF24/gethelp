<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_GET['idnotif'])) {
        $id = $_GET['idnotif'];

        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $stmt = $conn->prepare('SELECT `vu` FROM `notifications`
                                WHERE id = :id');
        
        $stmt->execute(
            array(
                ':id' => $id
            )
        );

        $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo utf8_encode(json_encode($rs));
        
    } else {
        echo 'Une erreur s\'est produite';
    }

    $conn = null;
?>
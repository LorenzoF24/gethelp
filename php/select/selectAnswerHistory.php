<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    // header('Content-Type: text/html; charset=utf-8');
    include '../util/bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_POST['id'])) {
        $idreponse = $_POST['id'];

        $stmt = $conn->prepare('SELECT idreponse,
                                       DATE_FORMAT(datemodif, \'Le %d/%m/%Y à %Hh%i\') AS datemodif,
                                       corps
                                FROM reponse_log
                                WHERE idreponse = :id
                                ORDER BY datemodif DESC');

        $stmt->execute(
            array(
                ':id' => $idreponse
            )
        );

        $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo utf8_encode(json_encode($rs));
        
    } else {
        echo 'Une erreur s\'est produite';
    }

    $conn = null;
?>
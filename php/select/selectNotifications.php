<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_SESSION['id_user'])) {
        $idUser = $_SESSION['id_user'];

        $query = 'SELECT id,
                         idquestion,
                         idutilisateur,
                         DATE_FORMAT(datenotif, \'Le %d/%m/%Y à %Hh%i\') as datenotif,
                         vu
                  FROM `notifications`
                  WHERE idutilisateur = :idutilisateur
                  ORDER BY datenotif DESC';

        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $stmt = $conn->prepare($query);

        $stmt->execute(
            array(
                ':idutilisateur' => $idUser
            )
        );

        $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo utf8_encode(json_encode($rs));
        
    } else {
        echo 'Une erreur s\'est produite';
    }

    $conn = null;
?>
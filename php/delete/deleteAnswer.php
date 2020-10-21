<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_SESSION['id_user'])) {
            $idreponse = $_POST['id_answer'];
            $stmt = $conn->prepare('DELETE FROM `reponse`
                                    WHERE id = :idreponse
                                    AND idutilisateur = :idutilisateur');
            $stmt->bindValue(':idreponse', $idreponse, PDO::PARAM_INT);
            $stmt->bindValue(':idutilisateur', $_SESSION['id_user'], PDO::PARAM_INT);
            $stmt->execute();
        }
    }

    $conn = null;
?>
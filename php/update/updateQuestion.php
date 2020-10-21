<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_POST['id'], $_POST['corps'])) {
        $idquestion = $_POST['id'];
        $corps = $_POST['corps'];

        if (strlen(trim($corps)) >= 10) {
            $stmt = $conn->prepare('UPDATE question
                                    SET corps = :corps
                                    WHERE id = :id');
    
            $stmt->execute(
                array(
                    ':corps' => $corps,
                    ':id' => $idquestion
                )
            );
    
            echo utf8_encode(json_encode(array('msg' => 'Modification OK')));
        } else {
            echo 'Le corps de la réponse doit contenir au moins 10 caractères';
        }
    } else {
        echo 'Une erreur s\'est produite';
    }

    $conn = null
?>
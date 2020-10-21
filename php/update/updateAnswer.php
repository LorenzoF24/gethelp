<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_POST['id'], $_POST['corps'])) {
        $idreponse = $_POST['id'];
        $corps = $_POST['corps'];

        if (!empty(trim($corps))) {
            $stmt = $conn->prepare('UPDATE reponse
                                    SET corps = :corps
                                    WHERE id = :id');
    
            $stmt->execute(
                array(
                    ':corps' => $corps,
                    ':id' => $idreponse
                )
            );
    
            echo utf8_encode(json_encode(array('msg' => 'Modification OK')));
        } else {
            echo 'La réponse ne doit pas être vide';
        }
    } else {
        echo 'Une erreur s\'est produite';
    }

    $conn = null
?>
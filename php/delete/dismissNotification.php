<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_POST['id'])) {
        $id = $_POST['id'];

        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $stmt = $conn->prepare('DELETE FROM `notifications`
                                WHERE id = :id');
        
        $stmt->execute(
            array(
                ':id' => $id
            )
        );
        
        echo utf8_encode(json_encode(array('msg' => 'OK')));
    } else {
        echo 'Une erreur s\'est produite';
    }

    $conn = null;
?>
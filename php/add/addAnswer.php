<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    // QUERIES
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_SESSION['id_user'])) {
            $idUtilisateur = $_SESSION['id_user'];
            $idQuestion = $_POST['idQuestion'];
            $reponse = $_POST['reponse-text'];

            if (!empty(trim($reponse))) {
                $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $stmt = $conn->prepare("INSERT INTO reponse (idutilisateur, datereponse, corps, idquestion)
                VALUES (:idutilisateur, now(), :corps, :idquestion)");
    
                $stmt->execute(
                    array(
                        ':idutilisateur' => $idUtilisateur,
                        ':corps' => trim($reponse),
                        ':idquestion' => $idQuestion
                    )
                );

                echo utf8_encode(json_encode(array('msg' => "OK")));
            } else {
                echo 'La réponse ne doit pas être vide';
            }
        } else {
            echo 'Vous devez être authentifié afin de repondre à une question';
        }
    }

    $conn = null;
?>
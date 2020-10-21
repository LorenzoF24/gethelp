<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';

    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_SESSION['id_user'])) {
            $query = 'SELECT * FROM utilisateur
            WHERE id = :id';

            $stmt = $conn->prepare($query);
            $stmt->bindValue(':id', $_SESSION['id_user'], PDO::PARAM_STR);
            $stmt->execute();

            $count = $stmt->rowCount();

            if($count > 0)
            {
                $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach($rs as $row)
                {
                    if($row['role'] == 'admin')
                    {
                        $iduser = $_POST['id_user'];

                        $statement = $conn->prepare('
                            DELETE FROM utilisateur
                            WHERE id = :iduser
                        ');
                        $statement->bindValue(':iduser', $iduser, PDO::PARAM_INT);
                        $statement->execute();

                        echo utf8_encode(json_encode(array('msg' => 'OK')));
                    } else {
                        echo 'Vous n\'avez pas les droits pour effectuer cette action';
                    }
                }
            } else {
                echo 'Une erreur s\'est produite, réessayez plus tard.';
            }
        } else {
            echo 'Vous devez être connecté pour effectuer cette action';
        }
    }
    $conn = null;
?>
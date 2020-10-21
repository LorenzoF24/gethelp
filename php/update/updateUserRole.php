<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_POST['id_user'])) {
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
                        $id = $_POST['id_user'];
                        $role = $_POST['role_user'];

                        $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                        $statement = $conn->prepare('UPDATE `utilisateur`
                                                SET `role` = :role
                                                WHERE `id` = :id');
                        
                        $statement->execute(
                            array(
                                ':id' => $id,
                                ':role' => $role
                            )
                        );

                        echo utf8_encode(json_encode(array('msg' => 'Opération bien effectuée')));
                    } else {
                        echo 'Vous n\'avez pas les droits pour effectuer cette action';
                    }
                }
            } else {
                echo 'Une erreur s\'est produite';
            }
        }

    } else {
        echo 'Une erreur s\'est produite';
    }

    $conn = null;
?>
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
                    $idutilisateur = $_SESSION['id_user'];
                    $verifutilisateur = $conn->prepare('SELECT idutilisateur
                                                        FROM question
                                                        WHERE id = :id');
                    
                    $verifutilisateur->execute(
                        array(
                            ':id' => $_POST['id_question']
                        )
                    );

                    $idutilisateurQuestion = $verifutilisateur->fetchAll(PDO::FETCH_ASSOC);

                    if($row['role'] == 'admin' || $row['role'] == 'modo' || $idutilisateurQuestion[0]['idutilisateur'] == $idutilisateur)
                    {
                        $idquestion = $_POST['id_question'];
                        $statement = $conn->prepare('DELETE FROM `question`
                                                WHERE id = :idquestion');
                        $statement->bindValue(':idquestion', $idquestion, PDO::PARAM_INT);
                        $statement->execute();

                        echo utf8_encode(json_encode(array('msg' => 'Opération OK')));
                    } else {
                        echo 'Vous n\'avez pas les droits pour effectuer cette action';
                    }
                }
            } else {
                echo 'Une erreur s\'est produite, réessayez plus tard';
            }

            
        } else {
            echo 'Cette action est réservée aux utilisateurs autorisés';
        }
    }

    $conn = null;
?>
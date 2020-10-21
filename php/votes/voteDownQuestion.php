<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        if (isset($_SESSION['id_user'])) {
            $idUtilisateur = $_SESSION['id_user'];

            if (isset($_SESSION['id_question'])) {
                $idQuestion = $_SESSION['id_question'];
    
                $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                // Check
                $stmtCHECK = $conn->prepare('SELECT * FROM `downvotequestion`
                WHERE `idutilisateur` = :idutilisateur
                AND `idquestion` = :idquestion');
    
                // $stmtCHECK->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
                // $stmtCHECK->bindValue(':idquestion', $idQuestion, PDO::PARAM_INT);
    
                $stmtCHECK->execute(
                    array(
                        ':idutilisateur' => $idUtilisateur,
                        ':idquestion' => $idQuestion
                    )
                );
    
                if ($stmtCHECK->rowCount() > 0) {
                    $stmtDELETE = $conn->prepare('DELETE FROM `downvotequestion`
                    WHERE `idutilisateur` = :idutilisateur
                    AND `idquestion` = :idquestion');
    
                    // $stmtDELETE->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
                    // $stmtDELETE->bindValue(':idquestion', $idQuestion, PDO::PARAM_INT);
    
                    $stmtDELETE->execute(
                        array(
                            ':idutilisateur' => $idUtilisateur,
                            ':idquestion' => $idQuestion
                        )
                    );

                } else {
                    $stmtINSERT = $conn->prepare('INSERT INTO `downvotequestion` 
                    (`idutilisateur`, `idquestion`) VALUES (:idutilisateur, :idquestion)');
        
                    // $stmtINSERT->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
                    // $stmtINSERT->bindValue(':idquestion', $idQuestion, PDO::PARAM_INT);
        
                    $stmtINSERT->execute(
                        array(
                            ':idutilisateur' => $idUtilisateur,
                            ':idquestion' => $idQuestion
                        )
                    );
        
                    // Suppression du downvote si celui-ci à eu lieu
                    $stmt = $conn->prepare('SELECT * FROM `votequestion`
                    WHERE idutilisateur = :idutilisateur 
                    AND idquestion = :idquestion');
                    
                    // $stmt->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
                    // $stmt->bindValue(':idquestion', $idQuestion, PDO::PARAM_INT);

                    $stmt->execute(
                        array(
                            ':idutilisateur' => $idUtilisateur,
                            ':idquestion' => $idQuestion
                        )
                    );
        
                    $count = $stmt->rowCount();
        
                    if ($count > 0) {
                        $stmt2 = $conn->prepare('DELETE FROM `votequestion`
                        WHERE idutilisateur = :idutilisateur AND idquestion = :idquestion');

                        // $stmt2->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
                        // $stmt2->bindValue(':idquestion', $idQuestion, PDO::PARAM_INT);
                        
                        $stmt2->execute(
                            array(
                                ':idutilisateur' => $idUtilisateur,
                                ':idquestion' => $idQuestion
                            )
                        );
                    }
                }

                echo utf8_encode(json_encode(array('msg' => 'Opération OK')));
                
            } else {
                echo 'Une erreur s\'est produite, veuillez réessayer plus tard';
            }
        } else {
            echo 'Vous devez être authentifié afin de voter';
        }
    }

    $conn = null;
?>
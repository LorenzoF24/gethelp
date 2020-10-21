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

            if (isset($_POST['id_reponse'])) {
                $idReponse = $_POST['id_reponse'];
    
                $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                // Check
                $stmtCHECK = $conn->prepare('SELECT * FROM `votereponse`
                WHERE `idutilisateur` = :idutilisateur
                AND `idreponse` = :idreponse');
    
                $stmtCHECK->execute(
                    array(
                        ':idutilisateur' => $idUtilisateur,
                        ':idreponse' => $idReponse
                    )
                );
    
                if ($stmtCHECK->rowCount() > 0) {
                    $stmtDELETE = $conn->prepare('DELETE FROM `votereponse`
                    WHERE `idutilisateur` = :idutilisateur
                    AND `idreponse` = :idreponse');
    
                    $stmtDELETE->execute(
                        array(
                            ':idutilisateur' => $idUtilisateur,
                            ':idreponse' => $idReponse
                        )
                    );

                } else {
                    $stmtINSERT = $conn->prepare('INSERT INTO `votereponse` 
                    (`idutilisateur`, `idreponse`) VALUES (:idutilisateur, :idreponse)');
        
                    $stmtINSERT->execute(
                        array(
                            ':idutilisateur' => $idUtilisateur,
                            ':idreponse' => $idReponse
                        )
                    );
        
                    // Suppression du downvote si celui-ci à eu lieu
                    $stmt = $conn->prepare('SELECT * FROM `downvotereponse`
                    WHERE idutilisateur = :idutilisateur 
                    AND idreponse = :idreponse');

                    $stmt->execute(
                        array(
                            ':idutilisateur' => $idUtilisateur,
                            ':idreponse' => $idReponse
                        )
                    );
        
                    $count = $stmt->rowCount();
        
                    if ($count > 0) {
                        $stmt2 = $conn->prepare('DELETE FROM `downvotereponse`
                        WHERE idutilisateur = :idutilisateur AND idreponse = :idreponse');
                        
                        $stmt2->execute(
                            array(
                                ':idutilisateur' => $idUtilisateur,
                                ':idreponse' => $idReponse
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
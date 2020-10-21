<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    // PDO error mode à exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {

        try {
            $idUtilisateur = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
            $idQuestion = isset($_SESSION['id_question']) ? $_SESSION['id_question'] : '';

            $queryUP = 'SELECT * FROM `votequestion`
                        WHERE `idutilisateur` = :idutilisateur
                        AND `idquestion` = :idquestion';

            $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $stmtUP = $conn->prepare($queryUP);
            $stmtUP->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
            $stmtUP->bindValue(':idquestion', $idQuestion, PDO::PARAM_INT);

            $stmtUP->execute();
            
            $queryDOWN = 'SELECT * FROM `downvotequestion`
                        WHERE `idutilisateur` = :idutilisateur
                        AND `idquestion` = :idquestion';

            $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $stmtDOWN = $conn->prepare($queryDOWN);
            $stmtDOWN->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
            $stmtDOWN->bindValue(':idquestion', $idQuestion, PDO::PARAM_INT);

            $stmtDOWN->execute();

            // Conditions
            $rowUP = $stmtUP->rowCount();
            $rowDOWN = $stmtDOWN->rowCount();

            if ($rowUP == 1 && $rowDOWN == 0) {
                // $queryRES = 'SELECT 1 AS `votestatus`';
                $status = 1;
            } elseif ($rowUP == 0 && $rowDOWN == 1) {
                // $queryRES = 'SELECT -1 AS `votestatus`';
                $status = -1;
            } else {
                // $queryRES = 'SELECT 0 AS `votestatus`';
                $status = 0;
            }

            echo utf8_encode(json_encode(array('votestatus' => $status)));
            // $stmtRES = $conn->prepare($queryRES);
            // $stmtRES->execute();

            // $rs = $stmtRES->fetchAll(PDO::FETCH_ASSOC);
            // echo utf8_encode(json_encode($rs));
            
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    $conn = null;
?>
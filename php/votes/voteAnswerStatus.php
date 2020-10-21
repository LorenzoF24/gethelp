<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    // PDO error mode à exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

    // if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //     $_SESSION['id_answer'] = $_GET['id_answer'];
    // }
    
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {

        try {
            $idUtilisateur = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
            $idReponse = isset($_GET['id_answer']) ? $_GET['id_answer'] : '';
            // $idReponse = isset( $_SESSION['id_answer']) ?  $_SESSION['id_answer'] : '';

            $queryUP = 'SELECT * FROM `votereponse`
                        WHERE `idutilisateur` = :idutilisateur
                        AND `idreponse` = :idreponse';

            $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $stmtUP = $conn->prepare($queryUP);
            $stmtUP->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
            $stmtUP->bindValue(':idreponse', $idReponse, PDO::PARAM_INT);

            $stmtUP->execute();
            
            $queryDOWN = 'SELECT * FROM `downvotereponse`
                        WHERE `idutilisateur` = :idutilisateur
                        AND `idreponse` = :idreponse';

            $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $stmtDOWN = $conn->prepare($queryDOWN);
            $stmtDOWN->bindValue(':idutilisateur', $idUtilisateur, PDO::PARAM_INT);
            $stmtDOWN->bindValue(':idreponse', $idReponse, PDO::PARAM_INT);

            $stmtDOWN->execute();

            // Conditions
            $rowUP = $stmtUP->rowCount();
            $rowDOWN = $stmtDOWN->rowCount();

            if ($rowUP == 1 && $rowDOWN == 0) {
                // $queryRES = 'SELECT 1 AS `votestatus`';
                $status = 1;
                // echo utf8_encode(json_encode(array('votestatus' => 1)));
            } elseif ($rowUP == 0 && $rowDOWN == 1) {
                // $queryRES = 'SELECT -1 AS `votestatus`';
                $status = -1;
                // echo utf8_encode(json_encode(array('votestatus' => -1)));
            } else {
                // $queryRES = 'SELECT 0 AS `votestatus`';
                $status = 0;
                // echo utf8_encode(json_encode(array('votestatus' => 0)));
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
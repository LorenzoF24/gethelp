<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {

        $stmt = $conn->prepare('SELECT 
            reponse.corps AS body,
            reponse.id AS idAnswer,
            DATE_FORMAT(reponse.datereponse, \'Le %d/%m/%Y à %Hh%i\') AS dater,
            reponse.idquestion AS idQuestion,
            (SELECT COUNT(*) FROM votereponse WHERE reponse.id = votereponse.idreponse) - (SELECT COUNT(*) FROM downvotereponse WHERE reponse.id = downvotereponse.idreponse) AS upVotes,
            utilisateur.pseudo AS pseudoUser
        FROM reponse
        INNER JOIN utilisateur
        ON reponse.idutilisateur = utilisateur.id
        WHERE utilisateur.id = :id
        ORDER BY reponse.datereponse DESC
        ');

        $stmt->bindValue(':id', $_SESSION['id_user'], PDO::PARAM_INT);
        
        $stmt->execute();
        
        $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo utf8_encode(json_encode($rs));
    }

    $conn = null;
?>
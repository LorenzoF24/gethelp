<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    include '../util/bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $_SESSION['search_key'] = $_POST['search-field'];
    }

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (isset($_SESSION['search_key'])) {
            $searchkey = $_SESSION['search_key'];

            $stmt = $conn->prepare("SELECT question.id AS idQuestion,
            DATE_FORMAT(question.datequestion, 'Le %d/%m/%Y à %Hh%i') AS dateq,
            utilisateur.pseudo AS userPseudo,
            question.nomlangage AS langage,
            question.sujet AS topic,
            question.corps AS body,
            (SELECT COUNT(*) FROM votequestion WHERE question.id = votequestion.idquestion) - (SELECT COUNT(*) FROM downvotequestion WHERE question.id = downvotequestion.idquestion) AS upVotes,
            count(reponse.id) AS nbreponse
            FROM question
            INNER JOIN utilisateur 
            ON question.idutilisateur = utilisateur.id
            LEFT JOIN reponse
            ON reponse.idquestion = question.id
            WHERE question.sujet LIKE CONCAT('%', :search, '%')
            OR question.corps LIKE CONCAT('%', :search, '%')
            OR question.nomlangage LIKE CONCAT('%', :search, '%')
            GROUP BY question.id
            ORDER BY question.datequestion DESC");

            $stmt->execute(
                array(
                    ':search' => $searchkey
                )
            );

            $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo utf8_encode(json_encode($rs));

            unset($_SESSION['search_key']);

        } else {
            $stmt = $conn->prepare('SELECT question.id AS idQuestion,
            DATE_FORMAT(question.datequestion, \'Le %d/%m/%Y à %Hh%i\') AS dateq,
            utilisateur.pseudo AS userPseudo,
            question.nomlangage AS langage,
            question.sujet AS topic,
            question.corps AS body,
            (SELECT COUNT(*) FROM votequestion WHERE question.id = votequestion.idquestion) - (SELECT COUNT(*) FROM downvotequestion WHERE question.id = downvotequestion.idquestion) AS upVotes,
            count(reponse.id) AS nbreponse
            FROM question
            INNER JOIN utilisateur 
            ON question.idutilisateur = utilisateur.id
            LEFT JOIN reponse
            ON reponse.idquestion = question.id
            GROUP BY question.id
            ORDER BY question.datequestion DESC
            ');

            $stmt->execute();
            $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo utf8_encode(json_encode($rs));
        }
    }

    $conn = null;
?>
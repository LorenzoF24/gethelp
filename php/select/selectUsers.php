<?php
    include '../util/bdd.php';
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    $stmt = $conn->prepare('SELECT utilisateur.id,
                                   utilisateur.pseudo,
                                   DATE_FORMAT(utilisateur.dateins, \'%d/%m/%Y\') AS dateins,
                                   utilisateur.mail,
                                   utilisateur.role,
                                   utilisateur.emailstatus
                            FROM utilisateur;
    ');

    $stmt->execute();
    $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo utf8_encode(json_encode($rs));
?>
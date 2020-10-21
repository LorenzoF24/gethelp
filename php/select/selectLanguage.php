<?php
    include '../util/bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');


    $stmt = $conn->prepare('SELECT * FROM `langage`');

    $stmt->execute();
    $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo utf8_encode(json_encode($rs));
?>
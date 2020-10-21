<?php
    // Fonction utilitaire de connection à une base de données
    function connectDB($host, $bdname, $user, $pass) {
        try {
            $bdd = new PDO('mysql:host=' . $host . ';dbname=' . $bdname . ';charset=utf8', $user, $pass);
        } catch(Exception $e) {
            die($e->getMessage());
        }

        return $bdd;
    }
?>
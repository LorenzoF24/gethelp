<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include './bdd.php';

    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $query = 'SELECT * FROM utilisateur
            WHERE mail = :mail';

        $stmt = $conn->prepare($query);
        $stmt->bindValue(':mail', $_POST['login-mail'], PDO::PARAM_STR);
        $stmt->execute();

        $count = $stmt->rowCount();

        if($count > 0)
        {
            $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach($rs as $row)
            {
                if($row['emailstatus'] == 1)
			    {
                    if(password_verify($_POST['login-password'], $row['mdp']))
                    {
                        $_SESSION['id_user'] = $row['id'];
                        $_SESSION['pseudo_user'] = $row['pseudo'];
                        echo utf8_encode(json_encode($rs));
                    } else {
                        echo 'Mauvais mot de passe';
                    }
                } else {
                    echo 'Vous devez confirmer votre email';
                }
            }
        } else {
            echo 'Nom d\'utilisateur inconnu';
        }

    }
    $conn = null;
?>
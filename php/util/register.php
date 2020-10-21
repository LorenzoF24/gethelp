<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include './bdd.php';
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');
    
    // Variables
    $mailErr = $pseudoErr = $mdpErr = "";

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        // Mail 
        if (empty($_POST["registration-mail"])) {
            $mailErr = "Email requis ";
            echo $mailErr;
        }
        else if (!filter_var($_POST['registration-mail'], FILTER_VALIDATE_EMAIL)) {
                $mailErr = "Mail : caractères alphanumériques, @ et . uniquement";
                echo $mailErr;
        }
        
        // Pseudo
        if (empty($_POST["registration-pseudo"])) {
            $pseudoErr = "Pseudo requis";
            echo $pseudoErr;
        }
        else if (!preg_match("#[A-Za-z\-_0-9]{4,}#", $_POST["registration-pseudo"])) {
                $pseudoErr = "Pseudo : caractères alphanumériques uniquement";
                echo $pseudoErr;
        }

        // Mot de passe
        if (empty($_POST['registration-password'])) {
            $mdpErr = 'Le mot de passe est requis';
            echo $mdpErr;
        } else if (!preg_match('#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$#', $_POST['registration-password'])) {
            $mdpErr = 'Le mot de passe doit au moins contenir 8 caractères, une lettre majuscule, une lettre minuscule, et un chiffre';
            echo $mdpErr;
        }

        if(empty($mailErr) && empty($pseudoErr) && empty($mdpErr)) {
            try {
                $mail = test_input($_POST["registration-mail"]);
                $pseudo = test_input($_POST['registration-pseudo']);
                $mdp = password_hash($_POST['registration-password'], PASSWORD_DEFAULT);
                $activationcode = md5(rand());

                $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                
                $query = 'SELECT * FROM utilisateur 
                        WHERE pseudo = :pseudo
                        OR mail = :mail';

                $verif = $conn->prepare($query);

                $verif->bindValue(':mail', $mail, PDO::PARAM_INT);
                $verif->bindValue(':pseudo', $pseudo, PDO::PARAM_STR);

                $verif->execute();
                $count = $verif->rowCount();

                if ($count > 0) {
                    $rs = $verif->fetchAll(PDO::FETCH_ASSOC);

                    foreach($rs as $row) {
                        if ($row['mail'] == $mail) {
                            echo 'Ce mail est déjà utilisé';
                        } else if ($row['pseudo'] == $pseudo) {
                            echo 'Ce pseudo est déjà prit';
                        }
                    }

                } else {
                    $sql = "INSERT INTO utilisateur 
                    (pseudo, dateins, mail, mdp, activationcode, emailstatus) 
                    VALUES
                    (:pseudo, now(), :mail, :mdp, :activationcode, 0)";

                    $stmt = $conn->prepare($sql);
                    
                    if (!$stmt) {
                        echo "\nPDO::errorInfo():\n";
                        print_r($conn->errorInfo());
                    }
                    
                    $stmt->bindValue(':mail', $mail, PDO::PARAM_INT);
                    $stmt->bindValue(':pseudo', $pseudo, PDO::PARAM_STR);
                    $stmt->bindValue(':mdp', $mdp, PDO::PARAM_STR);
                    $stmt->bindValue(':activationcode', $activationcode, PDO::PARAM_STR);
                    
                    $stmt->execute();

                    // Envoi mail de confirmation
                    $url = "https://getyourhelp.000webhostapp.com/php/util/";
                    $email_subject = "GetHelp() : confirmation de votre mail";
                    $email_message = "Merci de ton inscription !\n" 
                        ."Clique sur ce lien pour vérifier ton adresse mail -> "
                        . $url . "emailVerification.php?activationcode=" . $activationcode
                        . "\nÀ bientôt sur le forum - L'équipe GetHelp";
                    $email_from = "noreply.getyourhelp@gmail.com";
                    $email_replyto = "noreply.getyourhelp@gmail.com";
                    
                    $headers = 'From: '. $email_from . "\r\n".
                    'Reply-To: '.$email_replyto."\r\n" .
                    'X-Mailer: PHP/' . phpversion();
                    
                    @mail($mail, $email_subject, $email_message, $headers);  

                    // Connexion après inscription //
                    // $lastId = $conn->lastInsertId();
                    // $_SESSION['id_user'] = $lastId;

                    echo utf8_encode(json_encode(array('msg' => 'Utilisateur ok')));
                }

                
            } catch (PDOException $e) {
                echo $sql . "erreur catch<br>" . $e->getMessage();
            }
        }
    }

    $conn = null;

    // FUNCTION
    function test_input($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>
<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include './bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_SESSION['id_user'])) {
        if (isset($_POST['contact-text'], $_POST['contact-request'])) {
            $iduser = $_SESSION['id_user'];

            // Mail de l'utilisateur
            $mailQuery = $conn->prepare('SELECT mail
                                        FROM utilisateur
                                        WHERE id = :id');

            $mailQuery->execute(
                array(
                    ':id' => $iduser
                )
            );

            if ($mailQuery->rowCount() > 0) {
                $mailRes = $mailQuery->fetchAll(PDO::FETCH_ASSOC);

                $mailFrom = $mailRes[0]['mail'];

                // Envoi mail
                $email_subject = $_POST['contact-request'];
                $email_message = $_POST['contact-text'];
                $email_from = $mailFrom;
                $email_replyto = $mailFrom;
                
                $headers = 'From: '. $email_from . "\r\n".
                'Reply-To: '.$email_replyto."\r\n" .
                'X-Mailer: PHP/' . phpversion();
                
                @mail('lorenzojuve10@hotmail.com', $email_subject, $email_message, $headers);
                @mail('scounen@gmail.com', $email_subject, $email_message, $headers);

                echo utf8_encode(json_encode(array(
                    'mailFrom' => $mailFrom,
                    'subject' => $_POST['contact-request'],
                    'text' => $_POST['contact-text']
                )));
            } else {
                echo 'Une erreur s\'est produite, réessayez plus tard';
            }
        } else {
            echo 'Une erreur s\'est produite, réessayez plus tard';
        }
        
    } else {
        echo 'Vous devez être authentifié afin de nous contacter';
    }

?>
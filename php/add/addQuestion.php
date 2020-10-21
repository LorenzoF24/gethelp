<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include '../util/bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');
    

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_SESSION['id_user'])) {
            $id_user = $_SESSION['id_user'];
            $language = $_POST['addQuestion-language'];
            $subject = $_POST['addQuestion-subject'];
            $body = $_POST['addQuestion-body'];

            if (strlen(trim($subject)) >= 5 && strlen(trim($body)) >= 10) {
                $sql = "INSERT INTO question (idutilisateur, datequestion, nomlangage, sujet, corps) 
                VALUES(:id_user, now(), :langage, :sujet, :body)";
            
                $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $stmt = $conn->prepare($sql);
                
                $stmt->execute(
                    array(
                        ':id_user' => $id_user,
                        ':langage' => $language,
                        ':sujet' => trim($subject),
                        ':body' => trim($body)
                    )
                );

                echo utf8_encode(json_encode(array('msg' => 'OK')));
            } else {
                echo 'Le sujet doit au moins contenir 5 caractères, le corps 10';
            }
        } else {
            echo 'Vous devez être authentifié afin de poser une question';
        }
    }

    $conn = null;
?>
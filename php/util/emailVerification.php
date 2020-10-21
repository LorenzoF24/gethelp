<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    include './bdd.php';
    // $conn = connectDB('localhost', 'projet_2bial_forum', 'root', '');
    $conn = connectDB('localhost', 'id13546560_projet_2bial_forum', 'id13546560_admin', 'Helha-TMProjet2020');

    if (isset($_GET['activationcode'])) {
        $query = 'SELECT * FROM utilisateur
            WHERE activationcode = :activationcode';

        $stmt = $conn->prepare($query);
        $stmt->bindValue(':activationcode', $_GET['activationcode'], PDO::PARAM_STR);
        $stmt->execute();

        $count = $stmt->rowCount();

        if($count > 0)
        {
            $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach($rs as $row)
            {
                if($row['emailstatus'] == 0)
                {
                    $update_query = "
                        UPDATE utilisateur
                        SET emailstatus = 1
                        WHERE id = '".$row['id']."'
                    ";
                    $statement = $conn->prepare($update_query);
                    $statement->execute();
                    $sub_result = $statement->fetchAll();
                    if(isset($sub_result))
                    {
                        $message = '
                        <h2 class="heading-secondary">Votre adresse email a bien été confirmé.</h2>
                        <a href="../../index.html#popup-login" class="btn btn--primary">Connexion</a>
                        ';
                    }
                }
            }
        }

    }
    $conn = null;
?>

<!DOCTYPE html>
<html>
	<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="../../css/style.css" />
		<title>Confirmation email</title>		
	</head>
	<body id="body_emailVerif">
		<h1 class="heading-primary">Bienvenue dans la communauté GetHelp !</h1>
        <h3><?php echo $message; ?></h3>
        
	</body>
</html>
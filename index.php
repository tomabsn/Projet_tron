<?php
require_once('PHP/ConnexionBD.php');
 if(!isset($_SESSION)){session_start();}
 $PSEUDO= isset($_SESSION['id_utilisateur']) ? $_SESSION['id_utilisateur'] : 0;
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LightCycleFight</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Orbitron&display=swap" rel="stylesheet">  
    <link rel="stylesheet" href="CSS/acceuil.css" >
    <script src="JS/jquery-3.4.1.min.js"></script>
    <script src="https://kit.fontawesome.com/e2aac98496.js" crossorigin="anonymous"></script>
</head>

<body>
    <header>
       
            <nav class="nav navbar-default">
                <ul class="nav nav-pills justify-content-center">
                    <li class="nav-item">
                      <a class="nav-link active" href="#">Acceuil</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#Présentation">Présentation</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#Team">Team</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#Stats">Statistiques</a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="#Events">Evénements</a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="#Contact">Contact</a>
                    </li> 
                    <li class="nav-item">
                      <a class="nav-link" href="#">Jouer Vs IA</a>
                    </li>
                    <?php
                        if(isset($_SESSION['id_utilisateur'])){
                          echo " <li class='nav-item'>
                          <a class='nav-link' href='PHP/dashboardUser.php'>Mon Dashboard</a>
                        </li>";
                        }
                    ?>
                  </ul>
            </nav>

            <h1 class="col-md-12">LightCycleFight</h1>
            <hr>
            <button type='button' id='logButton' class='btn btn-primary btn-lg'><a href="PHP/login.php">S'authentifier</a></button>
            <!--button type='button' class='btn btn-primary btn-lg'>JOUER MAINTENANT</button-->
    </header> 
    <section id="Présentation">
        <h3>Présentation</h3>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,</p>
    </section>   

    <section id="Stats">
        <h3>Statistiques</h3>

        <div class="StatsRow">
        <div class="statsCards">
            <div class="statsData">
                <p>
                <?php
                $sql = "SELECT COUNT(*) as NBPARTIETOT FROM PARTIE";
                $res= $dbh->query($sql);
                foreach($res as $row)
                    echo $row['NBPARTIETOT'];
                    ?>
                </p>
            </div>
            <div class="statsTitle">
                <p>Nombre de partie joué</p>
            </div>
        </div>
        
        <div class="statsCards">
            <div class="statsData">
                <p>
                <?php
                $sql = "SELECT COUNT(*) as NBPARTIEIA FROM PARTIE WHERE TYPE_MATCH='IA'";
               $res= $dbh->query($sql);
               foreach($res as $row)
                   echo $row['NBPARTIEIA'];
                   ?>
                </p>
            </div>
            <div class="statsTitle">
                <p>Nombre de partie Vs IA</p>
            </div>
        </div>

        <div class="statsCards">
            <div class="statsData">
                <p>
                <?php
                $sql = "SELECT COUNT(*) as NBJOUEUR FROM UTILISATEUR WHERE ROLE='JOUEUR'";
               $res= $dbh->query($sql);
               foreach($res as $row)
                   echo $row['NBJOUEUR'];
                   ?>
                </p>
            </div>
            <div class="statsTitle">
                <p>Nombre de joueur</p>
            </div>
        </div>

        <div class="statsCards">
            <div class="statsData">
            <p>
                <?php
                $sql = "SELECT COUNT(*) as NBPARTIETOT1V1 FROM PARTIE WHERE TYPE_MATCH='1v1'";
                $res= $dbh->query($sql);
                foreach($res as $row)
                    echo $row['NBPARTIETOT1V1'];
                    ?>
                </p>
            </div>
            <div class="statsTitle">
                <p>Nombre de partie 1V1 </p>
            </div>
        </div>
        
    </div>
    </section>  
    <section id="Team">
        <h3>Team</h3>
        <div id="row">
            <div class="card" style="width: 20%;">
                <img src="IMAGES/31543101_102282713975787_7975195690995286016_o.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                  <p class="card-text" id="momo">Mohamed MASBAH ABOU LAICH</p>
                  <p>L3 Informatique FDS Montpellier</p>
                  <i class="fab fa-linkedin fa-4x"></i>
                </div>
              </div>
              <div class="card" style="width: 20%;">
                <img src="IMAGES/40313576_642691499489932_8305937623378034688_o.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text">Antoine AFFLATET<p>
                        <p>L3 Informatique FDS Montpellier</p>
                        <i class="fab fa-linkedin fa-4x"></i> 
                </div>
              </div>
              <div class="card" style="width: 20%;">
                <img src="IMAGES/23004546_713516668850307_9057302007055486628_o.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                  <p class="card-text">Hugo MIRAULT</p>
                  <p>L3 Informatique FDS Montpellier</p>
                  <i class="fab fa-linkedin fa-4x"></i>

                </div>
              </div>
              <div class="card" style="width: 20%;">
                <img src="IMAGES/48380390_342138316604462_2327487200549142528_o.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text"> Thomas BESSON<p>
                        <p>L3 Informatique FDS Montpellier</p>
                        <i class="fab fa-linkedin fa-4x "></i>
                </div>
              </div>
        </div>
      
    </section>   
   
    <section id="Jouer">
        <h3>Essayer le jeu </h3>
        <p class="col-md-7">Essayer une partie contre une IA développée par nos soins pour vous garantir une experience de jeu intense </p>
         <button type='button' id="playIAButton" class='btn btn-primary btn-lg col-md-4'>JOUER MAINTENANT</button>

    </section>   
    <section id="Events">
        <h3>Prochainements</h3>
        <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
            </ol>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="IMAGES/edgar-m-Tfrl8rH-QoU-unsplash.jpg" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </div>
              </div>
              <div class="carousel-item">
                <img src="IMAGES/s_t_a_r__labs_wallpaper_by_celethas-dbj509r.png" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
              <div class="carousel-item">
                <img src="IMAGES/jason-dent-uw-2pbbxIHs-unsplash.jpg" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </div>
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
    </section>   
    <section id="Contact">
        <h3>Contact</h3>
        <div id="contact-container">
          <div id="contact-form">
              <h2>Contactez-nous</h2>
              <form method="post" action="PHP/contact-submit.php" > 
              <label for="first-name"> Prénom:  </label>
                  <input type="text" name="first-name" placeholder="First-Name">
            
              
              <label for="last-name"> Nom :  </label>
                  <input type="text" name="last-name" placeholder="Last-Name">
              
      
              <label for="email"> Email :  </label>
                  <input type="text" name="email" placeholder="exemple@exemple.com" required></br>
          
              <label class="emailContent" for="emailContent">Contenu de message:  </label></br>
                  <textarea class="emailContent" name="emailContent" placeholder="text"></textarea></br>
              <input id='submitContactForm' type='submit' name='submit' class='btn btn-primary' value="Submit">
              
              </form>
          </div>
      
      </div>
      
      <div id='socialMediaAccounts'>
        <h2>Rejoignez l'aventure </h2>
        <i href="#" class="fab fa-instagram fa-4x"></i>
        <i href="#" class="fab fa-linkedin fa-4x"></i> 
        <i href="#" class="fab fa-facebook fa-4x"></i>
      </div>
      <p id="Copyrights">All Copyrights Reserved 2020.</p>
    </section>   
    <script src="JS/main.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>

</html>
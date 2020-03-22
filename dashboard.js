/*=============================VARIABLE GLOBAL ================================ **/

var PriorityClient ; // variable qui va contenir la priorité de joueur  
let indiceRoom = -1 ;

let ID_joueur;
    
var touches = [];
var timer = TMP_PARTIE;
    
let moto1;
let moto2;

var socket;
var timerMur = 0;
var murActif = false;
var pl;
var svgContainer;
var tempPartie;


/** ========================================On prépare la page de jeu ================================ */


$(document).ready(function(){

    $('body').on("click","#modifyProfile",function(){
        let niveau = $('.niveauMmr p:first').html();
        let mmr =$('.niveauMmr p:last').html();
        let pseudo = $('#pseudo').text();
        let email= $('#email').text();
        //let mdp = $('#mdp').text();
        let couleur_g = $('#couleur_g').text();
        let couleur_m = $('#couleur_m').text();
        let avatar = $('#avatar img').attr('src');
        $.ajax({
            url:"modifyProfileScript.php",
            method:"POST",
            data: {niveau: niveau , mmr: mmr,pseudo: pseudo, email: email,couleur_g: couleur_g , couleur_m: couleur_m, avatar:avatar},
            dataType:"text",
            success:function(data){
                console.log(data);
                $("#profil-container").html(data);
                },
                complete:function(data){
                    console.log(data);
                },
                error: function(data){
                    console.log("error");
                        console.log(data);
                }
        });
    });

    $('body').on('click',"#Joueur",function(e){
        $.ajax({
                    url : "fetch_All_Users.php",
                    method : "POST",
                    dataType: "text",
                    success:function(data){
                        console.log(data);
                    $("#Contact").html(data);    
                    },
                    complete:function(data){
                        console.log("lol");
                        console.log(data);
                    },
                    error: function(data){
                            console.log('error');
                            console.log(data);
                    }
                    
            });               
    }); 
    
    $('body').on('click','#1V1',function(){
        
        $('#rechercheMatch').css({
            'position':'fixed',
            'width':'100%', 
            'height':'100vh',
            'z-index':'3',
            'font-size':'24px',
            'background-color':'rgba(62, 74, 75, 0.7)',
            'text-align':'center',
            'justify-content':'center',
        });

        $('#rechercheMatch p').css({
            'color':'white',
            'position':'relative',
            'top':'50%'            
        });

        $('#rechercheMatch').fadeIn(); 

       

        socket = io('http://localhost:3333/first-namespace');


        /*=============================Fonction qui créé les joueurs, les moto et indique au serveur que le joueur est pret ================================ **/

        function BoutonReady(){
            var btn = document.createElement("button");
            btn.setAttribute("id","btn_ready");
            btn.setAttribute("onclick","socket.emit('joueur_pret')");
            btn.innerHTML = 'Are You Ready ?';
            document.body.appendChild(btn);
        }


        function GenerPlateau(){
            var elem = document.getElementById("btn_ready");
            elem.parentNode.removeChild(elem);
            pl = new Plateau();
            svgContainer = d3.select('#damier').append('svg').attr('width',PL_NBCOL*PL_L).attr('height',PL_NBLIG*PL_L).attr('id','plateau_');
            pl.newPlateau(PL_L,PL_NBCOL,PL_NBLIG);
            pl.newGrandeCases(PL_NBCOL*PL_L,PL_NBLIG*PL_L,5,5);
            console.log(svgContainer);
            socket.emit('CommencerPartie',indiceRoom);

        }

        function DemarePartie(){
            console.log(svgContainer);
            InitGame(ID_joueur, indiceRoom);
            defEvent(moto1);

            console.log("l'indice de la room est :" + indiceRoom);

            socket.emit('envoi_de_notre_moto',moto1,indiceRoom);
            var seconde_left = 10;
            var interval = setInterval(function(){
                document.getElementById('timer_partie').innerHTML = --seconde_left;

                if(seconde_left <= 0){
                    lanceMoto();

                    clearInterval(interval);
                }
            }, 1000);
        }

        /*============================= Met en mouvement les motos ================================ **/

        function lanceMoto(){
            tempPartie = setInterval(Frame, INTERVAL, moto1);
        }

       
        $.ajax({
            url : "fetchPlayerPriority.php",
            method : "POST",
            dataType: "text",
            success:function(data){
                PriorityClient = data;
                    console.log("this is data " +data);
                    console.log("this is data " +PriorityClient);
                },
                complete:function(data){
                    console.log("after lol");
                    console.log(data);
                },
                error: function(data){
                    console.log('error');
                    console.log(data);
                }
                
        });

        
        socket.on('connect',function(){
            socket.emit('envoiDePriorite',PriorityClient);
        });

        socket.emit('CommencerRecherche');

        socket.on('connectedToRoom',function(indiceRoomS){
            console.log("You Are Connected to Room " + indiceRoomS);
            indiceRoom = indiceRoomS ;
            console.log(indiceRoom);
        });

        
        /*============================= Commence la partie !!!!!!! ================================ **/

        socket.on('CommenceBientot',function(indiceRoom){

            $("body #rechercheMatch").append("<p id='PartieEnConst'>Votre partie va bientot commencer</p>");

            $("body #PartieEnConst").css({
                'position':'relative',
                'top':'60%',
                'color':'white' 
            });
            
            $.ajax({
                url : "LoadGamePage.php",
                method : "POST",
                dataType: "text",
                success:function(data){
                    //console.log("this is data " +data);
                    $('#main').html(data);
                },

                complete:function(data){
                    socket.emit('demande_id');
                    BoutonReady();
                },
                error: function(data){
                        console.log('error');
                        console.log(data);
                }
                
            });
            console.log("===========================LA PARTIE DOIT COMMENCER MNT===================");
        });
        
        //nous donne l'id du joueur pour la partie en cours (sert pour initialiser la moto)
        socket.on('id_joueur', function(id){
            ID_joueur = id;
            console.log("id joueur est : "+ id);
        });

        socket.on('generer_partie',function(){
            console.log("je genere la partie");
            GenerPlateau();
        });

        //il faut arriver à récupérer la moto du joueur adverse
        socket.on('autre_joueur', function(motoE){
            moto2 = new Moto(motoE.id_player);
            moto2.dessinerMoto();
        });

        //quand les deux joueurs sont pret on lance la partie
        socket.on('lance_partie', function(){
            DemarePartie();
        });

         //nous alerte lors d'une collision de nous ou de l'autre joueur
        socket.on('collision', function(message){
            console.log("=========================collision===============");
            moto1 = null;
            moto2 = null;
            svgContainer = null;
            pl = null;
            clearInterval(tempPartie);
            var elem = document.getElementById('plateau_');
            elem.parentNode.removeChild(elem);
        });


         /**
         lorsque on recoit le message du serveur comme quoi un joueur à bougé deux cas : 
         premier cas c'est nous alors on Update juste les deux motos
         deuxième cas on regarde si l'id de l'objet passé en paramètre est bien l'id de la moto adverse et dans ce cas on lui donne les arguments (de plus si la trainé est activé on la dessine)
         et ensuite on Update les deux motos

         */
        socket.on('update_joueur', function(moto){
            if(moto.id_player == moto2.id_player){

                moto2.X = moto.X;
                moto2.Y = moto.Y;
                moto2.ori = moto.ori;
                moto2.rot = moto.rot;
                moto2.speedX = moto.speedX;
                moto2.speedY = moto.speedY;
                moto2.train_act = moto.train_act;

                if(moto2.train_act){
                    pl.transformeCase(moto2.X+5,moto2.Y+25,moto2.color,'mur'); //permet de créer la trainée de la moto
                }
            }
            Update(moto1);
            Update(moto2);
        });

        socket.on('nouvelP', function(message){
            console.log("======================nouvelle partie =============================");
            BoutonReady();
        });
    });

});

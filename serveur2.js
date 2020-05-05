
var serveur = require('http').createServer();
var io = require("socket.io")(serveur);
const nsp = io.of('/first-namespace');


serveur.listen(8888,function(){
    console.log("serveur est en ecoute sur le port num : "+ 8888);
});


var Rooms = [];
var indiceInsertion = 0;


var id = 0;
var motoMouv;

nsp.on('connection', function (socket) {

    console.log('connetion');
    var inseré = false ;
   
  /* Commencer la Recherche de joueur à la connection en regardant toutes les chambrescréant une nouvelle chambre
  dont il est membre s'il trouve pas un joueur qui matche avec ça priorité de recherche
et sinon inclu*/ 
 socket.on('CommencerRecherche',function(Pseudo,Priority){
    Rooms.some( element => {
        if(Priority == element.Priority){

            if(element.remaining > 0){
               
                    
                    socket.join(element.name);
                    element.remaining--;
                    element.p2 = Pseudo
                    inseré = true;
                    socket.emit('connectedToRoom',element.position,2);
                    nsp.in(element.name).emit('CommenceBientot',{p2:element.p2,p1:element.p1} );
                    socket.to(element.name).emit('BeginInsertPartie',{p2:element.p2,p1:element.p1});
        
            }
      
        }
       
        return inseré ;
        
    });

    if(!inseré){
        console.log("INDICE INSERTION" + indiceInsertion);
        indiceNouvelleRoom = Rooms.length;

         /*on donne comme position de la room la taille de l'ensemble des rooms et
         comme nom l'indice insertion qui represente le nombre de room créér depuis
         le lancemant de serveur , on garantit ainsi des noms differents des rooms,Aussi 
        un acces correct pour toute modification a la room avec la variable position*/

        Rooms.push({name:'room'+indiceInsertion , position:indiceNouvelleRoom ,size:2,remaining:1,Priority:Priority, p1:Pseudo,p2:'null',idPartie:-1, score:[0,0],pret:0 ,plateauGenerer:0,motoPret:0,finMouv:0,moto1:0,moto2:0});
        socket.join(Rooms[indiceNouvelleRoom].name);
        indiceInsertion++;
    
        socket.emit('connectedToRoom',indiceNouvelleRoom,1);
        console.log('===============room Created================="=');
    }

    console.log(Rooms);
});

    socket.on('EnvoiIdPartieAutreJoueur',(id,indiceRoom)=>{
        Rooms[indiceRoom].idPartie = id ;
        console.log("===============Envoi ID Partie à l'Autre Joueur =========\n");
        console.log(Rooms[indiceRoom]);
        socket.to(Rooms[indiceRoom].name).emit('RecvIdPartie',id);
        
    });



    socket.on('couleurAdversaire', function(coul,indiceR){
        console.log("========================"+coul+"================");
        socket.to(Rooms[indiceR].name).emit('couleurAdv', coul);  

    });

    socket.on('joueur_pret', function(idJ,indiceR){
        console.log("Le Joueur Avec L'id "+ idJ + "est pret .");
        Rooms[indiceR].pret += 1;
        if(Rooms[indiceR].pret == 2 ) {
            console.log("les 2 joueurs sont prets");
            Rooms[indiceR].pret = 0;
            socket.emit('generer_partie');
        }
        
    });

    socket.on('CommencerPartie',(indiceRoom) =>{
        Rooms[indiceRoom].plateauGenerer += 1;

        if(Rooms[indiceRoom].plateauGenerer == 2){
            console.log("Une Partie a commencé dans room " +indiceRoom);
            Rooms[indiceRoom].plateauGenerer = 0;
            nsp.in(Rooms[indiceRoom].name).emit('lance_partie');
            
        }
    });


    //quand un des clients est prêt on l'envoie à l'autre joueur
    socket.on('envoi_de_notre_moto', function(moto,indice){
        console.log(indice);
        console.log(moto);
        socket.to(Rooms[indice].name).emit('moto_autre_joueur',moto);
    });

    socket.on('ok_pret', function(IR, tmpPartie, temp_refresh){
        Rooms[IR].motoPret +=1;
        if(Rooms[IR].motoPret == 2){
            Rooms[IR].motoPret = 0 ;
            var seconde_left = 5;
            var interval = setInterval(function(){

                nsp.in(Rooms[IR].name).emit('decompte_avant_demarage_parti', seconde_left);

                --seconde_left;

                if(seconde_left <= 0){
                    clearInterval(interval);
                    //TimerJeu(IR, tmpPartie, temp_refresh);
                    nsp.in(Rooms[IR].name).emit('frame');
                }
            }, 1000);
        }
        
    });
   

    socket.on('joueur_bouge', function(moto,indice, coll, ind, id_player){
        console.log(coll);
        Rooms[indice].finMouv += 1;
     

        if(Rooms[indice].finMouv == 2){
            if(moto.id_player == 1)
            Rooms[indice].moto1 = moto ;
            else
            Rooms[indice].moto2 = moto ;
            Rooms[indice].finMouv = 0;
    
        if(coll){
            clearInterval(motoMouv);
            nsp.in(Rooms[indice].name).emit('fin_manche',ind, id_player);
        }else{
            nsp.in(Rooms[indice].name).emit('update_joueur',Rooms[indice].moto1,Rooms[indice].moto2);
        }
        }
    });


    socket.on('miseAjourScore', function(indiceRoom,sc,id_joueur){
        Rooms[indiceRoom].score[id_joueur-1] = sc;
        nsp.in(Rooms[indiceRoom].name).emit('nouveauScore',Rooms[indiceRoom].score[0], Rooms[indiceRoom].score[1]);
    });


    socket.on('score', function(sc, id_joueur, indiceRoom){
        Rooms[indiceRoom].score[id_joueur-1] = sc[id_joueur-1];
        nsp.in(Rooms[indiceRoom].name).emit('vainceur',Rooms[indiceRoom].score[0], Rooms[indiceRoom].score[1]);
    });


   socket.on('JQuit',function(sc,idj,iR){
    Rooms[iR].score[0] = sc[0];
    Rooms[iR].score[1] = sc[1];
    nsp.in(Rooms[iR].name).emit('Joueur_A_Quitter',Rooms[iR].score[0], Rooms[iR].score[1],idj);
   });
   
    socket.on('FinDePartie',()=>{
        socket.emit("QuitterOuRejouer");
    });

    socket.on('Rejouer',function(idP,iR){
        console.log("================== Joueur Veut REJOUER  ===============\n");
        console.log(idP);
        console.log(iR);
        console.log(Rooms);
        if( typeof Rooms[iR] !== 'undefined'){
            console.log("LA ROOM EXISTE");
            if(Rooms[iR].idPartie == idP){
                console.log("Les ID SONT COMPATIBLES");
                Rooms.splice(iR,1);

                for(let i = iR ; i < Rooms.length;i++){

                    Rooms[i].position -= 1;
                    nsp.in(Rooms[i].name).emit("connectedToRoom",Rooms[i].position,Rooms[i].name);
    
                  }
                console.log(Rooms);
            }else{
                console.log("Les ID SONT INCOMPATIBLES");
            }
            
        }else{
            console.log("LA ROOM N'EXISTE PAS")
        }
    
        socket.emit("Replay");
    });

    socket.on('Quitter',function(idP,iR){
        console.log("================== Joueur A QUITTER ===============\n");
        console.log(idP);
        console.log(iR);
        console.log(Rooms);
        if( typeof Rooms[iR] !== 'undefined'){
            console.log("LA ROOM EXISTE");
            if(Rooms[iR].idPartie == idP){
                console.log("Les ID SONT COMPATIBLES");
                Rooms.splice(iR,1);

                for(let i = iR ; i < Rooms.length;i++){

                    Rooms[i].position -= 1;
                    nsp.in(Rooms[i].name).emit("connectedToRoom",Rooms[i].position,Rooms[i].name);
    
                  }

                console.log(Rooms);
            }else{
                console.log("Les ID SONT INCOMPATIBLES");
            }
            
        }else{
            console.log("LA ROOM N'EXISTE PAS")
        }
        socket.emit("redirectToDashBoard");
    });

    
    socket.on('clearInterval',function(){
        clearInterval(motoMouv);
    });

    socket.on('AdminRequestRooms',()=>{
        socket.emit('Rooms',Rooms);
    });

    socket.on('disconnect',function(){
        console.log('disconnected');
    });

});


function TimerJeu(IR ,tempPartie, temprefresh){
    var second = tempPartie;
    motoMouv = setInterval(function(){
        if(typeof Rooms[IR] !== 'undefined'){
            nsp.in(Rooms[IR].name).emit('frame', second/1000);
            second -= temprefresh;
            if(second <= 0){
                clearInterval(motoMouv);
                nsp.in(Rooms[IR].name).emit('fin_manche' , 0, -1);
            }
        }
    }, temprefresh);
}

var serveur = require('http').createServer();
var io = require("socket.io")(serveur);
const nsp = io.of('/first-namespace');
var eloModule = require('./elo');
var ExpModule = require('./experience');
var mysql = require('mysql');

/*
var con = mysql.createConnection({
  host: "test.lightcyclefight.com",
  user: "lightcycbrfight",
  password: "Halellujah19",
  database:"lightcycbrfight"
});
*/
var con = mysql.createConnection({
    host: "localhost",
    user: "debian-sys-maint",
    password: "t5n8O9FMkWEb4ssP",
    database:"lightcyclefight"
});

serveur.listen(8888,function(){
    console.log("serveur est en ecoute sur le port num : "+ 8888);
});


var Rooms = [];

var indiceInsertion = 0;



var id = 0;
var motoMouv;


function MatchMaking(socket,Rooms,Pseudo,Priority,nbPartieJoue,Elo,range,indiceRoom,nbTentative,XP,boost){

    let BestELo = {roomName:'null',elo:-1,differenceElo:3000,roomPosition:-1,Pseudo:'null'};
    
    Rooms.forEach(element => {
            if(element.remaining > 0 && element.Pseudo != Pseudo && Elo-range-Priority <= element.eloJ1 && Elo+range+Priority >= element.eloJ1 && BestELo.differenceElo >= Math.abs(Elo - element.eloJ1)){
             BestELo.roomName = element.name;
             BestELo.differenceElo = Math.abs(Elo - element.Elo) ;
             BestELo.roomPosition = element.position;
             BestELo.Pseudo = element.Pseudo ;    
            }
        
    });

    if(BestELo.roomName == 'null'){
        if(indiceRoom == -1){
        console.log("INDICE INSERTION" + indiceInsertion);
        indiceNouvelleRoom = Rooms.length;

         /*on donne comme position de la room la taille de l'ensemble des rooms et
         comme nom l'indice insertion qui represente le nombre de room créér depuis
         le lancemant de serveur , on garantit ainsi des noms differents des rooms,Aussi 
        un acces correct pour toute modification a la room avec la variable position*/

        Rooms.push({name:'room'+indiceInsertion , position:indiceNouvelleRoom ,size:2,remaining:1,XPJ1:XP,XPJ2:-1,BoostJ1:boost,BoostJ2:-1,Priority:Priority, p1:Pseudo,p2:'null',idPartie:-1, score:[0,0],pret:0 ,plateauGenerer:0,motoPret:0,finMouv:0,moto1:0,moto2:0,collJ1:-1,collJ2:-1,nbPartieJ1:nbPartieJoue,nbPartieJ2:0,eloJ1:Elo,eloJ2:0,demandeScore:0});
        socket.join(Rooms[indiceNouvelleRoom].name);
        indiceInsertion++;
        console.log(Rooms);
        socket.emit("RelanceDeRecherche",(Priority? Priority:range+250),indiceNouvelleRoom);
        }else{
            if(nbTentative < 3)
            socket.emit("RelanceDeRecherche",(Priority? Priority:range+250),indiceRoom);
            else{
            console.log(Rooms);
            socket.leave(Rooms[indiceRoom].name);
            Rooms.splice(indiceRoom,1);
            for(let i = indiceRoom ; i < Rooms.length ; i++){
                Rooms[i].position -= 1;
                nsp.in(Rooms[i].name).emit('miseAjourIndRoom',Rooms[i].position);
            }
            socket.emit("MatchIntrouvable");
            }
        }
    }else{
        if(indiceRoom != -1){
        socket.leave(Rooms[indiceRoom].name);
        Rooms.splice(indiceRoom,1);
        for(let i = indiceRoom ; i < Rooms.length ; i++){
            Rooms[i].position -= 1;
            nsp.in(Rooms[i].name).emit('miseAjourIndRoom',Rooms[i].position);
        }
        }
        console.log(BestELo);
        socket.join(BestELo.roomName);
        socket.to(BestELo.roomName).emit("ClearTimeout");
        Rooms[BestELo.roomPosition].remaining--;
        Rooms[BestELo.roomPosition].p2 = Pseudo;
        Rooms[BestELo.roomPosition].nbPartieJ2 = nbPartieJoue;
        Rooms[BestELo.roomPosition].eloJ2 = Elo;
        Rooms[BestELo.roomPosition].XPJ2 = XP;
        Rooms[BestELo.roomPosition].BoostJ2 = boost;
        socket.emit('connectedToRoom',BestELo.roomPosition,2);
        socket.to(BestELo.roomName).emit('connectedToRoom',BestELo.roomPosition,1);
        nsp.in(BestELo.roomName).emit('CommenceBientot',{p2:Pseudo,p1:BestELo.Pseudo} );
        socket.to(BestELo.roomName).emit('BeginInsertPartie',{p2:Pseudo,p1:BestELo.Pseudo});
        console.log(Rooms);
    }
};

nsp.on('connection', function (socket) {

    console.log('connetion');
    var inseré = false ;
   
  /* Commencer la Recherche de joueur à la connection en regardant toutes les chambrescréant une nouvelle chambre
  dont il est membre s'il trouve pas un joueur qui matche avec ça priorité de recherche
et sinon inclu*/ 
 socket.on('CommencerRecherche',function(Pseudo,Priority,nbPartieJoue,Elo,range,indiceRoom,nbTentative,XP,boost){
    MatchMaking(socket,Rooms,Pseudo,Priority,nbPartieJoue,Elo,range,indiceRoom,nbTentative,XP,boost);        
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
                    TimerJeu(IR, tmpPartie, temp_refresh);
                   
                }
            }, 1000);
        }
        
    });
   

    socket.on('joueur_bouge', function(moto,indice,coll){

        /*console.log("========================================");
        console.log("Coll");
        console.log(coll);
        console.log(Rooms[indice].collJ1);
        console.log(Rooms[indice].collJ2);
        console.log(moto.id_player);
        console.log("========================================");*/
        Rooms[indice].finMouv += 1;
    
        if(moto.id_player == 1){
        Rooms[indice].moto1 = moto ;
        Rooms[indice].collJ1 = coll ;
        }else{
        Rooms[indice].moto2 = moto ;
        Rooms[indice].collJ2 = coll ;
        }

        if(Rooms[indice].finMouv >= 2 &&  Rooms[indice].collJ1 != -1 && Rooms[indice].collJ2 != -1 ){   

            Rooms[indice].finMouv = 0;
            
            if(Rooms[indice].collJ1 || Rooms[indice].collJ2){
                clearTimeout(motoMouv);
                let scoreJ1 = 0;
                let scoreJ2 = 0; 
                if(Rooms[indice].collJ1 == Rooms[indice].collJ2){
                scoreJ1 = 0 ;
                scoreJ2 = 0 ;
                 }else{
                scoreJ1 = Rooms[indice].collJ1 ? 0 : 1;
                scoreJ2 = Rooms[indice].collJ2 ? 0 : 1; 
                }
                Rooms[indice].score[0] += scoreJ1;
                Rooms[indice].score[1] += scoreJ2;
                Rooms[indice].collJ1 = -1;
                Rooms[indice].collJ2 = -1;
              process.nextTick(()=>{
                nsp.in(Rooms[indice].name).emit('fin_manche',scoreJ1,scoreJ2);
              });   
           
            }else{  
                Rooms[indice].collJ1 = -1;
                Rooms[indice].collJ2 = -1;
                nsp.in(Rooms[indice].name).emit('update_joueur',Rooms[indice].moto1,Rooms[indice].moto2);
            }
        }
    });


 

    socket.on('score', function(nbManche,sc, id_joueur, indiceRoom){
        Rooms[indiceRoom].score[id_joueur-1] = sc;
        Rooms[indiceRoom].demandeScore += 1;
    
        if( Rooms[indiceRoom].demandeScore == 2){
            Rooms[indiceRoom].demandeScore = 0;
            let nouvRang = eloModule.nouveauRang(nbManche,Rooms[indiceRoom].eloJ1,Rooms[indiceRoom].eloJ2,Rooms[indiceRoom].score,Rooms[indiceRoom].nbPartieJ1,Rooms[indiceRoom].nbPartieJ2);
            con.connect(function(err) {
                if (err) throw err;
                console.log("========================================");
                console.log(nouvRang.nouveauRangJ1);
                console.log(nouvRang.nouveauRangJ2);
                console.log("========================================");
                var sql = "UPDATE UTILISATEUR SET ELO = '"+nouvRang.nouveauRangJ1+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p1+"'";
                var sql2 = "UPDATE UTILISATEUR SET ELO = '"+nouvRang.nouveauRangJ2+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p2+"'";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                  });
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                  });
              });
              let nouvXP= ExpModule.gainExperience(Rooms[indiceRoom].XPJ1,Rooms[indiceRoom].BoostJ1,Rooms[indiceRoom].XPJ2,Rooms[indiceRoom].BoostJ2,Rooms[indiceRoom].score);
                  console.log("========================================");
                  console.log(nouvXP.miseAJourExperienceJ1);
                  console.log(nouvXP.miseAJourExperienceJ2);
                  console.log("========================================");
                  var sql = "UPDATE UTILISATEUR SET EXPERIENCE = '"+nouvXP.miseAJourExperienceJ1+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p1+"'";
                  var sql2 = "UPDATE UTILISATEUR SET  EXPERIENCE = '"+nouvXP.miseAJourExperienceJ2+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p2+"'";
                  con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log(result.affectedRows + " record(s) updated");
                    });
                  con.query(sql2, function (err, result) {
                      if (err) throw err;
                      console.log(result.affectedRows + " record(s) updated");
                    });
            nsp.in(Rooms[indiceRoom].name).emit('vainceur',Rooms[indiceRoom].score[0], Rooms[indiceRoom].score[1]);
        }

    });


   socket.on('JQuit',function(nbManche,sc,idj,iR){
    Rooms[iR].score[0] = sc[0];
    Rooms[iR].score[1] = sc[1];
    let nouvRang = eloModule.nouveauRang(nbManche,Rooms[iR].eloJ1,Rooms[iR].eloJ2,Rooms[iR].score,Rooms[iR].nbPartieJ1,Rooms[iR].nbPartieJ2);
            con.connect(function(err) {
                if (err) throw err;
                var sql = "UPDATE UTILISATEUR SET ELO = '"+nouvRang.nouveauRangJ1+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p1+"'";
                var sql2 = "UPDATE UTILISATEUR SET ELO = '"+nouvRang.nouveauRangJ2+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p2+"'";
                con.query(sql, function (err, result){
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                  });
                con.query(sql2, function (err, result){
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                  });
              });
    let nouvXP = ExpModule.gainExperience(Rooms[indiceRoom].XPJ1,Rooms[indiceRoom].BoostJ1,Rooms[indiceRoom].XPJ2,Rooms[indiceRoom].BoostJ2,Rooms[indiceRoom].score);
            con.connect(function(err) {
                  if (err) throw err;
                  console.log("========================================");
                  console.log(nouvXP.miseAJourExperienceJ1);
                  console.log(nouvXP.miseAJourExperienceJ2);
                  console.log("========================================");
                  var sql = "UPDATE UTILISATEUR SET EXPERIENCE = '"+nouvXP.miseAJourExperienceJ1+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p1+"'";
                  var sql2 = "UPDATE UTILISATEUR SET  EXPERINECE = '"+nouvXP.miseAJourExperienceJ2+"' WHERE PSEUDO = '"+Rooms[indiceRoom].p2+"'";
                  con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log(result.affectedRows + " record(s) updated");
                    });
                  con.query(sql2, function (err, result) {
                      if (err) throw err;
                      console.log(result.affectedRows + " record(s) updated");
                    });
                });         
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
    function mouvementPerFrame(){
        if(typeof Rooms[IR] !== 'undefined'){
            nsp.in(Rooms[IR].name).emit('frame', second/1000);
            second -= temprefresh;
            motoMouv = setTimeout(mouvementPerFrame,temprefresh);
            if(second <= 0){
                clearTimeout(motoMouv);
                nsp.in(Rooms[IR].name).emit('fin_manche' , 0, -1);
            }
        }
    }
    motoMouv = setTimeout(mouvementPerFrame,temprefresh);
}
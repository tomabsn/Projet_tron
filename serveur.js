var nomsJoueurs = [];
var nbJoueursConnectes = 0;

var express = require('express');
var app = express();
var serveur = require('http').createServer(app);
var io = require("socket.io")(serveur);
const nsp = io.of('/first-namespace');

serveur.listen(3333,function(){
    console.log("serveur est en ecoute sur le port num : "+ 3333);
});
/*
app.get('/',function(req,res){
    res.send('<h1>HEllo World</h1>');
});*/

var Rooms = []

var indiceInsertion = 0;
var Priority ;
var id = 0;

var presD = 0;
var pres = 0;
var presc = 0;

nsp.on('connection', function (socket) {


    var inseré = false ;
   console.log('connetion');

    
    socket.on('CommencerRecherche',function(){
    Rooms.forEach(element => {
        if(Priority == 'null'){

            if(element.remaining > 0){
                if(element.Priority == 'null'){
                    
                    socket.join(element.name);
                    element.remaining-- ;
                    element.Priority = Priority;
                    inseré = true;
                    nsp.in(element.name).emit('connectedToRoom',indiceInsertion);
                    nsp.in(element.name).emit('CommenceBientot',indiceInsertion);
                }
            }
        
        }else{

            if(element.remaining > 0){
                if(element.Priority == Priority){
                    
                    socket.join(element.name);
                    element.remaining-- ;
                    element.Priority = Priority;
                    inseré = true;
                    nsp.in(element.name).emit('connectedToRoom',indiceInsertion);
                    nsp.in(element.name).emit('CommenceBientot',indiceInsertion);
                }
            }
        }
       

        indiceInsertion++;
    });

    if(!inseré){
        Rooms.push({name:'room'+indiceInsertion , size:2,'remaining':2,Priority:'null' });
        socket.join(Rooms[indiceInsertion].name);
        Rooms[indiceInsertion].remaining-- ;
        Rooms[indiceInsertion].Priority = Priority;
        inseré = true;
        nsp.in(Rooms[indiceInsertion].name).emit('connectedToRoom',indiceInsertion);
        console.log('===============room Created================="=');
    }

    console.log(Rooms);
    });
   
    socket.on('demande_id',function(){
        id = id+1;
        socket.emit('id_joueur', id);
    });
   
    socket.on('joueur_pret', function(){
        presD += 1;
        if(presD ==2) {
            console.log("un des joueur est pret");
            socket.emit('generer_partie');
            presD = 0;
        }
        
    });

    socket.on('CommencerPartie',(indiceRoom) =>{
        pres +=1;

        if(pres==2){
            console.log("Une Partie a commencé dans room " +indiceRoom);
            nsp.in(Rooms[indiceRoom].name).emit('lance_partie');
            pres = 0;
        }
    });

   //lors d'une collision un message est envoyé au client même et à l'autre client
    socket.on('collision',(indiceRoom) =>{
        presc = presc + 1;
        if(presc <= 1){
            socket.emit('collision', 'vous etes en collision !');
            socket.broadcast.emit('collision', 'l\'autre joueur est en collision');
            console.log("Serveur : message nouvelle partie / "+indiceRoom);
    
            nsp.in(Rooms[indiceRoom].name).emit('nouvelP','coucou');
            presc = 0;
        }
        
    });

    //quand un des clients est prêt on l'envoie à l'autre joueur
    socket.on('envoi_de_notre_moto', function(moto,indice){
        //console.log(indice);
        //console.log(moto);
        socket.to(Rooms[indice].name).emit('autre_joueur',moto);
    });

    //si un joueur bouge on l'envoi à tout les clients
    socket.on('joueur_bouge', function(moto,indice){
        socket.to(Rooms[indice].name).emit('update_joueur', moto);
        //socket.broadcast.emit('update_joueur', moto);
    });


   socket.on('envoiDePriorite',function(data){
       console.log("this is data " + data );
        Priority = data ;
       console.log("this is data " +Priority);
   });


    socket.on('disconnect',function(){
        console.log('disconnected');
    });

});

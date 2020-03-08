var serveur = require('http').createServer(function(req, res){});
var io = require("socket.io").listen(serveur);
var id = 0;
var nbrManche = 3;

io.sockets.on('connection', function(socket){
    if(id < 2){
        id += 1;
        socket.emit('id_joueur', id);
        console.log("joueur "+id+"présent dans la partie");
    }

    if(id==2){
        io.emit('joueurs_pret');
    }
    

    if(nbrManche <= 0){
        io.emit('Fin_de_la_Partie');
    }
    //lors d'une collision un message est envoyé au client même et à l'autre client
    socket.on('collision', function(message){
        io.emit('collision', message);
    });

    //quand un des clients est prêt on l'envoie à l'autre joueur
    socket.on('envoi_autre_joueur_serveur', function(moto){
        socket.broadcast.emit('autre_joueur',moto);
    });

    //si un joueur bouge on l'envoi à tout les clients
    socket.on('joueur_bouge', function(moto){
        io.emit('update_joueur', moto);
    });

    socket.on('fin_de_manche', function(){
        nbrManche--;
        io.emit('fin_de_manche');
    })
});

serveur.listen(8080, function(){
    console.log("serveur écoute ");
});
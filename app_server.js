var serveur = require('http').createServer(function(req, res){});
var io = require("socket.io").listen(serveur);
var id = 0;

io.sockets.on('connection', function(socket){
    if(id < 2){
        id += 1;
        socket.emit('id_joueur', id);
    }

    if(id==2){
        io.emit('joueurs_pret');
        //socket.broadcast.emit('joueurs_pret');
    }
    
    socket.on('collision', function(message){
        socket.emit('collision', 'vous etes en collision !');
        socket.broadcast.emit('collision', 'l\'autre joueur est en collision');
    });

    socket.on('envoi_autre_joueur_serveur', function(moto){
        socket.broadcast.emit('autre_joueur',moto);
    });

    socket.on('joueur_bouge', function(moto){
        io.emit('update_joueur', moto);
        //socket.broadcast.emit('update_joueur', moto);
    });
});

serveur.listen(8080, function(){
    console.log("serveur écoute ");
});
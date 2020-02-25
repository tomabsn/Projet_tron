var serveur = require('http').createServer(function(req, res){});
var io = require("socket.io").listen(serveur);
var id = 0;

io.sockets.on('connection', function(socket){
    if(id < 2){
        id += 1;
        console.log('Un joueur est en ligne. '+ id);
        socket.emit('id_joueur', id);
    }else{
        console.log('impossible de vous connecter');
    }
    
    
    socket.on('collision', function(message){
        console.log(message);
        socket.emit('collision', 'vous etes en collision !');
        socket.broadcast.emit('collision', 'il y a eu une collision');
    });

    socket.on('envoi_autre_joueur_serveur', function(moto){
        console.log('envoi de la moto adverse');
        socket.broadcast.emit('autre_joueur',moto);
    });
});

serveur.listen(8080, function(){
    console.log("serveur écoute ");
});
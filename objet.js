var moto1;
var moto2;
var svgContainer = d3.select("body").append("svg").attr("width", 800).attr("height", 800); //on crée un espace ou mettre la moto

function InitGame() {
    //moto1 = new Moto(400, 600, 1, "black"); //instance d'une moto
    moto2 = new Moto(400, 550, 2, "red");
    //moto1.dessinerMoto(0);
    moto2.dessinerMoto(0);
    
}



//définition de l'objet moto
function Moto(X, Y, id_p, color){

    this.X = X;
    this.Y = Y;
    this.speedX = 0;
    this.speedY = 0;
    this.id_player = id_p;
    this.color = color;
    this.rectangle = null;
    this.rot = 0;

    this.dessinerMoto= function(){
        this.rectangle = svgContainer.append("rect").attr("x", this.X).attr("y", this.Y).attr("width", 50).attr("height", 100).attr("fill", this.color).attr("id", "moto_html"+this.id_player).attr("transform", "rotate("+this.rot+","+(this.X-25)+","+(this.Y+75)+")");
    }
    this.movRight = function(){
        this.speedX += 10;
    }
    this.moveleft = function(){
        this.speedX -= 10;
    }
    this.moveup = function(){
        this.speedY -= 10;
    }
    this.movedown = function(){
        this.speedY += 10;
    }

    this.moveUPRIGHT = function(){
        this.speedX += 10;
        this.speedY -= 10;
    }

    this.moveUPLEFT= function(){
        this.speedX -= 10;
        this.speedY -= 10;
    }

    this.moveDOWNLEFT= function(){
        this.speedX -= 10;
        this.speedY += 10;
    }

    this.moveDOWNRIGTH = function(){
        this.speedX += 10;
        this.speedY += 10;
    }

    this.newPos = function() {
        this.X += this.speedX;
        this.Y += this.speedY;
        this.speedX = 0;
        this.speedY = 0;
    }
}

//on "raffraichit" la page , on va supprimer la moto et affciher une nouvelle moto avec les nouvelles coordonnées
function Update(moto_update){
    console.log("dans l'Update");
    var elem = document.getElementById("moto_html"+moto_update.id_player);
    elem.parentNode.removeChild(elem);
    moto_update.newPos();
    moto_update.dessinerMoto();
}

//en paramètre on mettra l'id de la moto/joueur et on fera un switch pour les touches et on enclanchera la direction plus la rotation
function Move(){
    moto2.moveUPRIGHT();
    Update(moto2);
}

function rotation(moto_m){

    moto_m.rot = 45;
    d3.select("#moto_html"+moto_m.id_player).attr("transform","rotate(45,"+(moto_m.X-25)+","+(moto_m.Y+75)+")");
}

InitGame();

var myVar = setInterval(Move, 60);



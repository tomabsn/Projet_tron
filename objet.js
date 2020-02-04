var moto1;
var moto2;
var svgContainer = d3.select("body").append("svg").attr("width", 1000).attr("height", 600); //on crée un espace ou mettre la moto

function InitGame(){
    moto2 = new Moto(400, 550, 2, "red");
    moto2.dessinerMoto(0);
    
}

//définition de l'objet moto
function Moto(X, Y, id_p, color){

    this.X = X;
    this.Y = Y;
    this.speedX = 0;
    this.speedY = -10;
    this.id_player = id_p;
    this.color = color;
    this.rectangle = null;
    this.rot = 0;
    this.dir = null;

    this.dessinerMoto= function(){
        this.rectangle = svgContainer.append("rect").attr("x", this.X).attr("y", this.Y).attr("width", 10).attr("height", 30).attr("fill", this.color).attr("id", "moto_html"+this.id_player).attr("transform", "rotate("+this.rot+","+(this.X+5)+","+(this.Y+25)+")");
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
    }
}

//on "raffraichit" la page , on va supprimer la moto et affciher une nouvelle moto avec les nouvelles coordonnées
function Update(moto_update){
    //console.log("dans l'Update");
    var elem = document.getElementById("moto_html"+moto_update.id_player);
    elem.parentNode.removeChild(elem);
    moto_update.newPos();
    moto_update.dessinerMoto();
}

//en paramètre on mettra l'id de la moto/joueur et on fera un switch pour les touches et on enclanchera la direction plus la rotation
function Move(){
    Update(moto2);
}

var touches = [];

d3.select("body")
.on("keydown", function()
{
    var code = d3.event.keyCode;
    if(touches.indexOf(code)<0) 
        touches.push(code);
    rotation(moto2);
});

d3.select("body")
.on("keyup", function()
{
    var code = d3.event.keyCode;
    index = touches.indexOf(code);
    if(index>=0) 
        touches.splice(index,1);
}); 



function direction()
{
    var dir=0;

    if(touches.indexOf(37)!=-1) dir +=1; //left
    if(touches.indexOf(38)!=-1) dir +=2; //up
    if(touches.indexOf(39)!=-1) dir +=4; //right
    if(touches.indexOf(40)!=-1) dir +=8; //down
    
    return dir;
}


function rotation(moto_m){
    var dir =  direction();
    moto_m.speedX = 0;
    moto_m.speedY = 0;
    var rotX = moto_m.X;
    var rotY = moto_m.Y;
    console.log(rotX+", "+rotY);
    
          switch (dir) {               
              case 1:
                  ori = 'O';
                  moto_m.rot = 270;
                  moto_m.moveleft();
                  Update(moto_m);

              break;
              case 2:
                  ori = 'N';
                  moto_m.rot = 0;
                  moto_m.moveup();
                  Update(moto_m);

              break;
              case 3:
                  ori = 'NO';
                  moto_m.rot = 315;
                  moto_m.moveUPLEFT();
                  Update(moto_m);

              break;
              case 4:
                  ori = 'E';
                  moto_m.rot = 90;
                  moto_m.movRight();
                  Update(moto_m);

              break;
              case 6:
                  ori = 'NE';
                  moto_m.rot = 45;
                  moto_m.moveUPRIGHT();
                  Update(moto_m);

              break;
              case 8:
                  ori = 'S';
                  moto_m.rot = 180;
                  moto_m.movedown();
                  Update(moto_m);

              break;
              case 9:
                  ori = 'SE';
                  moto_m.rot = 225;
                  moto_m.moveDOWNLEFT();
                  Update(moto_m);

              break;
              case 12:
                  ori = 'NE';
                  moto_m.rot = 135;
                  moto_m.moveDOWNRIGTH();
                  Update(moto_m);

              break;
          default : console.log("Aucune touche valide")
           // il faut check si l'orientation ets correcte
          }
          
}


InitGame();

var myVar = setInterval(Move, 60);



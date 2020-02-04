
function InitGame(){
    moto1 = new Moto(350,200 , 1, "black");
    moto2 = new Moto(400, 200, 2, "red");
    moto1.dessinerMoto();
    moto2.dessinerMoto();
    
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
    this.ori = "N";

    this.dessinerMoto= function(){
        //on dessine la moto avec déjà les attributs rotation que l'on modifiera avec l'attribut this.rot
        this.rectangle = svgContainer.append("rect").attr("x", this.X).attr("y", this.Y).attr("width", 10).attr("height", 30).attr("fill", this.color).attr("id", "moto_html"+this.id_player).attr("transform", "rotate("+this.rot+","+(this.X+5)+","+(this.Y+25)+")");
    }
    this.movRight = function(){
        this.speedX = 10;
    }
    this.moveleft = function(){
        this.speedX = -10;
    }
    this.moveup = function(){
        this.speedY = -10;
    }
    this.movedown = function(){
        this.speedY = 10;
    }

    this.moveUPRIGHT = function(){
        this.speedX = 7.1;
        this.speedY = -7.1;
    }

    this.moveUPLEFT= function(){
        this.speedX = -7.1;
        this.speedY = -7.1;
    }

    this.moveDOWNLEFT= function(){
        this.speedX = -7.1;
        this.speedY = 7.1;
    }

    this.moveDOWNRIGTH = function(){
        this.speedX = 7.1;
        this.speedY = 7.1;
    }

    this.newPos = function() {
        this.X += this.speedX;
        this.Y += this.speedY;  
    }
}

//on "raffraichit" la page , on va supprimer la moto et affciher une nouvelle moto avec les nouvelles coordonnées
function Update(moto_update){
    //console.log("dans l'Update");

    //on selectionne la moto dans le corps html
    var elem = document.getElementById("moto_html"+moto_update.id_player);

    //on retire la moto de la plateforme on l'efface (Attention on ne la détruit pas !!!)
    elem.parentNode.removeChild(elem);
    //on lui donne la nouvelle direction à prendre
    moto_update.newPos();
    //on redessine la moto avec les nouvelle coordonné et la nouvelle direction
    moto_update.dessinerMoto();
}

function Move(){
    //on rafracihi la moto
    rotation(moto2);
    Update(moto2);
    Update(moto1);
}



function defEvent()
{
                d3.select("body")
            .on("keydown", function()
            {
                console.log("coucou toi");
                var code = d3.event.keyCode;
                if(touches.indexOf(code)<0) 
                    touches.push(code);
            });

            d3.select("body")
            .on("keyup", function()
            {
                var code = d3.event.keyCode;
                index = touches.indexOf(code);
                if(index>=0) 
                    touches.splice(index,1);
            });
}


function direction()
{
    var dir=0;
    //code pour chaque touche
    if(touches.indexOf(37)!=-1) dir +=1; //left
    if(touches.indexOf(38)!=-1) dir +=2; //up
    if(touches.indexOf(39)!=-1) dir +=4; //right
    if(touches.indexOf(40)!=-1) dir +=8; //down
    
    return dir;
}

function rotation(moto_m){
    var dir =  direction();
    moto_m.speedX = 0; //la direction est mise à 0 en X et Y
    moto_m.speedY = 0;
    console.log("rotation" + dir);

          switch (dir) {               
              case 1:
                  if(moto_m.ori=="NO" || moto_m.ori=="SO"){
                    moto_m.ori = 'O';
                    moto_m.rot = 270; //on donne la rotation à la moto pour quand elle sera redessiné
                    moto_m.moveleft(); //on bouge la moto dans la direction
                  }else{
                    avancedefault(moto_m);
                }

              break;
              case 2:
                if(moto_m.ori=="NO" || moto_m.ori=="NE"){
                    moto_m.ori = 'N';
                    moto_m.rot = 0;
                    moto_m.moveup();
                }else{
                    avancedefault(moto_m);
                }


              break;
              case 3:
                if(moto_m.ori=="O" || moto_m.ori=="N"){
                    moto_m.ori = 'NO';
                    moto_m.rot = 315;
                    moto_m.moveUPLEFT();
                }else{
                    avancedefault(moto_m);
                }


              break;
              case 4:
                if(moto_m.ori=="NE" || moto_m.ori=="SE"){
                    moto_m.ori = 'E';
                    moto_m.rot = 90;
                    moto_m.movRight();
                }else{
                    avancedefault(moto_m);
                }


              break;
              case 6:
                if(moto_m.ori=="N" || moto_m.ori=="E"){
                    moto_m.ori = 'NE';
                    moto_m.rot = 45;
                    moto_m.moveUPRIGHT();
                }else{
                    avancedefault(moto_m);
                }

              break;
              case 8:
                if(moto_m.ori=="SE" || moto_m.ori=="SO"){
                    moto_m.ori = 'S';
                    moto_m.rot = 180;
                    moto_m.movedown();
                }else{
                    avancedefault(moto_m);
                }


              break;
              case 9:
                if(moto_m.ori=="O" || moto_m.ori=="S"){
                    moto_m.ori = 'SO';
                    moto_m.rot = 225;
                    moto_m.moveDOWNLEFT();
                }else{
                    avancedefault(moto_m);
                }


              break;
              case 12:
                if(moto_m.ori=="E" || moto_m.ori=="S"){
                    moto_m.ori = 'SE';
                    moto_m.rot = 135;
                    moto_m.moveDOWNRIGTH();
                }else{
                    avancedefault(moto_m);
                }


              break;
          default : avancedefault(moto_m);
           // il faut check si l'orientation ets correcte
          }
          
}

function avancedefault(moto_m){
    console.log(moto_m.ori, moto_m.rot);
    switch (moto_m.ori){
        case "N":
            moto_m.moveup();
        break;

        case "S":
            moto_m.movedown();
        break;
        
        case "O":
            moto_m.moveleft();
            break;
        
        case "E":
            moto_m.movRight();
            break;
            
        case "NO":
            moto_m.moveUPLEFT();
            break;
        
        case "NE":
            moto_m.moveUPRIGHT();
            break;

        case "SO":
            moto_m.moveDOWNLEFT();
            break;
        
        case "SE":
            moto_m.moveDOWNRIGTH();
            break;
        default: console.log("pas d'oritentation");
    }

}

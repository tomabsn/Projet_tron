//import { platform } from "os";

function InitGame(){
    moto1 = new Moto(350,200 , 1, "black");//création de moto
    moto2 = new Moto(250, 250, 2, col_moto);
    moto1.dessinerMoto(); //on dessine la moto
    moto2.dessinerMoto();
    
}

//définition de l'objet moto
function Moto(X, Y, id_p, color){

    this.X = X;//coordonnée X et Y de la moto
    this.Y = Y;
    this.speedX = 0; //vitesse de déplacement selon l'axe X ou Y
    this.speedY = -10;
    this.id_player = id_p;
    this.color = color;
    this.rectangle = null; //contiendra le dessin de la moto
    this.rot = 0; //on a une rotation de 0 de base
    this.ori = "N"; //on regarde au nord ou au sud tout dépend si on est méchant ou gentil
    this.train_act = false;

    this.dessinerMoto= function(){
        //on dessine la moto avec déjà les attributs rotation que l'on modifiera avec l'attribut this.rot
        this.rectangle = svgContainer.append("rect").attr("x", this.X).attr("y", this.Y).attr("width", MOT_Width).attr("height", MOT_Height).attr("fill", this.color).attr("id", "moto_html"+this.id_player).attr("transform", "rotate("+this.rot+","+(this.X+5)+","+(this.Y+25)+")");
    }
    this.movRight = function(){
        this.speedX = 1;
    }
    this.moveleft = function(){
        this.speedX = -1;
    }
    this.moveup = function(){
        this.speedY = -1;
    }
    this.movedown = function(){
        this.speedY = 1;
    }

    this.moveUPRIGHT = function(){
        this.speedX = 0.71;
        this.speedY = -0.71;
    }

    this.moveUPLEFT= function(){
        this.speedX = -0.71;
        this.speedY = -0.71;
    }

    this.moveDOWNLEFT= function(){
        this.speedX = -0.71;
        this.speedY = 0.71;
    }

    this.moveDOWNRIGTH = function(){
        this.speedX = 0.71;
        this.speedY = 0.71;
    }

    //cette fonction met à jour les coordonnées de la moto selon la vitesse de déplacement
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

function Frame()
{
    Move();
    collision(moto2);
    
        
        
        if (timerMur > 0) timerMur -= (INTERVAL/1000);
        let timeraffiche = (Math.floor(timerMur*1000))/1000;

        //console.log("timerMur : "+timerMur);
        if (timerMur <= 0 && murActif == true)// Quand on a finis de poser un mur
            {
                timerMur = TMP_RECHARGEMUR;
                murActif = false;
                moto2.train_act = false;
               // console.log("RECHARGREMENT DE LA TRIANEE");
            }
        if (timerMur <= 0 && murActif == false)//Quand ona fini de recharger le mur
            {
                timerMur = 0;
                murActif = false;
                moto2.train_act = false;
                //console.log("RECHARGREMENT DE LA TRIANEE");
            }

        //affichage sur le dom

        if (timerMur == 0)
        {
        document.getElementById("Space").innerText = "Pret";
        document.getElementById("etatSpace").innerText = "Ready";
        }
        else if(murActif)
        {
            document.getElementById("Space").innerText = "EN COURS";
            document.getElementById("etatSpace").innerText = "Temps de pose restant : "+timeraffiche+" s";
        }
        else if(!murActif)
        {
            document.getElementById("Space").innerText = "Rechargement";
            document.getElementById("etatSpace").innerText = "Temps de recharge restant restant : "+timeraffiche+" s";
        }
        
    
}

function Move(){
    //on rafracihi la moto
    rotation(moto2); //à chaque frame on regarde si on touche a été enfoncé et on effectue la rotation et le changement de direction 
    Update(moto2); //on donne les nouvelles coordonnées à la moto via la fonction Update
    Update(moto1);
   
}


//fonction qui va permettre de détecter si on appuie sur une touche ou pas
function toto()
{
    console.log("Coucou");
}
function defEvent(motoPr)
{
    let main = document.getElementById("main");
    //console.log(dam);
    main.addEventListener('keydown', (e) => {
        if(!e.repeat)
         {   

            if(e.keyCode==32)
            {
                
                if (motoPr.train_act == true)
                    {
                        motoPr.train_act = false;
                        murActif = false;
                        timerMur = TMP_RECHARGEMUR;
                        console.log("descativ avance")
                    }
                else if (motoPr.train_act == false && timerMur==0)
                    { 
                        motoPr.train_act = true;
                        murActif = true;
                        timerMur = TMP_POSMUR;
                    }
            } 
            var code = e.keyCode;
            if(touches.indexOf(code)<0) touches.push(code); //si la touche n'est pas encore dans le tableau "touches" on le rajoute
         }
         
      });




      main.addEventListener('keyup', (e) => {

        var code = e.keyCode;
        index = touches.indexOf(code);
        if(index>=0) 
            touches.splice(index,1); //on enlève la touche dans le tableau "touches"
      
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
    if(touches.indexOf(32)!=-1) dir +=13;
    
    return dir;
}

function rotation(moto_m){
    var dir =  direction();
    moto_m.speedX = 0; //la direction est mise à 0 en X et Y
    moto_m.speedY = 0;
   // console.log("rotation" + dir);

          switch (dir) {               
              case 1:
                  if(moto_m.ori=="NO" || moto_m.ori=="SO"){//selon l'orientation on doit bloquer des touche par exemple ici pour aller à l'ouest il faut venir du nord ouest ou du sud ouest
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

//cette fonction permet de donner la direction à prendre selon la direction prise
function avancedefault(moto_m){
    //console.log(moto_m.ori, moto_m.rot);

    switch (moto_m.ori){
        case "N":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveup();
        break;

        case "S":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.movedown();
        break;
        
        case "O":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveleft();
            break;
        
        case "E":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.movRight();
            break;
            
        case "NO":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveUPLEFT();
            break;
        
        case "NE":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveUPRIGHT();
            break;

        case "SO":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveDOWNLEFT();
            break;
        
        case "SE":
            if(moto_m.train_act){
                pl.transformeCase(moto2.X+5,moto2.Y+25,col_traine,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveDOWNRIGTH();
            break;
        default: console.log("pas d'oritentation");
    }

}

function collision(moto_m)
{
    //x+5 et y+25 points fixe de la moto(point de rotation)
    let x = (moto_m.X +5);
    let y = (moto_m.Y +25);
    //console.log("detection de collision");

    let xi;
    let yi;
    let jmax;

    switch (moto_m.ori){
        
        case "N":
            //x et y deviennent le point en haut a gauche de la moto, quel que soit soit son orientation
            x -=5;y-=25; // a changer en param globaux
            xi = (x - (x%PL_L));
            if(x%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

            for (let j = 0; j < jmax; j+=PL_L)
            {

               
                if(pl.isMur(xi+j,y))
                {
                   alert("collision");
                    break;
                }
               // svgContainer.append("rect").attr("x", xi+j).attr("y", y).attr("width", 1).attr("height", 1).attr("fill", "green");    
            }
           
           
            break;
        case "S":
            x -=5;y+=25;
            xi = (x - (x%PL_L));
            if(x%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

            for (let j = 0; j < jmax; j+=PL_L)
            {

               
                if(pl.isMur(xi+j,y))
                {
                  alert("collision");
                    break;
                }
               // svgContainer.append("rect").attr("x", xi+j).attr("y", y).attr("width", 1).attr("height", 1).attr("fill", "red");    
            }
           
            break;
        case "O":
            x -=25;y-=5;
            yi = (y - (y%PL_L));
            if(y%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

            for (let j = 0; j < jmax; j+=PL_L)
            {

               
                if(pl.isMur(x,yi+j))
                {
                   alert("collision");
                    break;
                }
                //svgContainer.append("rect").attr("x", x).attr("y", yi+j).attr("width", 1).attr("height", 1).attr("fill", "red");    
            }
           
            break;
        case "E":
            x +=25;y-=5;
            yi = (y - (y%PL_L));
            if(y%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

            for (let j = 0; j < jmax; j+=PL_L)
            {

               
                if(pl.isMur(x,yi+j))
                {
                    alert("collision");
                    break;
                }
                //svgContainer.append("rect").attr("x", x).attr("y", yi+j).attr("width", 1).attr("height", 1).attr("fill", "red");    
            }
           
          
            break;
        case "NO":
              //x et y deviennent le point en haut a gauche de la moto, quel que soit soit son orientation
              //x -=5;y-=25;
              let x1 = 0;//vecteur 1
              let y1 = -25;
              let teta = Math.PI / 4;
              let x2 =(x1*Math.cos(teta)-y1*Math.sin(teta));//vecteur 2
              let y2 =(x1*Math.sin(teta)+y1*Math.cos(teta));
              let boui = Math.sqrt(((MOT_Width/2)*(MOT_Width/2))/2); //TRUST ME .... TIER EXCLUS
            let bidule = Math.sqrt(((PL_L)*(PL_L))/2);
             x2 = x-x2-boui;
             y2 = y+y2+boui;


           
              jmax = Math.floor(MOT_Width/PL_L);
  
              for (let j = 0; j < jmax; j++)
              {
  
                 
                  if(pl.isMur(x2+j*bidule,y2-j*bidule))
                  {
                      alert("collision");
                      break;
                  }
                  
                  svgContainer.append("rect").attr("x", x2+j*bidule).attr("y", y2-j*bidule).attr("width", 1).attr("height", 1).attr("fill", "red");   
              }
              if(pl.isMur(x2+2*boui,y2-2*boui))
                  {
                      alert("collision");
                      break;
                  }
              svgContainer.append("rect").attr("x", x2+2*boui).attr("y", y2-2*boui).attr("width", 1).attr("height", 1).attr("fill", "red");
           
            break;
        case "NE":
           
            break;
        case "SO":
           
            break;
        case "SE":
            
            break;
        default: console.log("pas d'oritentation");
        break;

       
    
        }

       
}

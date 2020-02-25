/**
 * InitGame()
 * ne prend aucun paramètre
 * résultat : initialise les motos donc créé les objets et les dessine sur la plateau.
 */
function InitGame(id_){
    moto1 = new Moto(id_);//création de moto 1
    moto1.dessinerMoto(); //on dessine la moto numéro 1
    socket.emit('envoi_autre_joueur_serveur', moto1);
    //console.log(moto1.id_player);
}

/*
définition de l'objet moto
Moto(cooronnée X, coordonnée Y, un identifiant id_p, une couleur color)
new Moto(X, Y, 158, "red");
*/
function Moto(id_p){

    this.id_player = id_p; //identifiant du joueur
    this.speedX = 0; //vitesse de déplacement selon l'axe X
    

    //vitesse de déplacement selon l'axe y 
    if(this.id_player == 1){
        this.x = 300;
        this.Y = 400;
        this.speedY -= 10;
        this.ori = "N";
        this.color = "black"; //couleur de la moto du joueur
        this.rot = 0;//cet attribut nous permet de savoir l'angle de rotation de la moto
    }else{
        this.x = 300;
        this.Y = 200;
        this.speedY += 10;
        this.ori = "S";
        this.color = "red"; //couleur de la moto du joueur
        this.rot = 180;//cet attribut nous permet de savoir l'angle de rotation de la moto
    }
    this.rectangle = null; /*cet attribut vas nous servire pour stocker le dessin de la moto*/
     
    this.train_act = false; //cet attribut est un booléen pour savoir la trainé de la moto est active ou non

    /*dessinerMoto() méthode de l'objet moto
    ne prend aucun paramètre
    resultat : dessine la moto avec d3.js celon les coordonnées X et Y de la moto et celon son attribut rot
    */
    this.dessinerMoto= function(){
        //on dessine la moto avec déjà les attributs rotation que l'on modifiera avec l'attribut this.rot
        this.rectangle = svgContainer.append("rect").attr("x", this.X).attr("y", this.Y).attr("width", MOT_Width).attr("height", MOT_Height).attr("fill", this.color).attr("id", "moto_html"+this.id_player).attr("transform", "rotate("+this.rot+","+(this.X+5)+","+(this.Y+25)+")");
    }

    /*movRight() méthode de l'objet moto
    ne prend aucun paramètre
    résultat : décplace la moto sur la droite donc speedX = 1*/
    this.movRight = function(){
        this.speedX = 1;
    }

    /*moveleft() méthode de l'objet moto
    ne prend aucun paramètres
    résultat : déplace la moto sur la gauche, donc on décremente sur l'axe X donc speedX = -1*/
    this.moveleft = function(){
        this.speedX = -1;
    }
    this.moveup = function(){
        this.speedY = -1;
    }
    this.movedown = function(){
        this.speedY = 1;
    }

    /*moveUPRIGHT() méthode de l'objet moto
    ne prend aucun paramètre
    résultat : déplace la moto en haut à droite. donc on incrémente l'axe X et on décremente l'axe Y.
    attention ici speedX n'est pas égale à 1 mais à 0.71 car sinon la moto accélèrerai dans les diagonales.*/
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


    /*newPos() méthode de l'objet moto
    ne prend aucun paramètre
    résultat : actualise les coordonnée X et Y en ajoutant speedX à X et speedY à Y pour déplacer la moto*/
    this.newPos = function() {
        this.X += this.speedX;
        this.Y += this.speedY;  
    } 
    
    this.destroy = function(){
        var elem = document.getElementById("moto_html"+this.id_player);
        elem.parentNode.removeChild(elem);
    }
}

/**
Update(moto_update)
moto_update : est un objet de type Moto
résultat : nous allons EFFACER la moto (pas la détruire mais l'effacer) du dom, pour ensuite lui donner de nouvelles coordonnées X et Y et ensuite la redessiner.
 */
function Update(moto_update){

    var elem = document.getElementById("moto_html"+moto_update.id_player);
    elem.parentNode.removeChild(elem);
    moto_update.newPos();
    moto_update.dessinerMoto();

}

/**
 * direction()
 * ne prend aucun paramètre
 * resultat : renvoi un entier selon la touche qui aura était enfoncé
 * exemple si on appuie sur gauche et haut direction() va renvoyer 3
 */
function direction()
{
    var dir=0;
    if(touches.indexOf(37)!=-1) dir +=1; //gauche
    if(touches.indexOf(38)!=-1) dir +=2; //haut
    if(touches.indexOf(39)!=-1) dir +=4; //droit
    if(touches.indexOf(40)!=-1) dir +=8; //bas
    if(touches.indexOf(32)!=-1) dir +=13; //barre espace
    
    return dir;
}

/**
 * rotation(moto_m)
 * moto_m : est un objet de type moto
 * resultat : nous allons récupérer les touches enfoncé par l'utilisateur et celon les touche nous allons luis donner une rotation/orientation
 * de plus prenons comme exemple si le jour mont (va du bas vers le haut), si l'utilisateur appuis sur haut et gauche alors
 * ->on regarde si il le droit (dans ce cas la oui) -> exemple si la moto se dirige vers l'ouest et l'utilisateur appui sur la touche droite le changement ne se fera pas car on ne peux que faire des rotations de 45d, dans ce cas il ne se passera rien
 * -> on change l'attribut ori de la moto
 * -> on donner l'angle de rotation à la moto ici 45d
 * -> on appel lé méthode moveUPLEFT() de moto_m
 */
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

/**
 * Move()
 * ne prend aucun paramètre pour le moment mais devrait prendre les deux motos en paramètre
 * résulatat : on regarde si l'utilisateur souhaite faire une rotation (changer de sens), et on appel les fonctions Update de chaque moto
 */
function Move(moto_m){
    //on rafracihi la moto
    //console.log("dans Move");
    rotation(moto_m); //à chaque frame on regarde si on touche a été enfoncé et on effectue la rotation et le changement de direction 
    Update(moto_m); //on donne les nouvelles coordonnées à la moto via la fonction Update
   
}

/**
 *
 * collision(moto_m) 
 * moto_m : est un objet de type Moto
 * resultat : permet de détecter une colision entre un mur/une trainé et la moto du joueur
 */
function collision(moto_m)
{
    //console.log("je suis dans la fct collision");
    let x = (moto_m.X +5);
    let y = (moto_m.Y +25);

    let safeZoneOffset = Math.sqrt(2*(PL_L*PL_L)) + 1;

    let xi;
    let yi;
    let jmax;
    let x1;
    let y1;
    let teta;
    let x2;
    let y2;
    let boui;
  let bidule;

    switch (moto_m.ori){
        
        case "N":
            //x et y deviennent le point en haut a gauche de la moto, quel que soit soit son orientation
            x -=5;y-=25; // a changer en param globaux
            //xi = (x - (x%PL_L));
            xi = x;
            if(x%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

            for (let i = 0; i < 25-safeZoneOffset; i+=PL_L)           
            {
                for (let j = 0; j < jmax; j+=PL_L)
                {
                   
                    if(pl.isMur(xi+j,y+i))
                    {
                    alertcol();
                        break;
                    }
                     //svgContainer.append("rect").attr("x", xi+j).attr("y", y+i).attr("width", 1).attr("height", 1).attr("fill", "green");
                    
                }
               
               
                  
            }
           
           
            break;
        case "S":
            x -=5;y+=25;
            // xi = (x - (x%PL_L));
            xi = x;
            if(x%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

           
            for (let i = 0; i < 25-safeZoneOffset; i+=PL_L)           
            {
                for (let j = 0; j < jmax; j+=PL_L)
                {
                   
                    if(pl.isMur(xi+j,y-i))
                    {
                    alertcol();
                        break;
                    }
                    //  svgContainer.append("rect").attr("x", xi+j).attr("y", y-i).attr("width", 1).attr("height", 1).attr("fill", "cyan");
                    
                }
               
               
                  
            }
           
            break;
        case "O":
            x -=25;y-=5;
            yi = y;
            if(y%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

            

            for (let i = 0; i < 25-safeZoneOffset; i+=PL_L)           
            {
                for (let j = 0; j < jmax; j+=PL_L)
                {
                   
                    if(pl.isMur(x+i,yi+j))
                    {
                    alertcol()
                        break;
                    }
                    // svgContainer.append("rect").attr("x", x+i).attr("y", yi+j).attr("width", 1).attr("height", 1).attr("fill", "lime");
                    
                }
               
               
                  
            }
           
            break;
        case "E":
            x +=25;y-=5;
            //yi = (y - (y%PL_L));
            yi = y;
            if(y%PL_L==0)jmax=MOT_Width;
            else jmax = MOT_Width+PL_L;

            // for (let j = 0; j < jmax; j+=PL_L)
            // {

               
            //     if(pl.isMur(x,yi+j))
            //     {
            //         alert("collision");
            //         break;
            //     }
            //     //svgContainer.append("rect").attr("x", x).attr("y", yi+j).attr("width", 1).attr("height", 1).attr("fill", "red");    
            // }

            for (let i = 0; i < 25-safeZoneOffset; i+=PL_L)           
            {
                for (let j = 0; j < jmax; j+=PL_L)
                {
                   
                    if(pl.isMur(x-i,yi+j))
                    {
                    alertcol()
                        break;
                    }
                    //  svgContainer.append("rect").attr("x", x-i).attr("y", yi+j).attr("width", 1).attr("height", 1).attr("fill", "purple");
                    
                }
               
               
                  
            }
           
          
            break;
        case "NO":
              //x et y deviennent le point en haut a gauche de la moto, quel que soit soit son orientation

             x1 = 0;//vecteur 1
            y1 = -25;
            teta = Math.PI / 4;
            x2 =(x1*Math.cos(teta)-y1*Math.sin(teta));//vecteur 2
            y2 =(x1*Math.sin(teta)+y1*Math.cos(teta));
            boui = Math.sqrt(((MOT_Width/2)*(MOT_Width/2))/2); //TRUST ME .... TIER EXCLUS
            bidule = Math.sqrt(((PL_L)*(PL_L))/2);
             x2 = x-x2-boui;
             y2 = y+y2+boui;


           
              jmax = Math.floor(MOT_Width/PL_L);
            for (let i = 0; i*PL_L < 25-safeZoneOffset; i++) {

              for (let j = 0; j < jmax; j++)
              {
                  if(pl.isMur(x2+j*bidule+i*bidule,y2-j*bidule))
                  {
                     alertcol()
                      break;
                  }
                  
                    //svgContainer.append("rect").attr("x", x2+j*bidule+i*bidule).attr("y", y2-j*bidule+i*bidule).attr("width", 1).attr("height", 1).attr("fill", "green");   
              }

              if(pl.isMur(x2+2*boui+i*bidule , y2+2*boui+i*bidule))
                  {
                      alertcol()
                      break;
                  }
            //svgContainer.append("rect").attr("x", x2+2*boui+i*bidule).attr("y", y2-2*boui+i*bidule).attr("width", 1).attr("height", 1).attr("fill", "green");
                }
           
            break;
        case "NE":
            x1 = 0;//vecteur 1
            y1 = -25;
            teta = Math.PI / 4;
            x2 =(x1*Math.cos(teta)-y1*Math.sin(teta));//vecteur 2
            y2 =(x1*Math.sin(teta)+y1*Math.cos(teta));
            boui = Math.sqrt(((MOT_Width/2)*(MOT_Width/2))/2); //TRUST ME .... TIER EXCLUS
            bidule = Math.sqrt(((PL_L)*(PL_L))/2);
           x2 = x+x2-boui;
           y2 = y+y2-boui;


         
            jmax = Math.floor(MOT_Width/PL_L);

            for (let i = 0; i*PL_L < 25-safeZoneOffset; i++) {

                for (let j = 0; j < jmax; j++)
                {

                
                    if(pl.isMur(x2+j*bidule-i*bidule,y2-j*bidule+i*bidule))
                    {
                        alertcol()
                        break;
                    }
                    
                    // svgContainer.append("rect").attr("x", x2+j*bidule-i*bidule).attr("y", y2+j*bidule+i*bidule).attr("width", 1).attr("height", 1).attr("fill", "blue");   
                }

                if(pl.isMur(x2+2*boui-i*bidule,y2+2*boui+i*bidule))
                    {
                        alertcol()
                        break;
                    }
                // svgContainer.append("rect").attr("x", x2+2*boui-i*bidule).attr("y", y2+2*boui+i*bidule).attr("width", 1).attr("height", 1).attr("fill", "blue");
            }
            break;
        case "SO":

            x1 = 0;//vecteur 1
            y1 = -25;
            teta = Math.PI / 4;
            x2 =(x1*Math.cos(teta)-y1*Math.sin(teta));//vecteur 2
            y2 =(x1*Math.sin(teta)+y1*Math.cos(teta));
            boui = Math.sqrt(((MOT_Width/2)*(MOT_Width/2))/2); //TRUST ME .... TIER EXCLUS
            bidule = Math.sqrt(((PL_L)*(PL_L))/2);
             x2 = x-x2-boui;
             y2 = y-y2-boui;


           
              jmax = Math.floor(MOT_Width/PL_L);
            

              for (let i = 0; i*PL_L < 25-safeZoneOffset; i++) {

              for (let j = 0; j < jmax; j++)
              {
  
                 
                  if(pl.isMur(x2+j*bidule+i*bidule,y2-j*bidule-i*bidule))
                  {
                     alertcol()
                      break;
                  }
                  
                //    svgContainer.append("rect").attr("x", x2+j*bidule+i*bidule).attr("y", y2+j*bidule-i*bidule).attr("width", 1).attr("height", 1).attr("fill", "red");   
              }

              if(pl.isMur(x2+2*boui+i*bidule,y2+2*boui-i*bidule))
                  {
                      alertcol()
                      break;
                  }
            //   svgContainer.append("rect").attr("x", x2+2*boui+i*bidule).attr("y", y2+2*boui-i*bidule).attr("width", 1).attr("height", 1).attr("fill", "red");
                }
           
           
            break;
        case "SE":
            x1 = 0;//vecteur 1
            y1 = -25;
            teta = Math.PI / 4;
            x2 =(x1*Math.cos(teta)-y1*Math.sin(teta));//vecteur 2
            y2 =(x1*Math.sin(teta)+y1*Math.cos(teta));
            boui = Math.sqrt(((MOT_Width/2)*(MOT_Width/2))/2); //TRUST ME .... TIER EXCLUS
            bidule = Math.sqrt(((PL_L)*(PL_L))/2);
           x2 = x+x2-boui;
           y2 = y-y2+boui;


         
           
            jmax = Math.floor(MOT_Width/PL_L);

            for (let i = 0; i*PL_L < 25-safeZoneOffset; i++) {
            for (let j = 0; j < jmax; j++)
            {

               
                if(pl.isMur(x2+j*bidule-i*bidule,y2-j*bidule-i*bidule))
                {
                    alertcol()
                    break;
                }
                
            //    svgContainer.append("rect").attr("x", x2+j*bidule-i*bidule).attr("y", y2-j*bidule-i*bidule).attr("width", 1).attr("height", 1).attr("fill", "yellow");   
            }

            if(pl.isMur(x2+2*boui-i*bidule,y2+2*boui-i*bidule))
                {
                    alertcol()
                    break;
                }
            //  svgContainer.append("rect").attr("x", x2+2*boui-i*bidule).attr("y", y2-2*boui-i*bidule).attr("width", 1).attr("height", 1).attr("fill", "yellow");
            }
            break;
        default: console.log("pas d'oritentation");
        break;

       
    
        }

       
}

/**
 * timerMur(moto_m)
 * moto_m est un objet de type moto
 * permet de mettre en place le timer pour le mur
 */
function timerMurF(moto_m){

    //console.log("dans timerMurF");

    if (timerMur > 0) timerMur -= (INTERVAL/1000);

    let timeraffiche = (Math.floor(timerMur*1000))/1000;

    if (timerMur <= 0 && murActif == true)// Quand on a finis de poser un mur
    {
        timerMur = TMP_RECHARGEMUR;
        murActif = false;
        moto_m.train_act = false;
    }
    if (timerMur <= 0 && murActif == false)//Quand ona fini de recharger le mur
    {
        timerMur = 0;
        murActif = false;
        moto_m.train_act = false;
    }

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

/**
 * 
 * defEvent(motoPr)
 * motoPr : est un objet de type Moto
 * resultat : cette fonction vas nous permettre de savoir quand une touche est enfoncé et quand on relache une touche
 * sachant que si on enfonce la touhce espace deux cas s'offre à nous 
 * -> premier cas si la trainé est active qu'il reste encore du temps de trainé alors on coupe le chrono et la trainé
 * -> deuxime cas la trainé n'est pas activé alors on l'active et on active le chrono
 */
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
            if(touches.indexOf(code)<0) touches.push(code);
         }
         
      });




      main.addEventListener('keyup', (e) => {

        var code = e.keyCode;
        index = touches.indexOf(code);
        if(index>=0) 
            touches.splice(index,1);
      
      });
             
}

/**
 * 
 * avancedefault(moto_m)
 * moto_m : est un objet de type Moto
 * resultat : si la trainé de moto_m est active alors on dessine la traine et dans tous les cas la moto avance dans son orientation
 */
function avancedefault(moto_m){
    //console.log(moto_m.ori, moto_m.rot);

    switch (moto_m.ori){
        case "N":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveup();
        break;

        case "S":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.movedown();
        break;
        
        case "O":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveleft();
            break;
        
        case "E":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.movRight();
            break;
            
        case "NO":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveUPLEFT();
            break;
        
        case "NE":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveUPRIGHT();
            break;

        case "SO":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveDOWNLEFT();
            break;
        
        case "SE":
            if(moto_m.train_act){
                pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
            }
            moto_m.moveDOWNRIGTH();
            break;
        default: console.log("pas d'oritentation");
    }

}

/**
 * alertcol()
 * ne prend aucun paramètre
 * résultat : alerte le joueur qu'il y a eu une collision
 */
function alertcol()
{
    //alert("collision");

    socket.emit('collision','collision moto');   
}

/**
 * Frame(moto_m1, moto_m2)
 * moto_m1/2 sont deux objets de type moto
 * resultat : on met en mouvement toutes les motos et on détecte si il y a une collision et de plus on met leur chrono sur les murs
 */
function Frame(moto_m1)
{

    //Move(moto_m1);
    //Move(moto_m2);

    //collision(moto_m1);
    //collision(moto_m2);

    //timerMurF(moto_m1);
    //timerMur(moto_m2);

}
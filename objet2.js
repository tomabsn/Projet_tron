var IndRoom = -1;
var colli = false;
var ind = 90;
var moto_id_coll = -1;
/**
 * InitGame()
 * ne prend aucun paramètre
 * résultat : initialise les motos donc créé les objets et les dessine sur la plateau.
 */
function InitGame(id_, idr){
    moto1 = new Moto(id_);//création de moto 1
    moto1.dessinerMoto(); //on dessine la moto numéro 1
    IndRoom = idr;
}

/*
définition de l'objet moto
Moto(cooronnée X, coordonnée Y, un identifiant id_p, une couleur color)
new Moto(X, Y, 158, "red");
*/
function Moto(id_p){

    this.id_player = id_p; //identifiant du joueur
    this.speedX = 0; //vitesse de déplacement selon l'axe X
    this.timerMur = 0;


    //vitesse de déplacement selon l'axe y
    if(this.id_player == 1){
	this.X = 200;
	this.Y = 400;
	this.speedY = -1;
	this.ori = "N";
	this.color = couleurG; //couleur de la moto du joueur
	this.rot = 0;//cet attribut nous permet de savoir l'angle de rotation de la moto
    }else{
	this.X = 200;
	this.Y = 10;
	this.speedY = 1;
	this.ori = "S";
	this.color = couleurM; //couleur de la moto du joueur
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
    moto_update.dessinerMoto(svgContainer);

}

/**
 * direction()
 * ne prend aucun paramètre
 * resultat : renvoi un entier selon la touche qui aura était enfoncé
 * exemple si on appuie sur gauche et haut direction() va renvoyer 3
 */
function direction(touches)
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
    var dir =  direction(touches);
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
    rotation(moto_m); //à chaque frame on regarde si on touche a été enfoncé et on effectue la rotation et le changement de direction
}

/**
 *
 * collision(moto_m) 
 * moto_m : est un objet de type Moto
 * resultat : permet de détecter une colision entre un mur/une trainé et la moto du joueur
 */
function collision(moto_m1)
{
    //console.log("je suis dans la fct collision");
    let x = (moto_m1.X +5);
    let y = (moto_m1.Y +25);

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

    switch (moto_m1.ori){

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
		if((pl.isMur(xi+j,y+i)))
		{
		    alertcol(moto_m1, -1);
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
		    alertcol(moto_m1,-1);
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
		    alertcol(moto_m1, -1)
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
		    alertcol(moto_m1, -1)
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
		    alertcol(moto_m1, -1)
		    break;
		}

		//svgContainer.append("rect").attr("x", x2+j*bidule+i*bidule).attr("y", y2-j*bidule+i*bidule).attr("width", 1).attr("height", 1).attr("fill", "green");
	    }

	    if(pl.isMur(x2+2*boui+i*bidule , y2-2*boui+i*bidule))
	    {
		alertcol(moto_m1, -1)
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
		    alertcol(moto_m1, -1)
		    break;
		}

		// svgContainer.append("rect").attr("x", x2+j*bidule-i*bidule).attr("y", y2+j*bidule+i*bidule).attr("width", 1).attr("height", 1).attr("fill", "blue");
	    }

	    if(pl.isMur(x2+2*boui-i*bidule,y2+2*boui+i*bidule))
	    {
		alertcol(moto_m1, -1)
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
		    alertcol(moto_m1, -1)
		    break;
		}

		//    svgContainer.append("rect").attr("x", x2+j*bidule+i*bidule).attr("y", y2+j*bidule-i*bidule).attr("width", 1).attr("height", 1).attr("fill", "red");
	    }

	    if(pl.isMur(x2+2*boui+i*bidule,y2+2*boui-i*bidule))
	    {
		alertcol(moto_m1, -1)
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
		    alertcol(moto_m1, -1)
		    break;
		}

		//    svgContainer.append("rect").attr("x", x2+j*bidule-i*bidule).attr("y", y2-j*bidule-i*bidule).attr("width", 1).attr("height", 1).attr("fill", "yellow");
	    }

	    if(pl.isMur(x2+2*boui-i*bidule,y2+2*boui-i*bidule))
	    {
		alertcol(moto_m1,-1)
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

    if (moto_m.timerMur > 0) moto_m.timerMur -= (INTERVAL/1000);

    let timeraffiche = (Math.floor(moto_m.timerMur*1000))/1000;

    if (moto_m.timerMur <= 0 && murActif == true)// Quand on a finis de poser un mur
    {
	moto_m.timerMur = TMP_RECHARGEMUR;
	murActif = false;
	moto_m.train_act = false;
    }
    if (moto_m.timerMur <= 0 && murActif == false)//Quand ona fini de recharger le mur
    {
	moto_m.timerMur = 0;
	murActif = false;
	moto_m.train_act = false;
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
		    motoPr.timerMur = TMP_RECHARGEMUR;
		}
		else if (motoPr.train_act == false && motoPr.timerMur==0)
		{
		    //console.group("trainé=========================================================");
		    motoPr.train_act = true;
		    murActif = true;
		    motoPr.timerMur = TMP_POSMUR;
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
    //console.log(moto_m.train_act);

    switch (moto_m.ori){
    case "N":
	if(moto_m.train_act){
	    //console.log("==============================================");
	    pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
	    //console.log(pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"));
	}
	moto_m.moveup();
	break;

    case "S":
	if(moto_m.train_act){
	    //console.log("==============================================");
	    pl.transformeCase(moto_m.X+5,moto_m.Y+25,moto_m.color,"mur"); //permet de créer la trainée de la moto
	    //console.log("trainé");
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
 * prend deux paramètres : moto_c qui est la moto pour laquelle on detecte la collsion et indice qui aura comme valeur 1(collision avec un mur) ou -1 (collision avec un joueur egalite)
 * résultat : alerte le joueur qu'il y a eu une collision
 */
function alertcol(moto_c, indice)
{
    //socket.emit('collision', indice,moto_c.id_player, IndRoom);
    colli = true;
    ind = indice;
    moto_id_coll = moto_c.id_player;
}

function collisionJoueur(moto1,moto2)
{
    let xmax = 0,xmin = 9999,ymax = 0,ymin = 999999;
    let collider = ptsJoueur(moto1);
    let PtsJoueuradv = ptsJoueur(moto2);
    for(let i = 0; i < 4;i++)
    {
	xmax = Math.max(collider[i]["x"],xmax);
	ymax = Math.max(collider[i]["y"],ymax);
	xmin = Math.min(collider[i]["x"],xmin);
	ymin = Math.min(collider[i]["y"],ymin);
    }
    let Check = false;
    for(let i = 0; i < 4;i++)
    {
	if(PtsJoueuradv[i]["x"]>=xmin && PtsJoueuradv[i]["x"]<=xmax && PtsJoueuradv[i]["y"]>=ymin && PtsJoueuradv[i]["y"]<=ymax) Check = true;
    }

    if(Check && (moto1.ori == "N" || moto1.ori == "S" || moto1.ori == "O" || moto1.ori == "E" )) return true;
    else if(!Check ) return false;

    else
    {

	let Yxmax ;
	let Xymax ;
	let Yxmin ;
	let Xymin ;
	for(let i = 0; i < 4;i++)
	{
	    if(collider[i]["x"] = xmax)Yxmax = collider[i]["y"];
	    else if(collider[i]["x"] = xmin)Yxmin = collider[i]["y"];
	    else if(collider[i]["y"] = ymax)Xymax = collider[i]["x"];
	    else if(collider[i]["y"] = ymin)Xymin = collider[i]["x"];

	}
	for(let i = 0; i < 4;i++)
	{
	    if(distance(xmax,ymax,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])>Xymax,Yxmax,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])return true;
	    if(distance(xmin,ymin,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])>Xymin,Yxmin,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])return true;
	    if(distance(xmax,ymin,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])>Xymin,Yxmax,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])return true;
	    if(distance(xmin,ymax,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])>Xymax,Yxmin,PtsJoueuradv[i]["x"],PtsJoueuradv[i]["y"])return true;
	}
    }
}

/**
 *  ptsJoueur(moto)
 * moto : objet de type moto
 * resultat : tab un tableau de dictionnaire avec x et y une liste de point representant les 4 angles de la moto
 */
function ptsJoueur(moto)
{
    let x = moto.X +5 ; let y = moto.Y + 25;
    let tab = [];
    let x1 = 0;
    let y1 = -25;
    let teta = Math.PI / 4;
    let x2 =(x1*Math.cos(teta)-y1*Math.sin(teta));
    let y2 =(x1*Math.sin(teta)+y1*Math.cos(teta));
    let boui = Math.sqrt(((MOT_Width/2)*(MOT_Width/2))/2);
    switch(moto.ori)
    {
	case "N" :
	tab.push({"x":x-5,"y":y-25});
	tab.push({"x":x+5,"y":y-25});
	tab.push({"x":x-5,"y":y+5});
	tab.push({"x":x+5,"y":y+5});
	break;
	case "S" :
	tab.push({"x":x-5,"y":y-5});
	tab.push({"x":x+5,"y":y-5});
	tab.push({"x":x-5,"y":y+25});
	tab.push({"x":x+5,"y":y+25});
	break;
	case "E" :
	tab.push({"x":x+25,"y":y-5});
	tab.push({"x":x+25,"y":y+5});
	tab.push({"x":x-5,"y":y-5});
	tab.push({"x":x-5,"y":y+5});
	break;
	case "O" :
	tab.push({"x":x-25,"y":y-5});
	tab.push({"x":x-25,"y":y+5});
	tab.push({"x":x+5,"y":y-5});
	tab.push({"x":x+5,"y":y+5});
	break;

	case "NE" :

	x2 = x+x2-boui;
	y2 = y+y2-boui;
	tab.push({"x":x2,"y":y2});
	tab.push({"x":x2+2*boui,"y":y2+2*boui});
	tab.push({"x":x2-6*boui,"y":y2+6*boui});
	tab.push({"x":x2-4*boui,"y":y2+8*boui});
	break;
	case "NO" :

	x2 = x-x2-boui;
	y2 = y+y2+boui;
	tab.push({"x":x2,"y":y2});
	tab.push({"x":x2+2*boui,"y":y2-2*boui});
	tab.push({"x":x2+6*boui,"y":y2+6*boui});
	tab.push({"x":x2+8*boui,"y":y2+4*boui});
	break;
	case "SE" :

	x2 = x+x2-boui;
	y2 = y-y2+boui;
	tab.push({"x":x2,"y":y2});
	tab.push({"x":x2+2*boui,"y":y2-2*boui});
	tab.push({"x":x2-6*boui,"y":y2-6*boui});
	tab.push({"x":x2-4*boui,"y":y2-8*boui});
	break;
	case "SO" :

	x2 = x-x2-boui;
	y2 = y-y2-boui;
	tab.push({"x":x2,"y":y2});
	tab.push({"x":x2+2*boui,"y":y2+2*boui});
	tab.push({"x":x2+6*boui,"y":y2-6*boui});
	tab.push({"x":x2+8*boui,"y":y2-4*boui});
	break;


    }
    return tab;
}



function alertcolJoueur(moto_m1, moto_m2, coll12, coll21){
    

    if(coll12 == true && coll21 == true){
	colli = true;
	ind = 0;
	moto_id_coll = -1;
    }

    if(coll12 == true && coll21 == false){
	colli = true;
	ind = -1;
	moto_id_coll = moto_m2.id_player;
    }

    if(coll12 == false && coll21 == true){
	colli = true;
	ind = -1;
	moto_id_coll = moto_m1.id_player;
    }
}

/**
 * Frame(moto_m1, moto_m2)
 * moto_m1/2 sont deux objets de type moto
 * resultat : on met en mouvement toutes les motos et on détecte si il y a une collision et de plus on met leur chrono sur les murs
 */
function Frame(moto_m1, moto_m2)
{
    colli = false;
    ind = 99;
    moto_id_coll = -1;

    Move(moto_m1);

    collision(moto_m1);

    let coll_m1_m2 = collisionJoueur(moto_m1, moto_m2);
    let coll_m2_m1 = collisionJoueur(moto_m2, moto_m1);

    alertcolJoueur(moto_m1, moto_m2, coll_m1_m2, coll_m2_m1);

    timerMurF(moto_m1);
	
	socket.emit('joueur_bouge', moto_m1,indiceRoom, colli, ind, moto_id_coll);
	
}

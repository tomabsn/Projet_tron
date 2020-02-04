// ATTENTION, PREREQUIS :
// Ce fichier doit etre inseré apres le fichier de configuration
// pour fonctionner ce fichier a besoins d'une <div id="damier"></div> (reference a Plateau.newPlateau())

//a faire: faire disparaitre les grandes cases en fonction des grandes cases definies,
//ajout du compteur de temps sur les grandes cases




function Plateau()
{  
   this.grandeCases;//Grandes cases qui disparaissent au fil de la partie

   this.newGrandeCases = function(svgW,svgH,nbC_L,nbC_l)//FOnction pour definir le nombre de "Grande Cases" et leurs dimensions
   {
       this.grandeCases = [];
       for(let i = 0; i<nbC_l;i++)
       {
           for(let j = 0; j<nbC_L;j++)
           {
            
                this.grandeCases.push({
                    "x":MARGE+ (Math.floor((svgW/nbC_L)*j)),//Position de depart x
                    "y":MARGE+ (Math.floor((svgH/nbC_l)*i)),//Position de depart y
                    "w":(Math.floor(svgW/nbC_L)/PL_L),//width de la Case en nb de petite cases
                    "h":(Math.floor(svgH/nbC_l)/PL_L),//height de la Case en nb de petite cases
                    "temps": 0//mesure de temps passe sur chaque zone par les joueurs
                })
           }
       }

   for(let i in this.grandeCases)
    {
       
        let col =(Math.random()*0xFFFFFF<<0);
        while(col < 0xFFFFFF/10)
        {
           col*=10;
        }
        col = "#"+col.toString(16);
       this.colorAire(
         this.grandeCases[i]['x'],
         this.grandeCases[i]['y'],
         this.grandeCases[i]['h'],
         this.grandeCases[i]['w'],
         col);
    }
       
      


   }

   this.newPlateau = function(L,nbCol,nbLig)//CREE UN NOUVEAU PLATEAU GRAPHIQUE (OBJET D3) /!\ A N'UTILISER QU'UNE FOISN VOIR A METTRE CONSTRUCT
   {
      //d3.select("#damier").append("svg").attr("width",nbCol*L+2*MARGE).attr("height",nbLig*L+2*MARGE);
      let x = MARGE;
      let y = MARGE;
     
       
      for (let colonne = 0; colonne < nbCol; colonne++)
      {
         for (let ligne = 0; ligne < nbLig ; ligne++) 
         {
               
            this.creeCarre(L,x,y);
            
               y += L;        
         } 
         x += L;
         y = MARGE;
 }
   }

   

   this.transformeCase = function(x,y,col) //TRANSFORME LA CASE DE COORD X Y DANS LA COULEUR COL, PARAMETRABLE
   {
      x = x - (x%10);
      y = y - (y%10);
      let id =x+"_"+y;
      //console.log(id)
      d3.select("rect[id ='"+id+"']").attr("fill",col);
   }

    this.reset = function() // RESET DU PLATEAU DE JEU A PARAMETRER SELON LES PREFERENCES
    {let x,y;
       for(let i = 0; i <PL_NBCOL;i++)
       {
          for(let j = 0; j<PL_NBLIG;j++)
          {
            x = i*PL_L + MARGE;//necessite des test pour savoir si on prend bien la si on doit ou pas inverser le x et le y
            y = j*PL_L + MARGE;
            let id =x+"_"+y;
            d3.select("rect[id ='"+id+"']")
            .attr("fill","grey")
            .attr("stroke","black")
            ;
          }
       }
    }

    this.creeCarre = function(L,x,y)// CREE UN CARRE AU COORD X Y DE LARGEUR L
      {
         d3.select("svg").append("rect")
         .attr("y", y)
         .attr("x", x)
         .attr("width", L)
         .attr("height", L)
         .attr("fill", "grey")
         .attr("stroke", "grey")
         .attr("id",x+"_"+y)
         .attr("etat","vide")

         // .on("mouseover", function(){
         
            
         //    if(this.getAttribute("etat")=="mur")
         //    {console.log("$$$$$$$$$$COLLISION$$$$$$$$$$$$$");
             
         //    }
         //    console.log(x+"_"+y)
         //    d3.select(this).attr("fill","red")
         //                   .attr("etat","mur");


         //    //a mettre plus tard dans le setInterval
         //    socket.emit("poseMur",{'carre':this.getAttribute("id"),'couleur':couleursJoueurs[joueurLocal]});
            
         // })   

      }



    this.colorAire = function(x,y,L,l,color)//Colore une aire de L*l (en nb de carre) qui commence a x y de la couleur color
    {
       let xi = x - (x%10);
        y = y - (y%10);
        for(let i = 0; i <L;i++)
        {
           for(let j = 0; j<l;j++)
           {
             
            
             let id =xi+"_"+y;
             d3.select("rect[id ='"+id+"']")//faire des test pour verifier que il ne faut pas inverser x et y
             .attr("fill",color)
             .attr("stroke",color);

             xi += PL_L;
             
             ;
           }
           xi = x - (x%10);
           y += PL_L;
           
        }
     }
}

function Temps()//Nom Bidon, fonction qui colorie une case aleatoire en vert, mais utile pour le test de SetIntervalle
{
   y0 = Math.random()*500+MARGE;
   x0 = Math.random()*500+MARGE;
   this.transformeCase(x0,y0,"green");
   
}

function TimerPartie()
{

   //  timer -= INTERVAL/1000;
    
   //  document.getElementById("tmp").innerHTML = "Temps Restant : "+Math.round(timer*100)/100 + "s";
   //  if(timer <=0)this.colorAire(MARGE,MARGE,PL_NBCOL/2,PL_NBLIG/2,"green");
   //  else if(timer <=5)this.colorAire(MARGE+250,MARGE,PL_NBCOL/2,PL_NBLIG/2,"red");
   //  else if(timer <=10)this.colorAire(MARGE,MARGE+250,PL_NBCOL/2,PL_NBLIG/2,"blue");
   //  else if(timer <=15)this.colorAire(MARGE+250,MARGE+250,PL_NBCOL/2,PL_NBLIG/2,"yellow");

    //if(timer <= -2)alert("Fin de partie");  //Un peu chiant pour les test mais peut etre utile




}



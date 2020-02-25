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
                    "x":Math.floor((svgW/nbC_L)*j),//Position de depart x
                    "y":Math.floor((svgH/nbC_l)*i),//Position de depart y
                    "w":Math.floor((svgW/nbC_L)/PL_L),//width de la Case en nb de petite cases
                    "h":Math.floor((svgH/nbC_l)/PL_L),//height de la Case en nb de petite cases
                    "temps": 0//mesure de temps passe sur chaque zone par les joueurs
                })
           }
       }

       var bool = true
   for(let i in this.grandeCases)
    {
      let x = this.grandeCases[i]['x'];
      let y = this.grandeCases[i]['y'];
      let h = this.grandeCases[i]['h'];
      let w = this.grandeCases[i]['w'];


      
         this.colorAire(x,y,h,w,fond_pl);
        
      


         h*=PL_L;
         w*=PL_L;
         let pts = 
             x+","+y    +" "+
             x+","+(y+h)+" "+
         (x+w)+","+(y+h)+" "+
         (x+w)+","+y    +" "+
             x+","+y    +" ";
         //console.log(pts);

         d3.select("svg").append("polyline")
         .attr("points",pts)
         .attr("stroke-width", 2)
         .attr("fill","none")
         .attr("stroke", neons);
 
    }
       
      


   }

   this.newPlateau = function(L,nbCol,nbLig)//CREE UN NOUVEAU PLATEAU GRAPHIQUE (OBJET D3) /!\ A N'UTILISER QU'UNE FOISN VOIR A METTRE CONSTRUCT
   {
    
      let x = 0;
      let y = 0;
     
       
      for (let colonne = 0; colonne < nbCol; colonne++)
      {
         for (let ligne = 0; ligne < nbLig ; ligne++) 
         {
            if(ligne == 0 || colonne == 0 || ligne == (nbLig-1) || colonne == (nbCol-1) )
            {
               this.creeCarre(L,x,y,"mur");

            }
            else this.creeCarre(L,x,y,"vide");
            
               y += L;        
         } 
         x += L;
         y = 0;
 }
   }

   

   this.transformeCase = function(x,y,col,etat) //TRANSFORME LA CASE DE COORD X Y DANS LA COULEUR COL, PARAMETRABLE
   {
   
      x = (x - (x%PL_L));
      y = (y - (y%PL_L));
      let id =x+"_"+y;
     // console.log(id)
      d3.select("rect[id ='"+id+"']")
      .attr("fill",col)
      .attr("stroke",col)
      .attr("etat",etat);
   }

    this.reset = function() // RESET DU PLATEAU DE JEU A PARAMETRER SELON LES PREFERENCES
    {let x,y;
       for(let i = 0; i <PL_NBCOL;i++)
       {
          for(let j = 0; j<PL_NBLIG;j++)
          {
            x = i*PL_L;//necessite des test pour savoir si on prend bien la si on doit ou pas inverser le x et le y
            y = j*PL_L;
            let id =x+"_"+y;
            d3.select("rect[id ='"+id+"']")
            .attr("fill","grey")
            .attr("stroke","black")
            ;
          }
       }
    }

    this.creeCarre = function(L,x,y,etat)// CREE UN CARRE AU COORD X Y DE LARGEUR L
      {
         d3.select("svg").append("rect")
         .attr("y", y)
         .attr("x", x)
         .attr("width", L)
         .attr("height", L)
         .attr("id",x+"_"+y)
         .attr("etat",etat)

         // .on("mouseover", function(){
         
         //    console.log(this.getAttribute("etat"));
           

         // })   

      }



    this.colorAire = function(x,y,L,l,color)//Colore une aire de L*l (en nb de carre) qui commence a x y de la couleur color
    {
       let xi = x - (x%PL_L);
        y = y - (y%PL_L);
        for(let i = 0; i < L ; i++)
        {
           for(let j = 0; j < l ; j++)
           {
             
            
             let id =xi+"_"+y;
             if(y == 0 || xi == 0 || xi == PL_NBCOL*PL_L-PL_L || y == PL_NBLIG*PL_L-PL_L )
             d3.select("rect[id ='"+id+"']")//faire des test pour verifier que il ne faut pas inverser x et y
             .attr("fill",neons)
             .attr("stroke",neons);
            else
             d3.select("rect[id ='"+id+"']")//faire des test pour verifier que il ne faut pas inverser x et y
             .attr("fill",color)
             .attr("stroke",color);

             xi += PL_L;
             
             ;
           }
           xi = x - (x%PL_L);
           y += PL_L;
           
        }
     }

   this.isMur = function(x,y)
   {
      x = (x - (x%PL_L));
      y = (y - (y%PL_L));
      let id =x+"_"+y;
     // console.log(id)
     // console.log(d3.select("rect[id ='"+id+"']").attr("etat"));
      return ("mur" == d3.select("rect[id ='"+id+"']").attr("etat"));
   }
}

function Temps()//Nom Bidon, fonction qui colorie une case aleatoire en vert, mais utile pour le test de SetIntervalle
{
   y0 = Math.random()*500;
   x0 = Math.random()*500;
   //this.transformeCase(x0,y0,"green");
   
}

function TimerPartie()
{

   //  timer -= INTERVAL/1000;
    
  


}
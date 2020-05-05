// ATTENTION, PREREQUIS :
// Ce fichier doit etre inseré apres le fichier de configuration
// pour fonctionner ce fichier a besoins d'une <div id="damier"></div> (reference a Plateau.newPlateau())

//a faire: faire disparaitre les grandes cases en fonction des grandes cases definies,
//ajout du compteur de temps sur les grandes cases




function Plateau()
{  
   this.grandeCases;//Grandes cases qui disparaissent au fil de la partie
   this.matrice = [];// Matrice de stockage du Plateau
   this.nbgrandecasesDesactive = -1;
   this.caseAlerte = 0;

   /*
   colorAire(x,y,L,l,color,etat)
   X   : coord x
   Y   : coord y
   L   : Largeur de la zone en nombre de carre
   l   : Hauteur de la zone en nombre de carre
   etat: etat a mettre dans les cases
   color: couleur a utiliser
   La fonction colorie une aire de dimension L*l en partant de x y, de couleur col
   */
this.colorAire = function(x,y,L,l,color,etat)//Colore une aire de L*l (en nb de carre) qui commence a x y de la couleur color
  {
     let xi = x - (x%PL_L);
      y = y - (y%PL_L);
      for(let i = 0; i < L ; i++)
      {
         for(let j = 0; j < l ; j++)
         {
           
          
           let id =xi+"_"+y;
           if(y == 0 || xi == 0 || xi == PL_NBCOL*PL_L-PL_L || y == PL_NBLIG*PL_L-PL_L )
           {
            d3.select("rect[id ='"+id+"']")
            .attr("fill",neons)
            .attr("stroke",neons);
            this.matrice[xi/PL_L][y/PL_L]=
            {
               "x" : xi,
               "y" : y,
               "etat" : "mur"
            }
           }
           
          else
          {
            d3.select("rect[id ='"+id+"']")
            .attr("fill",color)
            .attr("stroke",color);
            this.matrice[xi/PL_L][y/PL_L]=
             {
                "x" : xi,
                "y" : y,
                "etat" : etat
             }
          }
           

           xi += PL_L;
           
           ;
         }
         xi = x - (x%PL_L);
         y += PL_L;
         
      }
   }

    
   /*
   transformeCase(x,y,col,etat)
   X   : coord x
   Y   : coord y
   col : doit colorier la case en col
   etat: doit changer l'etat de la case par etat
   La fonction modifie la case de coord associé au point x y, la colorie et modifie son etat
   */
   this.transformeCase = function(x,y,col,etat)
   {
      if(!(x<0 || y<0 || x >= PL_NBCOL*PL_L || y >= PL_NBLIG*PL_L ))
      {
         x = (x - (x%PL_L));
         y = (y - (y%PL_L));
         let id =x+"_"+y;
        // console.log(id)
         d3.select("rect[id ='"+id+"']")
         .attr("fill",col)
         .attr("stroke",col)
   
         this.matrice[x/PL_L][y/PL_L]=
         {
            "x" : x,
            "y" : y,
            "etat" : etat
   
         }
      }
   }

   /*
   reset()
   La fonction remet le plateau de jeu dans on etat initial ( ne touche pas au moto , a modifier reinitialiser aussi les grandes cases)
   */
  this.reset = function() 
  {
     let x,y;
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
  
   /*
   creeCarre(L,x,y,etat)
   L   : Largeur du carre
   X   : coord x
   Y   : coord y
   col : couleur du carré
   etat: etat du carre
   La fonction cree un carre en x y de couleur col et d'etat etat
   */
  this.creeCarre = function(L,x,y)
  {
     d3.select("svg").append("rect")
     .attr("y", y)
     .attr("x", x)
     .attr("width", L)
     .attr("height", L)
     .attr("id",x+"_"+y);
   }

   /*
   isMur(x,y)
   X   : coord x
   Y   : coord y
   La fonction renvoie vrai si le carré associé a x y est un mur, faux sinon
   */
  this.isMur = function(x,y)
   {
      if(x<0 || y<0 || x >= PL_NBCOL*PL_L || y >= PL_NBLIG*PL_L ) return false;
      x = (x - (x%PL_L));
      y = (y - (y%PL_L));
      
     // console.log(id)
     // console.log(d3.select("rect[id ='"+id+"']").attr("etat"));
      return this.matrice[x/PL_L][y/PL_L].etat=="mur";
   }

  /*
  newGrandeCases(svgW,svgH,nbC_L,nbC_l)
  svgW : Largeur de la zone ou dessiner le jeu
  svgH : Hauteur de la zone ou dessiner le jeu
  nbC_L: Nombre de case en Largeur
  nbC_l: Nombre de case en Hauteur
  La fonction rempli le tableau Grande cases et dessine les grandes cases correspondante en fonction du nombre desire en Hauteur et en Largeur
  */
  this.newGrandeCases = function(svgW,svgH,nbC_L,nbC_l)
   {
       this.grandeCases = [];
       for(let i = 0; i<nbC_l;i++)
       {
           for(let j = 0; j<nbC_L;j++)
           {
            
                this.grandeCases.push({
                    "x":Math.floor((svgW/ nbC_L)*j),//Position de depart x
                    "y":Math.floor((svgH/ nbC_l)*i),//Position de depart y
                    "w":Math.floor((svgW/ nbC_L)/ PL_L),//width de la Case en nb de petite cases
                    "h":Math.floor((svgH/ nbC_l)/ PL_L),//height de la Case en nb de petite cases
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


      
         this.colorAire(x,y,h,w,fond_pl,"vide");
        
      


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

   /*
   newPlateau(L,nbCol,nbLig)
   L    : Largeur des cases du plateau
   nbCol: Nombre de colonne dans le tableau de jeu
   nbLig: Nombre de ligne dans le tableau de jeu
   La fonction cree le plateau de jeu a partir de nouvelles cases puis initialise les grandes cases
   */
  this.newPlateau = function(L,nbCol,nbLig)//CREE UN NOUVEAU PLATEAU GRAPHIQUE (OBJET D3) /!\ A N'UTILISER QU'UNE FOISN VOIR A METTRE CONSTRUCT
   {
      let x = 0;
      let y = 0;
      for (let colonne = 0; colonne < nbCol; colonne++)
      {
         this.matrice[colonne]=[]
         for (let ligne = 0; ligne < nbLig ; ligne++) 
         {
            if(ligne == 0 || colonne == 0 || ligne == (nbLig-1) || colonne == (nbCol-1) )
            {
               this.creeCarre(L,x,y);
               this.matrice[colonne][ligne]=
               {
                  "x" : x,
                  "y" : y,
                  "etat" : "mur"
               }
            }
            else
            {
               this.creeCarre(L,x,y);
               this.matrice[colonne][ligne]=
               {
                  "x" : x,
                  "y" : y,
                  "etat" : "vide"
               }       
            } 
            y += L; 
         } 
        x += L;
        y = 0;
       }
 //Grandes cases
 this.newGrandeCases(PL_NBCOL*PL_L,PL_NBLIG*PL_L,5,5);
}

  /*
   incrementTMPS(x,y)
   x : coord x
   y : coord y
   La fonction incremente la variable temps de la grandecase associe a x y 
   */
  this.incrementTMPS = function(x,y)
  {
     let width = this.grandeCases[0].w;
     let height = this.grandeCases[0].h;

      for(let i in this.grandeCases)
      {
         if(this.grandeCases[i].x <= x && this.grandeCases[i].x + (width*PL_L) > x)
          {
            
             if(this.grandeCases[i].y <= y && this.grandeCases[i].y + (height*PL_L) > y)
             {
                this.grandeCases[i].temps ++;
                return;
             }
          }

      }
      console.log("ERREUR, GRANDE CASE NON TROUVE");

  }

  /*
   choisi la grande case a alerter et lance l'alerte
   */
  this.alertGrandeCase = function()
  {
      let max = 0;
      for(let i in this.grandeCases)
      {
         if(this.grandeCases[max].temps < this.grandeCases[i].temps)
         {
            max = i;
         }
      }
      this.caseAlerte = max;

      let x = this.grandeCases[max]['x'];
      let y = this.grandeCases[max]['y'];
      let L = this.grandeCases[max]['h'];
      let l = this.grandeCases[max]['w'];
      let color = "#E44F3F66";

      d3.select("svg").append("rect")
      .attr("y", y)
      .attr("x", x)
      .attr("width", l*PL_L)
      .attr("height", L*PL_L)
      .attr("fill",color)
      .attr("stroke",neons);
      
  }

  /*
   desactiveGrandeCase()
   La fonction desactive la grande case qui a le compteur temps le plus faible
   */
  this.desactiveGrandeCase = function()
  {
   let max = this.caseAlerte;
   let x = this.grandeCases[max]['x'];
   let y = this.grandeCases[max]['y'];
   let L = this.grandeCases[max]['h'];
   let l = this.grandeCases[max]['w'];
   
   d3.select("svg").append("rect")
   .attr("y", y)
   .attr("x", x)
   .attr("width", l*PL_L)
   .attr("height", L*PL_L)
   .attr("fill",case_des)
   .attr("stroke",neons);
   
   this.grandeCases[max].temps = -9999;

   let xi = x - (x%PL_L);
   for(let i = 0; i < L ; i++)
      {
         for(let j = 0; j < l ; j++)
         {          
            this.matrice[xi/PL_L][y/PL_L]=
            {
               "x" : xi,
               "y" : y,
               "etat" : "mur"
            }    
           xi += PL_L; 
         }
         xi = x - (x%PL_L);
         y += PL_L;
         
      }
   
  }
  

}

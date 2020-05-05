exports.max2 = function(x,y){
    var res = 0.00;
    if (x < y){
    	res = y;
    }else{
    	res = x;
    }
    
    return res;
}
exports.calculK = function(elo, nbPartieJoue){
	var res = 0;
	if (elo < 2000){
		res = 20;
	}else if (elo < 2500){
		res = 10;
	}else if (elo < 3000){
		res = 5;
	}
	var bonusNouveauJoueur = 10* this.max2(0,(1-(nbPartieJoue/10)));
	var bonusFaibleNbPartieJoue = res * this.max2(0,(1-(nbPartieJoue/50)));
	res = res + bonusNouveauJoueur + bonusFaibleNbPartieJoue;
	
	return res;

}

exports.estimation = function(eloJ1, eloJ2){
	eloJ1 += 0.00;
	eloJ2 += 0.00;
	return 1/ (1 + Math.pow(10,((eloJ2 - eloJ1) / 400)));
}


exports.nouveauRang = function(NB_MANCHE,eloj1,eloj2,score,nbPartieJoueJ1,nbPartieJoueJ2){
    
    var nouveauRangJ1 = 0;  
    var nouveauRangJ2 = 0; 
    var nbMancheNul = NB_MANCHE - (score[0] + score[1]);

    nouveauRangJ1 = this.max2( 300 ,(eloj1 + (this.calculK(eloj1,nbPartieJoueJ1) * ( (score[0]+(0,5 * nbMancheNul) ) - (NB_MANCHE * this.estimation(eloj1,eloj2))))));
    nouveauRangJ2 = this.max2( 300,(eloj2 + (this.calculK(eloj2,nbPartieJoueJ2) * ( (score[1]+(0,5 * nbMancheNul) ) - (NB_MANCHE * this.estimation(eloj2,eloj1))))));
    
    return {nouveauRangJ1: nouveauRangJ1,nouveauRangJ2: nouveauRangJ2};
}

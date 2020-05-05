exports.gainExperience = function(experienceJoueur1, boostJ1, experienceJoueur2, boostJ2, score){
	var gainJ1 = 256;
	var gainJ2 = 256;
	if (boostJ1 < 1){
		boostJ1 = 1;
	}
	if (boostJ2 < 1){
		boostJ2 = 1;
	}
	
	if (score[0]== 2 && score[1] == 0){
		gainJ1 += 64;
	} else if (score[1]== 2 && score[0] == 0){
		gainJ2 += 64;
	}
	
	if (score[0] > score[1]){
		gainJ1 += 128;
	} else if (score[1] > score[0]){
		gainJ2 += 128;
	}
	gainJ1 = gainJ1 * boostJ1;
	gainJ2 = gainJ2 * boostJ2;

	var miseAJourExperienceJ1 = Math.min((experienceJoueur1 + gainJ1),358144);
	var miseAJourExperienceJ2 = Math.min((experienceJoueur2 + gainJ2),358144);
	
	return {miseAJourExperienceJ1: miseAJourExperienceJ1, miseAJourExperienceJ2: miseAJourExperienceJ2};
}

exports.niveau = function(experience){
	var niveau = 1;
	var exp = experience;
	
	while (exp > 0){
		if(niveau < 8){
			exp = exp - 256;
		}else if(niveau < 16){
			exp = exp - 512;
		}else if(niveau < 32){
			exp = exp - 1024;
		}else if(niveau < 64){
			exp = exp - 2048;
		}else if(niveau < 128){
			exp = exp - 4096;
		}else {
			exp = exp - 8192;
		}
		niveau++;
	}
	if (exp < 0){
		niveau--;
	}
	
	return niveau;
}
function getEloWinProbability(ra, rb) {
	return 1.0 / (1.0 + Math.pow(10, (rb - ra) / 400.0));
}

function getSeed(contestants, rating) {
	var result = 1.0;
	for (var i = 0; i < contestants.content.length; i++) {
		result += getEloWinProbability(contestants.content[i].rating, rating);
	}
	return result;
}

function getRatingToRank(contestants, rank) {
	var left = 1;
	var right = 8000;
	while (right - left > 1) {
		var mid = (left + right) / 2;
		if (getSeed(contestants, mid) < rank) {
			right = mid;
		} else {
			left = mid;
		}
	}
	return left;
}

function process(contestants) {
	if (contestants.content.length == 0) {
		return;
	}
	for (var i = 0; i < contestants.content.length; i++) {
		contestants.content[i].seed = 1.0;
		for (var j = 0; j < contestants.content.length; j++) {
			if (i != j) {
				contestants.content[i].seed += getEloWinProbability(contestants.content[j].rating, contestants.content[i].rating);
			}
		}
	}
	for (var i = 0; i < contestants.content.length; i++) {
		var midRank = Math.sqrt(contestants.content[i].rank * contestants.content[i].seed);
		contestants.content[i].needRating = getRatingToRank(contestants, midRank);
		contestants.content[i].delta      = (contestants.content[i].needRating - contestants.content[i].rating) / 3;
	}
	var tmp = contestants.content[0];
	for (var i = 1; i < contestants.content.length; i++) {
		var j = i;
		while (j > 0 && (contestants.content[j - 1].rating < contestants.content[j].rating)) {
			tmp                        = contestants.content[j - 1];
			contestants.content[j - 1] = contestants.content[j];
			contestants.content[j]     = tmp;
			j--;
		}
	}
	var sum = 0;
	var zeroSumCount = Math.min((4 * Math.sqrt(contestants.content.length)), contestants.content.length);
	for (var i = 0; i < zeroSumCount; i++) {
		sum += contestants.content[i].delta;
	}
	var inc = -sum / zeroSumCount;
	for (var i = 0; i < contestants.content.length; i++) {
		contestants.content[i].delta += inc;
	}
}


function CalculateRatingChanges(previousRatings, standingsRows, newcomers) {
	 // for (StandingsRow standingsRow : standingsRows) {
     //           int rank = standingsRow.getRank();
     //           Party party = standingsRow.getParty();
     //           contestants.add(new Contestant(party, rank, standingsRow.getPoints(), previousRatings.get(party)));
     //       }
    var arr = [];
	for (var i = 0; i < standingsRows.length; i++) {
		var currentContestant = {party: i, rank: standingsRows[i], rating: previousRatings[i], seed : 0.0, needRating : 0.0, delta : 0.0};
		arr.push(currentContestant);
		alert("op-op\n nachali!!");
	}
	var contestants = {
		content : arr
	};
	process(contestants);     

	var result = [];
	for (var i = 0; i < contestants.content.length; i++) {
		result[contestants.content[i].party] = contestants.content[i].delta;
	}
	return result;
}


var a = [1500, 2300, 1850];
var b = [2, 1, 3];
var c;


console.log(CalculateRatingChanges(a, b, c));

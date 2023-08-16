/* Created in autumn 2015
   by
   Roman Rubanenko    (@Rubanenko at codeforces.com),
   Maxim Molchanov    (@MaximM at codeforces.com),
   Aleksey Kholovchuk (@meh at codeforces.com)

   This extension comes with absolutely NO WARRANTY,
   use it on your own risk.

   No rights reserved.
*/


function getEloWinProbability(ra, rb) {
	return 1.0 / (1.0 + Math.pow(10.0, (rb - ra) / 400.0));
}

function getSeed(contestants, rating) {
	if (rating in contestants.memSeed) {
		return contestants.memSeed[rating];
	}
	var result = 1.0;
	for (var i = 0; i < contestants.content.length; i++) {
		result += getEloWinProbability(contestants.content[i].rating, rating);
	}
	contestants.memSeed[rating] = result;
	return result;
}

function getRatingToRank(contestants, rank) {
	var left = 1;
	var right = 8000;
	while (right - left > 1) {
		var mid = (left + right) >> 1;
		if (getSeed(contestants, mid) < rank) {
			right = mid;
		} else {
			left = mid;
		}
	}
	return left;
}

function reassignRanks(contestants) {
	var first  = 0;
	var points = contestants.content[0].rank;
	for (var i = 1; i < contestants.content.length; i++) {
		if (contestants.content[i].rank > points) {
			for (var j = first; j < i; j++) {
				contestants.content[j].rank = i;
			}
			first = i;
			points = contestants.content[i].rank;
		}
	}
	for (var i = first; i < contestants.content.length; i++) {
		contestants.content[i].rank = contestants.content.length;
	}
}

function process(contestants) {
	if (contestants.content.length == 0) {
		return;
	}
	reassignRanks(contestants);
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
		contestants.content[i].delta      = (contestants.content[i].needRating - contestants.content[i].rating) >> 1;
	}



	var tmp;
	var j = 0;
	for (var i = 1; i < contestants.content.length; i++) {
		j = i;
		while (j > 0 && contestants.content[j].rating > contestants.content[j - 1].rating) {
			tmp                        = contestants.content[j];
			contestants.content[j]     = contestants.content[j - 1];
			contestants.content[j - 1] = tmp;
			j--;
		}
	}
	

	{
		var sum = 0;
		for (var i = 0; i < contestants.content.length; i++) {
			sum += contestants.content[i].delta;
		}
		var inc = ((-sum / contestants.content.length) >> 0) - 1;
		for (var i = 0; i < contestants.content.length; i++) {
			contestants.content[i].delta += inc;
		}
	}


	var sum = 0;
	var zeroSumCount = Math.min(4 * Math.round(Math.sqrt(contestants.content.length)), contestants.content.length);
	for (var i = 0; i < zeroSumCount; i++) {
		sum += contestants.content[i].delta;
	}
	var inc = Math.min(Math.max(((-sum / zeroSumCount) >> 0), -10), 0);
	for (var i = 0; i < contestants.content.length; i++) {
		contestants.content[i].delta += inc;
	}
}




function CalculateRatingChanges(previousRatings, standingsRows, userId) {
    var arr = [];
	for (var i = 0; i < standingsRows.length; i++) {
		var currentContestant = {party: userId[i], rank: standingsRows[i], rating: previousRatings[i], seed : 0.0, needRating : 0.0, delta : 0};
		arr.push(currentContestant);
	}
	var memTmp = [];
	var contestants = {
		content : arr,
		memSeed : memTmp
	};
	process(contestants);     

	var result = [];
	for (var i = 0; i < contestants.content.length; i++) {
		result[contestants.content[i].party] = contestants.content[i].delta;
	}
	return result;
}

function fft(x) {
    const N = x.length;

    if (N <= 1) return x;

    const even = [];
    const odd = [];

    for (let i = 0; i < N; i++) {
        if (i % 2 === 0) even.push(x[i]);
        else odd.push(x[i]);
    }

    const evenFFT = fft(even);
    const oddFFT = fft(odd);

    const T = [];
    for (let k = 0; k < N / 2; k++) {
        const t = Math.exp(-2 * Math.PI * k / N * 1j) * oddFFT[k];
        T.push(t);
    }

    const result = [];
    for (let k = 0; k < N / 2; k++) {
        result[k] = evenFFT[k] + T[k];
        result[k + N / 2] = evenFFT[k] - T[k];
    }

    return result;
}

// Helper function to handle complex numbers
function complex(real, imaginary) {
    return {
        r: real,
        i: imaginary,
        toString: function() {
            return `${this.r} + ${this.i}j`;
        },
        plus: function(other) {
            return complex(this.r + other.r, this.i + other.i);
        },
        minus: function(other) {
            return complex(this.r - other.r, this.i - other.i);
        },
        times: function(other) {
            return complex(
                this.r * other.r - this.i * other.i,
                this.r * other.i + this.i * other.r
            );
        }
    };
}

Math.exp = function(c) {
    const r = Math.E ** c.r;
    return complex(r * Math.cos(c.i), r * Math.sin(c.i));
};


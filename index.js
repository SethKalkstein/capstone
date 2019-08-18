//words that the player will be guessing
var hangManArray = ["word", "something", "another", "great", "random", "butterfly", "kittycat"];
//variable to hold hints
var hintArray = ["the basic structure of a sentance", "not nothing", "distinctly different", "better than good", "no specific pattern", "in the sky, I can fly twice as high", "cute, soft, and dangerous"];
//will hold letters or dashes
var dashStringArray = [];
//letters that have already been used 
var usedLetterBank = []; 
let gameTimer = 60;
//how many letters the user missed
var missedCount; 
var timeStamp = new Date();
var timerCount = 0;
var gameCount = 0;
var hintCount = false;
var highScore = [];


function randomWordGenerator(manArray) {
	//uses random to pick a word from the hangManArray
	return manArray[Math.floor(Math.random() * manArray.length)]; 
}

function newGameGenerator(aWord) {

	let dashString = "";
	
	//initialize or re-initialize the global game variables
	dashStringArray = []; 
	missedCount = 0;
	usedLetterBank = [];
	timerCount = 0;
	hintCount = false;
	intervalID = setInterval(addTimeHTML, 100);

	//set hint text to "?"... oooh the intigue
	$("#hint").html("?");

	console.log("inside new game generator: " + aWord);
	//sets initial value of letters the player has already used.
	$("#used").html("None Yet!") 
	
	//loops through the word to be guessed and creates a string of dashes for the word
	for (let i = 0; i < aWord.length; i++) {
		dashString += "_ "; 
		dashStringArray.push("_"); 
	}

	//appends the 0 missed letters to the webpage
	$("#missed").html(missedCount); 
	//appends the initial dashes to the page
	$("#wordHolder").html(dashString); 

	enableButtons();
}

// why is this here instead of the top?
var guesserCount = 0;

//the main portion of the program. Checks to see if the letter guessed 
function guesser(aLetter) { 

	console.log("guess count: " + guesserCount);
	
	guesserCount++;
	//re-initializes the string that will be dispayed on the html page
	let newDashString = ""; 
	//converts the guess to lowercase
	aLetter = aLetter.toLowerCase(); 

	//if the letter is already in the letter bank the index variable will not return -1
	if (usedLetterBank.indexOf(aLetter) != -1) { 
		//error message
		window.alert(aLetter + " has already been used. Please enter a new letter.")
	//makes sure they have entered only one letter 
	} else if (aLetter.length > 1) { 
		window.alert("Please enter only one character.");
	//uses regular expression to see if is in fact a letter
	} else if (/[a-z]/.test(aLetter) === false) {
		// special case if they've entered nothing 
		if (aLetter == "" || aLetter == " ") {  
			aLetter = "A blank entry"
		}
		window.alert(aLetter + " is not even a letter, how do you expect to win whilst typing tuch jibberish?!")
	}
	//its an acual letter that hasn't been guessed yet.
	else { 

		console.log("do stuff");
		//default for a wrong guess
		let missedFlag = true; 
		//stores the letter in the array of used letters
		usedLetterBank.push(aLetter);
		//sorts the used letters 
		usedLetterBank.sort();
		//re-initializes the string that will be appended to the html 
		let usedLetters = ""; 

		//formats the used letterbank
		for (let i = 0; i < usedLetterBank.length; i++) {
			usedLetters += usedLetterBank[i] + " | "; 
		}
		//appends the used letters to the html
		$("#used").html(usedLetters); 

		//loops through the word the player is guessing
		for (let i = 0; i < newWord.length; i++) {
			//if the letter matches any letter in the word 
			if (aLetter == newWord[i]) { 
				//the array holding the dashes and letters replaces the dash with a letter
				dashStringArray[i] = aLetter; 
				//changes the state of a wrong guess
				missedFlag = false; 
			}
			//formats the dashes and letters to a string
			newDashString += dashStringArray[i] + " "; 
		}
		//appends the dashes and dots string to the html
		$("#wordHolder").html(newDashString); 
		if (missedFlag == true) {
			//adds to the the wrong guess count if the wrong guess default is still true
			missedCount++; 
			//and displays it
			$("#missed").html(missedCount); 
		}
	}

	//6 missed guesses and you loose!!!
	if (missedCount === 6) { 
		gameOver(false, false);
	}

	//if there are no more dashes in the array, then it means the word has been guessed
	if (dashStringArray.indexOf("_") === -1) { 
		gameOver(true, null);
	}
}

//Starts a new game first argument is for if the game was won or lost, second is for the reason why it was lost
function gameOver(winner, timeReason) { 
	//stop timer
	clearInterval(intervalID);
	//disable game buttons 
	disableButtons(); 
	//why is this being declared here?
	var finalScore = scoreGen(winner);
	//create modal
	$('<div id="gameOver"></div>').appendTo('body'); 
	//set modal css
	$("#gameOver").css({
		"height": "200px",
		"width": "300px",
		"background-color": "red",
		"border": "1px solid black",
		"border-radius": "10px"
	}); 

	$('<p id="overMessage"></p>').appendTo("#gameOver");
	// why is declaration here?
	let hintText = "";
	//sets text for if they used a hint{
	if (hintCount === false) { 
		hintText = "out";
	} else {
		hintText = "";
	}

	//what does the next 4 lines do?
	let missedS = "s";
	if (missedCount === 1) {
		missedS = "";
	}

	if (winner === true) {
		$("#overMessage").text("You won! " + "You finsished in " + (60 - gameTimer) + " seconds, with " + usedLetterBank.length + " turns total, and missed " + missedCount + " time" + missedS + ", with" + hintText + " using a hint. Your score is: " + finalScore);
	} else {
		if (timeReason === true) {
			$("#overMessage").text("You loose. You ran out of time. You finsished in " + (60 - gameTimer) + " seconds, with " + usedLetterBank.length + " turns total, and missed " + missedCount + " time" + missedS + ", with" + hintText + " using a hint. Your score is: " + finalScore);
			console.log("you ran out of time.\nThe word was " + newWord);
		} else {
			$("#overMessage").text("You loose. You got too many wrong. You finsished in " + (60 - gameTimer) + " seconds, with " + usedLetterBank.length + " turns total, and missed " + missedCount + " time" + missedS + ", with" + hintText + " using a hint. Your score is: " + finalScore);
			console.log("you ran out of guesses.");
		}
	}
	//finds out if it was a top score in the scoreboard function
	let scoreResult = scoreBoard(winner, finalScore); 
	//creates a button to start a new game
	$('<input type="submit" id="newGame" value="New Game">').appendTo("#gameOver"); 
	$("#newGame").click(function () {
		//generates the new word.
		newWord = randomWordGenerator(hangManArray); 
		console.log(newWord);
		//will grab a high score name depending on the state of scoreResult
		grabName(scoreResult, finalScore, winner); 
		newGameGenerator(newWord);
		// $("#scoreHolder").remove();
		$("#gameOver").remove();
	});
}
//generates a score: lowest winning score starts at 90, highest losing score is a little below 90 depending on the percent of dashes there are left to total length of the word, which becomes a percent of 60, which coincides with what 6 wrong guesses would give you... each wrong guess on a winning game get 10 points subtracted from the score. time on the clock is added to a winners score. Using a hint will subtract 30 from your score whether you win or loose.
function scoreGen(winner) { 
	// initialize points for score
	let hintScore = 0;
	let score = 0; 
	let dashCount = 0;

	if (hintCount === true) {
		hintScore = 30;
	}
	if (winner === true) {
		score = gameTimer + 170 - (missedCount * 10 + hintScore);
	} else {
		for (let i = 0; i < dashStringArray.length; i++) {
			if (dashStringArray[i] === "_") {
				dashCount++;
			}
		}
		score = 90 - (Math.floor((dashCount / dashStringArray.length) * 60) + hintScore);
	}

	return score;
}

//decides whether of not thier name goes on the score board
function scoreBoard(winner, finalScore) {  //is winner used?

	$("<p id='highMessage'></p>").appendTo("#gameOver");
	
	console.log(finalScore);
	//score board has top 3 contenders so you automatically go in if you're one of the first 3 players
	if (gameCount <= 3) { 
		$("#gameOver").css({
			"height": "300px"
		});
		//if they're the first player to finish
		if (gameCount == 1) { 
			$("#highMessage").text("You're the first person to play, so by default, you have the high score. (and also the low score) Please enter your name!");
		//if they're not the first to finish, but still first 3
		} else { 
			if (finalScore > highScore[0].score) {
				$("#highMessage").text("Congratulations! You have the new high score!!!! Please enter your name!");
			} else if (gameCount === 2) {
				$("#highMessage").text("You're the second person to play, so by default, you're in the top 3. (but last if you think about it) Please enter your name!");
			} else if (finalScore > highScore[1].score) {
				$("#highMessage").text("You automatically get on the scoreboard because you're only the thrd to play but you got second place. Please enter your name!");
			} else {
				$("#highMessage").text("You're the third person to play, so by default, you're in the top 3, but you're also in last place... Please enter your name, anyway!");
			}
		}
		$('<input type="text" id="scoreHolder" maxlength="16" placeholder="enter name here:">').appendTo("#gameOver");
		return true;

	//game count is higher than 3
	} else if (finalScore > highScore[2].score) {
		$("#gameOver").css({
			"height": "300px"
		});
		if (finalScore > highScore[0].score) {
			$("#highMessage").text("Congratulations! You have the new high score!!!! Please enter your name!");
		} else if (finalScore > highScore[1].score) {
			$("#highMessage").text("Congratulations! You made it to second place. Please enter your name!");
		} else {
			$("#highMessage").text("Congratulations! You made it to third place. Please enter your name!");
		}
		$('<input type="text" id="scoreHolder" maxlength="16" placeholder="enter name here:">').appendTo("#gameOver");
		return true;
	} else {
		return false;
	}
}

//This function sets the information of player who make it to the high score board. Parameters are newScore (int), scroreResult
function grabName(newScore, scoreResult, winner) {
	//its a new high score
	if (newScore === true) { 
		if (highScore.length === 3) {
			//get rid of the third element
			highScore.splice(2, 1); 
		}
		highScore.push({
			name: $("#scoreHolder").val(),
			score: scoreResult,
			win: winner
		});
		console.log($("#scoreHolder").val());
		if (highScore.length > 1) {
			highScore = objectSort(highScore);
		}
		$(".highPlayers").html("");
		for (let i = 0; i < highScore.length; i++) {
			let winLoss = "Winner";
			if (highScore[i].win === false) {
				winLoss = "Loser"
			}
			// $(".highPlayers").eq(i).html("<td>Moew</td><td>Purr</td><td>hiss</td>");
			$(".highPlayers").eq(i).html("<td>" + highScore[i].score + "</td><td>" + highScore[i].name + "</td><td>" + winLoss + "</td>");
			// $(".highPlayers:eq(i)").html("Hello");
			console.log("appending");
		}
	}
	console.log(highScore);
}


function addTimeHTML() {
	// var timeStamp = new Date();
	if (timerCount === 0) {
		timeStamp = new Date();
	}
	timerCount++;
	newTime = new Date();
	gameTimer = 60 - Math.floor((newTime - timeStamp) / 1000)
	$("#timer").html(gameTimer);
	if (gameTimer === 0) {
		gameOver(false, true);
	}
}

function enableButtons() {

	console.log("enabling");
	//event listener for the guess button
	$("#guess").click(function () { 
		//calls the guesser function and passes the value of the input box to the function 
		guesser($("#letterHolder").val()); 
		$("#letterHolder").val(""); //and clears the letter input box
	});

	$("#letterHolder").removeAttr("disabled");

	if (gameCount === 0) {
		//does the same thing as as above but with the enter key while in the input box
		$("#letterHolder").keypress(function (enterButton) { 
			var key = enterButton.which;

			if (key === 13) {
				guesser($("#letterHolder").val());
				$("#letterHolder").val("");
			}
		});
	}

	$("#hintButton").click(function () {		
		$("#hint").html(hintArray[hangManArray.indexOf(newWord)]);
		hintCount = true;
	})

	gameCount++;
}

function disableButtons() {

	console.log("disabling");

	$("#guess").off("click");
	$("#letterHolder").attr("disabled", true);
	$("#hintButton").off("click");
}

//arg is an an array of objects to be sorted (t.b.s)
function objectSort(tbs) {
	//will hold the objects to be switched 
	var holder1 = {}; 
	//other holder
	var holder2 = {}; 
	for (var i = 0; i < tbs.length - 1; i++) {
		for (let j = 0; j < tbs.length - (i + 1); j++) {
			console.log("tbsj " + tbs[j] + " tbsj+1 " + tbs[j + 1] + " i " + i + " j " + j);
			if (tbs[j].score < tbs[j + 1].score) {
				holder1 = tbs[j];
				holder2 = tbs[j + 1]
				tbs[j] = holder2;
				tbs[j + 1] = holder1;
			}
		}
	}
	return tbs;
}

//generates the first word (down here becuase of hoisting?)
let newWord = randomWordGenerator(hangManArray); 

console.log(newWord);
//generates everything else and resets the variables
newGameGenerator(newWord); 
// enableButtons();
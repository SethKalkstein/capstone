//words that the player will be guessing
const hangManArray = ["mother", "word", "something", "another", "great", "random", "butterfly", "kittycat"];
//variable to hold hints
const hintArray = ["withour her you wouldn't be here","the basic structure of a sentance", "not nothing", "distinctly different", "better than good", "no specific pattern", "in the sky, I can fly twice as high", "cute, soft, and dangerous"];
//will hold letters or dashes
var dashStringArray = [];
//letters that have already been used 
var usedLetterBank = []; 
let gameTimer = 60;
//how many letters the user missed
var missedCount; 
var timeStamp = new Date();
var clockIsRunning = false;
var gameCount = 0;
var hintUsed = false;
var highScore = [];

/**
 * generates a random word from the hangman word array and returns it
 * 
 * @param {string[]} manArray 
 * @returns {string}
 * 
 */
function randomWordGenerator(manArray) {
	//uses random to pick a word from the hangManArray
	return manArray[Math.floor(Math.random() * manArray.length)]; 
}

/**
 *  initializes a new game
 * 
 * @param {string} aWord 
 * 
 * aword is the word generated from the random randomWordGenerator
 * 
 * Resets a bunch of the global variables for a new round of the game
 * enables the buttons/main-functionality 
 * No return value but it does set up a couple of event listeners
 *  
 */
function newGameGenerator(aWord) {
	// dashString hold the string of dashes that will apear on the screen. These dashes are placeholders for the letters to be guessed
	let dashString = "";
	
	//re-initialize the global game variables
	dashStringArray = []; 
	missedCount = 0;
	usedLetterBank = [];
	hintUsed = false;
	//sets the interval to calculate the time on the game clock every tenth of a second (100 miliseconds)
	intervalID = setInterval(gameClock, 100);

	//set hint text to "?"... oooh the intigue
	$("#hint").html("?");

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
/**
 * 
 * controls the countdown timer for the current game
 * 
 * no params. No returns.  
 * 
 * This function is called as often as the setInterval() function 
 * (inside newGameGenerator()) function is called.
 * 
 * It stops being called when the clearInterval method is called
 * clockIsRunning variable should be set to false at that time, or 
 * the next game will start from the same time as the last game.
 * In essense clearInterval stops the clock counter mechanism and clockIs Running
 * is used to reset the timestamp that counter is counting down from
 * 
 */
function gameClock() {
	let currentTime = new Date();
	//test to see if it is a new game, in which case we will start the timer
	if (clockIsRunning === false) {
		//the time that will be counted down from
		timeStamp = new Date();
		//clockIsRunning should be true while the game is ongoing
		clockIsRunning = true;
	}	
	//currentTime will be compared to the initial timeStamp created when the game was started
	// to calculate the lapsed time in countdown format
	gameTimer = 60 - Math.floor((currentTime - timeStamp) / 1000)
	//apend the timer to the html
	$("#timer").html(gameTimer);
	//if the clock reaches 0, time is up, call gameOver() function
	if (gameTimer === 0) {
		gameOver(false, true);
	}
}
/**
 * re-enables buttons that are disabled inbetween games (or before a 
 * the first game has been started enables them for the first time.)
 * 
 * no params or returns
 * 
 * sets up action listeners for the guess button, the hint button
 * and the enter key, when user is inside the letter input box (CSS #letterHolder ID)
 */
function enableButtons() {

	//event listener for the guess button
	$("#guess").click(function () { 
		//calls the guesser function and passes the value of the input box to the function 
		guesser($("#letterHolder").val()); 
		//and clears the letter input box after guess button is clicked
		$("#letterHolder").val(""); 
	});
	
	$("#letterHolder").removeAttr("disabled");
	//initializes the letter holder for the first game
	//after the first game the code below is turned on and off
	//by removing or adding the the disabled css attribute
	//applied to the letterholder id 
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
		hintUsed = true;
	})

	gameCount++;
}

/**
 * Function guesser:  
 * the main portion of the program. Checks to see if the letter guessed is correct
 *
 * @param {string} aLetter 
 * 
 * parameter: (aLetter) is taken in from keyboard input which was activated with a
 * jquery .click or .keypress event in the enableButtons function. It can be Any 
 * user input and will be error checked to make sure it is a valid letter.
 *
 * also checks to see if the game is over and whether or not the user won
 *
 * no return value
 * changes global variables for guess count 
 */


function guesser(aLetter) { 
	//re-initializes the string that will be appended to the html 
	let usedLetters = " | ";
	//re-initializes the string that will be dispayed on the html page
	let newDashString = "";
	//default is for a wrong guess
	let missedFlag = true; 
 
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
	//else means it's an acual letter that hasn't been guessed yet.
	else { 
		//stores the letter in the array of used letters
		usedLetterBank.push(aLetter);
		//sorts the used letters 
		usedLetterBank.sort();

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

	//6 missed guesses and you loose!!! (or change the if condition to whatever number of misses you want)
	if (missedCount === 6) { 
		gameOver(false, false);
	}

	//if there are no more dashes in the array, then it means the word has been guessed
	if (dashStringArray.indexOf("_") === -1) { 
		gameOver(true, null);
	}
}

/**
 * called from the guess function  or gameClock 
 * when the game is over
 * 
 * @param {boolean} winner 
 * @param {boolean} timeUpLoss 
 * 
 * Parameters determine is it was a win or a loss, 
 * and if it was a loss, was it due to time up
 */

function gameOver(winner, timeUpLoss) { 
	
	// initialize function variables

	//grammar helper
	let gameOverMessageHintGrammar = "";
	//grammar helper
	let gameOverMessageMissedTimesGrammar = "s";
	//grab final score
	var finalScore = scoreGen(winner);


	// functions to stop or disable main functionality

	//free the system resources using setInterval (clock would cycle back to 60 anyway if I didn't clear the interval) and stop timer
	clearInterval(intervalID);
	clockIsRunning = false;
	//disable game buttons 
	disableButtons(); 

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
	//create html element to hold the game over message
	$('<p id="overMessage"></p>').appendTo("#gameOver");

	//conditionals for setting grammar

	//sets message text grammer "with" using a hint vs "without" using a hint
	if (hintUsed === false) { 
		gameOverMessageHintGrammar = "out";
	} else {
		gameOverMessageHintGrammar = "";
	}
	//gameOverMessageMissedTimesGrammar provides proper grammer for the word time(). 1 time vs 2 time(s) or 0 time(s)
	if (missedCount === 1) {
		gameOverMessageMissedTimesGrammar = "";
	}

	//conditionals for generating an end of game message

	if (winner === true) {
		//User won!!!
		$("#overMessage").text("You won! " + "You finsished in " + (60 - gameTimer) + " seconds, with " + usedLetterBank.length + " turns total, and missed " + missedCount + " time" + gameOverMessageMissedTimesGrammar + ", with" + gameOverMessageHintGrammar + " using a hint. Your score is: " + finalScore);
	} else {
		if (timeUpLoss === true) {
			//User Lost because they ran out of time
			$("#overMessage").text("You loose. You ran out of time. You finsished in " + (60 - gameTimer) + " seconds, with " + usedLetterBank.length + " turns total, and missed " + missedCount + " time" + gameOverMessageMissedTimesGrammar + ", with" + gameOverMessageHintGrammar + " using a hint. Your score is: " + finalScore);
		} else {
			//The user lost because they had too many wrong guesses
			$("#overMessage").text("You loose. You got too many wrong. You finsished in " + (60 - gameTimer) + " seconds, with " + usedLetterBank.length + " turns total, and missed " + missedCount + " time" + gameOverMessageMissedTimesGrammar + ", with" + gameOverMessageHintGrammar + " using a hint. Your score is: " + finalScore);
		}
	}
	//isNewHighScore finds out if it was a top score in the scoreboard function, returns boolean: true for top 3 score, false for not top score. Scoreboard function will generate a message for the user and let them enter their name if the user makes it to the top 3
	let isNewHighScore = scoreBoard(finalScore); 
	//creates a button to start a new game and starts the new game
	//initialization process
	$('<input type="submit" id="newGame" value="New Game">').appendTo("#gameOver"); 
	$("#newGame").click(function () {
		//generates the new word.
		newWord = randomWordGenerator(hangManArray); 
		//will grab a high score name depending on the state of isNewHighScore
		if (isNewHighScore === true){
			grabName(finalScore, winner); 
		}

		newGameGenerator(newWord);
		//get rid of the game over text
		$("#gameOver").remove();
	});
}

/**
 * generates a score
 * 
 * @param {boolean} winner (whether or not the user guessed the right word) 
 * 
 * Scoring Criteria: lowest winning score starts at 90, highest losing score
 * is a little below 90 depending on the percent of dashes there are left to total
 * length of the word, which becomes a percent of 60, which coincides with what 6 
 * wrong guesses would give you... each wrong guess on a winning game get 10 points 
 * subtracted from the score. time on the clock is added to a winners score. Using 
 * a hint will subtract 30 from your score whether you win or loose. 
 * 
 *  @returns score (an integer value)
 */

function scoreGen(winner) { 
	// initialize points for score
	let hintScore = 0;
	let score = 0; 
	let dashCount = 0;
	//subtraction for using a hint
	if (hintUsed === true) {
		hintScore = 30;
	}

	if (winner === true) {
		//winners get extra points for time left on the game clock
		score = gameTimer + 170 - (missedCount * 10 + hintScore);
	} else {
		//loosers get credit for the percentage of letters they got right
		for (let i = 0; i < dashStringArray.length; i++) {
			if (dashStringArray[i] === "_") {
				dashCount++;
			}
		}
		score = 90 - (Math.floor((dashCount / dashStringArray.length) * 60) + hintScore);
	}

	return score;
}

/**
 * decides whether of not thier name goes on the score board
 *  
 * @param {number} finalScore an integer created in the scoreGen function
 * 
 * @returns {boolean} representing whether or not the user has made it to the 
 * the high score board. True if it's a new high score, false if not.
 */
function scoreBoard(finalScore) { 
	//create html element to hold a message that is appended to the
	//game over message. I could really go for a game over massage right now ;)
	$("<p id='highMessage'></p>").appendTo("#gameOver");
	
	//score board has top 3 contenders so you automatically go in if you're one of the first 3 players
	if (gameCount <= 3) { 
		$("#gameOver").css({
			"height": "300px"
		});
		//first game for user
		if (gameCount == 1) { 
			$("#highMessage").text("You're the first person to play, so by default, you have the high score. (and also the low score) Please enter your name!");
		//not first game for user but still first 3
		} else {
			//highest score so far, for second or third game
			if (finalScore > highScore[0].score) {
				$("#highMessage").text("Congratulations! You have the new high score!!!! Please enter your name!");
			//second game but not highest score is the lowest score!
			} else if (gameCount === 2) {
				$("#highMessage").text("You're the second person to play, so by default, you're in the top 3. (but last if you think about it) Please enter your name!");
			//otherwise it is the third game and they placed higher than the current second place
			} else if (finalScore > highScore[1].score) {
				$("#highMessage").text("You automatically get on the score board because you're only the third to play but you got second place. Not bad. Please enter your name!");
			// only option left is to be third place and lower than the current second, aka thrid, aka last place
			} else {
				$("#highMessage").text("You're the third person to play, so by default, you're in the top 3, but you're also in last place... Please enter your name, anyway!");
			}
		}
		//appends input box for name to be typed in
		$('<input type="text" id="scoreHolder" maxlength="16" placeholder="enter name here:">').appendTo("#gameOver");
		return true;

	//game count is higher than 3
	} else if (finalScore > highScore[2].score) {
		$("#gameOver").css({
			"height": "300px"
		});
		//higher than the previous high score. Way to go
		if (finalScore > highScore[0].score) {
			$("#highMessage").text("Congratulations! You have the new high score!!!! Please enter your name!");
		//higher than the previous second place score
		} else if (finalScore > highScore[1].score) {
			$("#highMessage").text("Congratulations! You made it to second place. Please enter your name!");
		//higher than the previous third place score
		} else {
			$("#highMessage").text("Congratulations! You made it to third place. Please enter your name!");
		}
		//input box for name
		$('<input type="text" id="scoreHolder" maxlength="16" placeholder="enter name here:">').appendTo("#gameOver");
		return true;
	} else {
		$("#gameOver").css({ "height": "250px" });
		$("#highMessage").text("You didn't make it to the score board. Better luck next time");
		return false;
	}
}

//This function sets the information of player who make it to the high score board, scroreResult
/**
 * 
 * @param {int} theFinalScore 
 * @param {boolean} winner (did user win?)
 */

function grabName(theFinalScore, winner) {
	if (highScore.length === 3) {
		//get rid of the third element
		highScore.splice(2, 1); 
	}
	//add the object consisting of the name, the score and the 
	highScore.push({
		name: $("#scoreHolder").val(),
		score: theFinalScore,
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
		$(".highPlayers").eq(i).html("<td>" + highScore[i].score + "</td><td>" + highScore[i].name + "</td><td>" + winLoss + "</td>");
	}
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

// console.log(newWord);
//generates everything else and resets the variables
newGameGenerator(newWord); 
// enableButtons();
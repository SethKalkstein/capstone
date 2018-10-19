var hangManArray = ["word", "something", "another", "great", "random", "butterfly", "kittycat"]; //words that the player will be guessing
var hintArray = ["the basic structure of a sentance","not nothing", "distinctly different","better than good","no specific pattern", "in the sky, I can fly twice as high", "cute, soft, and dangerous"]; //holds hints
var dashStringArray = []; //will hold letters or dashes
var usedLetterBank = []; //letters that have already been used
let gameTimer = 60;
var missedCount; //how many letters the user missed
var timeStamp = new Date();
var timerCount = 0;
var gameCount = 0;
var hintCount = false;
var highScore = [];


function randomWordGenerator(manArray){
	return manArray[Math.floor(Math.random()*manArray.length)]; //uses random to pick a word from the hangManArray
}

function newGameGenerator(aWord){
	let dashString=""; 
	dashStringArray = []; //initialize or re-initialize the game variables
	missedCount = 0;
	usedLetterBank = [];
	timerCount=0;
	hintCount=false;
	intervalID = setInterval(addTimeHTML, 100);
	// enableButtons();
	$("#hint").html("?");
	console.log("inside new game generator: "+aWord);
	$("#used").html("None Yet!") //sets initial value of letters the player has already used.
	for(let i = 0; i<aWord.length;i++){
		dashString+="_ ";             //loops through the word to be guessed
		dashStringArray.push("_"); //creates a string of dashes for the word
	}
	$("#missed").html(missedCount); //appends the 0 missed letters to the webpage
	$("#wordHolder").html(dashString); //appends the initial dashes to the page
	enableButtons();
}

var guesserCount=0;

function guesser(aLetter){ //the main portion of the programmer checks to see if the letter guessed 
	console.log("guess count: "+guesserCount);
	guesserCount++;
	let newDashString = ""; //re-initializes the string that will be dispayed on the html page
	aLetter=aLetter.toLowerCase(); //converts the guess to lowercase
	if(usedLetterBank.indexOf(aLetter)!=-1){ //if the letter is already in the letter bank the index variable will not return -1
		window.alert(aLetter+" has already been used. Please enter a new letter.") //error message
	} else if(aLetter.length>1){ //makes sure they have entered only one letter
		window.alert("Please enter only one character.");
	} else if(/[a-z]/.test(aLetter)===false) { //uses regular expression to see if is in fact a letter
		if (aLetter==""||aLetter==" "){ // special case if they've entered nothing 
			aLetter="A blank entry"
		}
		window.alert(aLetter+" is not even a letter, how do you expect to win whilst typing tuch jibberish?!")
	} else { //its an acual letter that hasn't been guessed yet.
		console.log("do stuff"); 
		let missedFlag = true; //default for a wrong guess
		usedLetterBank.push(aLetter); //stores the letter in the array of used letters
		usedLetterBank.sort(); //sorts the used letters
		let usedLetters = ""; //re-initializes the string that will be appended to the html
		for(let i = 0;i<usedLetterBank.length;i++){ 
			usedLetters+=usedLetterBank[i]+" | "; //formats the used letterbank
		}
		$("#used").html(usedLetters); //appends the used letters to the html
		for(let i=0;i<newWord.length; i++){ //loops through the word the player is guessing
			if(aLetter==newWord[i]){ //if the letter matches any letter in the word
				dashStringArray[i]=aLetter; //the array holding the dashes and letters replaces the dash with a letter
				missedFlag=false; //changes the state of a wrong guess
			}
			newDashString +=dashStringArray[i]+" "; //formats the dashes and letters to a string
		}
		$("#wordHolder").html(newDashString); //appends the dashes and dots string to the html
		if(missedFlag==true){
			missedCount++; //adds to the the wrong guess count if the wrong guess default is still true
			$("#missed").html(missedCount); //and displays it
		}	
	}
	if(missedCount===6){ //6 missed guesses and you loose!!!
		gameOver(false,false); 
	}
	if(dashStringArray.indexOf("_")===-1){ //if there are no more dashes in the array, then it means the word has been guessed
		gameOver(true,null);
	}
}
/*Starts a new game*/
function gameOver(winner, timeReason){ //first argument is for if the game was won or lost, second is for the reason why it was lost
	clearInterval(intervalID); //stop timer
	disableButtons(); //disable game buttons
	var finalScore = scoreGen(winner);
	$('<div id="gameOver"></div>').appendTo('body'); //create modal
	$("#gameOver").css({"height":"200px", "width":"300px", "background-color":"red", "border": "1px solid black", "border-radius": "10px"}); //set modal css
	$('<p id="overMessage"></p>').appendTo("#gameOver");
	let hintText="";
	if(hintCount===false){ //sets text for if they used a hint{
		hintText="out";
	} else{
		hintText="";
	}
	if(winner===true){
		$("#overMessage").text("You won! "+"You finsished in "+(60-gameTimer)+" seconds, with "+usedLetterBank.length+" turns total, and missed "+missedCount+" times, with"+hintText+" using a hint. Your score is: "+finalScore);
	}
	else{
		if(timeReason===true){
		$("#overMessage").text("You loose. You ran out of time. You finsished in "+(60-gameTimer)+" seconds, with "+usedLetterBank.length+" turns total, and missed "+missedCount+" times, with"+hintText+" using a hint. Your score is: "+finalScore);
			console.log("you ran out of time.\nThe word was "+newWord);
		}
		else{
			$("#overMessage").text("You loose. You got too many wrong. You finsished in "+(60-gameTimer)+" seconds, with "+usedLetterBank.length+" turns total, and missed "+missedCount+" times, with"+hintText+" using a hint. Your score is: "+finalScore);
			console.log("you ran out of guesses.");
		}
	}
	let scoreResult = scoreBoard(winner, finalScore); //finds out if it was a top score in the scoreboard function
	$('<input type="submit" id="newGame" value="New Game">').appendTo("#gameOver"); //creates a button to start a new game
	$("#newGame").click(function(){
		newWord = randomWordGenerator(hangManArray); //generates the new word.
		console.log(newWord);
		grabName(scoreResult, finalScore, winner); //will gran a high score name depending on the state of scoreResult
		newGameGenerator(newWord);
		// $("#scoreHolder").remove();
		$("#gameOver").remove();
	});
}
//lowest winning score starts at 90, highest losing score is a little below 90 depending on the percent of dashes there are left to total length of the word, which becomes a percent of 60, which coincides with what 6 wrong guesses would give you... each wrong guess on a winning game get 10 points subtracted from the score. time on the clock is added to a winners score. Using a hint will subtract 30 from your score whether you win or loose.
function scoreGen(winner){ //generates a score
	let hintScore = 0;
	let score = 0; //initialize score
	let dashCount = 0;
	if(hintCount===true){
		hintScore=30;
	}
	if(winner===true){
		score = gameTimer + 170 - (missedCount*10 + hintScore);
	}else{
		for(let i =0;i<dashStringArray.length;i++){
			if(dashStringArray[i]==="_"){
				dashCount++;
			}
		}
		score = 90 - (Math.floor((dashCount/dashStringArray.length)*60) + hintScore);
	}
	return score;
}

function scoreBoard(winner, finalScore) { //decides whether of not thier name goes on the score board
	$("<p id='highMessage'></p>").appendTo("#gameOver");
	console.log(finalScore);
	if(gameCount<=3){ //score board has top 3 contenders so you automatically go in if you're one of the first 3 players
		$("#gameOver").css({"height":"300px"});
		if(gameCount==1){ //if they're the first player to finish
			$("#highMessage").text("You're the first person to play, so by default, you have the high score. (and also the low score) Please enter your name!");
		}
		else{ //if they're not the first to finish, but still first 3
			if(finalScore>highScore[0].score){
				$("#highMessage").text("Congratulations! You have the new high score!!!! Please enter your name!");
			} else if(gameCount===2){
				$("#highMessage").text("You're the second person to play, so by default, you're in the top 3. (but last if you think about it) Please enter your name!");
			} else if(finalScore>highScore[1].score){
				$("#highMessage").text("You automatically get on the scoreboard because you're only the thrd to play but you got second place. Please enter your name!");
			} else {
				$("#highMessage").text("You're the third person to play, so by default, you're in the top 3, but you're also in last place... Please enter your name, anyway!");
			}
		}
		$('<input type="text" id="scoreHolder" maxlength="16" placeholder="enter name here:">').appendTo("#gameOver");
		return true;
	}
	else if(finalScore>highScore[2]){

	}
}

function grabName(newScore, scoreResult, winner){
	if(newScore===true){
		if(highScore.length===3){
			highScore.splice(2,1); //get rid of the third element
		}
		highScore.push({name: $("#scoreHolder").val(), score: scoreResult, win: winner});
		console.log($("#scoreHolder").val());
	}
	if(highScore.length>1){
		highScore=objectSort(highScore);
	}
	console.log(highScore);
}


function addTimeHTML(){
	if(timerCount===0){
	 	timeStamp = new Date();
	}
	timerCount++;
	newTime = new Date();
	gameTimer = 60-Math.floor((newTime-timeStamp)/1000)
	$("#timer").html(gameTimer);
	if(gameTimer===0){
		gameOver(false,true);
	}
}

function enableButtons(){
	console.log("enabling");
	$("#guess").click(function(){  //event listener for the guess button
		guesser($("#letterHolder").val()); //calls the guesser function and passes the value of the input box to the function 
		$("#letterHolder").val(""); //and clears the letter input box
	});
	$("#letterHolder").removeAttr("disabled");
	if(gameCount===0){
		$("#letterHolder").keypress(function (enterButton){ //does the same thing as as above but with the enter key while in the input box
			var key = enterButton.which; //
		    if(key === 13){
				guesser($("#letterHolder").val());
				$("#letterHolder").val("");
			}
		});
	}
	$("#hintButton").click(function(){
		$("#hint").html(hintArray[hangManArray.indexOf(newWord)]);
		hintCount=true;	
	})
	gameCount++;
}

function disableButtons(){
	console.log("disabling");
	$("#guess").off("click");
	$("#letterHolder").attr("disabled",true);
	$("#hintButton").off("click");
}

var sampleArray = [{name: "bill",score:10, win: false},{name: "jill",score:30, win: false},{name: "will",score:70, win: false},{name: "phill",score:90, win: false},{name: "gill",score:50, win: false}];

function objectSort(tbs){ //arg is an an array of objects to be sorted (t.b.s)
    var holder1 = {}; //will hold the objects to be switched
    var holder2 = {}; //other holder
    for(var i=0;i<tbs.length-1;i++){
        for(let j = 0; j<tbs.length-(i+1);j++){
        	console.log("tbsj "+tbs[j]+" tbsj+1 "+tbs[j+1]+" i "+i+" j "+j);
            if(tbs[j].score<tbs[j+1].score){
                holder1=tbs[j];
                holder2=tbs[j+1]
                tbs[j]=holder2;
                tbs[j+1]=holder1;
            }
        }
    }
    return tbs;
}



let newWord = randomWordGenerator(hangManArray); //generates the first word
console.log(newWord); 
newGameGenerator(newWord); //generates everything else and resets the variables
// enableButtons();

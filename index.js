var hangManArray = ["word", "something", "another", "great", "random", "butterfly", "kittycat"]; //words that the player will be guessing
var hintArray = ["the basic structure of a sentance","not nothing","better than good","no specific pattern","in the sky, I can fly twice as high", "cute, soft, and dangerous"]; //holds hints
var dashStringArray = []; //will hold letters or dashes
var usedLetterBank = []; //letters that have already been used
var missedCount; //how many letters the user missed

function randomWordGenerator(manArray){
	return manArray[Math.floor(Math.random()*manArray.length)]; //uses random to pick a word from the hangManArray
}

function newGameGenerator(aWord){
	let dashString=""; 
	dashStringArray = []; //initialize or re-initialize the game variables
	missedCount = 0;
	usedLetterBank = [];
	$("#used").html("None Yet!") //sets initial value of letters the player has already used.
	for(let i = 0; i<aWord.length;i++){
		dashString+="_ ";             //loops through the word to be guessed
		dashStringArray.push("_"); //creates a string of dashes for the word
	}
	$("#missed").html(missedCount); //appends the 0 missed letters to the webpage
	$("#wordHolder").html(dashString); //appends the initial dashes to the page
}

let newWord = randomWordGenerator(hangManArray); //generates the first word
console.log(newWord); 
newGameGenerator(newWord); //generates everything else and resets the variables


$("#guess").click(function(){  //event listener for the guess button
	guesser($("#letterHolder").val()); //calls the guesser function and passes the value of the input box to the function 
	$("#letterHolder").val(""); //and clears the letter input box
});

$("#letterHolder").keypress(function (e){ //does the same thing as as above but with the enter key while in the input box
	var key = e.which; //
    if(key == 13){
		guesser($("#letterHolder").val());
		$("#letterHolder").val("");
	}
});

function guesser(aLetter){ //the main portion of the programmer checks to see if the letter guessed 
	let newDashString = ""; //re-initializes the string that will be dispayed on the html page
	aLetter=aLetter.toLowerCase(); //converts the guess to lowercase
	if(usedLetterBank.indexOf(aLetter)!=-1){ //if the letter is already in the letter bank the index variable will not return -1
		window.alert(aLetter+" has already been used. Please enter a new letter.") //error message
	} else if(aLetter.length>1){ //makes sure they have entered only one letter
		window.alert("Please enter only one character.");
	} else if(/[a-z]/.test(aLetter)===false) { //uses regular expression to see if is in fact a letter
		if (aLetter==""||aLetter=" "){ // special case if they've entered nothing 
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
	if(missedCount===5){ //5 missed guesses and you loose!!!
		gameOver(false,false); 
	}
	if(dashStringArray.indexOf("_")===-1){ //if there are no more dashes in the array, then it means the word has been guessed
		gameOver(true,null);
	}
}
/*Starts a new game*/
function gameOver(winner, timeReason){ //first argument is for if the game was won or lost, second is for the reason why it was lost
	
	if(winner===true){
		console.log("winner winner chicken dinner.");
	}
	else{
		if(timeReason===true){
			console.log("you ran out of time.\nThe word was "+newWord);
		}
		else{
			console.log("you ran out of guesses.");
		}
	}
	newWord = randomWordGenerator(hangManArray); //re-initializes the word being guessed
	console.log(newWord); 
	newGameGenerator(newWord); //re-initializes all the other processes needed for a new game
}
// console.log(newGameGenerator(randomWordGenerator(hangManArray)));
var hangManArray = ["word", "something", "another", "great", "random", "butterfly", "kittycat"]; //words that the player will be guessing
var hintArray = ["the basic structure of a sentance","not nothing","better than good","no specific pattern","in the sky, I can fly twice as high", "cute, soft, and dangerous"]; //holds hints
var dashStringArray = []; //will hold letters or dashes
var usedWordBank = []; //letters that have already been used
var missedCount; //how many letters the user missed

function randomWordGenerator(manArray){
	return manArray[Math.floor(Math.random()*manArray.length)]; //uses random to pick a word from the hangManArray
}

function newGameGenerator(aWord){
	let dashString=""; 
	dashStringArray = []; //initialize or re-initialize the game variables
	missedCount = 0;
	usedWordBank = [];
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
	guesser($("#letterHolder").val()); 
	$("#letterHolder").val("");
});

$("#letterHolder").keypress(function (e){ //does the same thing as 
	var key = e.which;
    if(key == 13){
		guesser($("#letterHolder").val());
		$("#letterHolder").val("");
	}
});

function guesser(aLetter){
	let newDashString = "";
	aLetter=aLetter.toLowerCase();
	if(usedWordBank.indexOf(aLetter)!=-1){
		window.alert(aLetter+" has already been used. Please enter a new letter.")
	} else if(aLetter.length>1){
		window.alert("Please enter only one character.");
	} else if(/[a-z]/.test(aLetter)===false) {
		if (aLetter==""||aLetter=" "){
			aLetter="A blank entry"
		}
		window.alert(aLetter+" is not even a letter, how do you expect to win whilst typing tuch jibberish?!")
	} else {
		console.log("do stuff");
		let missedFlag = true;
		usedWordBank.push(aLetter);
		usedWordBank.sort();
		let usedLetters = "";
		for(let i = 0;i<usedWordBank.length;i++){
			usedLetters+=usedWordBank[i]+" ";
		}
		$("#used").html(usedLetters);
		for(let i=0;i<newWord.length; i++){
			if(aLetter==newWord[i]){
				dashStringArray[i]=aLetter;
				missedFlag=false;
			}
			newDashString +=dashStringArray[i]+" ";
		}
		$("#wordHolder").html(newDashString);
		if(missedFlag==true){
			missedCount++;
			$("#missed").html(missedCount);
		}	
	}
	if(missedCount===5){
		gameOver(false,false);
	}
	if(dashStringArray.indexOf("_")===-1){
		gameOver(true,null);
	}
}

function gameOver(winner, timeReason){
	
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
	newWord = randomWordGenerator(hangManArray);
	console.log(newWord);
	newGameGenerator(newWord);
}
// console.log(newGameGenerator(randomWordGenerator(hangManArray)));
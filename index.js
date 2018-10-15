var hangManArray = ["word", "something", "another", "great", "random", "butterfly", "kittycat"];

function randomWordGenerator(manArray){
	return manArray[Math.floor(Math.random()*manArray.length)];
}

function dashGenerator(aWord){
	let dashString="";
	for(let i = 0; i<aWord.length;i++){
		dashString+="_ ";
	}
	$("#wordHolder").html(dashString);
	return dashString;
}

var newWord = randomWordGenerator();
console.log(newWord);
dashGenerator(newWord);
var usedWordBank = [];

function guesser(aLetter){
	aLetter=aLetter.toLowerCase();
	if(usedWordBank.indexOf(aLetter)!=-1){
		console.log("your letter has already been entered");
	} else if(aLetter.length)
	for(let i=0;i<newWord.length; i++)
		if(aLetter==newWord[i]){

		}
		else{

		}
}
// console.log(dashGenerator(randomWordGenerator(hangManArray)));
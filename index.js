var hangManArray = ["word", "something", "another", "great", "random", "butterfly", "kittycat"];
var hintArray = [];
var dashStringArray = [];
var missedCount;

function randomWordGenerator(manArray){
	return manArray[Math.floor(Math.random()*manArray.length)];
}

function dashGenerator(aWord){
	let dashString="";
	for(let i = 0; i<aWord.length;i++){
		dashString+="_ ";
		dashStringArray.push("_");
	}
	missedCount = 0;
	$("#missed").html(missedCount);
	$("#used").html("None Yet!")
	$("#wordHolder").html(dashString);
	return dashString;
}

var newWord = randomWordGenerator(hangManArray);
console.log(newWord);
dashGenerator(newWord);
var usedWordBank = []; //letters that have already been used

$("#guess").click(function(){
	guesser($("#letterHolder").val());
	$("#letterHolder").val("");
});

$("#letterHolder").keypress(function (e){
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
	} else if(/[a-zA-Z]/.test(aLetter)===false) {
		if (aLetter==""){
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
}
// console.log(dashGenerator(randomWordGenerator(hangManArray)));
import { showAlert, showConfirm } from './modal.js';

//some global elements

//main word input
var word = document.getElementById('word');

//check for word btn
var submit = document.getElementById('submit');

//all words btn
var allWords = document.getElementById('all');

//clear all words btn 
var clearWords = document.getElementById("clear");

//last word and last char text
var lastWord = document.getElementById('lastword'),
	lastChar = document.getElementById("lastletter");

//edit button and input
var editBtn = document.getElementById("editbtn"),
    editTxt = document.getElementById("edittxt");

//initialize localstorage if not done already ----- firebase instead
if (!localStorage.words) {
    localStorage.setItem("words", "");
}

//initial focus for mobile to make it convenient
word.focus();

//els which when clicked on will focus to main input
let focusEls = document.querySelectorAll(".focus");

for(let i of focusEls) {
	i.addEventListener("click", function() {
		word.focus();
	});
}

//create a set which cannot have dupe values using stored localstorage data, and fix error with split by deleting empty string
let words = new Set(localStorage.words.replaceAll(/[^a-z ]/g, "").split(" "));
words.delete("");

// console.log(localStorage.words); //debug

// var hide = el => el.style.visibility = "hidden";
// var show = el => el.style.visibility = "visible";
// var isVis = el => el.style.visibility = "visible"? true : false; 


//function used to repeatedly update bottom texts and input box for edits
function updateLastWord(newWord) {
 	prevWord = Array.from(words).pop();
	prevChar = newWord.split("")[newWord.split("").length - 1];
	
	lastWord.innerText = `Last Word: ${newWord}`;
	lastChar.innerText = `Last Letter: ${ newWord != "" ? prevChar : "" }`;
	editTxt.value = localStorage.words.replaceAll(/[^a-z ]/g, "").split(" ").join(",")	
}

//globalize the last word user added, and letter for checks below
var prevWord, prevChar;

//gets last word by making a temporary array from the main set and "pop"ping the last el off
prevWord = Array.from(words).pop()

//initial update on load
updateLastWord(prevWord == undefined ? "" : prevWord);

submit.addEventListener("click", function() {
	//format word input for easy storage
	word.value = word.value.trim().toLowerCase().replaceAll(/[^a-z]/g, "");

	if (words.has(word.value + "ly") || words.has(word.value + "s") || words.has(word.value + "es") || words.has(word.value)) {

		showAlert({
			title: 'Already used',
			message: `"${word.value}" was already used.`,
			type: 'info',
		}).then(() => word.focus());

	} else if (!words.has(word.value) && word.value.toLowerCase().match(/[a-z]/g)) {


		//if localstorage is empty or new word first letter matches last word last letter, just add word
		if(localStorage.words == "" || word.value.split("").shift() == prevChar){
			//adding word to set
			words.add(word.value);
			//spread set into an array using iterator and joining with spaced format
			localStorage.setItem("words", [...words.values()].join(" "));
			
			//again updating texts and input box
			updateLastWord(word.value);

			/*temporarily show the word addition was successful 
	 		without making an alert the user has to manually exit, 
			making it easier for mobile users and when on the go*/
			word.placeholder = `${word.value} added`;
			window.setTimeout(() => { word.placeholder = "word" }, 1000)
			
		} else {
			showAlert({
				title: 'Wrong starting letter',
				message: `The last word was "${prevWord}". Your word needs to begin with "${prevChar}".`,
				type: 'error',
			}).then(() => word.focus());
		}
		
		

	}

	//reset input value
	word.value = "";
})

//show all words when clicked
allWords.addEventListener("click", function() {
	showAlert({
		title: 'All words',
		items: [...words.values()],
		type: 'list',
		buttonText: 'Done',
	});
})

//simulate clicking button when pressing return or enter, makes it easier for mobile
window.addEventListener("keydown", function(e) {
	if (e.key == "Enter" && !document.querySelector(".twg-modal-overlay.open")) submit.click();
})

//editing logic
editBtn.addEventListener("click", function() {

	//set localstorage value to formatted edit value then alert the user
	localStorage.setItem("words", editTxt.value.trim().toLowerCase().replaceAll(/[^a-z\,]/g, "").split(",").join(" "));
	showAlert({
		title: 'Saved',
		message: 'Words were successfully edited.',
		type: 'success',
	});

	//use globalized vars to reset main Set and update bottom text and edit value
	words = new Set(localStorage.words.replaceAll(/[^a-z ]/g, "").split(" "))
	prevWord = Array.from(words).pop()
	updateLastWord(prevWord == undefined ? "" : prevWord);
});

//clear word history button
clearWords.addEventListener("click", function() {
	const count = words.size;

	showConfirm({
		title: 'Clear all words?',
		message: `This will permanently delete all ${count} saved word${count === 1 ? '' : 's'}. This cannot be undone.`,
		confirmText: 'Clear words',
	}).then((confirmed) => {
		if (!confirmed) {
			word.focus();
			return;
		}

		localStorage.setItem("words", "");
		word.value = "";
		updateLastWord("");
		words = new Set();
		showAlert({
			title: 'Cleared',
			message: 'Words were successfully cleared.',
			type: 'success',
		});
	});
})




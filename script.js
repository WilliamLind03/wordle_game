"use strict";

var currentRow = 1;
var currentCharacter = 0;
var cell = document.getElementById('table').getElementsByTagName('td');
var correctWord = "";
var wordLength = 5;
var guessedWord = "";
var correctGuess = false;
var lang = "en";
var popupAnimationReady = true;
var wordlistToCheckFrom = possibleWords;
var diff;
var infoOpen = false;

var startDateTime = new Date(2022,1,23,23,59,59,0);
var startStamp = startDateTime.getTime();
var newDate = new Date();
var newStamp = newDate.getTime();
var timer;
var correctColor = "green";
var almostCorrectColor = "orange";

$(document).ready(function(){
    //localStorage.clear();
    $("#langSwitch").click(switchLanguage);
    $("#openInfo").click(openInfo);
    $("#closeInfo").click(closeInfo);
    $("#share").click(share);
    $("#copy").click(copy);
    $("#colors1").change(setCorrectColor);
    $("#colors2").change(setAlmostCorrectColor);
    $(document).keydown(keyDownHandler);
    $(document).keyup(keyUpHandler);
    updateClock();
    timer = setInterval(updateClock, 1000);
    if (localStorage.getItem("correctColor")) {
        correctColor = localStorage.getItem("correctColor");
    }
    if (localStorage.getItem("almostCorrectColor")) {
        almostCorrectColor = localStorage.getItem("almostCorrectColor");
    }
    console.log(localStorage);
});

function setCorrectColor() {
    correctColor = document.getElementById("colors1").value;
    localStorage.setItem("correctColor", correctColor);
    console.log(correctColor);
    $(".correct").css("backgroundColor", correctColor);
    $(".correct").css("border", correctColor);
}
function setAlmostCorrectColor() {
    almostCorrectColor = document.getElementById("colors2").value;
    localStorage.setItem("almostCorrectColor", almostCorrectColor);
    console.log(almostCorrectColor);
    $(".almostCorrect").css("backgroundColor", almostCorrectColor);
    $(".almostCorrect").css("border", almostCorrectColor);
}

function openInfo() {
    if (infoOpen == false) {
        $("#info").css("display", "block");
        infoOpen = true;
    } else {
        $("#info").css("display", "none");
        infoOpen = false;
    }
}
function closeInfo() {
    console.log("stäng");
    if (infoOpen == true) {
        $("#info").css("display", "none");
        infoOpen = false;
    }   
}

function updateClock() {
    newDate = new Date();
    newStamp = newDate.getTime();
    diff = Math.round((newStamp-startStamp)/1000);
    var timeLeft = 86400 - diff;
    
    var d = Math.floor(timeLeft/(24*60*60));
    timeLeft = timeLeft-(d*24*60*60);
    var h = Math.floor(timeLeft/(60*60));
    timeLeft = timeLeft-(h*60*60);
    var m = Math.floor(timeLeft/(60));
    timeLeft = timeLeft-(m*60);
    var s = timeLeft;
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    } else
    
    
    //document.getElementById("time-elapsed").innerHTML = d+" day(s), "+h+" hour(s), "+m+" minute(s), "+s+" second(s) working";
    $("#timeDisplayText").html(h + ":" + m + ":" + s);
    if ($("#langSwitch").val() == "en"){
        correctWord = correctWordList[Math.floor(diff/86400)];
    } else if ($("#langSwitch").val() == "sv") {
        correctWord = svOrdlista[Math.floor(diff/86400)];
    }
    if (diff % 86400 == 0) {
        clearBoard();
    }
}

function clearBoard() {
    for (var i = 0; i < 30; i++) {

        cell[i].classList.remove("correct");
        cell[i].classList.remove("almostCorrect");
        cell[i].style.background = "none";
        cell[i].style.border = "solid #333 2px";
        cell[i].innerHTML = "";
        console.log(cell[i].classList);
        // Reset game board
        $('td').css("backgroundColor", "");
        $('td').html("");
        $('td').css("border", "solid #333 2px");
        // Reset keyboard
        $('#keyboard button').css("backgroundColor", "#555");
        // Reset values
        currentRow = 1;
        currentCharacter = 0;
        correctGuess = false;
        
    }
}

function share() {
    // Closes the info window when sharing
    if (infoOpen == true) {
        $("#info").css("display", "none");
        infoOpen = false;
    }
    var shareContent = getResultString();
    // Shares string
    var text = shareContent;
    if (navigator.share) {
        console.log("share");
        navigator.share({text: text});
    } else { // Copies string if it cant share
        console.log("copy");
        var shareElement = document.createElement("textarea");
        document.body.appendChild(shareElement);
        shareElement.value = shareContent;
        shareElement.select();
        document.execCommand("copy");
        document.body.removeChild(shareElement);
        popup("Copied results to clipboard");
    }
}

function copy() {
    // Closes the info window when copying
    if (infoOpen == true) {
        $("#info").css("display", "none");
        infoOpen = false;
    }
    
    // Creates the string for copying
    var shareContent = getResultString();
    // Copies string
    var shareElement = document.createElement("textarea");
    document.body.appendChild(shareElement);
    shareElement.value = shareContent;
    shareElement.select();
    document.execCommand("copy");
    document.body.removeChild(shareElement);
    popup("Copied results to clipboard");
}

function getResultString() {
    // Check the language
    var whichWordle;
    if ($("#langSwitch").val() == "en"){
        whichWordle = "Wordle";
    } else {
        whichWordle = "Wördle";
    }
    var shareContent = "Williams " +  whichWordle + " " + Math.floor(diff/86400) + " " + (currentRow-1) + "/6 \n";
    var gs = "🟩"; // Green square emoji
    var os = "🟧"; // Orange square emoji
    var bs = "⬛"; // Black square emoji
    for (var i = 0; i < currentRow-1; i++) {
        for (var j = 0; j < wordLength; j++) {
            var square = cell[j + wordLength * i];
            if (square.classList.contains("correct")) {
                shareContent += gs;
            } else if (square.classList.contains("almostCorrect")) {
                shareContent += os;
            } else {
                shareContent += bs;
            }
        }
        shareContent += " \n"
    }
    return shareContent;
}


function switchLanguage() {
    // Reset game board
    $('td').css("backgroundColor", "");
    $('td').html("");
    $('td').css("border", "solid #333 2px");
    // Reset keyboard
    $('#keyboard button').css("backgroundColor", "#555");
    // Reset values
    currentRow = 1;
    currentCharacter = 0;
    correctGuess = false;
    
    if ($("#langSwitch").val() == "en") {
        $("#langSwitch").val("sv");
        $("#langSwitch").css("backgroundImage", "url(img/swedish.png)");
        document.getElementById("Å").style.display = "block";
        document.getElementById("Ä").style.display = "block";
        document.getElementById("Ö").style.display = "block";
        wordlistToCheckFrom = svOrdlista;
        correctWord = svOrdlista[Math.floor(diff/86400)];
        $("h1").html("Wördle");
        popup("Spelet är nu på svenska!");
        
    } else if($("#langSwitch").val() == "sv"){
        $("#langSwitch").val("en");
        $("#langSwitch").css("backgroundImage", "url(img/english.png)");
        document.getElementById("Å").style.display = "none";
        document.getElementById("Ä").style.display = "none";
        document.getElementById("Ö").style.display = "none";
        wordlistToCheckFrom = possibleWords;
        correctWord = correctWordList[Math.floor(diff/86400)];
        $("h1").html("Wordle");
        popup("The game is now in english!");
    }
    
    
}

function addCharacter(character) {
    if (currentCharacter < wordLength*currentRow && currentCharacter < 30 && !correctGuess) {
        console.log("added character!");
        cell[currentCharacter].innerHTML = character;
        cell[currentCharacter].style.border = "solid #777 2px";
        currentCharacter++;
    }
}

function deleteCharacter() {
    if (currentCharacter > wordLength*(currentRow -1)) {
        currentCharacter--;
        cell[currentCharacter].innerHTML = "";
        cell[currentCharacter].style.border = "solid #333 2px";
    }
}

function enterWord() {
    if (currentCharacter == wordLength * currentRow) {
        var correctCharacters = 0;
        guessedWord = "";
        for (var u = 0; u < wordLength; u++) {
            guessedWord += cell[u + wordLength * (currentRow-1)].innerHTML.toLowerCase();
        }
        //console.log(guessedWord);
        if (wordlistToCheckFrom.includes(guessedWord)) {
            var tempGuessed = guessedWord;
            var tempCorrect = correctWord;
            
            // White border and grey backgrounds
            for (var i = 0; i < wordLength; i++) {
                cell[i + wordLength * (currentRow-1)].style.border = "solid #333 2px";
                cell[i + wordLength * (currentRow-1)].style.backgroundColor = "#333";
                document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).style.backgroundColor = "#222";
            }
            // Checks for yellow squares
            for (var i = 0; i < wordLength; i++) {
                if (tempGuessed.indexOf(tempCorrect[i]) >= 0) {
                    // Change square background-color
                    //cell[tempGuessed.indexOf(tempCorrect[i]) + wordLength * (currentRow-1)].style.backgroundColor = almostCorrectColor;
                    cell[tempGuessed.indexOf(tempCorrect[i]) + wordLength * (currentRow-1)].classList.add("almostCorrect");
                    document.getElementById(cell[tempGuessed.indexOf(tempCorrect[i]) + wordLength * (currentRow-1)].innerHTML).classList.add("almostCorrect")
                    tempGuessed = setCharAt(tempGuessed,tempGuessed.indexOf(tempCorrect[i]),'_');
                    console.log(tempGuessed);
                    // Change keyboard color
                    
                    $(".almostCorrect").css("backgroundColor", almostCorrectColor);
                    $(".almostCorrect").css("border", almostCorrectColor);
                }
            }
            // Checks for green squares
            for (var i = 0; i < wordLength; i++) {
                console.log(guessedWord[i]);
                console.log(correctWord[i]);
                
                if(guessedWord[i] == correctWord[i]) {
                    correctCharacters++;
                    cell[i + wordLength * (currentRow-1)].classList.add("correct");
                    cell[i + wordLength * (currentRow-1)].classList.remove("almostCorrect");
                    console.log(guessedWord[i]);
                    console.log(correctWord[i]);

                    document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).classList.add("correct");
                    document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).classList.remove("almostCorrect");
                }
                $(".correct").css("backgroundColor", correctColor);
                $(".correct").css("border", correctColor);
                
                
                
            }
            
            currentRow++;
            
        } else {
            popup("Word is not in list");
        }
        
    } 
    
    else {
        popup("Word is too short");
    }
    
    if (correctCharacters == 5) {
        correctGuess = true;
        if ($("#langSwitch").val() == "en"){
            if(currentRow == 7) {
                popup("Close one!");
            } else if(currentRow == 6) {
                popup("Well done!");
            } else if(currentRow == 5) {
                popup("Good job!");
            } else if(currentRow == 4) {
                popup("Awesome!");
            } else if(currentRow == 3) {
                popup("Insane!");
            } else if(currentRow == 2) {
                popup("Impossible!");
            }
        } else {
            if(currentRow == 7) {
                popup("Nära ögat!");
            } else if(currentRow == 6) {
                popup("Bra gissat!");
            } else if(currentRow == 5) {
                popup("Bra jobbat!");
            } else if(currentRow == 4) {
                popup("Snyggt!");
            } else if(currentRow == 3) {
                popup("Enastående!");
            } else if(currentRow == 2) {
                popup("Omöjligt!");
            }
        }
        $("#share").css("display", "block");
        $("#copy").css("display", "block");
        setTimeout(function(){
            $("#info").css("display", "block");
            infoOpen = true;
        }, 1000);
    }
    if  (correctCharacters != 5 && currentRow == 7) {
        $("#share").css("display", "block");
        $("#copy").css("display", "block");
        $("h1").html(correctWord);
        popup(correctWord);
    }
}
function popup(popupStr) {
    if (popupAnimationReady) {
        popupAnimationReady = false;
        var element = document.getElementById("popup");
        element.innerHTML = popupStr;
        element.classList.add("activate");
        setTimeout(removeClass, 1000);
    }
}
function removeClass() {
    var element = document.getElementById("popup");
    element.classList.remove("activate");
    popupAnimationReady = true;
}

function setCharAt(str,index,chr) {
    return str.substring(0,index) + chr + str.substring(index+1);
}

function keyDownHandler(event){
    if (event.keyCode == Q){
        addCharacter("Q");
        console.log("Q");
    }
    if (event.keyCode == W){
        addCharacter("W");
    }
    if (event.keyCode == E){
        addCharacter("E");
    }
    if (event.keyCode == R){
        addCharacter("R");
    }
    if (event.keyCode == T){
        addCharacter("T");
    }
    if (event.keyCode == Y){
        addCharacter("Y");
    }
    if (event.keyCode == U){
        addCharacter("U");
    }
    if (event.keyCode == I){
        addCharacter("I");
    }
    if (event.keyCode == O){
        addCharacter("O");
    }
    if (event.keyCode == P){
        addCharacter("P");
    }
    if (event.keyCode == Å){
        addCharacter("Å");
    }
    if (event.keyCode == A){
        addCharacter("A");
    }
    if (event.keyCode == S){
        addCharacter("S");
    }
    if (event.keyCode == D){
        addCharacter("D");
    }
    if (event.keyCode == F){
        addCharacter("F");
    }
    if (event.keyCode == G){
        addCharacter("G");
    }
    if (event.keyCode == H){
        addCharacter("H");
    }
    if (event.keyCode == J){
        addCharacter("J");
    }
    if (event.keyCode == K){
        addCharacter("K");
    }
    if (event.keyCode == L){
        addCharacter("L");
    }
    if (event.keyCode == Ö){
        addCharacter("Ö");
    }
    if (event.keyCode == Ä){
        addCharacter("Ä");
    }
    if (event.keyCode == Z){
        addCharacter("Z");
    }
    if (event.keyCode == X){
        addCharacter("X");
    }
    if (event.keyCode == C){
        addCharacter("C");
    }
    if (event.keyCode == V){
        addCharacter("V");
    }
    if (event.keyCode == B){
        addCharacter("B");
    }
    if (event.keyCode == N){
        addCharacter("N");
    }
    if (event.keyCode == M){
        addCharacter("M");
    }
    
    if (event.keyCode == BACKSPACE){
        deleteCharacter();
    }
    
    if (event.keyCode == ENTER){
        console.log("enter");
        enterWord();
    }
}

function keyUpHandler(event){
}
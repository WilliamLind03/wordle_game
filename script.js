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
var timeDisplayed = false;

var startDateTime = new Date(2022,1,23,23,59,59,0);
var startStamp = startDateTime.getTime();
var newDate = new Date();
var newStamp = newDate.getTime();
var timer;

$(document).ready(function(){
    $("#langSwitch").click(switchLanguage);
    $("#time").click(openTimeDisplay);
    $("#closeTime").click(closeTimeDisplay);
    $("#share").click(share);
    updateClock();
    timer = setInterval(updateClock, 1000);
});

function openTimeDisplay() {
    if (timeDisplayed == false) {
        $("#timeDisplay").css("display", "block");
        timeDisplayed = true;
    } else {
        $("#timeDisplay").css("display", "none");
        timeDisplayed = false;
    }
}
function closeTimeDisplay() {
    console.log("stäng");
    if (timeDisplayed == true) {
        $("#timeDisplay").css("display", "none");
        timeDisplayed = false;
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
}

function share() {
    var shareContent = "Wordle " + Math.floor(diff/86400) + " " + (currentRow-1) + "/6 \n";
    var gs = "🟩"; // Green square emoji
    var os = "🟧"; // Orange square emoji
    var bs = "⬛"; // Black square emoji
    for (var i = 0; i < currentRow-1; i++) {
        for (var j = 0; j < wordLength; j++) {
            var square = cell[j + wordLength * i].style.backgroundColor;
            if (square == "green") {
                shareContent += gs;
            } else if (square == "orange") {
                shareContent += os;
            } else {
                shareContent += bs;
            }
        }
        shareContent += " \n"
    }
    console.log(shareContent);
    
    var shareElement = document.createElement("textarea");
    document.body.appendChild(shareElement);
    shareElement.value = shareContent;
    shareElement.select();
    document.execCommand("copy");
    document.body.removeChild(shareElement);
    
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
    if (currentCharacter+1 <= wordLength*currentRow && currentCharacter < 30 && !correctGuess) {
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
                    cell[tempGuessed.indexOf(tempCorrect[i]) + wordLength * (currentRow-1)].style.backgroundColor = "orange";
                    cell[tempGuessed.indexOf(tempCorrect[i]) + wordLength * (currentRow-1)].style.border = "solid orange 2px";
                    document.getElementById(cell[tempGuessed.indexOf(tempCorrect[i]) + wordLength * (currentRow-1)].innerHTML).style.backgroundColor = "orange";
                    tempGuessed = setCharAt(tempGuessed,tempGuessed.indexOf(tempCorrect[i]),'_');
                    console.log(tempGuessed);
                    // Change keyboard color
                    
                }
            }
            // Checks for green squares
            for (var i = 0; i < wordLength; i++) {
                console.log(guessedWord[i]);
                console.log(correctWord[i]);
                
                if(guessedWord[i] == correctWord[i]) {
                    correctCharacters++;
                    cell[i + wordLength * (currentRow-1)].style.backgroundColor = "green";
                    cell[i + wordLength * (currentRow-1)].style.border = "solid green 2px";
                    console.log(guessedWord[i]);
                    console.log(correctWord[i]);
                    document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).style.backgroundColor = "green";
                }
                
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
    }
    if  (correctCharacters != 5 && currentRow == 7) {
        if ($("#langSwitch").val() == "en"){
            $("h1").html(correctWord);
            popup(correctWord);
        } else {
            $("h1").html(correctWord);
            popup(correctWord);
        }
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
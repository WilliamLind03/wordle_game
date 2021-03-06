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
var enterReady = false;
var startDateTime = new Date(2022,1,23,23,59,59,0);
var startStamp = startDateTime.getTime();
var newDate = new Date();
var newStamp = newDate.getTime();
var timer;
var correctColor = "green";
var almostCorrectColor = "orange";
var revealInterval;
var revealWordInterval;
var cellIndex = 0;
var correctCharacters = 0;
var guessCompared = [];
var svBoardData = [];
var enBoardData = [];
var thisCharacter;
var firstTime;

var timesPlayed = 0;
var currentStreak = 0;
var maxStreak = 0;
var winrate = 0;
var timesWon = 0;

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
    updateClock();
    timer = setInterval(updateClock, 1000);
    
    if (localStorage.getItem("timesPlayed")) {
        timesPlayed = localStorage.getItem("timesPlayed");
        currentStreak = localStorage.getItem("currentStreak");
        maxStreak = localStorage.getItem("maxStreak");
        timesWon = localStorage.getItem("timesWon");
    }
    if (localStorage.getItem("winrate")) {
        winrate = localStorage.getItem("winrate");
    }
    
    // Refreshes first time user opens website
    if (!localStorage.getItem("day") || localStorage.getItem("day") < Math.floor(diff/86400)){
        
        
        localStorage.clear();

    }
    localStorage.setItem("correctColor", correctColor);
    localStorage.setItem("almostCorrectColor", almostCorrectColor);
    localStorage.setItem("timesPlayed", timesPlayed);
    localStorage.setItem("winrate", winrate);
    localStorage.setItem("currentStreak", currentStreak);
    localStorage.setItem("maxStreak", maxStreak);
    localStorage.setItem("timesWon", timesWon);
    localStorage.setItem("day", Math.floor(diff/86400));
    
    if (localStorage.getItem("correctGuessEn") && $("#langSwitch").val() == "en") {
        correctGuess = localStorage.getItem("correctGuessEn");
    }
    if (localStorage.getItem("correctGuessSv" && $("#langSwitch").val() == "sv")) {
        correctGuess = localStorage.getItem("correctGuessSv");
    }
    if (correctGuess) {
        $("#share").css("display", "block");
        $("#copy").css("display", "block");
    }
    if ($("#langSwitch").val() == "en" && localStorage.getItem("enCurrentRow", currentRow)) {
        if(localStorage.getItem("enCurrentRow") == 7) {
            $("#share").css("display", "block");
            $("#copy").css("display", "block");
        }
    } else if ($("#langSwitch").val() == "sv" && localStorage.getItem("svCurrentRow", currentRow)){
        if(localStorage.getItem("svCurrentRow") == 7) {
            $("#share").css("display", "block");
            $("#copy").css("display", "block");
        }
    }
    
    if (localStorage.getItem("correctColor")) {
        correctColor = localStorage.getItem("correctColor");
    }
    if (localStorage.getItem("almostCorrectColor")) {
        almostCorrectColor = localStorage.getItem("almostCorrectColor");
    }
    if (localStorage.getItem("language")) {
        $("#langSwitch").val(localStorage.getItem("language"));
        setLanguage();
    }
    
    if (localStorage.getItem("enCurrentRow") && $("#langSwitch").val() == "en") {
        currentRow = localStorage.getItem("enCurrentRow");
        currentCharacter = wordLength * (currentRow-1);
    } else if (localStorage.getItem("svCurrentRow") && $("#langSwitch").val() == "sv") {
        currentRow = localStorage.getItem("svCurrentRow");
        currentCharacter = wordLength * (currentRow-1);
    }
    
    for (var i = 29; i >= 0; i--) {
        
        if ($("#langSwitch").val() == "sv") {
            if(localStorage.getItem("cellInfoSv" + i)) {
                cell[i].classList.add(localStorage.getItem("cellInfoSv" + i));
            }
            if(localStorage.getItem("cellCharSv" + i)) {
                cell[i].innerHTML = localStorage.getItem("cellCharSv" + i);
                document.getElementById(cell[i].innerHTML).classList.add(localStorage.getItem("cellInfoSv" + i));
                
                if (document.getElementById(cell[i].innerHTML).classList.contains("almostCorrect") && document.getElementById(cell[i].innerHTML).classList.contains("correct")) {
                    document.getElementById(cell[i].innerHTML).classList.remove("almostCorrect");
                }
            }
        }
        if ($("#langSwitch").val() == "en") {
            if(localStorage.getItem("cellInfoEn" + i)) {
                cell[i].classList.add(localStorage.getItem("cellInfoEn" + i));
            }
            if(localStorage.getItem("cellCharEn" + i)) {
                cell[i].innerHTML = localStorage.getItem("cellCharEn" + i);
                document.getElementById(cell[i].innerHTML).classList.add(localStorage.getItem("cellInfoEn" + i));
                
                if (document.getElementById(cell[i].innerHTML).classList.contains("almostCorrect") && document.getElementById(cell[i].innerHTML).classList.contains("correct")) {
                    document.getElementById(cell[i].innerHTML).classList.remove("almostCorrect");
                }
            }
        }
    }
    $(".correct").css("backgroundColor", correctColor);
    $(".correct").css("border", "solid " + correctColor + " 2px");
    $(".almostCorrect").css("backgroundColor", almostCorrectColor);
    $(".almostCorrect").css("border", "solid " + almostCorrectColor + " 2px");
    $(".wrong").css("backgroundColor", "#333");
    $(".wrong").css("border", "solid #333 2px");
    revealInterval = setInterval(reveal, 30);
    setStats();
});

function setStats() {
    if (localStorage.getItem("timesPlayed")) {
        $("#timesPlayed").html(timesPlayed);
    }
    if (localStorage.getItem("winrate")) {
        $("#winrate").html(winrate);
    }
    if (localStorage.getItem("currentStreak")) {
        $("#winStreak").html(currentStreak);
    }
    if (localStorage.getItem("maxStreak")) {
        $("#bestStreak").html(maxStreak);
    }
    
}


var bla = 0;
function reveal() {
    cell[bla].classList.add("revealAnim");
    bla++;
    if (bla >= 30) {
        clearInterval(revealInterval)
        setTimeout(function () {
            for (var i = 0; i < 30; i++) {
                cell[i].classList.remove("revealAnim");
            } 
            enterReady = true;
        }, 1000);
        
    }
      
    
}

function setCorrectColor() {
    correctColor = document.getElementById("colors1").value;
    localStorage.setItem("correctColor", correctColor);
    $(".correct").css("backgroundColor", correctColor);
    $(".correct").css("border", "solid " + correctColor + " 2px");
}

function setAlmostCorrectColor() {
    almostCorrectColor = document.getElementById("colors2").value;
    localStorage.setItem("almostCorrectColor", almostCorrectColor);
    $(".almostCorrect").css("backgroundColor", almostCorrectColor);
    $(".almostCorrect").css("border", "solid " + almostCorrectColor + " 2px");
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
        timesPlayed = localStorage.getItem("timesPlayed");
        currentStreak = localStorage.getItem("winrate");
        maxStreak = localStorage.getItem("currentStreak");
        winrate = localStorage.getItem("maxStreak");
        timesWon = localStorage.getItem("timesWon");
        localStorage.clear();
        localStorage.setItem("correctColor", correctColor);
        localStorage.setItem("almostCorrectColor", almostCorrectColor);
        timesPlayed = localStorage.setItem("timesPlayed", timesPlayed);
        currentStreak = localStorage.setItem("winrate", winrate);
        maxStreak = localStorage.setItem("currentStreak", currentStreak);
        winrate = localStorage.setItem("maxStreak", maxStreak);
        timesWon = localStorage.setItem("timesWon", timesWon);
        localStorage.setItem("correctColor", correctColor);
        localStorage.setItem("almostCorrectColor", almostCorrectColor);
        setStats();
    }
}

function clearBoard() {
    for (var i = 0; i < 30; i++) {

        cell[i].classList.remove("correct");
        cell[i].classList.remove("almostCorrect");
        cell[i].style.background = "none";
        cell[i].style.border = "solid #333 2px";
        cell[i].innerHTML = "";
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
        navigator.share({text: text});
    } else { // Copies string if it cant share
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

function reset() {
    // Reset game board
    $('#table td').css("backgroundColor", "");
    $('#table td').html("");
    $('#table td').css("border", "solid #333 2px");
    // Reset keyboard
    $('#keyboard button').css("backgroundColor", "#555");
    // Reset values
    currentRow = 1;
    currentCharacter = 0;
    cellIndex = 0;
    enterReady = true;
    for (var i = 0; i < 30; i++) {
        cell[i].classList.remove("correct");
        cell[i].classList.remove("almostCorrect");
        cell[i].classList.remove("wrong");
    }
    var key = document.getElementById("keyboard").getElementsByTagName("button");
    for (var i = 0; i < 31; i++) {
        key[i].classList.remove("correct");
        key[i].classList.remove("almostCorrect");
        key[i].classList.remove("wrong");
        key[i].style.border = "none";
    }
}

function getResultString() {
    // Check the language
    var whichWordle;
    if ($("#langSwitch").val() == "en"){
        whichWordle = "Wordle";
    } else {
        whichWordle = "W??rdel";
    }
    var shareContent = "Williams " +  whichWordle + " " + Math.floor(diff/86400) + " " + (currentRow-1) + "/6 \n";
    var gs = "????"; // Green square emoji
    var os = "????"; // Orange square emoji
    var bs = "???"; // Black square emoji
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

function setLanguage() {
    
    if ($("#langSwitch").val() == "en") {
        if (localStorage.getItem("enCurrentRow") && $("#langSwitch").val() == "en") {
            currentRow = localStorage.getItem("enCurrentRow");
            currentCharacter = wordLength * (currentRow-1);
        }
        $("#langSwitch").css("backgroundImage", "url(img/english.png)");
        document.getElementById("??").style.display = "none";
        document.getElementById("??").style.display = "none";
        document.getElementById("??").style.display = "none";
        wordlistToCheckFrom = possibleWords;
        correctWord = correctWordList[Math.floor(diff/86400)];
        $("h1").html("Wordle");
    } else if($("#langSwitch").val() == "sv") {
        if (localStorage.getItem("svCurrentRow") && $("#langSwitch").val() == "sv") {
            currentRow = localStorage.getItem("svCurrentRow");
            currentCharacter = wordLength * (currentRow-1);
        }
        $("#langSwitch").css("backgroundImage", "url(img/swedish.png)");
        document.getElementById("??").style.display = "block";
        document.getElementById("??").style.display = "block";
        document.getElementById("??").style.display = "block";
        wordlistToCheckFrom = svOrdlista;
        correctWord = svOrdlista[Math.floor(diff/86400)];
        $("h1").html("W??rdel");
    }
    
}

function switchLanguage() {
    if (enterReady) {
        reset();
        
        

        if ($("#langSwitch").val() == "en") {
            if (localStorage.getItem("svCurrentRow")) {
                currentRow = localStorage.getItem("svCurrentRow");
                currentCharacter = wordLength * (currentRow-1);
            }
            $("#langSwitch").val("sv");
            $("#langSwitch").css("backgroundImage", "url(img/swedish.png)");
            document.getElementById("??").style.display = "block";
            document.getElementById("??").style.display = "block";
            document.getElementById("??").style.display = "block";
            wordlistToCheckFrom = svOrdlista;
            correctWord = svOrdlista[Math.floor(diff/86400)];
            $("h1").html("W??rdel");
            popup("Spelet ??r nu p?? svenska!");

        } else if($("#langSwitch").val() == "sv"){
            if (localStorage.getItem("enCurrentRow")) {
                currentRow = localStorage.getItem("enCurrentRow");
                currentCharacter = wordLength * (currentRow-1);
            }
            $("#langSwitch").val("en");
            $("#langSwitch").css("backgroundImage", "url(img/english.png)");
            document.getElementById("??").style.display = "none";
            document.getElementById("??").style.display = "none";
            document.getElementById("??").style.display = "none";
            wordlistToCheckFrom = possibleWords;
            correctWord = correctWordList[Math.floor(diff/86400)];
            $("h1").html("Wordle");
            popup("The game is now in english!");
        }
        
        for (var i = 0; i < 30; i++) {
            if (cell[i].classList.contains("correct")) {
                cell[i].classList.remove("correct");
            }
            else if (cell[i].classList.contains("almostCorrect")) {
                cell[i].classList.remove("almostCorrect");
            }
            else if (cell[i].classList.contains("wrong")) {
                cell[i].classList.remove("wrong");
            }
            
            if ($("#langSwitch").val() == "en") {
                if(localStorage.getItem("cellInfoEn" + i)) {
                    cell[i].classList.add(localStorage.getItem("cellInfoEn" + i));
                }
                if(localStorage.getItem("cellCharEn" + i)) {
                    cell[i].innerHTML = localStorage.getItem("cellCharEn" + i);
                    document.getElementById(cell[i].innerHTML).classList.add(localStorage.getItem("cellInfoEn" + i));
                    
                    if (document.getElementById(cell[i].innerHTML).classList.contains("almostCorrect") && document.getElementById(cell[i].innerHTML).classList.contains("correct")) {
                        document.getElementById(cell[i].innerHTML).classList.remove("almostCorrect");
                    }
                }
            }
            if ($("#langSwitch").val() == "sv") {
                if(localStorage.getItem("cellInfoSv" + i)) {
                    cell[i].classList.add(localStorage.getItem("cellInfoSv" + i));
                }
                if(localStorage.getItem("cellCharSv" + i)) {
                    cell[i].innerHTML = localStorage.getItem("cellCharSv" + i);
                    document.getElementById(cell[i].innerHTML).classList.add(localStorage.getItem("cellInfoSv" + i));
                    
                    if (document.getElementById(cell[i].innerHTML).classList.contains("almostCorrect") && document.getElementById(cell[i].innerHTML).classList.contains("correct")) {
                        document.getElementById(cell[i].innerHTML).classList.remove("almostCorrect");
                    }
                }
            }
        }
        $(".correct").css("background", correctColor);
        $(".correct").css("border", "solid " + correctColor + " 2px");
        $(".almostCorrect").css("background", almostCorrectColor);
        $(".almostCorrect").css("border", "solid " + almostCorrectColor + " 2px");
        $(".wrong").css("background", "#333");
        $(".wrong").css("border", "solid #333 2px");
        
        if (localStorage.getItem("correctGuessEn") && $("#langSwitch").val() == "en") {
            correctGuess = localStorage.getItem("correctGuessEn");
            
        }
        else if (localStorage.getItem("correctGuessSv") && $("#langSwitch").val() == "sv") {
            correctGuess = localStorage.getItem("correctGuessSv");
        } else {
            correctGuess = false;
        }
        if (correctGuess) {
            $("#share").css("display", "block");
            $("#copy").css("display", "block");
        } else {
            $("#share").css("display", "none");
            $("#copy").css("display", "none");
        }
        localStorage.setItem("language", $("#langSwitch").val())
    }
}

function addCharacter(character) {
    if (currentCharacter < wordLength*currentRow && currentCharacter < 30 && !correctGuess) {
        cell[currentCharacter].innerHTML = character;
        cell[currentCharacter].style.border = "solid #777 2px";
        currentCharacter++;
    }
}

function deleteCharacter() {
    if (currentCharacter > wordLength*(currentRow -1) && enterReady) {
        currentCharacter--;
        cell[currentCharacter].innerHTML = "";
        cell[currentCharacter].style.border = "solid #333 2px";
    }
}

function convertToLowerCase(word) {
    for (var u = 0; u < wordLength; u++) {
        word += cell[u + wordLength * (currentRow-1)].innerHTML.toLowerCase();
    }
    return word;
}

function goThroughWord(i) {
    
    // Checks if Character is correct
    if(guessCompared[i] == "correct") {
        correctCharacters++;
        cell[i + wordLength * (currentRow-1)].classList.add("correct");
        document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).classList.add("correct");
        $(".correct").css("backgroundColor", correctColor);
        $(".correct").css("border", "solid " + correctColor + " 2px");
        
    } 
    // Checks if Character is almost correct
    else if (guessCompared[i] == "almostCorrect") {
        cell[i + wordLength * (currentRow-1)].classList.add("almostCorrect");
        if (!document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).classList.contains("correct")) {
            document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).classList.add("almostCorrect");
        }
        $(".almostCorrect").css("backgroundColor", almostCorrectColor);
        $(".almostCorrect").css("border", "solid " + almostCorrectColor + " 2px");
    } 
    // Checks if Character is wrong
    else if (guessCompared[i] == "wrong") {
        cell[i + wordLength * (currentRow-1)].classList.add("wrong");
        if (document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).classList == 0) {
            document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).classList.add("wrong");
        }
        
        $(".wrong").css("backgroundColor", "#333");
        $(".wrong").css("border", "solid #333 2px");
    }
    
    if (i >= 4) {
        setTimeout(function () {
            currentRow++;
            if ($("#langSwitch").val() == "en") {
                localStorage.setItem("enCurrentRow", currentRow)
            } else {
                
                localStorage.setItem("svCurrentRow", currentRow)
            }
            clearInterval(revealWordInterval);
            for (var i = 0; i < 30; i++) {
                if ($("#langSwitch").val() == "en") {
                    if (cell[i].classList.contains("correct")){
                        localStorage.setItem("cellInfoEn" + i, "correct");
                    }
                    else if (cell[i].classList.contains("almostCorrect")){
                        localStorage.setItem("cellInfoEn" + i, "almostCorrect");
                    }
                    else if (cell[i].classList.contains("wrong")) {
                        localStorage.setItem("cellInfoEn" + i, "wrong");
                    }
                    localStorage.setItem("cellCharEn" + i, cell[i].innerHTML);
                }
                if ($("#langSwitch").val() == "sv") {
                    if (cell[i].classList.contains("correct")){
                        localStorage.setItem("cellInfoSv" + i, "correct");
                    }
                    else if (cell[i].classList.contains("almostCorrect")){
                        localStorage.setItem("cellInfoSv" + i, "almostCorrect");
                    }
                    else if (cell[i].classList.contains("wrong")) {
                        localStorage.setItem("cellInfoSv" + i, "wrong");
                    }
                    localStorage.setItem("cellCharSv" + i, cell[i].innerHTML);
                }
                
                
            }
            enterReady = true;
            checkResult(correctCharacters);
            for (var i = 0; i < 30; i++) {
                if (cell[i].classList.contains("revealAnim")) {
                    cell[i].classList.remove("revealAnim");
                }
            }
        }, 400);
    }
}

function revealAnimationDelay(i){
    
    if (i < 5) {
        cellIndex++;
        cell[i + wordLength * (currentRow-1)].classList.add("revealAnim");
        setTimeout(function () {
            goThroughWord(i);
        }, 400);
    }
}

function enterWord() {
    if (currentCharacter == wordLength * currentRow && enterReady) {
        correctCharacters = 0;
        
        guessedWord = "";
        guessedWord = convertToLowerCase(guessedWord);
        cellIndex = 0;
        if (wordlistToCheckFrom.includes(guessedWord)) {
            compareWords();
            enterReady = false;
            revealAnimationDelay(cellIndex)
            revealWordInterval = setInterval(function () {
                revealAnimationDelay(cellIndex);
            }, 300);
            
        } else {
            popup("Word is not in list");
        }
    } 
    else {
        popup("Word is too short");
    }
    
}

function compareWords() {
    guessCompared = ["wrong", "wrong", "wrong", "wrong", "wrong"];

    for (var i = 0; i < 5; i++) {
        if(guessedWord[i] == correctWord[i]) {
            guessCompared[i] = "correct";
        } 
        else if (guessedWord.indexOf(correctWord[i]) >= 0) {
            guessCompared[guessedWord.indexOf(correctWord[i])] = "almostCorrect";
        }
    }
}

function checkResult(correctCharacters) {
    if (correctCharacters == 5) {
        correctGuess = true;
        if ($("#langSwitch").val() == "en") {
            localStorage.setItem("correctGuessEn", correctGuess)
        } else if ($("#langSwitch").val() == "sv") {
            localStorage.setItem("correctGuessSv", correctGuess)
        }
        
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
                popup("N??ra ??gat!");
            } else if(currentRow == 6) {
                popup("Bra gissat!");
            } else if(currentRow == 5) {
                popup("Bra jobbat!");
            } else if(currentRow == 4) {
                popup("Snyggt!");
            } else if(currentRow == 3) {
                popup("Enast??ende!");
            } else if(currentRow == 2) {
                popup("Om??jligt!");
            }
        }
        timesPlayed++;
        timesWon++;
        currentStreak++;
        localStorage.setItem("timesPlayed", timesPlayed);
        localStorage.setItem("currentStreak", currentStreak);
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
            localStorage.setItem("maxStreak", maxStreak);
        }
        if(timesPlayed > 0) {
            winrate = timesWon/timesPlayed*100;
            localStorage.setItem("winrate", winrate);
        }
        
        $("#share").css("display", "block");
        $("#copy").css("display", "block");
        setTimeout(function(){
            $("#info").css("display", "block");
            infoOpen = true;
        }, 1000);
        setStats();
    }
    if  (correctCharacters != 5 && currentRow == 7) {
        $("#share").css("display", "block");
        $("#copy").css("display", "block");
        $("h1").html(correctWord);
        popup(correctWord);
        timesPlayed++;
        currentStreak = 0;
        if(timesPlayed > 0) {
            winrate = timesWon/timesPlayed*100;
            localStorage.setItem("winrate", winrate);
        }
        localStorage.setItem("currentStreak", currentStreak);
        setTimeout(function(){
            $("#info").css("display", "block");
            infoOpen = true;
        }, 1000);
        setStats();
    }
    correctCharacters = 0;
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
    if (event.keyCode == ??){
        addCharacter("??");
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
    if (event.keyCode == ??){
        addCharacter("??");
    }
    if (event.keyCode == ??){
        addCharacter("??");
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

        enterWord();
    }
}

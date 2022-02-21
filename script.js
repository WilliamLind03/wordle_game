"use strict";

var currentRow = 1;
var currentCharacter = 0;
var cell = document.getElementById('table').getElementsByTagName('td');
var correctWord = "";
var wordLength = 5;
var correctGuess = false;
var wordList = 
    ["HAPPY", "PAINT", "GRIND", "HORSE", "FLANK", "IDEAL", "RULED", "GIVEN", "FUNGI", "NORTH", "SOUTH", "BRAND", "BREAK", "SHAKE", "SNAKE", "FLAKE", "HEART", "MUMMY", "MOMEY", "SHARE", "WRATH", "SAINT", "STEAL", "PINCH", "COAST", "BEACH", "THREW", "SLOPE", "TROLL", "POKER", "LASER", "SCARF", "EQUAL", "NERVE", "SHUCK", "TRAIN", "TRIED", "FLIRT", "SHINY", "SMELT", "CHEIF", "HIGHT", "WIDTH", "SPADE", "STUMP", "TENSE", "SMACK", "PLASM", "LODGE", "QUICK", "BIRCH", "PANIC", "DRILL", "YOUTH", "FLOWN", "BEIGE", "AIMED", "SKILL", "PASTA", "SPOUT", "SPARE", "BLUSH", "SHARP", "FEAST", "BLIND", "WIERD", "BLOCK", "ELDER", "SPEAR", "SMALL", "NORSE", "SWEAT", "BUILT", "CLAMP", "SENSE", "WOMAN", "FIBRE", "BRAWL", "THICK", "GIRTH", "TRAIL", "HEDGE", "CHART", "SWARM", "FUNNY", "ELITE", "HOUSE", "WHEEL", "ANVIL", "FORGE", "ERASE", "FLEAK", "EMPTY", "YACHT", "FLOUR", "SLUNK", "BOUND", "STOOD", "SOUND", "PLANK", "VAULT", "ANGEL", "ANGLE", "LEARN", "STEAM", "GAMES", "FRAME", "HEAVE", "STUNT", "STAND", "WORLD", "PLACE", "BRACE", "GRACE", "FRASE", "BLAST", "SURGE", "FRUIT", "SCARE", "DITCH", "VAPOR", "CROWD", "BIOME", "SWORN", "SWORD", "SAINT", "STUNG", "LABOR", "NINTH", "WEDGE", "JOINT", "LIMIT", "SCARY", "BOOZE", "CHARM", "PURSE", "BREED", "FLUFF", "SQUID", "PLANT", "AGREE", "PLASH", "ASIAN", "BRANT", "ABOUT", "PURGE", "SHORE", "ANODE", "GODLY", "DEVIL", "WHILE", "SHOUT", "STAKE", "RAVEN", "FROST", "GREEK", "CHEEK", "CRAFT", "RATIO", "CHASE", "SKULL", "TOKEN", "FOUND", "FLASK", "BLEND", "DRESS", "RODEO", "TAPER", "DEALT", "TORSO", "RAPID", "MEDIC", "LEAKY", "AFTER", "PAINS", "BUDGE", "COVER", "ABORT", "DIRTY", "GROUP", "FORCE", "TRACK", "FINED", "TUTOR", "KNIFE", "HEAVY", "COACH", "MOURN", "RIFLE", "DARED", "SLAVE", "XYLOL", "THREW", "DATES", "TEACH", "CRIME", "READY", "ALARM", "CROWN", "KILOS", "LIVES", "TOUCH", "SHELF", "NUDGE", "GRAIN", "SCALE", "ASIDE", "OFFER", "CANDY", "JEWEL", "GLOBE", "GRANT", "MINOR", "ADULT", "PAGED", "OBESE", "UNARM", "TRUTH", "LIGHT", "GAMMA", "BIRCH", "BASED", "FLUSH", "CLEAN", "BLOWN"]

$(document).ready(function(){
    correctWord = wordList[Math.floor(Math.random() * (wordList.length-1))];
    console.log(correctWord);
});

function addCharacter(character) {
    if (currentCharacter+1 <= wordLength*currentRow && currentCharacter < 30 && !correctGuess) {
        cell[currentCharacter].innerHTML = character;
        currentCharacter++;
    }
}

function deleteCharacter() {
    if (currentCharacter > wordLength*(currentRow -1)) {
        currentCharacter--;
        cell[currentCharacter].innerHTML = "";
    }
}

function enterWord() {
    if (currentCharacter == wordLength*currentRow) {
        var correctCharacters = 0;
        for (var i = 0; i < wordLength; i++) {
            document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).style.backgroundColor = "#222";
            for (var j = 0; j < wordLength; j++) {
                if (cell[i + wordLength * (currentRow-1)].innerHTML == correctWord.charAt(j)) {
                    document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).style.backgroundColor = "orange";
                    cell[i + wordLength * (currentRow-1)].style.backgroundColor = "orange";
                }
            }
            cell[i + wordLength * (currentRow-1)].style.border = " 2px solid #fff";
            if (cell[i + wordLength * (currentRow-1)].innerHTML == correctWord.charAt(i)) {
                document.getElementById(cell[i + wordLength * (currentRow-1)].innerHTML).style.backgroundColor = "green";
                cell[i + wordLength * (currentRow-1)].style.backgroundColor = "green";
                correctCharacters++;
            }
        }
        
        currentRow++;
    } else {
        alert("word is too short");
    }
    if (correctCharacters == 5) {
        correctGuess = true;
        $("h1").html("Good job!");
    }
}
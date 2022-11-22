var buttonColors = ["red", "blue", "green", "yellow"];

var userClickedPattern = [];

var gameSequence = [];

var gameInGameProgress = false; //is the game running?

var playerLevel = 1;

buttonColors.forEach((value) => {  // add click listener to each button
    $(`.${value}`).on("click",
        function () {
            handleClickFunction(value) //pass the color
        }
    );
});

$("h1").on("click", startGame);

$(document).on("keyup", startGame);

function startGame(){  //start game if it hasn't been started already.
    if (!gameInGameProgress){
        gameInGameProgress = true;
        setPlayerLevel(); //display level
        setTimeout( function (){  //initiate the game;
            addToSequence();
        }, 500); 
    }
}

function handleClickFunction(value){
if (!gameInGameProgress) return; //deactive buttons while game is not is progress.

    userClickedPattern.push(value); 
    var correctChoice = correctClick(value);
    handleClickSound(value, correctChoice);
    handleButtonClickAnimation(value);

    
    if (correctChoice){
        if (userClickedPattern.length == gameSequence.length) { //check for completed sequence.
            userClickedPattern = []; //reset user pattern.
            setTimeout( function (){  //bring in the next selection to the sequence
                addToSequence();
            }, 500);
            playerLevel++;
            setPlayerLevel();
        }
    } 

    else {        
        gameOver();
    }

}

function setPlayerLevel(){
    setTimeout( function (){  //delay display
        $("h1").text(`Level ${playerLevel}`);
    }, 250);   
}

function correctClick(value){
    console.log("value of click: " + value);
    console.log("memory " + gameSequence[userClickedPattern.length-1]);
    return (value == gameSequence[userClickedPattern.length-1]);
}

function handleButtonClickAnimation(value){ //

    $(`.${value}`).addClass("pressed");

    setTimeout( function (){ //animate button press
        $(`.${value}`).removeClass("pressed");
    }, 100);

}

function handleClickSound(value, correctChoice){

    if (!correctChoice){
        var wrongChoiceSound = new Audio(`sounds/wrong.mp3`);
        wrongChoiceSound.play();
        return;
    }
    var clickAudio = new Audio(`sounds/${value}.mp3`);
    clickAudio.play();

}

function gameOver(){ //handle game over scenario

    gameSequence = []; //empty the arrays.
    userClickedPattern = [];

    playerLevel = 1; //reset player level

    $("h1").text("Game Over. Click here or press any key to restart.");

    gameInGameProgress = false;

}

function nextSequence(){ //random number to choose next color
    var randNum = Math.floor(Math.random()*4);
    return randNum;
}



function getRandomColor(){
    var randomColor = buttonColors[nextSequence()];
    $(`.${randomColor}`).css({visibility: "hidden"});
    var audio = new Audio(`sounds/${randomColor}.mp3`);
    audio.play();
    setTimeout( function (){ //animate sequence addiition.
                $(`.${randomColor}`).css({visibility: "visible"});
            }, 200);

    return randomColor;
}

function addToSequence(){
    gameSequence.push(getRandomColor());
}



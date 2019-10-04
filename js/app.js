(function(){
    "use strict";
/*
 * Create a list that holds all of your cards
 */
const cards = document.querySelectorAll(".card");
let openedCards = [];  // will contain any opened cards
let icons = [];
let numberOfMoves = 0;
let numberOfStars = 3;
let seconds = 0;
let minutes = 0;
let timerHandler;


// initialize game is for things that only
// need to be done once, not repeated.
function initializeGame() {
    cards.forEach(card => {
        // add event listener to each card
        card.addEventListener("click", cardClicked);

        // collect all available icon names
        let child = card.children[0];
        //console.log(child.className);
        icons.push(child.className);
    
    }); 

    document.querySelector("#btn-play-again").addEventListener("click", startGame);
    document.querySelector("#btn-cancel").addEventListener("click", closeDialog);
    document.querySelector(".restart").addEventListener("click", startGame);

}


// flipping cards down can be called multiple times

function flipAllCardsDown() {

    cards.forEach(card => {
        // hide all cards and face them down
        card.className = "card";
       
        
        
    
        // for debuggin only
        // card.className = "card open show";  // will be removed later
    
    });
}




// attach click events to dialog play again and cancel


function startGame() {
    
    closeDialog();
    
    seconds = 0;
    minutes = 0;

    openedCards = [];

    numberOfMoves = 0;
    numberOfStars = 3;
    updateScore();
    updateTime();
    
    shuffleCards();
    flipAllCardsDown();

    startTimer();

}

function closeDialog() {
    document.querySelector("#dialog-box").close();
}

function startTimer() {
    if(!timerHandler) {
        timerHandler = setInterval(updateTime,1000);
    }
    
}

function updateTime() {

    
    if(seconds>59) {
        seconds = 0;
        minutes += 1;
    }
    let secondsString = "";
    let minutesString = "";
    if (seconds<10) {
        secondsString = "0" + seconds;
    } else {
        secondsString = seconds;
    }

    if (minutes < 10) {
        minutesString = "0" + minutes;
    } else {
        minutesString = minutes;
    }
    document.querySelector(".timer").innerText = 
    `${minutesString}:${secondsString}`;

    seconds += 1;
    
}
function stopTimer() {
    clearInterval(timerHandler);
    timerHandler = null;
}

function shuffleCards() {
    // first we shuffle the icons
    icons = shuffle(icons);

    // then we assign them to each card in sequence
    let i = 0;
    cards.forEach(card => {
        let child = card.children[0];

        child.className = icons[i];
        i++;
    });

}

function cardClicked() {
    // first, make sure the clicked card is not already opened

    
    if(this.classList.contains("show")) {
        
        console.log("this card is already open");
        return;
    }

    // we need to only open 2 cards (max) at any given time

    if (openedCards.length<2) {
        // flip the card
        this.classList.toggle("show");
        this.classList.toggle("open");

        // push it to the openedCards array
        openedCards.push(this);

        // check if we have 2 cards in the array
        if (openedCards.length == 2) {
            // we should wait before deciding 
            // if the cards are matched or not
            setTimeout(matchCards, 1000);

            //matchCards();
        }
    }
    
    
}

function matchCards() {
    // first, make sure we have 2 cards open

    if(openedCards.length==2) {
        let firstCard = openedCards[0];
        let secondCard = openedCards[1];

        // now compare the className of the child element
        // of each card.

        let firstChildClass = firstCard.children[0].className;
        let secondChildClass = secondCard.children[0].className;

        if(firstChildClass==secondChildClass) {
            firstCard.classList.add("match");
            secondCard.classList.add("match");

            
        } else {
            // flip them back down
            // remove the show and open
            // and only keep the card class
            firstCard.className = "card";
            secondCard.className = "card";
            
        }
        // clear the opendCards array in both cases
        openedCards = [];

        // increment the number of moves
        incrementMoves();
    }

    // check if there are no more cards to match
    // so that we can display a message to the user

    const remainingUnOpenedCards = document.querySelectorAll(".card:not(.match)");
    if(remainingUnOpenedCards.length==0) {
        // display : You win
        showDialogBox();
        
        
    }
}

function incrementMoves() {
    numberOfMoves += 1;
    // setting number of stars

    // lets say that if the player can solve the game
    // in 8 moves (minimum number of moves possible),
    // then he/she gets 3 stars
    // also, if the player can solve the game in less than
    // lets say 15 moves, still the stars is 3
    // if moves > 15 and < 20 ==> 2 stars
    // if moves >= 20 ==> 1 star

    if(numberOfMoves<15) {
        numberOfStars = 3;
    } else if(numberOfMoves < 20) {
        numberOfStars = 2;
    } else {
        numberOfStars = 1;
    }
    

    updateScore();
}

function updateScore() {
    // update the number of moves
    const movesElement = document.querySelector(".moves");
    movesElement.innerText = numberOfMoves;

    // now we need to update the number of stars
    const starsElement = document.querySelector(".stars");
    // first clear any previous star
    starsElement.innerHTML = "";

    for(let i=0; i<numberOfStars; i++) {
        let star = "<li> <i class='fa fa-star'></i> </li>";
        starsElement.innerHTML += star;
    }

}

function showDialogBox() {
    //let dialog = document.getElementById("dialog-box");

    let dialog = document.querySelector("#dialog-box");

    // update the score first
    document.querySelector("#span-moves").innerText = numberOfMoves;

    dialog.showModal();

    stopTimer();
}



initializeGame();
startGame();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

})();
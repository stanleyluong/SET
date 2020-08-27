document.addEventListener("DOMContentLoaded", main)

function main(){
    fetchCards()
    pageButtons()
    // fetchGames()
}

function newGame(e){

    e.preventDefault();
    fetchCards()
    fetch("http://localhost:3000/games" , {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            totScore:0
        })
    })
    .then(response => response.json())
    .then(results=> submitAttempt(0, results))
}

function fetchCards(){
    fetch("http://localhost:3000/cards")
    .then(response => response.json())
    .then(cards => deckOfCards(cards, [], []))
}
function deckOfCards(cards, currentCards, usedCards){
    initialRandomCards(cards, currentCards, usedCards)
}

function initialRandomCards(cards, currentCards, usedCards){
    console.log('cards',cards.length,'currentCards',currentCards.length,'usedCards',usedCards.length*3)
    // if(cards.length===0){
    //     console.log(currentCards,'currentcards')
    // }
    while (document.getElementById("container").hasChildNodes()){
        document.getElementById("container").removeChild(document.getElementById("container").lastChild)
    }
    let cardTable = document.getElementById("container")
    let selected = []
    //  console.log(usedCards)
    if (cards.length > 0){
        while (currentCards.length < 12){
            let randomNumber = Math.floor(Math.random() * (cards.length))
            let card = cards.splice(randomNumber,1)
            console.log('adding card to current cards',card)
            currentCards.push(card)
        } 
    } 
    // else { 
    //     alert("There are no more cards in the deck!")
    // }
    
    currentCards.forEach(card => {
        let image = document.createElement("img")
        image.src = card[0].img
        image.id = card[0].id
        image.setAttribute("class", "img")
        image.onclick = e => {
            image.style.backgroundColor="red"
                
            if (!selected.includes(card[0])){
                // image.style.border="1px dotted red"
                // image.style.backgroundColor="red"
                selected.push(card[0])
                console.log(selected.length)
                threeClicks(selected, cards, currentCards, usedCards)
            } else {
                image.style.backgroundColor=null
                selected = selected.filter(c => c !== card[0])
                console.log(selected)
            }
        }
        cardTable.appendChild(image)
    })
        let moreCardsButton = document.getElementById("moreCards")
        moreCardsButton.onclick = () => {
            if (cards.length > 0){
                for (i=0; i<3; i++){
                let randomNumber = Math.floor(Math.random() * (cards.length))
                let card = cards.splice(randomNumber,1)
                currentCards.push(card)
                }
            // console.log("cards remaining in deck", cards.length)
            } else {
                alert("There are no more cards in the deck!")
                console.log("cards remaining in deck", cards)
            }
            console.log("cards on table", currentCards.length)
            console.log("cards remaining in deck", cards.length)
            console.log("used cards",usedCards.length*3)
            initialRandomCards(cards, currentCards, usedCards)
        }
}

function threeClicks(selected, cards, currentCards, usedCards){
    if (selected.length == 3) {
        determineValid(selected, cards, currentCards, usedCards) 
    }
}

function determineValid(selected, cards, currentCards, usedCards){
    let a = selected[0]
    let b = selected[1]
    let c = selected[2]
    let valid = null
    let numberValid = null
    let shapeValid = null
    let shadingValid = null
    let colorValid = null
    if (!((a.number == b.number) && (b.number == c.number) ||
            (a.number != b.number) && (a.number != c.number) && (b.number != c.number))) {
        numberValid = false;
    } else {
        numberValid = true
        // console.log(numberValid)
    }     
    if (!((a.shape == b.shape) && (b.shape == c.shape) ||
            (a.shape != b.shape) && (a.shape != c.shape) && (b.shape != c.shape))) {
        shapeValid = false;
    } else {
        shapeValid = true
    }
    if (!((a.shading == b.shading) && (b.shading == c.shading) ||
        (a.shading != b.shading) && (a.shading != c.shading) && (b.shading != c.shading))) {
        shadingValid = false;
    } else {
        shadingValid = true
    }
    if (!((a.color == b.color) && (b.color == c.color) ||
            (a.color != b.color) && (a.color != c.color) && (b.color != c.color))) {
        colorValid = false;
    } else {
        colorValid = true
    }
    if ((numberValid == true) && (shapeValid == true) && (shadingValid == true) && (colorValid == true)) { 
        valid = true
        console.log(valid)
    } else {
        alert("Invalid Set!")
    }
    submitAttempt(valid, selected, cards, currentCards, usedCards) 
}

function submitAttempt(valid, selected, cards, currentCards, usedCards, results){
    // console.log('currentCards',currentCards.length)
    // console.log('cards',cards.length)
    // console.log('usedCards',usedCards.length*3)
    let sets = document.getElementById('sets')

    if (valid === true){
        let set = document.createElement('div')
        set.className = "set"
        for(i=0;i<selected.length;i++){
            let image = document.createElement('img')
            image.src = selected[i].img
            image.className = "found-img"
            set.appendChild(image)
            // for (x=0; x<selected.length; x++){
                for (y=0; y<currentCards.length; y++) {
                    if (selected[i].id == currentCards[y][0].id){
                        if(currentCards.length===12){
                            let randomNumber = Math.floor(Math.random() * (cards.length))
                            let card = cards.splice(randomNumber,1)
                            currentCards.splice(y, 1, card)
                        } else {
                            currentCards.splice(y,1)
                            let lastCard = currentCards.splice(currentCards.length-1,1)
                            // console.log('rearranging last card',lastCard[0])
                            currentCards.splice(y-1, 0, lastCard[0])
                        }
                    }
                }
            // }
            sets.appendChild(set)
        }
        
        usedCards.push(selected)
        console.log('usedCards',usedCards.length*3)
        selected = []
        initialRandomCards(cards, currentCards, usedCards)
    } else {
        selected = []
        console.log("failed validity")
        initialRandomCards(cards, currentCards, usedCards)
    }
}
var clear; function stopWatch( ) { 
    // javascript statement here 
    clear = setTimeout( "stopWatch( )", 1000 ); 
} 
// initialize your variables outside the function 
var count = 0; var clearTime; var seconds = 0, minutes = 0, hours = 0; 
var clearState; var secs, mins, gethours ; 
function startWatch( ) { 
    /* check if seconds is equal to 60 and add a +1 to minutes, and set seconds to 0 */ 
    if ( seconds === 60 ) { seconds = 0; minutes = minutes + 1; } 
    /* you use the javascript tenary operator to format how the minutes should look and add 0 to minutes if less than 10 */ 
    mins = ( minutes < 10 ) ? ( '0' + minutes + ': ' ) : ( minutes + ': ' ); 
    /* check if minutes is equal to 60 and add a +1 to hours set minutes to 0 */ 
    if ( minutes === 60 ) { minutes = 0; hours = hours + 1; } 
    /* you use the javascript tenary operator to format how the hours should look and add 0 to hours if less than 10 */ 
    gethours = ( hours < 10 ) ? ( '0' + hours + ': ' ) : ( hours + ': ' ); secs = ( seconds < 10 ) ? ( '0' + seconds ) : ( seconds );
     // display the stopwatch 
     var x = document .getElementById("timer"); 
     x.innerHTML = 'Time: ' + gethours + mins + secs;
      /* call the seconds counter after displaying the stop watch and increment seconds by +1 to keep it counting */ 
      seconds++; 
      /* call the setTimeout( ) to keep the stop watch alive ! */ 
      clearTime = setTimeout( "startWatch( )", 1000 ); 
    } 
    // startWatch( ) 
    //create a function to start the stop watch 
function startTime( ) { 
    /* check if seconds, minutes, and hours are equal to zero and start the stop watch */ 
    if ( seconds === 0 && minutes === 0 && hours === 0 ) { 
        /* hide the fulltime when the stop watch is running */ 
        var fulltime = document.getElementById( "fulltime" );
         fulltime.style.display = "none";
          /* hide the start button if the stop watch is running */ 
          this.style.display = "none"; 
          /* call the startWatch( ) function to execute the stop watch whenever the startTime( ) is triggered */ 
          startWatch( ); 
        } 
        // if () 
    } // startTime() 
        /* you need to bind the startTime( ) function to any event type to keep the stop watch alive ! */
         window.addEventListener( 'load', function ( ) {
              var start = document .getElementById("start"); start.addEventListener( 'click', startTime ); 
            }); 
            // startwatch.js end 
function stopTime( ) {
    if ( seconds !== 0 || minutes !== 0 || hours !== 0 ) { 
        /* display the full time before reseting the stop watch */ 
        var fulltime = document .getElementById( "fulltime" ); 
        //display the full time 
        fulltime.style.display = "inline"; 
        fulltime.className = "menu-item"
        var time = gethours + mins + secs; 
        fulltime.innerHTML = 'Fulltime: ' + time; 
        // reset the stop watch
        seconds = 0; minutes = 0; hours = 0; secs = '0' + seconds; mins = '0' + minutes + ': '; gethours = '0' + hours + ': '; 
        /* display the stopwatch after it's been stopped */ 
        var x = document.getElementById ("timer");
        var stopTime = gethours + mins + secs; 
        x.innerHTML = stopTime;
        /* display all stop watch control buttons */
        var showStart = document.getElementById ('start'); 
        showStart.style.display = "inline"; 
        var showStop = document.getElementById ("stop"); 
        showStop.style.display = "inline";
        /* clear the stop watch using the setTimeout( ) return value 'clearTime' as ID */
        clearTimeout( clearTime ); 
    }
     // if () 
} 
    // stopTime() 
    /* you need to call the stopTime( ) function to terminate the stop watch */ 
window.addEventListener( 'load', function ( ) {
    var stop = document.getElementById ("stop"); 
    stop.addEventListener( 'click', stopTime ); 
    }
); 
    // stopwatch.js end 


function submitNewScore(totScore, results){
    console.log("the id of item to fetch")
    console.log(results.id)
    fetch(`http://localhost:3000/games/${results.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            totScore: totScore
        })
    })
    let setCounter= document.getElementById("setCounter")
    setCounter.innerHTML = totScore
    fetchGames()
    //change value on front end to score here
    return totScore   
}

   
function statsScores(games){
    sortedScores= games.sort(function(a, b){
    return a.totScore - b.totScore;
    });
    // maxScores= sortedScores[0..5]
    //too tired to find the corresponding players right now
}
    
// function fetchGames(){
//     fetch("http://localhost:3000/games")
//     .then(response => response.json())
//     .then(games => statsScores(games))
// }

function statsScores(games){
    // console.log(games)
    sortedScores= games.sort(function(a, b){
    return parseFloat(a.totScore) - parseFloat(b.totScore);
    });
    let highScores= games.sort(function(a, b) {return a.totScore < b.totScore ? 1 : -1; })
    .slice(0, 10);
    // console.log(highScores)
    highScores
}


function pageButtons(){
    let newGameButton = document.getElementById("newGameButton")
    newGameButton.addEventListener("click", e => {
        location.reload()
    })
} 










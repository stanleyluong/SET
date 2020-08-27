document.addEventListener("DOMContentLoaded", main)

function main(){
    fetchCards()
    pageButtons()
    // fetchGames()
}

function k_combinations(set, k) {
    var i, j, combs, head, tailcombs;
    
    // There is no way to take e.g. sets of 5 elements from
    // a set of 4.
    if (k > set.length || k <= 0) {
        return [];
    }
    
    // K-sized set has only one K-sized subset.
    if (k == set.length) {
        return [set];
    }
    
    // There is N 1-sized subsets in a N-sized set.
    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }
    
    // Assert {1 < k < set.length}
    
    // Algorithm description:
    // To get k-combinations of a set, we want to join each element
    // with all (k-1)-combinations of the other elements. The set of
    // these k-sized sets would be the desired result. However, as we
    // represent sets with lists, we need to take duplicates into
    // account. To avoid producing duplicates and also unnecessary
    // computing, we use the following approach: each element i
    // divides the list into three: the preceding elements, the
    // current element i, and the subsequent elements. For the first
    // element, the list of preceding elements is empty. For element i,
    // we compute the (k-1)-computations of the subsequent elements,
    // join each with the element i, and store the joined to the set of
    // computed k-combinations. We do not need to take the preceding
    // elements into account, because they have already been the i:th
    // element so they are already computed and stored. When the length
    // of the subsequent list drops below (k-1), we cannot find any
    // (k-1)-combs, hence the upper limit for the iteration:
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

const valid = set => {
    console.log(set)
    let a = set[0][0]
    let b = set[1][0]
    let c = set[2][0]
    let validity = null
    let numberValid = null
    let shapeValid = null
    let shadingValid = null
    let colorValid = null
    if (!((a.number == b.number) && (b.number == c.number) ||
            (a.number != b.number) && (a.number != c.number) && (b.number != c.number))) {
        numberValid = false;
    } else {
        numberValid = true
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
        validity = true
        console.log(a,b,c)
    }
    return validity
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
            // console.log('adding card to current cards',card)
            currentCards.push(card)
        } 
    }
    let combos = k_combinations(currentCards, 3)
    console.log('some valid',combos.some(valid))
    currentCards.forEach(card => {
        let image = document.createElement("img")
        image.src = card[0].img
        image.id = card[0].id
        image.setAttribute("class", "img")
        image.onclick = e => {
            image.style.backgroundColor="red"
            if (!selected.includes(card)){
                selected.push(card)
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
        submitAttempt(valid(selected), selected, cards, currentCards, usedCards) 
    }
}

function submitAttempt(validity, selected, cards, currentCards, usedCards){
    let sets = document.getElementById('sets')
    if (validity === true){
        let set = document.createElement('div')
        set.className = "set"
        for(i=0;i<selected.length;i++){
            let image = document.createElement('img')
            image.src = selected[i][0].img
            image.className = "found-img"
            set.appendChild(image)
                for (y=0; y<currentCards.length; y++) {
                    if (selected[i][0].id == currentCards[y][0].id){
                        if(currentCards.length <= 12){
                            if(cards.length>0){
                                let randomNumber = Math.floor(Math.random() * (cards.length))
                                let card = cards.splice(randomNumber,1)
                                currentCards.splice(y, 1, card)
                            } else {
                                currentCards.splice(y, 1)
                            }
                        } else {
                            currentCards.splice(y,1)
                            let lastCard = currentCards.splice(currentCards.length-1,1)
                            // console.log('rearranging last card',lastCard[0])
                            currentCards.splice(y-1, 0, lastCard[0])
                        }
                    }
                }
            sets.appendChild(set)
        }
        usedCards.push(selected)
        let combos = k_combinations(currentCards, 3)
        if(cards.length===0 && combos.some(valid)===false){
            alert('Congratulations! There are no possible valid sets remaining.')
            //trigger fireworks from here
        } else {
            initialRandomCards(cards, currentCards, usedCards)
        }
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










document.addEventListener("DOMContentLoaded", main)

function main(){
    fetchCards()
    pageButtons()
    fetchGames()
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
    while (document.getElementById("container").hasChildNodes()){
        document.getElementById("container").removeChild(document.getElementById("container").lastChild)
    }
    let cardTable = document.getElementById("container")
    let selected = []
     console.log(usedCards)
    if (cards.length > 0){
        while (currentCards.length < 12){
            let randomNumber = Math.floor(Math.random() * (cards.length))
            let card = cards.splice(randomNumber,1)
            currentCards.push(card)
        } 
    } else { 
        alert("There are no more cards in the deck!")
    }
    
    currentCards.forEach(card => {
        let image = document.createElement("img")
        image.src = card[0].img
        image.id = card[0].id
        image.setAttribute("class", ".col-sm")
        image.onclick = e => {
            if (!selected.includes(card[0])){
                image.style.border="5px solid green"
                selected.push(card[0])
                console.log(selected.length)
                threeClicks(selected, cards, currentCards, usedCards)
            } else {
                image.style.border=null
                selected = selected.filter(c => c !== card[0])
                console.log(selected)
            }
                
            
        }
        cardTable.appendChild(image)
    })
    
    if (document.getElementById("moreButton") == null){
        let moreCardsButton = document.createElement("button")
        moreCardsButton.id = "moreButton"
        moreCardsButton.textContent = "More Cards"
        let gameMenu = document.getElementById("menu")
        gameMenu.appendChild(moreCardsButton)
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
            initialRandomCards(cards, currentCards, usedCards)
        }
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

    // const properties = ['number', 'shape', 'shading', 'color']
    // for (const property in properties) {
    //     a[property] == b[property] && b[property] == c[property]
    // }

    if (!((a.number == b.number) && (b.number == c.number) ||
            (a.number != b.number) && (a.number != c.number) && (b.number != c.number))) {
        numberValid = false;
    } else {
        numberValid = true
        console.log(numberValid)
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
    if (valid === true){
        cardToBeRemoved_1 = document.getElementById(selected[0].id)
        cardToBeRemoved_2 = document.getElementById(selected[1].id)
        cardToBeRemoved_3 = document.getElementById(selected[2].id)
        cardToBeRemoved_1.remove()
        cardToBeRemoved_2.remove()
        cardToBeRemoved_3.remove()
        for (x=0; x<selected.length; x++){
            for (y=0; y<currentCards.length; y++) {
                if (selected[x].id == currentCards[y][0].id){
                    currentCards.splice(y, 1)
                }
            }
        }
        
        usedCards.push(selected)
        
        console.log(usedCards)
        if (document.getElementById("foundButton") == null){
            foundButton = document.createElement("button")
            foundButton.id = "foundButton"
            let gameMenu = document.getElementById("menu")
            gameMenu.appendChild(foundButton)
            foundButton.textContent = "Show Found Sets"
            foundButton.value = false
            console.log(foundButton.value)
            setsFound = document.getElementById("found")
            foundButton.onclick = () => {
                if(foundButton.textContent == "Show Found Sets"){
                    foundButton.textContent = "Hide Found Sets"
                    while (setsFound.hasChildNodes()){
                    setsFound.removeChild(setsFound.lastChild)
                    }
                    usedCards.forEach(innerArray=> {
                        console.log(innerArray)
                        innerArray.forEach(c=> {
                            console.log(c)
                            let img = document.createElement("img")
                            img.src = c.img
                            setsFound.appendChild(img)
                        })    
                    })
                } else if (foundButton.textContent = "Hide Found Sets"){
                    foundButton.textContent = "Show Found Sets"
                    while (setsFound.hasChildNodes()){
                        setsFound.removeChild(setsFound.lastChild)
                        }
                }
            }
        }
        selected = []
        initialRandomCards(cards, currentCards, usedCards)
    } else {
        selected = []
        console.log("failed validity")
        initialRandomCards(cards, currentCards, usedCards)
    }
}

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
    
function fetchGames(){
    fetch("http://localhost:3000/games")
    .then(response => response.json())
    .then(games => statsScores(games))
}

function statsScores(games){
    // console.log(games)
    sortedScores= games.sort(function(a, b){
    return parseFloat(a.totScore) - parseFloat(b.totScore);
    });
    let highScores= games.sort(function(a, b) {return a.totScore < b.totScore ? 1 : -1; })
    .slice(0, 10);
    // console.log(highScores)
    highScores
    //too tired to find the corresponding players right now
}


function pageButtons(){
    let gameMenu = document.getElementById("menu")
    let newButton = document.getElementById("newGame")


    newButton.innerText = "New Game!"
    newButton.addEventListener("click", e => {
        newGame(e)
    })

    ///STATS MODAL
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
    modal.style.display = "block";
    }

    //What is in the modal
    var content = document.getElementById("modal-header")
    // content.innerText= statsScores()
    //figure out how to show this in text

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }
} 


////USER MODAL
    // Get the modal
//     var modal = document.getElementById("myModal");

//     // Get the button that opens the modal
//     var btn = document.getElementById("myBtn");

//     // Get the <span> element that closes the modal
//     var span = document.getElementsByClassName("close")[0];

//     // When the user clicks the button, open the modal 
//     btn.onclick = function() {
//     modal.style.display = "block";
//     }

//     //What is in the modal
//     var content = document.getElementById("modal-header")
//     // content.innerText= statsScores()
//     //figure out how to show this in text

//     // When the user clicks on <span> (x), close the modal
//     span.onclick = function() {
//     modal.style.display = "none";
//     }

//     // When the user clicks anywhere outside of the modal, close it
//     window.onclick = function(event) {
//         if (event.target == modal) {
//           modal.style.display = "none";
//         }
//     }
// } 








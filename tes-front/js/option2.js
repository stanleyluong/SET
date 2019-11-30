function initialRandomCards(cards){
    //puts default 12 cards in the grid
    let cardTable = document.getElementById("grid-container")
    let row1= document.getElementById("row1")
    let row2= document.getElementById("row2")
    let row3= document.getElementById("row3")
    let cardArr = []
    let selected = []
    for (i = 0; i < 12; i++) {
        randCard= Math.floor(Math.random() * (cards.length))
        // console.log(randCard)
        // console.log(cards[randCard].img)
        if (!cardArr.includes(randCard)){
            let image = document.createElement("img")
            image.src = cards[randCard].img
            image.setAttribute("class", ".col-sm")
            // image.setAttribute([idCounter])
            image.addEventListener("click", e => {
                // console.log("click working")
                selected.push(cards[randCard])
                threeClicks(e, cards)
            })
            cardTable.appendChild(image)
            cardArr.push(cards[randCard])
            // console.log(cardArr)
            // console.log(selected)
        }
    }
}
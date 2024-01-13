// *******************************************************************************************
// DECK OF CARDS STEP ONE: DRAW A SINGLE CARD AND LOG THE VALUE AND SUIT

function drawCard(url) {
  const request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.onload = () => {
      if (request.readyState !== 4) return;

      if (request.status >= 200 && request.status < 300) {
        resolve({
          data: JSON.parse(request.response),
          status: request.status,
          request: request,
        });
      } else {
        reject({
          msg: "SERVER ERROR!",
          status: request.status,
          request: request,
        });
      }
    };

    request.onerror = function handleError() {
      request = null;
      reject({
        msg: "NETWORK ERROR!",
      });
    };

    request.open("GET", url);

    request.send();
  });
}

// TOGGLE COMMENT ON/OFF FUNCTION CALL BELOW TO SEE/HIDE RESULT.

// drawCard("https://deckofcardsapi.com/api/deck/new/draw/?count=1")
//   .then((res) =>
//     console.log(`${res.data.cards[0].value} of ${res.data.cards[0].suit}`)
//   )
//   .catch((err) => console.log(err));

// *******************************************************************************************
// DECK OF CARDS STEP TWO: GET CARD FROM NEWLY SHUFFLED DECK, GET ONE MORE CARD FROM SAME DECK, LOG BOTH VALUES AND SUITS

function drawTwoCards() {
  let cards = [];
  drawCard("https://deckofcardsapi.com/api/deck/new/draw/?count=1")
    .then((res) => {
      const cardOne = `${res.data.cards[0].value} of ${res.data.cards[0].suit}`;
      cards.push(cardOne);
      return drawCard(
        `https://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`
      );
    })
    .then((res) => {
      const cardTwo = `${res.data.cards[0].value} of ${res.data.cards[0].suit}`;
      cards.push(cardTwo);
    })
    .then(() => {
      for (let i = 0; i <= cards.length - 1; i++) {
        console.log(cards[i]);
      }
    })
    .catch((err) => console.log(err));
}

// TOGGLE COMMENT ON/OFF FUNCTION CALL BELOW TO SEE/HIDE RESULT.

// drawTwoCards();

// *******************************************************************************************
// DECK OF CARDS STEP THREE: BUILD A PAGE THAT LETS YOU DRAW CARDS FROM A DECK AND DISPLAY THE CARD, UNTIL THE DECK RUNS OUT

// SELECT OUR PAGE ELEMENTS:
const userMessage = document.getElementById("user-message");
const userButton = document.getElementById("user-button");
const cardDisplay = document.getElementById("card-display");

// FUNCTION TO GET A NEW DECK:
function getDeck(url) {
  const request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.onload = () => {
      if (request.readyState !== 4) return;

      if (request.status >= 200 && request.status < 300) {
        resolve({
          data: JSON.parse(request.response),
          status: request.status,
          request: request,
        });
      } else {
        reject({
          msg: "SERVER ERROR!",
          status: request.status,
          request: request,
        });
      }
    };

    request.onerror = function handleError() {
      request = null;
      reject({
        msg: "NETWORK ERROR!",
      });
    };

    request.open("GET", url);

    request.send();
  });
}

// CREATE A NEW DECK AND AN OBJECT TO STORE THE DECK INFORMATION
let deck = {};

function newDeck() {
  getDeck("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(
    (res) => {
      deck.deckId = res.data.deck_id;
      deck.rem = res.data.remaining;
    }
  );
}

newDeck();

// HANDLE DRAWING FROM THE DECK, DISPLAYING THE CARDS, SHUFFLING, AND STARTING OVER
userButton.addEventListener("click", (evt) => {
  if (deck.rem >= 1) {
    evt.preventDefault();
    userMessage.innerHTML = "Click the button to draw a card!";
    userButton.innerHTML = "Draw a Card";
    drawCard(
      `https://deckofcardsapi.com/api/deck/${deck.deckId}/draw/?count=1`
    ).then((res) => {
      cardDisplay.innerHTML = "";
      let img = document.createElement("img");
      img.src = res.data.cards[0].image;
      cardDisplay.appendChild(img);
      deck.rem = res.data.remaining;
      if (deck.rem == 0) {
        userMessage.innerHTML = "Click the button to shuffle and draw again!";
        userButton.innerHTML = "Start Over";
      }
    });
  }
});

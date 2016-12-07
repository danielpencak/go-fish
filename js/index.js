(function() {
  'use strict';

  let computerCardRequest = {};
  let userScore = 0;
  let computerScore = 0;
  let userCards =[];
  let computerCards = [];
  let remainingCardsInDeck = 52;

  const $xhr = $.ajax({
    method: 'GET',
    url:
    'https://deckofcardsapi.com/api/deck/new/draw/?count=5',
    dataType: 'json'
  });

  $xhr.done((data) => {
    if ($xhr.status !== 200) {
      return;
    }
    remainingCardsInDeck -= 5;
    const deckID = data.deck_id;

    // console.log(deckID);
    userCards = data.cards.map((userCard) => {
      return {
        value: userCard.value,
        image: userCard.image
      };
    });

    // for (const userCard of userCards) {
    //   const $span = $('#userHand');
    //   const $img = $('<img>').addClass('responsive-img playerCard');
    //
    //   $img.attr({ alt: 'Card', src: `${userCard.image}` });
    //   $span.append($img);
    // }
    // console.log(userCards);
    const $xhr2 = $.ajax({
      method: 'GET',
      url:
      `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=5`,
      dataType: 'json'
    });

    $xhr2.done((data2) => {
      if ($xhr2.status !== 200) {
        return;
      }
      let player = 'player1';
      remainingCardsInDeck -= 5;
      computerCards = data2.cards.map((computerCard) => {
        return {
          value: computerCard.value,
          image: computerCard.image
        };
      });

      const checkForGameEnd = function() {
        console.log('Hello');
        if (remainingCardsInDeck === 0) {
          const $spanComputer = $('#computerCards');
          const $spanUser = $('#userCards');
          // const $spanCardDeck = $('#cardDeck');
          $spanComputer.empty();
          $spanUser.empty();
          // $spanCardDeck.empty();
          if (player === 'player2') {
            userScore += computerCards.length;
            $('#userScore').text(`Pair: ${userScore}`);
          }
          else if (player === 'player1') {
            computerScore += userCards.length;
            $('#computerScore').text(`Pair: ${userScore}`);
          }
          if (userScore > computerScore) {
            Materialize.toast('Congratulations! You won!', 6000);
          }
          else if (userScore < computerScore) {
            Materialize.toast('Sorry. You lost. Try again.', 6000);
          }
        }

        return;
      };

      const randomCardRequest = function() {
        const randomCardIndex = Math.floor(Math.random() * computerCards.length);
        const requestCardComputer = {
          value: computerCards[randomCardIndex].value,
          image: computerCards[randomCardIndex].image
        }
        Materialize.toast(`Do you have a ${requestCardComputer.value}?`, 6000);

        return requestCardComputer;
      };

      // const checkPlayer = function() {
      //   if (player === 'player2') {
      //      computerCardRequest = randomCardRequest();
      //   }
      // };

      // const renderDrawCard = function(hand, drawCard) {
      //   const $span = $(`#${hand}`);
      //
      //   const $img = $('<img>').addClass('responsive-img playerCard');
      //
      //   $img.attr({ alt: 'Card', src: `${drawCard.image}` });
      //   $span.append($img);
      // };

      // const renderDrawCardToUserHand = function() {
      //   const $span = $('#userHand');
      //
      //   const $img = $('<img>').addClass('responsive-img playerCard');
      //
      //   $img.attr({ alt: 'Card', src: `${requestCard.image}` });
      //   $span.append($img);
      // };

      // const renderDrawCardToComputerHand = function() {
      //   const $span = $('#computerHand');
      //
      //   const $img = $('<img>').addClass('responsive-img imgCardBack');
      //
      //   $img.attr({ alt: 'Card', src: 'images/card_back.jpg' });
      //   $span.append($img);
      // };

      const renderComputerCards = function() {
        const $span = $('#computerCards');

        $span.empty();
        for (const computerCard of computerCards) {
          const $img = $('<img>').addClass('responsive-img imgCardBack');

          $img.attr({ alt: 'Card', src: 'images/card_back.jpg' });
          $span.append($img);
        }
      };

      const renderUserCards = function() {
        const $span = $('#userCards');

        $span.empty();
        for (const userCard of userCards) {
          const $img = $('<img>').addClass('responsive-img playerCard');

          $img.attr({ alt: `${userCard.value}`, src: `${userCard.image}` });
          $span.append($img);
        }
      };

      const checkForPairsOnDraw = function(hand, cardCompare) {
        // console.log(cardCompare[0]);
        // console.log(hand);
        const handFiltered = hand.filter((card) => {
          return card.value !== cardCompare[0].value;
        });
        // console.log(handFiltered);
        if (handFiltered.length === hand.length) {
          hand.push(cardCompare[0]);
          renderUserCards();
          renderComputerCards();
        }
        else {
          if (hand === userCards) {
            userScore += 1;
            $('#userScore').text(`Pair: ${userScore}`);
            // renderDrawCard(userCards, cardCompare);
            userCards = handFiltered;
            renderUserCards();
          }
          if (hand === computerCards) {
            computerScore += 1;
            $('#computerScore').text(`Pair: ${computerScore}`);
            // renderDrawCard(computerCards, cardCompare);
            computerCards = handFiltered;
            renderComputerCards();
          }
          // console.log(hand);
          // return hand;
        }
        // renderDrawCardToComputerHand();
      };

      const switchPlayer = function() {
        checkForGameEnd();
        console.log('player before switch', player);
        if (player === 'player1') {
          player = 'player2';
          computerCardRequest = randomCardRequest()
          console.log('player after switch', player);
        }
        else if (player === 'player2') {
          player = 'player1';
          console.log('player after switch', player);
        }
      };

      const goFish = ((hand, callback) => {
        console.log('callback', callback);
        // console.log('player before switch', player);
        // if (player === 'player1') {
        //   player = 'player2';
        //   console.log('player after switch', player);
        // }
        // else if (player === 'player2') {
        //   player = 'player1';
        //   console.log('player after switch', player);
        // }
        // console.log(deckID);
        const $xhr3 = $.ajax({
          method: 'GET',
          url:
          `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`,
          dataType: 'json'
        });

        $xhr3.done((data3) => {
          if ($xhr3.status !== 200) {
            return;
          }
          console.log('xhrDone', player);
          remainingCardsInDeck -= 1;
          // checkForGameEnd();
          callback();
          const drawCard = data3.cards.map((card) => {
            return {
              value: card.value,
              image: card.image
            };
          });
          // console.log(drawCard);
          // console.log(remainingCardsInDeck);
          // console.log(hand === userCards);
          checkForPairsOnDraw(hand, drawCard);
          // console.log(hand);

          // renderComputerCards();
          // renderUserCards();
        });

        $xhr3.fail((err) => {
          console.log(err);
        });
      });

      const checkOwnHandForPairs = function(hand) {
        const handValues = hand.map((card) => {
          return card.value;
        });

        // console.log(hand);

        const cardsFound = {};

        for (const value of handValues) {
          if (cardsFound[value]) {
            if (cardsFound[value] === 1) {
              cardsFound[value] = 2;
            }
            else if (cardsFound[value] === 2) {
              cardsFound[value] = 3;
            }
          }
          else {
            cardsFound[value] = 1;
          }
        }
        console.log(cardsFound);
        const cardsToDelete = [];

        for (let i = 0; i < handValues.length; i++) {
          if (cardsFound[handValues[i]] === 2 || cardsFound[handValues[i]] === 3) {
            const firstIndex = handValues.indexOf(handValues[i]);
            const lastIndex = handValues.lastIndexOf(handValues[i]);

            if (cardsToDelete.indexOf(firstIndex) === -1) {
              cardsToDelete.push(firstIndex);
            }
            if (cardsToDelete.indexOf(lastIndex) === -1) {
              cardsToDelete.push(lastIndex);
            }
          }
        }
        const sortCardsToDelete = cardsToDelete.sort((a, b) => {
          return b - a;
        });

        // console.log(sortCardsToDelete);
        for (const cardToDelete of sortCardsToDelete) {
          hand.splice(cardToDelete, 1);
        }
        if (hand === userCards) {
          userScore += (sortCardsToDelete.length) / 2;
          $('#userScore').text(`Pairs: ${userScore}`);
        }
        else if (hand === computerCards) {
          computerScore += (sortCardsToDelete.length) / 2;
          $('#computerScore').text(`Pairs: ${computerScore}`);
        }
        renderUserCards();
        renderComputerCards();
      };

      const noHandDeal = ((callback) => {
        if (userCards.length === 0) {
          const $xhr4 = $.ajax({
            method: 'GET',
            url:
            `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${computerCards.length}`,
            dataType: 'json'
          });

          $xhr4.done((data4) => {
            if ($xhr4.status !== 200) {
              return;
            }
            remainingCardsInDeck -= computerCards.length;
            // checkForGameEnd();
            callback();
            userCards = data4.cards.map((card) => {
              return {
                value: card.value,
                image: card.image
              };
            });
            // console.log(userCards);
            checkOwnHandForPairs(userCards);
            renderUserCards();
          });

          $xhr4.fail((err) => {
            console.log(err);
          });
        }
        else if (computerCards.length === 0) {
          const $xhr5 = $.ajax({
            method: 'GET',
            url:
            `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${userCards.length}`,
            dataType: 'json'
          });

          $xhr5.done((data5) => {
            if ($xhr5.status !== 200) {
              return;
            }
            remainingCardsInDeck -= userCards.length;
            // checkForGameEnd();
            callback();
            computerCards = data5.cards.map((card) => {
              return {
                value: card.value,
                image: card.image
              };
            });

            checkOwnHandForPairs(computerCards);
            renderComputerCards();
          });

          $xhr5.fail((err) => {
            console.log(err);
          });
        }
      });

      const checkForPairsOnRequest = function(hand, cardRequest) {
        // if (hand === userCards) {
        //   const computerHandFiltered = computerCards.filter((card) => {
        //     return card.value !== cardRequest.value;
        //   });
        //   const userHandFiltered = userCards.filter((card) => {
        //     return card.value !== cardRequest.value;
        //   });
        //   // if (userHandFiltered.length === hand.length) {
        //   //   $('#goFish').on('click', () => {
        //   //     goFish(computerCards, switchPlayer);
        //   //   });
        //   // }
        //   if (userHandFiltered.length !== hand.length){
        //     userCards = userHandFiltered;
        //     computerCards = computerHandFiltered;
        //     renderComputerCards();
        //     renderUserCards();
        //     computerScore += 1;
        //     $('#computerScore').text(`Pair: ${computerScore}`);
        //   }
        // }
        if (hand === computerCards) {
          const userHandFiltered = userCards.filter((card) => {
            return card.value !== cardRequest.value;
          });
          // console.log(userHandFiltered.length);
          // console.log(userCards.length);
          const computerHandFiltered = computerCards.filter((card) => {
            return card.value !== cardRequest.value;
          });
          if (computerHandFiltered.length === computerCards.length) {
            goFish(userCards, switchPlayer);
            // console.log(userCards);
          }
          else {
            userCards = userHandFiltered;
            // console.log(userCards);
            computerCards = computerHandFiltered;
            // console.log(computerCards);
            userScore += 1;
            $('#userScore').text(`Pair: ${userScore}`);
            renderComputerCards();
            renderUserCards();
          }
        }
      };

      // console.log(data2.remaining);
      // console.log(data2.deck_id);
      // console.log(deckID);
      // console.log(data2.cards.length);
      // console.log(computerCards);

      // for (const computerCard of computerCards) {
      //   const $span = $('#computerHand');
      //   const $img = $('<img>').addClass('responsive-img imgCardBack');
      //
      //   $img.attr({ alt: 'Card', src: 'images/card_back.jpg' });
      //   $span.append($img);
      // }

      checkOwnHandForPairs(computerCards);
      checkOwnHandForPairs(userCards);

      // console.log(remainingCardsInDeck);

      $('#goFish').on('click', () => {
        goFish(computerCards, switchPlayer);
      });
      $('#userCards').on('click', '.playerCard', (event) => {
        // $('#goFish').off('click', () => {
        //   goFish(computerCards, switchPlayer);
        // });
        console.log('currentplayer', player);
        if (player === 'player1') {

          // console.log(event.target.alt);
          const requestCardUser = {
            image: event.target.src,
            value: event.target.alt
          }
          console.log(`${player} clicked on ${requestCardUser.value}`)
          // console.log(data.remaining);
          // console.log(requestCard.image);
          // Check for pairs fn
          // Check if card clicked by user matches a card in computer's hand.
          // If so the player gets a point cards are removed from both hands and user clicks again with no player change.
          // If the computer does not have the card the player asked for a card from the deck will be -- dealCard -- dealt to the user and the code will check to see if there is a pair created by the draw.
          // If so, if the card matches up with the card requested from the computer the user will go again.
          // If there is a pair but not the same card the user requested or there is no pair at all the player will be switched to the computer and the computer will go.
          checkForPairsOnRequest(computerCards, requestCardUser);
          // console.log(remainingCardsInDeck);
          console.log('currentplayer', player);
          // console.log(deckID);
          // console.log(userCards);
          // if (player === 'player2') {
          //   requestCardComputer = randomCardRequest();
          // //   $('#goFish').on('click', () => {
          // //     goFish(computerCards);
          // //     console.log('currentplayer', player);
          // //   });
          // //   // console.log(player);
          // }
          // noHandDeal();
          // No click event to switch players. Need a nested if statement to run computer logic.
          // randomCardRequest fn -- Computer will randomly request a card with a toast.
          // Might need while loops for when the computer to continue going. No click event will trigger this.
        }
        if (player === 'player2') {
          console.log(event.target);
          // requestCardComputer = randomCardRequest();
          // const requestCard = randomCardRequest();
          console.log('computer request', computerCardRequest);
          // checkForPairsOnRequest(userCards, computerCardRequest);
          const userCardToGive = {
            image: event.target.src,
            value: event.target.alt
          }
          console.log('user click', userCardToGive.value);
          console.log('computer request', computerCardRequest);
          if (userCardToGive.value === computerCardRequest.value) {
            const computerHandFiltered = computerCards.filter((card) => {
              return card.value !== computerCardRequest.value;
            });
            const userHandFiltered = userCards.filter((card) => {
              return card.value !== computerCardRequest.value;
            });
            // if (userHandFiltered.length === hand.length) {
            //   $('#goFish').on('click', () => {
            //     goFish(computerCards, switchPlayer);
            //   });
            // }
            userCards = userHandFiltered;
            computerCards = computerHandFiltered;
            renderComputerCards();
            renderUserCards();
            computerScore += 1;
            $('#computerScore').text(`Pair: ${computerScore}`);
          }
          noHandDeal();
          console.log('currentplayer', player);
          if (player === 'player2') {
            computerCardRequest = randomCardRequest();
          }
          // console.log(player);
          // $('#goFish').off('click', () => {
          //   goFish(computerCards);
          // });
          // The user will click on the card that they have that matches. This will trigger the high level click event and this time the user will be the computer. It will run the logic accordingly: take both cards from the corresponding hands add a point for the computer and the computer will go again. No player switch.
          // randomCardRequest fn -- Randomly select another card and toast again.
          // Go Fish! fn
          // Event listener for Go Fish! button will trigger if the user has no matches. The click will -- dealCard -- deal a card to the computer.
          // If the card dealt to the computer matches the same card requested to user the computer gets a point and gets to go again.
          // If the card matches a card but not the requested computer gets a point but does not get to go again. If no pairs are found it is the end of the computer's turn. Switch player to user.
          // When player clicks on card to go will start the high level click event all over again.
        }
      });
    });

    $xhr2.fail((err) => {
      console.log(err);
    });
  });

  $xhr.fail((err) => {
    console.log(err);
  });
})();

(function() {
  'use strict';

  let userScore = 0;
  let computerScore = 0;

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
    console.log(data.remaining);
    const deckID = data.deck_id;

    console.log(deckID);
    let userCards = data.cards.map((userCard) => {
      return {
        value: userCard.value,
        image: userCard.image
      };
    });

    for (const userCard of userCards) {
      const $span = $('#userHand');
      const $img = $('<img>').addClass('responsive-img playerCard');

      $img.attr({ alt: 'Card', src: `${userCard.image}` });
      $span.append($img);
    }
    console.log(userCards);
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
      let computerCards = data2.cards.map((computerCard) => {
        return {
          value: computerCard.value,
          image: computerCard.image
        };
      });
      const randomCardRequest = function(hand) {
        const randomCardIndex = Math.floor(Math.random() * hand.length);
        const value = hand[randomCardIndex].value;

        Materialize.toast(`Do you have a ${value}?`, 6000);
      };

      const renderComputerCards = function() {
        const $span = $('#computerHand');

        $span.empty();
        for (const computerCard of computerCards) {
          const $img = $('<img>').addClass('responsive-img imgCardBack');

          $img.attr({ alt: 'Card', src: 'images/card_back.jpg' });
          $span.append($img);
        }
      };

      const renderUserCards = function() {
        const $span = $('#userHand');

        $span.empty();
        for (const userCard of userCards) {
          const $img = $('<img>').addClass('responsive-img playerCard');

          $img.attr({ alt: 'Card', src: `${userCard.image}` });
          $span.append($img);
        }
      };

      const checkForPairsOnRequest = function(hand, cardRequest) {
        const userHandFiltered = hand.filter((card) => {
          return card.value !== cardRequest.value;
        });
        const computerHandFiltered = hand.filter((card) => {
          return card.value !== cardRequest.value;
        });

        if (hand === userCards) {
          if (userHandFiltered.length === hand.length) {
            goFish(computerCards);
          }
          else {
            userCards = userHandFiltered;
            computerCards = computerHandFiltered;
            computerScore += 1;
            $('#computerScore').text(`Pair: ${computerScore}`);
          }
        }
        else if (hand === computerCards) {
          if (userHandFiltered.length === hand.length) {
            goFish(userCards);
          }
          else {
            userCards = userHandFiltered;
            computerCards = computerHandFiltered;
            userScore += 1;
            $('#userScore').text(`Pair: ${userScore}`);
          }
        }
        renderComputerCards();
        renderUserCards();
      };

      const checkForPairsOnDraw = function(hand, cardCompare) {
        const handFiltered = hand.filter((card) => {
          return card.value !== cardCompare.value;
        });

        if (handFiltered.length === hand.length) {
          hand.push(cardCompare);
        }
        else {
          hand = handFiltered;
          if (hand === userCards) {
            userScore += 1;
            $('#userScore').text(`Pair: ${userScore}`);
          }
          if (hand === computerCards) {
            computerScore += 1;
            $('#computerScore').text(`Pair: ${computerScore}`);
          }
        }
        renderComputerCards();
        renderUserCards();
      };

      const checkOwnHandForPairs = function(hand) {
        const handValues = hand.map((card) => {
          return card.value;
        });

        console.log(hand);

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

        console.log(sortCardsToDelete);
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

      console.log(data2.remaining);
      console.log(data2.deck_id);
      console.log(deckID);
      console.log(data2.cards.length);
      console.log(computerCards);
      // for (const computerCard of computerCards) {
      //   const $span = $('#computerHand');
      //   const $img = $('<img>').addClass('responsive-img imgCardBack');
      //
      //   $img.attr({ alt: 'Card', src: 'images/card_back.jpg' });
      //   $span.append($img);
      // }

      checkOwnHandForPairs(computerCards);
      checkOwnHandForPairs(userCards);

      let player = 'player1';

      $('#goFish').off('click', () => {
        goFish(computerCards);
      });

      $('.playerCard').on('click', (event) => {
        if (player === 'player1') {
          // Check for pairs fn
          // Check if card clicked by user matches a card in computer's hand.
          // If so the player gets a point cards are removed from both hands and user clicks again with no player change.
          // If the computer does not have the card the player asked for a card from the deck will be -- dealCard -- dealt to the user and the code will check to see if there is a pair created by the draw.
          // If so, if the card matches up with the card requested from the computer the user will go again.
          // If there is a pair but not the same card the user requested or there is no pair at all the player will be switched to the computer and the computer will go.
          // No click event to switch players. Need a nested if statement to run computer logic.
          // randomCardRequest fn -- Computer will randomly request a card with a toast.
          // Might need while loops for when the computer to continue going. No click event will trigger this.
        }
        else if (player === 'player2') {
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

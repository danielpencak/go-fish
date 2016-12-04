(function() {
  'use strict';
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
    console.log(data.cards.length);
    const playerCards = data.cards.map((playerCard) => {
      return {
        value: playerCard.value,
        image: playerCard.image
      };
    });

    for (const playerCard of playerCards) {
      const $span = $('#userHand');
      const $img = $('<img>').addClass('responsive-img playerCard');

      $img.attr({ alt: 'Card', src: `${playerCard.image}` });

      $span.append($img);
    }
    console.log(playerCards);

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
      console.log(data2.remaining);
      console.log(data2.deck_id);

      console.log(deckID);
      console.log(data2.cards.length);
      const computerCards = data2.cards.map((computerCard) => {
        return {
          value: computerCard.value,
          image: computerCard.image
        };
      });

      console.log(computerCards);
      for (const computerCard of computerCards) {
        const $span = $('#computerHand');
        const $img = $('<img>').addClass('responsive-img imgCardBack');

        $img.attr({ alt: 'Card', src: 'images/card_back.jpg' });
        $span.append($img);
      }
      // const checkForPairs = function()
      let player = 'player1';
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

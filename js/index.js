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
    });

    $xhr2.fail((err) => {
      console.log(err);
    });
  });

  $xhr.fail((err) => {
    console.log(err);
  });
})();

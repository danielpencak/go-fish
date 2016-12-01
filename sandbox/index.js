(function() {
  'use strict';

const playerCards = [];
let deckID= '';

const $xhr = $.ajax({
  method: 'GET',
  url:
  `https://deckofcardsapi.com/api/deck/new/draw/?count=5`,
  dataType: 'json'
});

$xhr.done((data) => {
  if ($xhr.status !== 200) {
    return;
  }
  const card = {};
  console.log(data)
  console.log(data.remaining);
  console.log(data.deck_id);
  deckID = data.deck_id;
  console.log(deckID);
  console.log(data.cards.length);
  for (const element of data.cards) {
    card.value = parseInt(element.value);
    card.image = element.image;
    playerCards.push(card);
  }
  console.log(playerCards);
});
console.log(deckID);

$xhr.fail((err) => {
  console.log(err);
});

})();

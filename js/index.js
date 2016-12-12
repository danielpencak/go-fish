(function() {
  'use strict';

  let computerCardRequest = {};
  let userScore = 0;
  let computerScore = 0;
  let userCards = [];
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

    userCards = data.cards.map((userCard) => {
      return {
        value: userCard.value,
        image: userCard.image
      };
    });

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

      $('#userTurn').attr('style', 'color: purple');
      remainingCardsInDeck -= 5;
      computerCards = data2.cards.map((computerCard) => {
        return {
          value: computerCard.value,
          image: computerCard.image
        };
      });

      const removeFlashUser = (() => {
        $('#userScore').removeClass('flash');
      });

      const removeFlashComputer = (() => {
        $('#computerScore').removeClass('flash');
      });

      const renderComputerCards = (() => {
        const $span = $('#computerCards');

        $span.empty();
        for (const computerCard of computerCards) {
          const $img = $('<img>').addClass('responsive-img imgCardBack');

          $img.attr({ alt: 'Card', src: 'images/card_back.jpg' });
          $span.append($img);
        }
      });

      const renderUserCards = (() => {
        const $span = $('#userCards');

        $span.empty();
        for (const userCard of userCards) {
          const $img = $('<img>').addClass('responsive-img playerCard');

          $img.attr({ alt: `${userCard.value}`, src: `${userCard.image}` });
          $span.append($img);
        }
      });

      const checkForGameEnd = (() => {
        if (remainingCardsInDeck === 0) {
          const $spanComputer = $('#computerCards');
          const $spanUser = $('#userCards');

          if (player === 'player2') {
            userScore += computerCards.length;
            $('#userScore').text(`Pairs: ${userScore}`).addClass('flash');
            setTimeout(removeFlashUser, 500);
          }
          else if (player === 'player1') {
            computerScore += userCards.length;
            $('#computerScore').text(`Pairs: ${computerScore}`);
            $('#computerScore').addClass('flash');
            setTimeout(removeFlashComputer, 500);
          }
          if (userScore > computerScore) {
            Materialize.toast('Congratulations! You won!', 6000);
          }
          else if (userScore < computerScore) {
            Materialize.toast('Sorry. You lost. Try again.', 6000);
          }
          else {
            Materialize.toast("Wow! It's a tie. Play again!", 6000);
          }
          $spanComputer.empty();
          $spanUser.empty();
        }
      });

      const dealNewHand = ((callback) => {
        if (remainingCardsInDeck > 1) {
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
              userCards = data4.cards.map((card) => {
                return {
                  value: card.value,
                  image: card.image
                };
              });

              const handValues = userCards.map((card) => {
                return card.value;
              });
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

              for (const cardToDelete of sortCardsToDelete) {
                userCards.splice(cardToDelete, 1);
              }
              userScore += (sortCardsToDelete.length) / 2;
              $('#userScore').text(`Pairs: ${userScore}`).addClass('flash');
              setTimeout(removeFlashUser, 500);

              renderUserCards();
              callback();
              if (userCards.length === 0 || computerCards.length === 0) {
                return true;
              }
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

              computerCards = data5.cards.map((card) => {
                return {
                  value: card.value,
                  image: card.image
                };
              });

              const handValues = computerCards.map((card) => {
                return card.value;
              });
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

              for (const cardToDelete of sortCardsToDelete) {
                computerCards.splice(cardToDelete, 1);
              }
              computerScore += (sortCardsToDelete.length) / 2;
              $('#computerScore').text(`Pairs: ${computerScore}`);
              $('#computerScore').addClass('flash');
              setTimeout(removeFlashComputer, 500);

              renderComputerCards();
              callback();
              if (userCards.length === 0 || computerCards.length === 0) {
                return true;
              }
            });

            $xhr5.fail((err) => {
              console.log(err);
            });
          }
        }
        if (remainingCardsInDeck < computerCards.length) {
          if (userCards.length === 0) {
            const $xhr6 = $.ajax({
              method: 'GET',
              url:
              `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${remainingCardsInDeck}`,
              dataType: 'json'
            });

            $xhr6.done((data6) => {
              if ($xhr6.status !== 200) {
                return;
              }
              remainingCardsInDeck = 0;

              userCards = data6.cards.map((card) => {
                return {
                  value: card.value,
                  image: card.image
                };
              });

              const handValues = userCards.map((card) => {
                return card.value;
              });
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

              for (const cardToDelete of sortCardsToDelete) {
                userCards.splice(cardToDelete, 1);
              }
              userScore += (sortCardsToDelete.length) / 2;
              $('#userScore').text(`Pairs: ${userScore}`).addClass('flash');
              setTimeout(removeFlashUser, 500);
              renderUserCards();
              callback();
              if (userCards.length === 0 || computerCards === 0) {
                return true;
              }
            });

            $xhr6.fail((err) => {
              console.log(err);
            });
          }
        }
        if (remainingCardsInDeck < userCards.length) {
          if (computerCards.length === 0) {
            const $xhr7 = $.ajax({
              method: 'GET',
              url:
              `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${remainingCardsInDeck}`,
              dataType: 'json'
            });

            $xhr7.done((data7) => {
              if ($xhr7.status !== 200) {
                return;
              }
              remainingCardsInDeck = 0;

              computerCards = data7.cards.map((card) => {
                return {
                  value: card.value,
                  image: card.image
                };
              });

              const handValues = computerCards.map((card) => {
                return card.value;
              });
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

              for (const cardToDelete of sortCardsToDelete) {
                computerCards.splice(cardToDelete, 1);
              }
              computerScore += (sortCardsToDelete.length) / 2;
              $('#computerScore').text(`Pairs: ${computerScore}`);
              $('#computerScore').addClass('flash');
              setTimeout(removeFlashComputer, 500);
              renderComputerCards();
              callback();
              if (userCards.length === 0 || computerCards === 0) {
                return true;
              }
            });

            $xhr7.fail((err) => {
              console.log(err);
            });
          }
        }
      });

      const randomCardRequest = (() => {
        if (remainingCardsInDeck === 0) {
          return;
        }
        if (computerCards.length === 0) {
          dealNewHand(checkForGameEnd);
        }
        else {
          const randomCardIndex = Math.floor(Math.random() * computerCards.length);
          const randomComputerCardRequest = {
            value: computerCards[randomCardIndex].value,
            image: computerCards[randomCardIndex].image
          };

          Materialize.toast(`Do you have a ${randomComputerCardRequest.value}?`, 3000);

          return randomComputerCardRequest;
        }
      });

      const checkOwnHandForPairs = ((hand, callback) => {
        const handValues = hand.map((card) => {
          return card.value;
        });
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

        for (const cardToDelete of sortCardsToDelete) {
          hand.splice(cardToDelete, 1);
        }
        if (hand === userCards) {
          userScore += (sortCardsToDelete.length) / 2;
          $('#userScore').text(`Pairs: ${userScore}`).addClass('flash');
          setTimeout(removeFlashUser, 500);
        }
        else if (hand === computerCards) {
          computerScore += (sortCardsToDelete.length) / 2;
          $('#computerScore').text(`Pairs: ${computerScore}`);
          $('#computerScore').addClass('flash');
          setTimeout(removeFlashComputer, 500);
        }
        if (callback()) {
          callback();
        }
        renderUserCards();
        renderComputerCards();
      });

      const checkForPairsOnDraw = ((hand, cardCompare) => {
        const handFiltered = hand.filter((card) => {
          return card.value !== cardCompare[0].value;
        });

        if (handFiltered.length === hand.length) {
          hand.push(cardCompare[0]);
          renderUserCards();
          renderComputerCards();
        }
        else {
          if (hand === userCards) {
            userScore += 1;
            $('#userScore').text(`Pairs: ${userScore}`).addClass('flash');
            setTimeout(removeFlashUser, 500);
            userCards = handFiltered;
            renderUserCards();
            checkForGameEnd();
            dealNewHand(checkForGameEnd);
          }
          if (hand === computerCards) {
            computerScore += 1;
            $('#computerScore').text(`Pairs: ${computerScore}`);
            $('#computerScore').addClass('flash');
            setTimeout(removeFlashComputer, 500);
            computerCards = handFiltered;
            renderComputerCards();
            checkForGameEnd();
            dealNewHand(checkForGameEnd);
          }
        }
      });

      const switchPlayer = (() => {
        checkForGameEnd();
        dealNewHand(checkForGameEnd);
        if (player === 'player1') {
          player = 'player2';
          $('#computerTurn').attr('style', 'color: purple');
          $('#userTurn').attr('style', 'color: black');
          computerCardRequest = randomCardRequest();
        }
        else if (player === 'player2') {
          player = 'player1';
          $('#computerTurn').attr('style', 'color: black');
          $('#userTurn').attr('style', 'color: purple');
        }
      });

      const goFish = ((hand, callback) => {
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
          remainingCardsInDeck -= 1;

          callback();
          const drawCard = data3.cards.map((card) => {
            return {
              value: card.value,
              image: card.image
            };
          });

          checkForPairsOnDraw(hand, drawCard);
        });

        $xhr3.fail((err) => {
          console.log(err);
        });
      });

      const checkForPairsOnRequest = ((hand, cardRequest) => {
        const userHandFiltered = userCards.filter((card) => {
          return card.value !== cardRequest.value;
        });
        const computerHandFiltered = computerCards.filter((card) => {
          return card.value !== cardRequest.value;
        });

        if (computerHandFiltered.length === computerCards.length) {
          goFish(userCards, switchPlayer);
        }
        else {
          userCards = userHandFiltered;
          computerCards = computerHandFiltered;
          userScore += 1;
          $('#userScore').text(`Pairs: ${userScore}`).addClass('flash');
          setTimeout(removeFlashUser, 500);
          renderComputerCards();
          renderUserCards();
          checkForGameEnd();
          dealNewHand(checkForGameEnd);
          checkForGameEnd();
        }
      });

      checkOwnHandForPairs(computerCards, dealNewHand);
      checkOwnHandForPairs(userCards, dealNewHand);

      $('#goFish').on('click', () => {
        goFish(computerCards, switchPlayer);
      });
      $('#userCards').on('click', '.playerCard', (event) => {
        if (player === 'player1') {
          checkForGameEnd();
          dealNewHand(checkForGameEnd);
          const requestCardUser = {
            image: event.target.src,
            value: event.target.alt
          };

          checkForPairsOnRequest(computerCards, requestCardUser);
        }
        if (player === 'player2') {
          checkForGameEnd();
          const userCardToGive = {
            image: event.target.src,
            value: event.target.alt
          };

          if (userCardToGive.value === computerCardRequest.value) {
            const computerHandFiltered = computerCards.filter((card) => {
              return card.value !== computerCardRequest.value;
            });
            const userHandFiltered = userCards.filter((card) => {
              return card.value !== computerCardRequest.value;
            });

            checkForGameEnd();
            dealNewHand(checkForGameEnd);
            checkForGameEnd();
            userCards = userHandFiltered;
            computerCards = computerHandFiltered;
            renderComputerCards();
            renderUserCards();
            computerScore += 1;
            $('#computerScore').text(`Pairs: ${computerScore}`);
            $('#computerScore').addClass('flash');
            setTimeout(removeFlashComputer, 500);
          }

          if (player === 'player2') {
            checkForGameEnd();
            dealNewHand(checkForGameEnd);
            computerCardRequest = randomCardRequest();
          }
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

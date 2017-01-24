#Go Fish!

###[<img src="/images/gofishsmall.png">](https://vimeo.com/195285371)

##What problem does it solve?

I'd like an application that is interactive and intellectually stimulating that my toddler son can play while I do chores, exercise, etc.

##Who has this problem?

Martha is a young, active, single mother of a five-year old boy. She works a full-time job and at night she needs an application that her son can play while she takes a half hour to herself. She wants the application to be intellectually stimulating, focusing on topics her son is learning: shapes, numbers, letters, and reading. At the same time she wants it to keep his attention for the full half hour.

###Context:
Martha arrives home with her son, who she just picked up from daycare. She is exhausted after working a full day at work but she still wants to get a half hour of exercise in. But there is no one around to watch her son and it is hard to occupy him with an application that keeps his attention but still serves a positive purpose: to stimulate her son intellectually. She lets her son use her phone to play Go Fish!

##How does the project solve this problem?

The application incorporates shapes, letters, and numbers.

The application is interactive and fun to play.

##What web APIs does it use?

The application uses the Deck of Cards API.

##What technologies does it use?

The application uses CSS, HTML, JavaScript, jQuery, Ajax and Materialize.

##What was the most valuable piece of Customer feedback received?

The best piece of feedback was in regards to keeping track of player turns. Through this feedback as well as observing the Customer struggle with determining whose turn it was I was able to come up with a fix. In this case it was coloring the name of the player whose turn it currently is.

##What was the biggest challenge to overcome?

For this project the problem was and still is asynchronous behavior due to the API calls. Some of the issues related to these race conditions were solved using callback functions. This allowed for game logic to run after the data from the API call came back.

##Future Goals:

1. Deal with bugs that arise at the end of a game cycle

    In order to complete the full first version of this application the game must be able to get through the game without issues every time. There are certain restrictions in the game play in this version but the game must be able to complete without error even with these restrictions.

    The issues that arise at the end of the game are most likely due to race conditions. There is a lot of automatic game logic happening at once at the very end of the game. It appears that the sequence of this game logic is out of order. This, I believe, is another issue arising from the asynchronous behavior caused by the Ajax calls to the API.

2. Remove the restrictions from the game play and incorporate the full set of   game rules.

3. Add a tutorial showing the rules of the game as well as how this particular version of the game works.

4. Make the computer logic smarter.

5. Create the ability to play against another human player.

6. Create the ability to play against multiple human players.

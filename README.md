# Two Up Digital Test Task

## Task Description

Write a server which is a "randomization machine" of 6 numbers from 1 to 49 for each full minute (backend) and a page that allows you to select the numbers for the next draw. (frontend).
The numbers should be sent via the websocket to the server, and at the time of the drawing, the server should return the result of the drawing with this websocket and how many numbers have been hit (to each connected client). Visually, it can be as simple as possible.
It will be perfect if the frontend is in React and the backend in Rust. When it comes to Rust preffered framework is Actix but do not hesitate to use one that you deserve or you can use NodeJS.

## Structure:

<img src="https://referenceprojects-abkno.run-eu-central1.goorm.io/src/github/testdocuments/wire.jpg" height="300px" >
</br>

- Main Page
  - Board
  - Chat
  - ScoreBoard
  - Bet Button

## Final Product

<img src="https://referenceprojects-abkno.run-eu-central1.goorm.io/src/github/testdocuments/reactbingo.png" height="400px">

# Main Game

## Rules

- All players starts with 100 points.
- In every minutes the new numbers are rolled
- This game is Multiplayer, everybody can join to.
- If the player bets in a round, that costs 6 points.
- Each match gives 6 points back.

## Scheduldes:

- 00:50 : Are bets are closed
- 00:01 : Calculate and sends all scores
- 00:04 : Generate the new round's numbers
- 00:05 : Send the new numbers back to the clients

## Extra features

- Mutual chat for the players
  - The chat shows the Player's name and the message.
- Mutual Scoreboard

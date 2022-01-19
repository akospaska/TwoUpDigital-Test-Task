import express, { Request, Response } from "express";
import { CronJob } from "cron";

import bodyParser from "body-parser";

import Rule from "./classes/Rule/Rule";
import Formatter from "./classes/formatter/Formatter";

const formatter = new Formatter();
const rule = new Rule();

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(__dirname + "/public"));

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

interface scoreBoard {
  socketId?: string;
  playerName: string;
  actualScore: number;
}

interface roundType {
  socketId: string;
  bet: number[];
}

interface message {
  message: string;
  playerName?: string;
}

//actual scoreboard
let scoreBoard: scoreBoard[] = [];

//holds the actual round's bets and the player's socketIDs
let round: roundType[] = [];

//the actual rolled number array
let theNumber: number[] = [0];

//is the bet avalaible or not
let betAvalaible: boolean = true;

//empty the actual rolled numbers array and fill with the new values
const getRandomNumber = () => {
  theNumber.length = 0;
  theNumber = rule.generateRandomNumberArray();
};

//generate by every start
getRandomNumber();

io.on("connection", (socket: any) => {
  socket.on("join_room", async (data: scoreBoard) => {
    //if a player has been joined, the socketId and the player name will be pushed to the scoreboard
    scoreBoard.push({ socketId: socket.id, playerName: data.playerName, actualScore: 100 });

    //all the players are joins ti the "TheGame" room
    socket.join("TheGame:");

    //sends the new scoreboard
    socket.to("TheGame:").emit("get_scores", formatter.getPublicScoreBoard(scoreBoard));
  });

  socket.on("get_scores", () => {
    //sends the scoreboard
    socket.to("TheGame:").emit("get_scores", formatter.getPublicScoreBoard(scoreBoard));
  });

  socket.on("take_bets", (data: number[]) => {
    if (!betAvalaible) {
      return;
    }

    //fill the actual round's bets array with the new bet
    const betByPlayer: roundType = { socketId: socket.id, bet: data };
    round.push(betByPlayer);
  });

  socket.on("send_message", (data: message) => {
    //get the playerName based on the socketId
    const playerName = scoreBoard.find((a) => a.socketId === socket.id)?.playerName;

    //to be sure, we send back the plazername based on the stored values, not what the client has been sent.
    data.playerName = playerName;

    socket.to("TheGame:").emit("receive_message", data);
  });

  socket.on("rolled_number", () => {
    //sends the new rolled number
    socket.to("TheGame:").emit("rolled_number", theNumber);
  });

  socket.on("disconnect", () => {
    //remove the player from the scoreboard
    scoreBoard = scoreBoard.filter((a) => a.socketId !== socket.id);

    //refresh the scoreboard by the clients
    socket.to("TheGame:").emit("get_scores", formatter.getPublicScoreBoard(scoreBoard));
    console.log("User Disconnected", socket.id);
  });

  socket.on("bet_avalaible", () => {
    //get the bet status
    socket.to("TheGame:").emit("bet_avalaible", betAvalaible);
  });

  //00:50 disable all bets
  const cronJob2 = new CronJob("50 * * * * *", () => {
    betAvalaible = false;
    socket.to("TheGame:").emit("bet_avalaible", betAvalaible);
  });

  cronJob2.start();

  // 00:01 set the new coreboard scores based on the bets
  const cronJob = new CronJob("1 * * * * *", async () => {
    round.map((roundObject) => {
      scoreBoard.map((scoreBoardElement, b) => {
        if (scoreBoardElement.socketId === roundObject.socketId) {
          scoreBoardElement.actualScore = rule.resultCalculator(theNumber, roundObject.bet, scoreBoardElement.actualScore);

          round = round.filter((filetItem) => filetItem.socketId != scoreBoardElement.socketId);
        }
      });
    });

    //refresh on the client side the new rolled numbers
    socket.to("TheGame:").emit("rolled_number", theNumber);

    //refresh on the client side the new scoreboard
    socket.to("TheGame:").emit("get_scores", formatter.getPublicScoreBoard(scoreBoard));
  });

  cronJob.start();

  //00:05set the bet avalaible back
  const cronJob3 = new CronJob("5 * * * * *", async () => {
    betAvalaible = true;
    round = [];
    socket.to("TheGame:").emit("bet_avalaible", betAvalaible);
  });

  cronJob3.start();
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

//generate the new numbers
const cronJob = new CronJob("4 * * * * *", async () => {
  getRandomNumber();
});

cronJob.start();

app.get("/getscoreboard", (req, res) => {
  res.send(formatter.getPublicScoreBoard(scoreBoard));
});

export = scoreBoard;

app.get("/", function (req, res) {
  res.render("index");
});

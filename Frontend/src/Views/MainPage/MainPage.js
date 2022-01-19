import React from "react";
import { useState, useEffect, Fragment } from "react";

import Board from "../../Components/Board/Board";
import Chat from "../../Components/Chat/Chat";
import ScoreBoard from "../../Components/ScoreBoard/ScoreBoard";
import Join from "../../Components/Join/Join";
import SendButton from "../../Components/SendButton/SendButton";

import io from "socket.io-client";

import backendEndpoint from "../../Api/BackendEndpoint";

const Socket = io.connect(backendEndpoint);

const MainPage = () => {
  const [socket, setSocket] = useState(Socket);
  const [playerName, setPlayerName] = useState("");

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betSent, setBetSent] = useState(false);
  const [betAvalaible, setBetAvalaible] = useState(true);

  //refresh the last round's numbers when they are changed
  useEffect(() => {
    if (betAvalaible) {
      setSelectedNumbers([]);
    }
  }, [betAvalaible]);

  //refresh the status is the bet avalaible or not
  useEffect(() => {
    socket.on("bet_avalaible", (data) => {
      setBetAvalaible(data);
    });
  }, [socket]);

  return (
    <div className="MainPage">
      <div className="MainPageHeader">
        <h1>React Bingo!!!</h1>
      </div>
      {playerName === "" ? (
        <Join playerName={playerName} setPlayerName={setPlayerName} socket={socket} />
      ) : (
        <Fragment>
          <Board
            socket={socket}
            selectedNumbers={selectedNumbers}
            setSelectedNumbers={setSelectedNumbers}
            setBetAvalaible={setBetAvalaible}
            betAvalaible={betAvalaible}
          />
          <Chat socket={socket} playerName={playerName} />
          <ScoreBoard socket={socket} />
          <SendButton
            setBetAvalaible={setBetAvalaible}
            betAvalaible={betAvalaible}
            selectedNumbers={selectedNumbers}
            setSelectedNumbers={setSelectedNumbers}
            socket={socket}
            betSent={betSent}
            setBetSent={setBetSent}
          />
        </Fragment>
      )}
    </div>
  );
};

export default MainPage;

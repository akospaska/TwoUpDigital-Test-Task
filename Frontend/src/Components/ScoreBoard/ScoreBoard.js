import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import React, { useState, useEffect } from "react";

import axios from "axios";
import backendEndpoint from "../../Api/BackendEndpoint";

const ScoreBoard = (props) => {
  const [players, setPlayers] = useState([]);

  const { socket } = props;

  //
  const getScoreBoardData = () => {
    var config = {
      method: "get",
      url: backendEndpoint + "/getscoreboard",
    };

    axios(config)
      .then(function (response) {
        setPlayers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getScoreBoardData();
  }, []);

  useEffect(async () => {
    const x = await socket.emit("get_scores");
    setPlayers(x);
  }, []);

  useEffect(async () => {
    await socket.on("get_scores", (data) => {
      setPlayers(data);
    });
  }, [socket]);

  return (
    <div className="scoreBoard">
      <div>Players:</div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          {players.length > 0
            ? players.map((a, b) => (
                <div key={b} className="playerListItem">
                  {a.playerName}: {a.actualScore} Points
                </div>
              ))
            : ""}
        </Grid>
      </Box>
    </div>
  );
};

export default ScoreBoard;

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import React, { useState, useEffect } from "react";

//Generate the board
let numbers = [];
for (let i = 0; i < 48; i++) {
  numbers.push(1);
}

const Board = (props) => {
  const [lastNumber, setLastNumber] = useState([0]);
  const { socket, selectedNumbers, setSelectedNumbers, betAvalaible } = props;

  //refresh tha last round's number
  useEffect(() => {
    socket.on("rolled_number", (data) => {
      setLastNumber(data);
    });
  }, [socket]);

  const numberPicker = (number) => {
    //If the game current status doesn't allow to pick a number, than return.
    if ((selectedNumbers.length >= 6 && selectedNumbers.includes(number) === false) || betAvalaible === false) {
      return;
    }

    //If its allready selected, than it will be deselected.
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((a) => a != number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  return (
    <div className="board">
      <h2>The last Winner numbers are: {lastNumber.length === 1 ? "Waiting for result!!!" : lastNumber.join("; ")}</h2>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          {numbers.map((a, b) => (
            <div key={b} className={`number ${selectedNumbers.includes(b + 1) ? "selected" : ""}`} onClick={() => numberPicker(b + 1)}>
              {b + 1}
            </div>
          ))}
        </Grid>
      </Box>
      <h4>{betAvalaible ? "Please take your bets!" : "Bets are disabled. Please wait for the next round"}</h4>
    </div>
  );
};

export default Board;

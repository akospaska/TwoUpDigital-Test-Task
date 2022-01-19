import { useState } from "react";

const Join = (props) => {
  const [inputValue, setInputValue] = useState("");

  const { setPlayerName, socket } = props;

  const joinGame = () => {
    setPlayerName(inputValue);
    socket.emit("join_room", { playerName: inputValue });
  };

  return (
    <div className="joinContainer">
      <p>Give me Your name!</p>

      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <button onClick={(e) => joinGame()}>Join</button>
    </div>
  );
};

export default Join;

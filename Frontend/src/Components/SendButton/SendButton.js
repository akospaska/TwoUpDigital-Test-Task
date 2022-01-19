const SendButton = (props) => {
  const { selectedNumbers, socket, setBetSent, betAvalaible, setBetAvalaible } = props;

  const sendBets = async () => {
    setBetSent(true);
    await socket.emit("take_bets", selectedNumbers);
    setBetAvalaible(false);
  };

  return (
    <div className="sendButtonContainer">
      <button
        className={selectedNumbers.length < 6 || betAvalaible === false ? "buttonDisabled" : ""}
        disabled={selectedNumbers.length < 6 || betAvalaible === false ? "buttonDisabled" : ""}
        onClick={() => sendBets()}
      >
        <p>Send</p>
      </button>
    </div>
  );
};

export default SendButton;

import React, { useState, useEffect } from "react";

const Chat = (props) => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [messageList, setMessageList] = useState([]);

  const { socket, playerName } = props;

  //send message to the backend and reset the current input value
  const sendMessage = async () => {
    if (inputTextValue !== "") {
      const messageData = {
        message: inputTextValue,
        playerName: playerName,
        // time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setInputTextValue("");
    }
  };

  //refresh the messageList if a new message has come
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat">
      <h3>Chat</h3>
      <div className="messageContainer">
        <ul>
          {messageList.map((a, b) => {
            return (
              <li key={b}>
                <span>{a.playerName}:</span> {a.message}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="chatControlPanel">
        <input value={inputTextValue} onChange={(e) => setInputTextValue(e.target.value)} />
        <button onClick={() => sendMessage()}>Send message</button>
      </div>
    </div>
  );
};

export default Chat;

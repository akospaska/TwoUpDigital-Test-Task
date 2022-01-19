import scoreBoard from "../..";

class Formatter {
  getPublicScoreBoard(scoreBoard: scoreBoard[]) {
    //clone the scoreboard results and clone a public scoreboard without the socketID
    const cloneArray = [...scoreBoard];
    const clone: scoreBoard[] = cloneArray.map((scoreBoardItem) => {
      const copyOfScoreBoard: scoreBoard = Object.assign({}, scoreBoardItem);
      delete copyOfScoreBoard.socketId;
      return copyOfScoreBoard;
    });

    return clone;
  }

  getNextDrawingTime() {
    const actualSeconds = Number(new Date(Date.now()).getSeconds());

    let status;

    if (actualSeconds < 50 && actualSeconds > 5) {
      status = { status: "before", seconds: 50 - actualSeconds };
    } else {
      status = { status: "after" };
    }
    return status;
  }
}
export = Formatter;

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
}
export = Formatter;

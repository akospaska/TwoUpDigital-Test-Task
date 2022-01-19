class Rule {
  resultCalculator(currentRoundNumbers: number[], playerBet: number[], actualScore: number): number {
    let currentPoint: number = 0;

    //every bet costs 6 points. every match gives 6 points back.
    currentRoundNumbers.map((resultNumberElement) => {
      playerBet.includes(resultNumberElement) ? (currentPoint = currentPoint + 6) : "";
    });

    return actualScore + (-6 + currentPoint);
  }
  generateRandomNumberArray(): number[] {
    let newNumbersContainer: number[] = [];

    //if the array contains the new random number, than skip and generate a new one.
    while (newNumbersContainer.length < 6) {
      const theNewRandomNumber = Math.floor(Math.random() * 49) + 1;

      if (newNumbersContainer.includes(theNewRandomNumber)) {
      } else {
        newNumbersContainer.push(theNewRandomNumber);
      }
    }

    return newNumbersContainer;
  }
}

export = Rule;

import React, { Component } from "react";
import "./App.css";
import RollsDiv from "./roll";

const getRollScore = (roll, x, rolls) => {
  let rollScore =
    roll.firstScore + (roll.secondScore || 0) + (roll.thirdScore || 0);

  if (roll.spare) {
    const nextRoll = rolls[x + 1];
    if (nextRoll) rollScore += nextRoll.firstScore;
  }

  if (roll.strike) {
    const nextRoll = rolls[x + 1];
    if (nextRoll)
      rollScore += nextRoll.firstScore + (nextRoll.secondScore || 0);
  }

  return rollScore;
};

const getFinalScore = (rolls, x) => {
  const roll = rolls[x];
  if (!roll) return null;

  return rolls
    .slice(0, x + 1)
    .reduce((prev, curr, index) => prev + getRollScore(curr, index, rolls), 0);
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      rolls: [],
      finalresult: "Waiting..."
    };
  }

  getRandomNumber() {
    const min = 0;
    let max = 11;
    const { rolls } = this.state;

    if (rolls.length > 0) {
      const lastRoll = rolls[rolls.length - 1];
      lastRoll.finished === false && !lastRoll.bonusRound
        ? (max = 11 - lastRoll.firstScore)
        : (max = 11);
    }

    return Math.floor(Math.random() * (max - min)) + min;
  }

  addNewRoll() {
    const { rolls } = this.state;
    let { finalresult } = this.state;
    let rollConcat = rolls.concat();
    const lastRoll = rolls[rolls.length - 1];
    let final = rolls.length === 9;
    const firstScore = this.getRandomNumber();

    const strike = firstScore === 10;
    const newRoll = {
      playindex: rolls.length,
      firstScore,
      secondScore: null,
      thirdScore: null,
      spare: false,
      strike,
      finished: !final && strike,
      bonusRound: final && strike
    };
    this.setState({ rolls: [...rollConcat, newRoll], finalresult });
  }

  roll() {
    const { rolls } = this.state;

    if (rolls.length === 0) {
      this.addNewRoll();
      return;
    }

    const lastRoll = rolls[rolls.length - 1];

    if (rolls.length === 10 && lastRoll.finished) {
      return alert("Game Over!");
    }

    if (lastRoll.finished === true) {
      this.addNewRoll();
      return;
    }

    const newRolls = rolls.map((roll, index) => {
      if (index !== rolls.length - 1) {
        return roll;
      }

      const secondScore = roll.bonusRound
        ? roll.secondScore
        : this.getRandomNumber();
      const thirdScore = roll.bonusRound
        ? this.getRandomNumber()
        : roll.thirdScore;
      const final = rolls.length === 10;
      const spare = !roll.strike && roll.firstScore + secondScore === 10;

      return {
        ...roll,
        secondScore,
        thirdScore,
        spare,
        finished: !(final && spare),
        bonusRound: final && spare
      };
    });

    this.setState({ rolls: newRolls });
  }

  refresh() {
    this.setState({ rolls: [] });
  }

  render() {
    const DivRolls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <div className="App">
        <div className="title">
          <h1 className="titletext">BOWLING GAME</h1>
        </div>
        <div className="divButton">
          <button className="buttonRoll" onClick={() => this.roll()}>
            ROLL!
          </button>
        </div>
        <div className="pontuation">
          {DivRolls.map(x => {
            const roll = this.state.rolls[x] || {};
            const rolls = this.state.rolls;
            let finalScore = getFinalScore(this.state.rolls, x);
            return (
              <RollsDiv
                roll={roll}
                x={x}
                last={DivRolls.length - 1}
                key={x}
                finalScore={finalScore}
              />
            );
          })}
        </div>
        <div className="finalresult">
          FINAL RESULT:{" "}
          {this.state.rolls.length === 10 && this.state.rolls[9].finished
            ? getFinalScore(this.state.rolls, 9)
            : "Waiting..."}
        </div>
        <div className="refreshdiv">
          <button className="refreshbutton" onClick={() => this.refresh()}>
            Restart
          </button>
        </div>
      </div>
    );
  }
}

export default App;

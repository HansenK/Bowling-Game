import React, { Component } from "react";
import "./App.css";
import RollsDiv from "./roll";

const getRollScore = (roll, x, rolls) => {
  let rollScore = roll.firstScore + (roll.secondScore || 0);

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
      rolls: []
    };
  }

  getRandomNumber() {
    const min = 0;
    let max = 11;
    const { rolls } = this.state;

    if (rolls.length > 0) {
      const lastRoll = rolls[rolls.length - 1];
      lastRoll.finished === false
        ? (max = 11 - lastRoll.firstScore)
        : (max = 11);
    }

    return Math.floor(Math.random() * (max - min)) + min;
  }

  addNewRoll() {
    const { rolls } = this.state;
    const lastRoll = rolls[rolls.length - 1];
    const penultimate = rolls[rolls.length - 2];
    const firstScore = this.getRandomNumber();
    let final;

    if (rolls.length > 8) {
      if (lastRoll.strike || lastRoll.spare) {
        final = 11;
      } else {
        final = 10;
      }
    }

    if (final === 10) return alert("Acabou!");

    const strike = firstScore === 10;
    const newRoll = {
      playindex: rolls.length,
      firstScore,
      secondScore: null,
      spare: false,
      strike,
      finished: strike
    };
    this.setState({ rolls: [...rolls, newRoll] });
  }

  roll() {
    const { rolls } = this.state;

    if (rolls.length === 0) {
      this.addNewRoll();
      return;
    }

    const lastRoll = rolls[rolls.length - 1];
    const penultimate = rolls[rolls.length - 2];

    if (lastRoll.finished === true) {
      this.addNewRoll();
      return;
    }

    const newRolls = rolls.map((roll, index) => {
      if (index !== rolls.length - 1) {
        return roll;
      }

      const secondScore = this.getRandomNumber();

      return {
        ...roll,
        secondScore,
        spare: roll.firstScore + secondScore === 10,
        finished: true
      };
    });

    this.setState({ rolls: newRolls });
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
            const finalScore = getFinalScore(this.state.rolls, x);
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
      </div>
    );
  }
}

export default App;

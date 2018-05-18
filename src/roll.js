import React, { Component } from "react";

export default class RollsDiv extends Component {
  render() {
    const { finalScore, x, last, finalResult } = this.props;
    const { firstScore, secondScore, strike, thirdScore } = this.props.roll;
    return (
      <div>
        <div className="rolls">
          <div className="firsttrie">
            <span className="resulttrie">{firstScore}</span>
          </div>
          <div
            className={x === last ? "secondtrie10" : "secondtrie"}
            style={strike ? { backgroundColor: "black" } : null}
          >
            <span className="resulttrie">{secondScore}</span>
          </div>
          {x === last ? (
            <div className="thirdtrie">
              <span className="resulttrie">{thirdScore}</span>
            </div>
          ) : null}
          <span className="result">{finalScore}</span>
        </div>
      </div>
    );
  }
}

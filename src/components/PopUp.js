import React from "react";

import Dealer from "./Dealer";
import Player from "./Player";

class PopUp extends React.Component {
  render() {
    return (
      <div className="popupBox">
        <div>
          <h1>The Winner is: {this.props.winner} !!</h1>
        </div>

        <div className="tableBox">
          <div>
            <Dealer
              dealerCards={this.props.dealerCards}
              dealerSum={this.props.dealerSum}
              playerFinish={this.props.playerFinish}
            />
          </div>
          <div>
            <Player
              playerCards={this.props.playerCards}
              playerSum={this.props.playerSum}
            />
          </div>
        </div>

        <div>
          <button className="optionButton">Replay</button>
        </div>
      </div>
    );
  }
}

export default PopUp;

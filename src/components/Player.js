import React from "react";
import Cardview from "./Cardview";
//tomoorow
class Player extends React.Component {
  showCards = () => {
    let cards = this.props.playerCards.map((item, i) => {
      return <Cardview type="Player" key={i} cardURL={item.image} />;
    });
    return (
      <div>
        <div>{cards}</div>
      </div>
    );
  };
  render() {
    return (
      <div>
        <div className="deckBox">
          <div className="sumCircle" style={{ display: "block" }}>
            {this.props.playerSum}
          </div>
          <div>{this.showCards()}</div>
        </div>
      </div>
    );
  }
}
export default Player;

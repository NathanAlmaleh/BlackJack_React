import React from "react";
import Cardview from "./Cardview";

class Player extends React.Component {
  showCards(props) {
    let backCard = "Undefined";
    let firstCard = (
      <Cardview key={0} cardURL={this.props.dealerCards[0].image} />
    );

    if (!this.props.playerFinish) {
      backCard = <Cardview key={1} cardURL="img/backCardImg.jpg" />;
    } else {
      firstCard = "";
      backCard = this.props.dealerCards.map((item, i) => {
        return <Cardview key={i} cardURL={item.image} />;
      });
    }

    return [firstCard, backCard];
  }

  render() {
    return (
      <div>
        <div className="deckBox">
          <div
            className="sumCircle"
            style={
              this.props.playerFinish
                ? { display: "block" }
                : { display: "none" }
            }
          >
            {this.props.dealerSum}
          </div>
          {this.showCards()}
        </div>
      </div>
    );
  }
}
export default Player;

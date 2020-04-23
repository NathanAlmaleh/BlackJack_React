import React from "react";

import Options from "./Options";
import Dealer from "./Dealer";
import Player from "./Player";
import Board from "./Board";

class GameAlgo extends React.Component {
  constructor() {
    super();
    this.state = {
      endGame: "none",
      isLoad: true,
      DealerSum: null,
      playerSum: null,
      playerCards: [],
      dealerCards: []
    };
  }

  componentDidMount() {
    // this.setState({ isLoad: true });
    this.fetchCards("player", this.props.amount);
    this.fetchCards("dealer", this.props.amount);
    // this.setState({
    //   isload: false
    // });
  }

  fetchCards(type, cardsAmount) {
    //console.log(cardsAmount, this.state.isLoad);
    fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${cardsAmount}`)
      .then(response => response.json())
      .then(data => {
        if (type === "player") {
          this.playerDeck(data);
          this.countSum("player");
        } else {
          //dealer
          this.dealerDeck(data);
          this.countSum("dealer");
          this.setState({ isLoad: false });
        }
      });
  }
  dealerDeck(NewCards) {
    this.setState({
      dealerCards: [...this.state.dealerCards, ...NewCards.cards]
    });
  }
  playerDeck(NewCards) {
    this.setState({
      playerCards: [...this.state.playerCards, ...NewCards.cards]
    });
  }

  countSum(type) {
    let sum = 0;
    if (type === "player") {
      for (let item in this.state.playerCards) {
        let stVal = this.state.playerCards[item].value;
        let val = this.cardValue(stVal);
        sum += val;
      }
    } else {
      for (let item in this.state.dealerCards) {
        let stVal = this.state.dealerCards[item].value;
        let val = this.cardValue(stVal);
        sum += val;
      }
    }

    if (type === "player") {
      this.setState({
        playerSum: sum
      });
    } else {
      this.setState({
        DealerSum: sum
      });
    }
  }

  cardValue(string) {
    let val = parseInt(string, 10);
    if (val < 11) return val;
    //need to check the ACE value
    return 10;
  }
  // viewPlayer = () => {
  //   let cards = this.state.playerCards.map((item, i) => {
  //     return <Cardview key={i} cardURL={item.image} />;
  //   });
  //   return (
  //     <div>
  //       <div>{cards}</div>
  //       <h3>{this.state.playerSum}</h3>
  //     </div>
  //   );
  // };

  // DealerCards = () => {
  //   let cards = this.state.dealerCards.map((item, i) => {
  //     return <Cardview key={i} cardURL={item.image} />;
  //   });

  //   return (
  //     <div>
  //       <div>{cards}</div>
  //       <h3>{this.state.DealerSum}</h3>
  //     </div>
  //   );
  // };

  checkval() {
    return this.state.playerSum <= 21;
  }

  hitCard() {
    console.log("player requested hit");
    if (this.checkval()) {
      this.fetchCards("player", 1);
    } else {
      console.log("player lost");
      this.setState({
        endGame: "true"
      });
    }
  }

  stand() {
    console.log("stand");
  }

  restartGame() {
    console.log("restart game");
    //need to see how to display the loosing last card before restarting game
    return (
      <div>
        <Board />
      </div>
    );
  }
  render() {
    if (this.state.isLoad === false) {
      if (this.checkval() === false) {
        return this.restartGame();
      } else {
        return (
          <div className="tableBox">
            <div>
              <Dealer
                dealerCards={this.state.dealerCards}
                DealerSum={this.state.DealerSum}
              />
            </div>
            <div>
              <Player
                playerCards={this.state.playerCards}
                playerSum={this.state.playerSum}
              />
            </div>
            <div>
              <Options stand={() => this.stand()} hit={() => this.hitCard()} />
            </div>
          </div>
        );
      }
    } else {
      return <h1>Loading data....</h1>;
    }
  }
}

export default GameAlgo;

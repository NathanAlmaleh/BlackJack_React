import React from "react";
import Options from "./Options";
import Dealer from "./Dealer";
import Player from "./Player";
import Loading from "./Loading";

class GameAlgo extends React.Component {
  constructor() {
    super();
    this.state = {
      LoadAPI: false,
      playerFinish: false,
      dealerFinish: false,
      playerWin: false,
      restartGame: false,
      dealerSum: 0,
      playerSum: 0,
      playerCards: [],
      dealerCards: []
    };
  }

  componentDidMount() {
    this.fetchCards("player", this.props.amount);
    this.fetchCards("dealer", this.props.amount);
  }

  fetchCards(cardHolder, cardsAmount) {
    fetch(
      `https://deckofcardsapi.com/api/deck/${
        this.props.id
      }/draw/?count=${cardsAmount}`
    )
      .then(response => response.json())
      .then(data => {
        if (cardHolder === "player") {
          //initialize playerCards
          this.playerDeck(data);
          this.countSum("player");
        } else {
          //dealer
          this.dealerDeck(data);
          this.countSum("dealer");
          // if(this.playerFinish){this.dealerTurn()}
          this.setState({ LoadAPI: true });
        }
      });
  }

  //Loads dealer card deck
  dealerDeck(NewCards) {
    this.setState({
      dealerCards: [...this.state.dealerCards, ...NewCards.cards]
    });
  }
  //Loads player card deck
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
        let val = this.cardValue(stVal, type);
        sum += val;
      }
      this.setState({ playerSum: sum }, () => {
        this.playerToggleController();
      });
    } else if (type === "dealer") {
      for (let item in this.state.dealerCards) {
        let stVal = this.state.dealerCards[item].value;
        let val = this.cardValue(stVal, type);
        sum += val;
      }
      this.setState({ dealerSum: sum }, () => {
        this.dealerTurn();
      });
    }
  }

  cardValue(cardVal, type) {
    let val = parseInt(cardVal, 10);
    if (val < 11) return val;
    //TODO: calculate ACE value
    else if (cardVal === "ACE") {
      let sum;
      switch (type) {
        case "player":
          sum = this.state.playerSum;
          if (sum === 10) return 11;
          else if (sum + 11 > 21) return 1;
          else return 11;

        case "dealer":
          sum = this.state.dealerSum;
          if (sum === 10) return 11;
          else if (sum + 11 > 21) return 1;
          else return 11;

        default:
          return 11;
      }
    }
    return 10;
  }
  //TOGGLES:
  //TODO: sets playerFinish=true & calls dealerTurn()
  playerFinishToggle() {
    this.setState({ playerFinish: true }, () => {
      this.dealerTurn();
    });
  }

  //TODO: after calculates all cards & dealer is done
  //      checks if player wins else restart game
  dealerFinishToggle() {
    const playerSum = this.state.playerSum;
    const dealerSum = this.state.dealerSum;
    this.setState(
      { dealerFinish: true },
      playerSum <= 21 && (playerSum > dealerSum || dealerSum > 21)
        ? this.setState({ playerWin: true }, this.restartToggle()) &&
            console.log("player wins!")
        : this.restartToggle()
    );
  }

  //TODO: draw cards until dealerSum <= 17
  dealerTurn() {
    let dealerSum = this.state.dealerSum;

    if (dealerSum <= 17 && dealerSum < this.state.playerSum) {
      this.fetchCards("dealer", 1);
    } else this.dealerToggleController();
  }

  //TODO: update restartGame=true & sets the delay acordingly
  restartToggle() {
    setTimeout(
      () =>
        this.setState({
          restartGame: true
        }),
      this.state.playerWin ? 5500 : 3000
    );
  }

  //TODO: checks if dealer won AFTER playerFinish=true
  //      & call dealerFinishToggle
  dealerToggleController() {
    let dealerSum = this.state.dealerSum;
    let playerSum = this.state.playerSum;

    if (this.state.playerFinish) {
      console.log(this.state);
      console.log(
        "player: " +
          this.state.playerSum +
          " > dealer: " +
          this.state.dealerSum +
          " ?"
      );

      if (playerSum > 21) {
        console.log("Dealer win!!");
        this.dealerFinishToggle();
      } else if (dealerSum > playerSum && dealerSum < 22) {
        console.log("Dealer win!!");
        this.dealerFinishToggle();
      } else if (dealerSum === playerSum) {
        console.log("no Winners!");
        this.dealerFinishToggle();
      } else this.dealerFinishToggle();
    }
  }

  //TODO: checks playerSum status and terminiates turn
  //      when loses/wins by 21
  playerToggleController() {
    let playerSum = this.state.playerSum;

    if (playerSum > 21) {
      console.log("Player Lost!");
      this.playerFinishToggle();
    } else if (playerSum === 21) {
      console.log("Player Winner unless dealer has 21!");
      this.playerFinishToggle();
    }
  }

  //TODO: click-Action
  hitCard() {
    console.log("player requested hit");
    if (this.state.playerSum < 21) this.fetchCards("player", 1);
  }
  //TODO: stand button
  stand() {
    console.log("player stand");
    this.playerFinishToggle();
  }
  //TODO: split button
  split() {
    console.log("player requested split");
  }

  render() {
    if (!this.state.restartGame) {
      if (this.state.LoadAPI) {
        return (
          <div className="tableBox">
            <div
              className="popupBackground"
              style={
                this.state.playerWin
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              <h1> Winner !!! </h1>
            </div>

            <div>
              <Dealer
                dealerCards={this.state.dealerCards}
                dealerSum={this.state.dealerSum}
                playerFinish={this.state.playerFinish}
              />
            </div>
            <div>
              <Player
                playerCards={this.state.playerCards}
                playerSum={this.state.playerSum}
              />
            </div>
            <div>
              <Options
                stand={() => this.stand()}
                hit={() => this.hitCard()}
                split={() => this.split()}
                playerFinish={this.state.playerFinish}
              />
            </div>
          </div>
        );
      } else {
        return <Loading />;
      }
    } else {
      return <GameAlgo id={this.props.id} amount={2} />;
    }
  }
}

export default GameAlgo;

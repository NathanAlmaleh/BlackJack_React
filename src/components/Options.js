import React from "react";

class Options extends React.Component {
  render() {
    return (
      <div className="playerOptionBox">
        <button
          disabled={this.props.playerFinish}
          onClick={this.props.hit}
          className="optionButton"
        >
          {" "}
          Hit{" "}
        </button>
        <button
          disabled={this.props.playerFinish}
          onClick={this.props.stand}
          className="optionButton"
        >
          {" "}
          Stand{" "}
        </button>
        <button
          disabled={this.props.playerFinish}
          onClick={this.props.split}
          className="optionButton"
        >
          {" "}
          Split{" "}
        </button>
      </div>
    );
  }
}

export default Options;

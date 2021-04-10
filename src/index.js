import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];
    for (let row = 0; row < 3; row++) {
      let squares = [];
      for (let col = 0; col < 3; col++) {
        squares.push(this.renderSquare(col + (row * 3)));
      }
      board.push(<div className="board-row">{squares}</div>);
    }

    return (
      <div>{board}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      isAscendingHistory: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      let desc;
      if (move) {
        const diff = findDiff(history[move - 1].squares, history[move].squares);
        desc = ('Go to move #' + move + ('(' + (diff % 3) + ', ' + parseInt(diff / 3) + ')'));
      } else {
        desc = 'Go to game start';
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={{ fontWeight: (move === this.state.stepNumber) ? "bold" : "normal" }}>{desc}</button>
        </li>
      );
    });

    if (!this.state.isAscendingHistory) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ isAscendingHistory: !this.state.isAscendingHistory })}>{this.state.isAscendingHistory ? "Ascending" : "Descending"}</button>
          <ol>{moves}</ol>
        </div >
      </div >
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function findDiff(beforeSquares, afterSquares) {
  for (let i = 0; i < beforeSquares.length; i++) {
    if (beforeSquares[i] !== afterSquares[i]) {
      return i;
    }
  }
  return -1;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

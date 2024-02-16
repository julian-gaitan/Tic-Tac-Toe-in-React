
import { useState } from "react";

function Square({ value, onSquareClick, addWinnerDecoration }) {

  return (
    <button
      className={"square" + (addWinnerDecoration ? " square-winner" : "") }
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function MovesListOrder({ isDescenOrder, onReorder }) {
  
  function handleChange(e) {
    const { id } = e.target;
    onReorder(id === "des");
  }

  return (
    <fieldset className="game-order">
      <legend>Move Order</legend>
      <input type="radio" name="move-order" id="asc" checked={!isDescenOrder} 
        onChange={handleChange}
       />
      <label htmlFor="asc">Ascending</label>
      <br />
      <input type="radio" name="move-order" id="des" checked={isDescenOrder} 
        onChange={handleChange}/>
      <label htmlFor="des">Descending</label>
    </fieldset>
  );
}

function Board({ squares, xIsNext, onPlay }) {
  const { winner, cells } = calculateWinner(squares);
  const cellsPlayed = squares.reduce((prev, curr) => prev += curr != null, 0);
  const status = winner
    ? `Winner: ${winner}`
    : ( cellsPlayed < squares.length ? `Next player: ${xIsNext ? "X" : "O"}` : "Is a DRAW");

  function handleClick(i) {
    if (!squares[i] && !calculateWinner(squares).winner) {
      const nextSquares = squares.slice();
      nextSquares[i] = xIsNext ? "X" : "O";
      onPlay(nextSquares);
    }
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(3).keys()].map((row) => (
        <div key={row} className="board-row">
          {[...Array(3).keys()].map((col) => (
            <Square
              key={3 * row + col}
              value={squares[3 * row + col]}
              onSquareClick={() => handleClick(3 * row + col)}
              addWinnerDecoration={
                cells ? cells.includes(3 * row + col) : false
              }
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const [isDescenOrder, setIsDecenOrder] = useState(false);
  const currentSquares = history[history.length - 1];
  
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function handleReorder(descendOrAscend) {
    if (isDescenOrder !== descendOrAscend) {
      setIsDecenOrder(descendOrAscend);
    }
  }

  function jumpToPlay(i) {
    setHistory(history.slice(0, i));
    setXIsNext(0 === (i+1)%2);
  }

  function changeMoveOrder(arr) {
    return isDescenOrder ? arr.reverse() : arr;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay} />
        <MovesListOrder isDescenOrder={isDescenOrder} onReorder={handleReorder} />
      </div>
      <div className="game-info">
        <ol>
          {changeMoveOrder(
            history.map((squares, i, arr) => (
              <li key={i}>
                {i + 1 < arr.length ? (
                  <button onClick={() => jumpToPlay(i + 1)}>
                    {i !== 0 ? `Go to ${determineLastMove(arr[i], arr[i-1])}` : "Go to game start"}
                  </button>
                ) : (
                  <p>
                    {i !== 0 ? `You are at ${determineLastMove(arr[i], arr[i-1])}` : "You are at the game start"}
                  </p>
                )}
              </li>
            )))}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const result = {
    winner: undefined,
    cells: [],
  };
  const possibilities = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for(let i = 0; i < possibilities.length; i++) {
    const [a, b, c] = possibilities[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      result.winner = squares[a];
      result.cells = [a, b, c];
    }
  }
  return result;
}

function determineLastMove(currSquares, prevSquares) {
  for (let i = 0; i < currSquares.length; i++) {
    if (currSquares[i] && currSquares[i] !== prevSquares[i]) {
      return `${currSquares[i]}: row=${1+Math.trunc(i/3)}, col=${1+i%3}`;
    }
  }
}

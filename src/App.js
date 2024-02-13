
import { useState } from "react";

function Square({ value, onSquareClick }) {

  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, xIsNext, onPlay }) {

  const winner = calculateWinner(squares);
  const status = winner ? 
    ( `Winner: ${winner}` ) 
    : 
    ( `Next player: ${xIsNext ? "X" : "O"}` );
  
    function handleClick(i) {
      if (!squares[i] && !calculateWinner(squares)) {
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O";
        onPlay(nextSquares);
      }
    }

  return (<>
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    </div>
  </>);
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const currentSquares = history[history.length - 1];
  
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpToPlay(i) {
    setHistory(history.slice(0, i));
    setXIsNext(0 === (i+1)%2);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares}
          xIsNext={xIsNext}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>
          {history.map((squares, i) => 
            <li key={i}>
              <button onClick={() => jumpToPlay(i+1)}>
                {i !== 0 ? `Go to move #${i+1}` : `Go to game start`}
              </button>
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}

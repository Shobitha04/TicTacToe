import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./styles.css";

const XOGameComponents = () => {
  const [squares, setSquares] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).squares : Array(9).fill(null);
  });

  const [isXTurn, setIsXTurn] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).isXTurn : true;
  });

  const [winner, setWinner] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).winner : null;
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [winningLine, setWinningLine] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).winningLine : [];
  });

  const [playerOneWins, setPlayerOneWins] = useState(() => {
    return parseInt(localStorage.getItem("playerOneWins") || "0");
  });

  const [playerTwoWins, setPlayerTwoWins] = useState(() => {
    return parseInt(localStorage.getItem("playerTwoWins") || "0");
  });

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    localStorage.setItem(
      "gameState",
      JSON.stringify({
        squares,
        isXTurn,
        winner,
        winningLine,
      })
    );
  }, [squares, isXTurn, winner, winningLine]);

  useEffect(() => {
    localStorage.setItem("playerOneWins", playerOneWins.toString());
  }, [playerOneWins]);

  useEffect(() => {
    localStorage.setItem("playerTwoWins", playerTwoWins.toString());
  }, [playerTwoWins]);

  const handleClick = (index) => {
    if (squares[index] || winner) return;

    const newSquares = squares.slice();
    newSquares[index] = isXTurn ? "X" : "O";
    setSquares(newSquares);
    setIsXTurn(!isXTurn);

    checkWinner(newSquares);
  };

  const checkWinner = (board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningLine(combo);
        setShowConfetti(true);
        if (board[a] === "X") {
          setPlayerOneWins((prev) => prev + 1);
        } else {
          setPlayerTwoWins((prev) => prev + 1);
        }
        setTimeout(() => setShowConfetti(false), 6000);
        return;
      }
    }

    if (board.every((cell) => cell)) {
      setWinner("Draw");
    }
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setShowConfetti(false);
    setWinningLine([]);
  };

  const resetAllStats = () => {
    resetGame();
    setPlayerOneWins(0);
    setPlayerTwoWins(0);
    localStorage.clear();
  };

  return (
    <div className="game-container">
      {showConfetti && <Confetti />}

      <h1 className="game-title">TIC TAC TOE</h1>

      <div className="game-layout">
        <div className="card">
          <div className={`player-info ${isXTurn && !winner ? "active" : ""}`}>
            <div className="player-label">Player 1 (X)</div>
            <div className="player-symbol">X</div>
            <div className="win-count">Wins: {playerOneWins}</div>
          </div>
        </div>

        <div className="game-board-container">
          <div className="game-board">
            {squares.map((square, index) => (
              <button
                key={index}
                className={`board-cell ${
                  winningLine.includes(index) ? "winning" : ""
                } 
                  ${square ? "filled" : ""}`}
                onClick={() => handleClick(index)}
              >
                {square}
              </button>
            ))}
          </div>

          <div className="game-status">
            <div className="status-message">
              {winner
                ? winner === "Draw"
                  ? "Game is a Draw!"
                  : `${winner} Wins!`
                : `Current Turn: ${isXTurn ? "Player 1 (X)" : "Player 2 (O)"}`}
            </div>
            <div className="button-container">
              {winner && (
                <button className="play-again-button" onClick={resetGame}>
                  Play Again
                </button>
              )}
              <button className="reset-button" onClick={resetAllStats}>
                Reset All
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={`player-info ${!isXTurn && !winner ? "active" : ""}`}>
            <div className="player-label">Player 2 (O)</div>
            <div className="player-symbol">O</div>
            <div className="win-count">Wins: {playerTwoWins}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XOGameComponents;

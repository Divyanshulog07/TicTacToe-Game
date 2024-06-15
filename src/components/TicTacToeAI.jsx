import React, { useState, useEffect, useCallback } from "react";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import "../App.css";

function Block({ pos, grid, onClick }) {
  return (
    <div
      className="blocked flex flex-1 justify-center items-center"
      style={{
        fontSize: "40px",
        fontWeight: 500,
        color: "#767676",
      }}
      onClick={() => onClick(pos)}
    >
      {grid[pos]}
    </div>
  );
}

const GameStatus = {
  Init: "Init",
  Playing: "Playing",
  End: "End",
};

const initState = {
  grid: Array(9).fill(null),
  turn: null,
  gameStatus: GameStatus.Init,
  winner: null,
  you: null,
};

const Strategy = {
  random: (grid) => {
    const avail = [];
    grid.forEach((block, i) => {
      if (block === null) avail.push(i);
    });

    if (avail.length === 0) return null;
    return avail[Math.floor(Math.random() * avail.length)];
  },

  minimax: (grid, turn) => {
    const [gameStatus, winner] = gameCheck(grid);
    if (gameStatus === GameStatus.End) {
      if (winner === null) return [null, 0];
      return [null, -1];
    }

    let score = Number.MIN_SAFE_INTEGER;
    let posChoice = null;
    const nextTurn = turn === "O" ? "X" : "O";

    for (let pos of shuffle(range(grid.length))) {
      if (grid[pos] === null) {
        grid[pos] = turn;

        const [, oppoScore] = Strategy.minimax(grid, nextTurn);
        if (-oppoScore > score) {
          score = -oppoScore;
          posChoice = pos;
        }

        grid[pos] = null;

        if (score === 1) break;
      }
    }
    return [posChoice, score];
  },
};

const WIN_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const gameCheck = (grid) => {
  if (grid.filter((block) => block === null).length === 0) {
    return [GameStatus.End, null];
  }

  for (const cond of WIN_CONDITIONS) {
    if (cond.filter((idx) => grid[idx] === "O").length === 3) {
      return [GameStatus.End, "O"];
    }

    if (cond.filter((idx) => grid[idx] === "X").length === 3) {
      return [GameStatus.End, "X"];
    }
  }

  return [GameStatus.Playing, null];
};

function TicTacToeAI({ difficulty }) {
  const [state, setState] = useState(initState);
  const { grid, turn, gameStatus, winner, you } = state;

  const move = useCallback(
    (pos) => {
      if (grid[pos] === null) {
        const newGrid = [...grid];
        newGrid[pos] = turn;

        const [gameStatus, winner] = gameCheck(newGrid);

        let nextTurn = turn === "O" ? "X" : "O";
        if (gameStatus !== GameStatus.Playing) {
          nextTurn = null;
        }

        setState((preState) => ({
          ...preState,
          grid: newGrid,
          gameStatus,
          turn: nextTurn,
          winner,
        }));
      }
    },
    [grid, turn]
  );

  const aiMove = useCallback(() => {
    let pos;

    if (difficulty === "hard") {
      [pos] = Strategy.minimax(grid, turn);
    } else {
      pos = Strategy.random(state.grid);
    }

    move(pos);
  }, [difficulty, grid, move, state.grid, turn]);

  useEffect(() => {
    const handleAI = () => {
      if (turn !== you && gameStatus === GameStatus.Playing)
        setTimeout(aiMove, 500);
    };

    handleAI();

    return () => {
      clearTimeout();
    };
  }, [aiMove, difficulty, gameStatus, grid, state.grid, turn, you]);

  const start = (choice) => {
    setState((preState) => ({
      ...preState,
      grid: Array(9).fill(null),
      turn: "O",
      gameStatus: GameStatus.Playing,
      winner: null,
      you: choice,
    }));
  };

  const youMove = (pos) => {
    if (turn === you) move(pos);
  };

  return (
    <div className="relative">
      <div
        className="flex flex-col"
        style={{ width: "300px", height: "300px" }}
      >
        <div className="row flex flex-1">
          <Block pos={0} grid={grid} onClick={youMove} />
          <Block pos={1} grid={grid} onClick={youMove} />
          <Block pos={2} grid={grid} onClick={youMove} />
        </div>
        <div className="row flex flex-1">
          <Block pos={3} grid={grid} onClick={youMove} />
          <Block pos={4} grid={grid} onClick={youMove} />
          <Block pos={5} grid={grid} onClick={youMove} />
        </div>
        <div className="row flex flex-1">
          <Block pos={6} grid={grid} onClick={youMove} />
          <Block pos={7} grid={grid} onClick={youMove} />
          <Block pos={8} grid={grid} onClick={youMove} />
        </div>
      </div>
      {gameStatus !== GameStatus.Playing && (
        <div
          className="absolute top-0 left-0 bg-white opacity-92"
          style={{ width: "300px", height: "300px" }}
        />
      )}
      {gameStatus === GameStatus.Init && (
        <div
          className="absolute top-0 right-3 flex flex-col justify-center align-items-center uppercase"
          style={{
            width: "300px",
            height: "300px",
            fontSize: "40px",
            fontWeight: 500,
          }}
        >
          <div className="flex justify-center">Tic Tac Toe</div>
          <div className="flex ml-12">
            <div
              className="cursor-pointer text-base font-bold border-2 border-solid border-gray-300 py-2 px-8 rounded-md mt-8 bg-white text-gray-600 hover:bg-gray-300 transition duration-300 ease-in-out mr-10"
              onClick={() => start("O")}
            >
              O
            </div>
            <div
              className="cursor-pointer text-base font-bold border-2 border-solid border-gray-300 py-2 px-8 rounded-md mt-8 bg-white text-gray-600 hover:bg-gray-300 transition duration-300 ease-in-out"
              onClick={() => start("X")}
            >
              X
            </div>
          </div>
        </div>
      )}
      {gameStatus === GameStatus.End && (
        <div
          className="absolute top-0 right-3 flex flex-col justify-center align-items-center uppercase"
          style={{
            width: "300px",
            height: "300px",
            fontSize: "40px",
            fontWeight: 500,
          }}
        >
          <div className="flex justify-center">
            {winner ? `Winner: ${winner}` : "Draw"}
          </div>
          <div className="flex ml-12">
            <div
              className="cursor-pointer text-base font-bold border-2 border-solid border-gray-300 py-2 px-8 rounded-md mt-8 bg-white text-gray-600 hover:bg-gray-300 transition duration-300 ease-in-out mr-10"
              onClick={() => start("O")}
            >
              O
            </div>
            <div
              className="cursor-pointer text-base font-bold border-2 border-solid border-gray-300 py-2 px-8 rounded-md mt-8 bg-white text-gray-600 hover:bg-gray-300 transition duration-300 ease-in-out"
              onClick={() => start("X")}
            >
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToeAI;

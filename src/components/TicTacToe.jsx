import React, { useState, useRef } from "react";
import cloneDeep from "lodash/cloneDeep";
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

const initCheck = {
  rows: Array(3).fill(0),
  cols: Array(3).fill(0),
  diagonal: 0,
  antiDiagonal: 0,
  total: 0,
};

function TicTacToe() {
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("O");
  const [gameStatus, setGameStatus] = useState(GameStatus.Init);
  const [winner, setWinner] = useState(null);
  const check = useRef(null);

  const start = () => {
    check.current = cloneDeep(initCheck);
    setGrid(Array(9).fill(null));
    setTurn("O");
    setGameStatus(GameStatus.Playing);
    setWinner(null);
  };

  const move = (pos) => {
    if (grid[pos] === null) {
      const newGrid = [...grid];
      const [gameStatus, winner] = gameCheck(pos);

      newGrid[pos] = turn;
      setGrid(newGrid);
      setTurn(turn === "O" ? "X" : "O");
      setGameStatus(gameStatus);
      setWinner(winner);
    }
  };

  const gameCheck = (pos) => {
    const add = turn === "O" ? 1 : -1;
    const row = Math.floor(pos / 3);
    const col = pos % 3;

    check.current.rows[row] += add;
    check.current.cols[col] += add;
    if ([0, 4, 8].includes(pos)) check.current.diagonal += add;
    if ([2, 4, 6].includes(pos)) check.current.antiDiagonal += add;
    check.current.total++;

    if (
      Math.abs(check.current.rows[row]) === 3 ||
      Math.abs(check.current.cols[col]) === 3 ||
      Math.abs(check.current.diagonal) === 3 ||
      Math.abs(check.current.antiDiagonal) === 3
    ) {
      return [GameStatus.End, turn];
    }

    if (check.current.total === 9) {
      return [GameStatus.End, null];
    }

    return [GameStatus.Playing, null];
  };

  return (
    <div className="relative">
      <div
        className="flex flex-col"
        style={{ width: "300px", height: "300px" }}
      >
        <div className="row flex flex-1">
          <Block pos={0} grid={grid} onClick={move} />
          <Block pos={1} grid={grid} onClick={move} />
          <Block pos={2} grid={grid} onClick={move} />
        </div>
        <div className="row flex flex-1">
          <Block pos={3} grid={grid} onClick={move} />
          <Block pos={4} grid={grid} onClick={move} />
          <Block pos={5} grid={grid} onClick={move} />
        </div>
        <div className="row flex flex-1">
          <Block pos={6} grid={grid} onClick={move} />
          <Block pos={7} grid={grid} onClick={move} />
          <Block pos={8} grid={grid} onClick={move} />
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
          className="absolute top-0 left-0 flex flex-col justify-center align-items-center uppercase"
          style={{
            width: "275px",
            height: "300px",
            fontSize: "40px",
            fontWeight: 500,
          }}
        >
          <div className="flex justify-center">Tic Tac Toe</div>
          <div
            className="cursor-pointer text-base font-bold border-2 border-gray-300 rounded-md py-2 px-8 mt-8 bg-white text-gray-600 hover:bg-gray-300 transition duration-300 ease-in-out"
            onClick={start}
            style={{ width: "115px", marginLeft: 80 }}
          >
            Start
          </div>
        </div>
      )}

      {gameStatus === GameStatus.End && (
        <div
          className="absolute top-0 left-0 flex flex-col justify-center align-items-center uppercase"
          style={{
            width: "275px",
            height: "300px",
            fontSize: "40px",
            fontWeight: 500,
          }}
        >
          <div className="flex justify-center">
            {winner ? `Winner: ${winner}` : "Draw"}
          </div>
          <div
            className="cursor-pointer text-base font-bold border-2 border-gray-300 rounded-md py-2 px-8 mt-8 bg-white text-gray-600 hover:bg-gray-300 transition duration-300 ease-in-out"
            onClick={start}
            style={{ width: "170px", marginLeft: 55 }}
          >
            Start Over
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;

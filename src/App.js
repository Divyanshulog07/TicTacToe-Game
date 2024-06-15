import React from "react";
import TicTacToe from "./components/TicTacToe";
import TicTacToeAI from "./components/TicTacToeAI";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Tic_Tac_Toe_image from "./image/Tic-Tac-Toe.jpg";
import './App.css'; // Import your CSS file

function Menu() {
  return (
    <div className="menu flex text-base font-bold p-10">
      <NavLink
        exact
        to="/"
        className="menu-link"
      >
        Easy
      </NavLink>
      <NavLink
        to="/hard"
        className="menu-link"
      >
        Hard
      </NavLink>
      <NavLink
        to="/2players"
        className="menu-link"
      >
        2 Players
      </NavLink>
    </div>
  );
}

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="background-images">
        <img src={Tic_Tac_Toe_image} alt="" className="img1" />
        <img src={Tic_Tac_Toe_image} alt="" className="img2" />
        <img src={Tic_Tac_Toe_image} alt="" className="img3" />
        <img src={Tic_Tac_Toe_image} alt="" className="img4" />
        <img src={Tic_Tac_Toe_image} alt="" className="img5" />
        <img src={Tic_Tac_Toe_image} alt="" className="img6" />
        <img src={Tic_Tac_Toe_image} alt="" className="img7" />
        <img src={Tic_Tac_Toe_image} alt="" className="img8" />
      </div>
      <div className="w-screen h-screen flex flex-col items-center justify-center relative">
        <Menu />
        <Routes>
          <Route
            path="/hard"
            exact
            element={<TicTacToeAI difficulty="hard" />}
          />
          <Route path="/2players" exact element={<TicTacToe />} />
          <Route path="/" element={<TicTacToeAI key="default" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

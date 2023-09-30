import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Gaming.css";

function Gaming() {
  const [state, setState] = useState({
    name: "",
    email: "",
    mobile: "",
    difficulty: "easy",
    gameStarted: false,
    score: 0,
    timeLeft: 0,
    gameColor: "red",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const gameIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const levels = {
    easy: { n: 10, timeLeft: 40 },
    medium: { n: 15, timeLeft: 40 },
    hard: { n: 25, timeLeft: 40 },
  };

  const startGame = useCallback(() => {
    const colorChangeInterval = 2000;
    let isGreen = false;

    gameIntervalRef.current = setInterval(() => {
      setState((prevState) => ({
        ...prevState,
        gameColor: isGreen ? "red" : "green",
      }));
      isGreen = !isGreen;
    }, colorChangeInterval);

    countdownIntervalRef.current = setInterval(() => {
      setState((prevState) => ({
        ...prevState,
        timeLeft: prevState.timeLeft - 1,
      }));
    }, 1000);
  }, []);

  const endGame = useCallback(
    (isWin) => {
      clearInterval(gameIntervalRef.current);
      clearInterval(countdownIntervalRef.current);

      if (isWin) {
        alert("You win!");

        setLeaderboard((prevLeaderboard) => [
          ...prevLeaderboard,
          {
            name: state.name,
            score: state.score,
            difficulty: state.difficulty,
            timeLeft: state.timeLeft,
          },
        ]);
      } else {
        alert("Game Over!");
      }

      setState((prevState) => ({
        ...prevState,
        gameStarted: false,
        score: 0,
        timeLeft: 0,
        gameColor: "red",
      }));
    },
    [state.name, state.score]
  );

  useEffect(() => {
    if (state.gameStarted) {
      startGame();
    }
  }, [state.gameStarted, startGame]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.gameStarted) {
      endGame(false);
    }
  }, [state.timeLeft, state.gameStarted, endGame]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });

    if (name === "name") {
      setFormErrors({
        ...formErrors,
        name: value.length <= 5 ? "Name must be longer than 5 characters." : "",
      });
    } else if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      setFormErrors({
        ...formErrors,
        email: !value.match(emailPattern) ? "Invalid email format." : "",
      });
    } else if (name === "mobile") {
      setFormErrors({
        ...formErrors,
        mobile:
          value.length > 10 ? "Mobile number must be 10 digits or less." : "",
      });
    }
  };

  const handleStartGame = () => {
    const { difficulty, name, email, mobile } = state;

    if (!name || !email || !mobile || name.length <= 5) {
      alert(
        "Please fill in all form fields and correct errors before starting the game."
      );
      return;
    }

    setState({
      ...state,
      gameStarted: true,
      timeLeft: levels[difficulty].timeLeft,
    });
  };

  const handleClick = () => {
    const { gameColor, score, gameStarted } = state;
    const winningScore = getWinningScore();

    if (gameStarted) {
      if (gameColor === "green") {
        setState((prevState) => ({
          ...prevState,
          score: score + 1,
        }));

        if (score + 1 === winningScore) {
          endGame(true);
        }
      } else {
        endGame(false);
      }
    }
  };

  const getWinningScore = () => {
    const { difficulty } = state;
    return levels[difficulty].n + 1;
  };

  const {
    gameStarted,
    name,
    email,
    mobile,
    difficulty,
    score,
    timeLeft,
    gameColor,
  } = state;

  return (
    <div className="App">
      {gameStarted ? (
        <div className="game">
          <h2 className="light">Green Light Red Light Game</h2>
          <p className="player">Player Name: {name}</p>
          <p className="player">Difficulty Level: {difficulty}</p>
          <div className={`game-box ${gameColor}`} onClick={handleClick}></div>
          <p className="time">Time left: {timeLeft} seconds</p>
          <p className="score">Score: {score}</p>
        </div>
      ) : (
        <div>
          <h2>User Registration</h2>
          <form className="game-form">
            <label>Name:</label>
            <input
              className="game-input"
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              required
            />
            <p className="error">{formErrors.name}</p>
            <br />
            <label>Email:</label>
            <input
              className="game-input"
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />
            <p className="error">{formErrors.email}</p>
            <br />
            <label>Mobile Number:</label>
            <input
              className="game-input"
              type="tel"
              name="mobile"
              value={mobile}
              onChange={handleInputChange}
              required
            />
            <p className="error">{formErrors.mobile}</p>
            <br />
            <label>Difficulty Level:</label>
            <select
              className="game-select"
              name="difficulty"
              value={difficulty}
              onChange={handleInputChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <br />
            <button className="game-button" onClick={handleStartGame}>
              Start Game
            </button>
          </form>
        </div>
      )}

      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index} className="leaderboard-entry">
              {entry.name}: {entry.score} <br />
              {entry.difficulty} : {entry.timeLeft}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Gaming;

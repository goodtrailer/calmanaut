import React, { useEffect, useState } from 'react';
import '../styles/Timer.css';

const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

function Timer() {
  const [timeLimit, setTimeLimit] = useState(20); // Default time is 20 seconds
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timePassed, setTimePassed] = useState(0);
  const [remainingPathColor, setRemainingPathColor] = useState(COLOR_CODES.info.color);
  const [isActive, setIsActive] = useState(false); // To track if the timer is running

  useEffect(() => {
    let timerInterval = null;
    if (isActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimePassed(prev => prev + 1);
        setTimeLeft(timeLimit - (timePassed + 1));
        setCircleDasharray();
        setRemainingPathColor(getRemainingPathColor(timeLeft));
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerInterval);
      setIsActive(false);
    }

    return () => clearInterval(timerInterval);
  }, [isActive, timePassed, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimePassed(0);
    setTimeLeft(timeLimit);
    setRemainingPathColor(COLOR_CODES.info.color);
  };

  const handleTimeLimitChange = (event) => {
    const newTimeLimit = parseInt(event.target.value, 10) || 0;
    setTimeLimit(newTimeLimit);
    setTimeLeft(newTimeLimit); // Update timeLeft to reflect the new time limit
  };

  const formatTimeLeft = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  };

  const calculateTimeFraction = () => {
    const rawTimeFraction = timeLeft / timeLimit;
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
  };

  const setCircleDasharray = () => {
    const circleDasharray = `${(calculateTimeFraction() * 283).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  };

  const getRemainingPathColor = (timeLeft) => {
    if (timeLeft <= COLOR_CODES.alert.threshold) {
      return COLOR_CODES.alert.color;
    } else if (timeLeft <= COLOR_CODES.warning.threshold) {
      return COLOR_CODES.warning.color;
    }
    return COLOR_CODES.info.color;
  };

  return (
    // refer to https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/ for the animation
    <div id="app">
      <div className="time-input">
        <label class="timer-label">Set Timer (seconds): </label>
        <input
          type="number"
          value={timeLimit}
          onChange={handleTimeLimitChange}
          disabled={isActive} // Disable while timer is running
        />
      </div>
      <div className="base-timer"> 
        <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="base-timer__circle">
            <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
              id="base-timer-path-remaining"
              strokeDasharray="283"
              className={`base-timer__path-remaining ${remainingPathColor}`}
              d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" className="base-timer__label">
          {formatTimeLeft(timeLeft)} 
        </span>
      </div>
      <div className="timer-controls">
        <button onClick={handleStart} disabled={isActive || timeLeft === 0}>Start</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default Timer;

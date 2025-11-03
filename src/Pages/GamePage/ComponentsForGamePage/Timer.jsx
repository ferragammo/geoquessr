import React, { useEffect } from 'react';
import './Timer.css';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
};

const Timer = ({ timeLeft, onTick, onTimeOver, isPaused }) => {

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const timerId = setInterval(() => {
        onTick(); 
      }, 1000);

      return () => clearInterval(timerId); 
    } else if (timeLeft === 0) {
      onTimeOver(); 
    }
  }, [isPaused, timeLeft, onTick, onTimeOver]);

  return (
    <div className="timer-container">
      <div className="timer-display">{formatTime(timeLeft)}</div>
    </div>
  );
};

export default Timer;

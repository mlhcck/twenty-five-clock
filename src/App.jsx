import React, { useState, useEffect, useRef } from 'react';
import sound from "./assets/sound.wav";
import './App.css';
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { VscDebugStart, VscDebugPause, VscDebugRestart } from "react-icons/vsc";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isActive, setIsActive] = useState(false);
  const beepRef = useRef(null);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval);
            setIsActive(false);
            handleSwitchTimer();
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleReset = () => {
    setIsActive(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const handleIncrement = (type) => {
    if (!isActive) {
      if (type === 'break' && breakLength < 60) {
        setBreakLength((prev) => prev + 1);
      } else if (type === 'session' && sessionLength < 60) {
        setSessionLength((prev) => prev + 1);
        setTimeLeft((prev) => prev + 60);
      }
    }
  };

  const handleDecrement = (type) => {
    if (!isActive) {
      if (type === 'break' && breakLength > 1) {
        setBreakLength((prev) => prev - 1);
      } else if (type === 'session' && sessionLength > 1) {
        setSessionLength((prev) => prev - 1);
        setTimeLeft((prev) => prev - 60);
      }
    }
  };

  const handleStartStop = () => {
    setIsActive((prev) => !prev);
  };

  const handleSwitchTimer = () => {
    if (timerLabel === 'Session') {
      setTimerLabel('Break');
      setTimeLeft(breakLength * 60);
    } else {
      setTimerLabel('Session');
      setTimeLeft(sessionLength * 60);
    }
    beepRef.current.play();
    setIsActive(true);
  };

  return (
    <div id='main'>
      <div>
        <h2 id="break-label">Break Length</h2>
        <button id="break-increment" onClick={() => handleIncrement('break')}>
          <GoArrowUp />
        </button>
        <h2 id="break-length">{breakLength}</h2>
        <button id="break-decrement" onClick={() => handleDecrement('break')}>
          <GoArrowDown />
        </button>
      </div>
      <div>
        <h2 id="timer-label">{timerLabel}</h2>
        <h2 id="time-left">{`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}</h2>
        <button id="start_stop" onClick={handleStartStop}>
          {!isActive ? <VscDebugStart /> : <VscDebugPause />}
        </button>
        <button id="reset" onClick={handleReset}>
          <VscDebugRestart />
        </button>
        <audio id="beep" ref={beepRef} src={sound}></audio>
      </div>
      <div>
        <h2 id="session-label">Session Length</h2>
        <button id="session-increment" onClick={() => handleIncrement('session')}>
          <GoArrowUp />
        </button>
        <h2 id="session-length">{sessionLength}</h2>
        <button id="session-decrement" onClick={() => handleDecrement('session')}>
          <GoArrowDown />
        </button>
      </div>
    </div>
  );
}

export default App;
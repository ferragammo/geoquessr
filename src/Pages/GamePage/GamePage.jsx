import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameSettingsContext } from '../../Сontexts/GameSettingsContext';
import { calculatePoints } from '../../Utils/calculatePoints.js';
import { LocationsForEasyMode } from '../../CoordinatesOfPlaces/EasyMode.js';
import { LocationsForMediumMode } from '../../CoordinatesOfPlaces/MediumMode.js';
import { LocationsForHardMode } from '../../CoordinatesOfPlaces/HardMode.js';
import { saveResult } from '../../Services/ApiService.js';
import Timer from './ComponentsForGamePage/Timer.jsx';
import StreetView from "./ComponentsForGamePage/StreetView.jsx";
import Ymap from "./ComponentsForGamePage/Ymap.jsx";
import './GamePage.css';

const MAX_POINTS_PER_GAME = 10000;
const TIME_FOR_ROUND = 120


function getRandomLocations(locations) {
  const shuffled = [...locations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

const modeToLocationsMap = {
  Easy: LocationsForEasyMode,
  Medium: LocationsForMediumMode,
  Hard: LocationsForHardMode,
};

const GamePage = () => {
  const { selectedMode, rounds, userName } = useContext(GameSettingsContext);

  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_FOR_ROUND);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [randomLocations, setRandomLocations] = useState(() => {
    const selectedLocations = modeToLocationsMap[selectedMode] || LocationsForEasyMode;
    return getRandomLocations(selectedLocations);
  });
  const navigate = useNavigate();


  const amountOfRounds = rounds;
  const maxPointsPerRound = MAX_POINTS_PER_GAME / amountOfRounds;

  const handlePauseTimer = () => {
    setIsPaused(true);
  };

  const handleResult = (newDistance, newShowResult) => {
    setShowResult(newShowResult);
    const pointsForRound = calculatePoints(newDistance, maxPointsPerRound, rounds);
    setCurrentPoints(prevPoints => prevPoints + pointsForRound);
  };

  const handleStartNewRound = () => {
    if (currentRound < amountOfRounds - 1) {
      setCurrentRound(prevRound => prevRound + 1);
      setShowResult(false);
      setTimeLeft(TIME_FOR_ROUND);
      setIsPaused(false);
      setIsTimeOver(false);
    }
  };

  const handleTimerTick = () => {
    setTimeLeft((prevTime) => prevTime - 1);
  };

  const handleTimerEnd = () => {
    setIsTimeOver(true);
    setIsPaused(true);
    setShowResult(true);
  };

  const handleFinishGame = () => {
    saveResult(userName, currentPoints.toFixed(0), selectedMode)
    navigate('/')
  }

  const currentLocation = randomLocations[currentRound];
  const coordOfCurrentPlace = currentLocation ? [currentLocation.latitude, currentLocation.longitude] : [0, 0];

  return (
    <div className="g_page_main_container">
      <StreetView latitude={coordOfCurrentPlace[0]} longitude={coordOfCurrentPlace[1]} />
      <div className='g_page_current_points'>
        {currentPoints.toFixed(0)}/{MAX_POINTS_PER_GAME}
        <div> current round: {currentRound + 1}/{amountOfRounds}</div>
      </div>
      <div className="g_page_timer_for_round">
        <Timer
          timeLeft={timeLeft}
          onTick={handleTimerTick}
          onTimeOver={handleTimerEnd}
          isPaused={isPaused}
        />
      </div>
      <button className="g_page_btn_for_fullscreen" />
      <Ymap
        key={currentRound}
        coordOfCurrentPlace={coordOfCurrentPlace}
        onResult={handleResult}
        onPauseTimer={handlePauseTimer}
        isTimeOver={isTimeOver}
      />
      {showResult && (
        <button
          className='g_page_btn_for_start_new_round'
          onClick={(event) => {
            if (event.target.innerText === 'Finish Game') {
              handleFinishGame();
            } else {
              handleStartNewRound();
            }
          }}
        >
          {currentRound < amountOfRounds - 1 ? 'Start new round' : 'Finish Game'}
        </button>
      )}

    </div>
  );
};

export default GamePage;

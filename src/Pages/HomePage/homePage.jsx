import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameSettingsContext } from '../../Сontexts/GameSettingsContext';
import { getResults, openDatabase, getResultsForOneUser } from '../../StoreResults/IndexedDB';
import MoveStar from './AnimationsForHomePage/MoveStar';
import SpaceObject from './AnimationsForHomePage/SpaceObject';
import SliderWithDisplay from './ComponentsForHomePage/Slider';
import RadioButton from './ComponentsForHomePage/Radio-button';
import WelcomeMenu from './ComponentsForHomePage/WelcomeMenu';
import './HomePage.css';

const MODES = ['Easy', 'Medium', 'Hard'];

const HomePage = () => {
    const { selectedMode, setSelectedMode, setUserName, rounds, setRounds, userName } = useContext(GameSettingsContext);
    const navigate = useNavigate();
    const planetRef = useRef(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardMode, setLeaderboardMode] = useState('Easy');
    const [currentUserScore, setCurrentUserScore] = useState(null);

    useEffect(() => {
        const fetchUserScore = async () => {
            try {
                const result = await getResultsForOneUser(leaderboardMode, userName);
                if (result.some(entry => entry.mode === leaderboardMode)) {
                    setCurrentUserScore(result);
                } else {
                    setCurrentUserScore(null);  
                }
            } catch (error) {
                console.error('Error fetching user score:', error);
            }
        };

        if (userName) {
            fetchUserScore();
        }
    }, [leaderboardMode, userName]);


    useEffect(() => {
        if (leaderboardMode) {
            getResults(leaderboardMode)
                .then((results) => setLeaderboard(results))
                .catch((error) => console.error("Error loading leaderboard:", error));
        }
    }, [leaderboardMode]);

    const handleModeChange = (mode) => {
        setSelectedMode(mode);
    };

    const handleRoundsChange = (newRounds) => {
        setRounds(newRounds);
    };

    const handleUserNameChange = (userName) => {
        setUserName(userName);
    };

    const handleLeaderboardModeChange = (mode) => {
        setLeaderboardMode(mode);
    };

    const handleNewTrip = () => {
        if (planetRef.current) {
            planetRef.current.classList.add('animate');
            planetRef.current.addEventListener('animationend', () => {
                planetRef.current.classList.remove('animate');
            }, { once: true });
        }

        setTimeout(() => {
            navigate('/map');
        }, 1700);
    };

    const showAlertForChooseMode = () => {
        alert('Choose mode before start the game');
    };

    return (
        <div className="h_page_main_container">
            <MoveStar />
            <SpaceObject />
            {!userName && <WelcomeMenu setUserNameForHP={handleUserNameChange} />}
            {userName && <div className="greeting_to_the_user">Hi, {userName}!</div>}
            <div className="h_page_planet" ref={planetRef} />
            <div className="h_page_leaderboard">
                <div className="h_page_title_of_menu_common">Leaderboard</div>
                <div className="h_page_container_of_modes_common h_page_container_of_modes_leaderboard">
                    {MODES.map((mode, index) => (
                        <RadioButton
                            key={`leaderboard-${index}`}
                            className="h_page_button_radio"
                            classNameForText="h_page_text_in_button_radio"
                            id={`leaderboard-radio${index + 1}`}
                            text={mode}
                            isSelected={leaderboardMode === mode}
                            onChange={handleLeaderboardModeChange}
                            name="leaderboard-mode"
                        />
                    ))}
                </div>
                {leaderboard.length > 0 ? (
                    <>
                        {leaderboard.map((entry, index) => {
                            const isCurrentUser = entry.username === userName && entry.mode === leaderboardMode; 
                            return (
                                <div
                                    key={index}
                                    className={`h_page_result_in_leaderboard ${isCurrentUser ? 'highlight_current_user' : ''}`}
                                >
                                    <div className="h_page_username_in_leaderboard">{entry.username}</div>
                                    <div className="h_page_points_in_leaderboard">{entry.points}</div>
                                </div>
                            );
                        })}
                        {!leaderboard.some((entry) => entry.username === userName && entry.mode === leaderboardMode) && currentUserScore && (
                            <div className="h_page_result_in_leaderboard highlight_current_user looser">
                                <div className="h_page_username_in_leaderboard">{userName}</div>
                                <div className="h_page_points_in_leaderboard">{currentUserScore[0]?.points}</div>  
                            </div>
                        )}
                    </>
                ) : (
                    <div className='h_page_leaderboard_no_results'>No results available</div>
                )}
            </div>


            <div className="h_page_choose_mode_window">
                <div className="h_page_title_of_menu_common h_page_title_of_menu_settings">Settings</div>
                <div className="h_page_settings">Choose mode:</div>
                <div className="h_page_container_of_modes_common h_page_container_of_modes_settings">
                    {MODES.map((mode, index) => (
                        <RadioButton
                            key={`settings-${index}`}
                            className="h_page_button_radio"
                            classNameForText="h_page_text_in_button_radio"
                            id={`settings-radio${index + 1}`}
                            text={mode}
                            isSelected={selectedMode === mode}
                            onChange={handleModeChange}
                            name="settings-mode"
                        />
                    ))}
                </div>
                <div className="h_page_settings">Select number of rounds:</div>
                <SliderWithDisplay onRoundsChange={handleRoundsChange} />
            </div>
            {selectedMode ? (
                <button className="h_page_start_game" onClick={handleNewTrip}>
                    NEW TRIP
                </button>
            ) : (
                <button className="h_page_start_game" onClick={showAlertForChooseMode}>
                    NEW TRIP
                </button>
            )}
        </div>
    );
};

export default HomePage;

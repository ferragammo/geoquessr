import React, { createContext, useState } from 'react';

export const GameSettingsContext = createContext();

export const GameSettingsProvider = ({ children }) => {
    const [selectedMode, setSelectedMode] = useState(null);
    const [rounds, setRounds] = useState(3);
    const [userName, setUserName] = useState('')

    return (
        <GameSettingsContext.Provider value={{ selectedMode, setSelectedMode, rounds, setRounds, userName, setUserName }}>
            {children}
        </GameSettingsContext.Provider>
    );
};

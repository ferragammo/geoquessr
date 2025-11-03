import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameSettingsProvider } from './Сontexts/GameSettingsContext';
import HomePage from './Pages/HomePage/homePage';
import GamePage from './Pages/GamePage/GamePage';



const App = () => {
  return (
    <GameSettingsProvider>
      <Router>
        <Routes>
          <Route path="/map" element={<GamePage latitude={-13.1633223} longitude={-72.5452067} />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </GameSettingsProvider>
  );
};

export default App;
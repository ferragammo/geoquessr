// src/Services/ApiService.js

const BASE_URL = '/api';

export const getLeaderboard = async (mode) => {
  try {
    const response = await fetch(`${BASE_URL}/user/all/${mode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.successful) {
      throw new Error(data.error || 'Failed to fetch leaderboard');
    }
    
    // Преобразуем данные в нужный формат
    const leaderboard = data.data
      .map(user => {
        const result = user.results.find(r => r.mode === mode);
        return result ? {
          username: user.nickname,
          points: result.amountOfPoints,
          mode: result.mode,
          userId: user.id
        } : null;
      })
      .filter(entry => entry !== null)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export const getUserResult = async (nickname) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${nickname}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Пользователь не найден
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.successful) {
      throw new Error(data.error || 'Failed to fetch user result');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching user result:', error);
    throw error;
  }
};

export const saveResult = async (nickname, points, mode) => {
  try {
    const response = await fetch(`${BASE_URL}/user/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname,
        mode,
        amountOfPoints: parseFloat(points)
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.successful) {
      throw new Error(data.error || 'Failed to save result');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error saving result:', error);
    throw error;
  }
};

export const  getRandomLocationsApi = async (mode, amountOfRounds ) => {
  try {
    const response = await fetch(
      `${BASE_URL}/location/start-game/${mode}?amountOfRounds=${amountOfRounds}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.successful) {
      throw new Error(data.error || 'Failed to fetch leaderboard');
    }
     
    const randomLocations = data.data.map(location => ({
      id: location.id,
      name: location.name,
      city: location.city,
      country: location.country,
      mode: location.mode,
      latitude: location.latitude,
      longitude: location.longitude
    }));
    console.log(randomLocations);
    return randomLocations;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

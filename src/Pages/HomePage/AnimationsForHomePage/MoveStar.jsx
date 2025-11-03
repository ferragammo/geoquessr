import React, { useState, useEffect } from 'react';
import './MoveStar.css';

const MoveStar = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStar = {
        id: Date.now(),
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        moveX: (Math.random() - 0.5) * 200,
        moveY: (Math.random() - 0.5) * 200,
        duration: Math.random() * 3 + 4,
        size: Math.random() * 2 + 4,
        hasTrail: Math.random() < 0.5 
      };

      setStars((prevStars) => [...prevStars, newStar]);

      setTimeout(() => {
        setStars((prevStars) => prevStars.filter(star => star.id !== newStar.id));
      }, newStar.duration * 1000);

    }, Math.random() * 400 + 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {stars.map(star => (
        <div
          key={star.id}
          className={`star ${star.hasTrail ? 'trail' : ''}`} 
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            '--move-x': `${star.moveX}vw`,
            '--move-y': `${star.moveY}vh`,
            animationDuration: `${star.duration}s`,
            width: `${star.size}px`,
            height: `${star.size}px`
          }}
        />
      ))}
    </>
  );
};

export default MoveStar;

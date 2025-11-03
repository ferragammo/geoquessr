import React, { useEffect, useState } from 'react';
import './SpaceObject.css';

const OBJECTS = [
    { type: 'rocket', speed: 1.3, initialRotation: 90 },
    { type: 'saucer', speed: 1.5, initialRotation: 0 },
    { type: 'asteroid', speed: 1, initialRotation: 0 }
];

const OBJECT_SIZE = 25; 

const getRandomPosition = () => ({
    top: Math.random() * (window.innerHeight - OBJECT_SIZE),
    left: Math.random() * (window.innerWidth - OBJECT_SIZE)
});

const getRandomDirection = () => {
    const angle = Math.random() * 2 * Math.PI;
    return {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
};

const SpaceObject = () => {
    const [objects, setObjects] = useState([]);

    const addRandomObject = () => {
        const randomObject = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
        const id = Date.now() + Math.random();
        setObjects(prevObjects => [
            ...prevObjects,
            {
                ...randomObject,
                id,
                position: getRandomPosition(),
                direction: getRandomDirection(),
                angle: randomObject.initialRotation,
                opacity: 1
            }
        ]);

        setTimeout(() => {
            setObjects(prevObjects =>
                prevObjects.map(obj =>
                    obj.id === id ? { ...obj, opacity: 0 } : obj
                )
            );

            setTimeout(() => {
                setObjects(prevObjects => prevObjects.filter(obj => obj.id !== id));
            }, 500);
        }, 3000);
    };

    useEffect(() => {
        const interval = setInterval(addRandomObject, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setObjects(currentObjects =>
                currentObjects.map(obj => {
                    const { x, y } = obj.direction;
                    const calculatedAngle = Math.atan2(y, x) * (180 / Math.PI);
                    const angle = obj.type === 'rocket' ? calculatedAngle + 90 : calculatedAngle;

                    return {
                        ...obj,
                        position: {
                            top: (obj.position.top + y * obj.speed + window.innerHeight) % window.innerHeight,
                            left: (obj.position.left + x * obj.speed + window.innerWidth) % window.innerWidth
                        },
                        angle: angle
                    };
                })
            );
        }, 1);

        return () => clearInterval(moveInterval);
    }, []);
    return (
        <div>
            {objects.map((obj) => {
                let transformStyle;
    
                if (obj.type === 'saucer') {
                    if (obj.angle > 90 && obj.angle < 270) {
                        transformStyle = {
                            transform: `rotate(${obj.angle + 90}deg) scaleX(-1)`
                        };
                    } else {
                        transformStyle = {
                            transform: `rotate(${obj.angle + 90}deg)`
                        };
                    }
                } else {
                    transformStyle = { transform: `rotate(${obj.angle}deg)` };
                }
    
                return (
                    <div
                        key={obj.id}
                        className={`space-object ${obj.type}`}
                        style={{
                            top: `${obj.position.top}px`,
                            left: `${obj.position.left}px`,
                            opacity: obj.opacity,
                            transition: 'opacity 0.5s ease, transform 0.1s linear',
                            ...transformStyle
                        }}
                    />
                );
            })}
        </div>
    );
        
    
};

export default SpaceObject;

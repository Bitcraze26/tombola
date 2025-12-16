import React, { useEffect, useState } from 'react';
import { smorfia } from '../data/smorfia';
import './ExtractionStage.css';

const ExtractionStage = ({ currentNumber }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (currentNumber) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [currentNumber]);

    if (!currentNumber) {
        return (
            <div className="extraction-stage empty">
                <h2>Pronto per la Tombola?</h2>
                <p>Premi "Estrai" per iniziare!</p>
            </div>
        );
    }

    const meaning = smorfia[currentNumber];

    return (
        <div className={`extraction-stage ${animate ? 'pop-active' : ''}`}>
            <div className="number-display">
                <span className="huge-number">{currentNumber}</span>
            </div>
            <div className="meaning-display">
                <h2 className="meaning-text">"{meaning}"</h2>
            </div>
        </div>
    );
};

export default ExtractionStage;

import React from 'react';
import './Tabellone.css';

const Tabellone = ({ drawnNumbers, lastNumber }) => {
    const nums = Array.from({ length: 90 }, (_, i) => i + 1);

    return (
        <div className="tabellone-container">
            <div className="tabellone-grid">
                {nums.map((num) => {
                    const isDrawn = drawnNumbers.includes(num);
                    const isLast = num === lastNumber;
                    return (
                        <div
                            key={num}
                            className={`tombola-cell ${isDrawn ? 'drawn' : ''} ${isLast ? 'last-drawn' : ''}`}
                        >
                            <span className="cell-number">{num}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tabellone;

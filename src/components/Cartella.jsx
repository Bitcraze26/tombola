import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Trophy, RefreshCw, Plus, Trash2, RotateCcw } from 'lucide-react';
import './Cartella.css';

const socket = io('http://localhost:3001');

const generateCardGrid = () => {
    const card = Array(3).fill(null).map(() => Array(9).fill(null));
    const usedNumbers = new Set();
    const colRanges = [[1, 9], [10, 19], [20, 29], [30, 39], [40, 49], [50, 59], [60, 69], [70, 79], [80, 90]];

    for (let col = 0; col < 9; col++) {
        const [min, max] = colRanges[col];
        let num;
        do { num = Math.floor(Math.random() * (max - min + 1)) + min; } while (usedNumbers.has(num));
        const row = Math.floor(Math.random() * 3);
        card[row][col] = num;
        usedNumbers.add(num);
    }

    while (usedNumbers.size < 15) {
        const col = Math.floor(Math.random() * 9);
        const [min, max] = colRanges[col];
        if (card.filter(r => r[col] !== null).length >= 2) continue;
        const row = Math.floor(Math.random() * 3);
        if (card[row][col] !== null || card[row].filter(n => n !== null).length >= 5) continue;
        let num;
        do { num = Math.floor(Math.random() * (max - min + 1)) + min; } while (usedNumbers.has(num));
        card[row][col] = num;
        usedNumbers.add(num);
    }

    for (let col = 0; col < 9; col++) {
        const colNums = [card[0][col], card[1][col], card[2][col]].filter(n => n !== null).sort((a, b) => a - b);
        const rowsWithValues = [0, 1, 2].filter(r => card[r][col] !== null);
        rowsWithValues.forEach((r, i) => { card[r][col] = colNums[i]; });
    }
    return card;
};

function Cartella() {
    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('tombola_multi_cards');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing saved cards", e);
            }
        }
        return [{ id: 'card-' + Date.now(), grid: generateCardGrid(), marked: [] }];
    });
    const [drawnNumbers, setDrawnNumbers] = useState([]);

    useEffect(() => {
        console.log("Saving cards to localStorage:", cards);
        localStorage.setItem('tombola_multi_cards', JSON.stringify(cards));
    }, [cards]);

    useEffect(() => {
        socket.on('stateUpdate', (state) => {
            console.log("Socket update received:", state);
            setDrawnNumbers(state.drawnNumbers);
        });
        return () => socket.off('stateUpdate');
    }, []);

    const addCard = () => {
        console.log("Adding new card");
        const newCard = {
            id: 'card-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            grid: generateCardGrid(),
            marked: []
        };
        setCards([...cards, newCard]);
    };

    const removeCard = (id) => {
        console.log("Attempting to remove card:", id);
        if (cards.length > 1) {
            if (window.confirm('Sei sicuro di voler eliminare questa cartella?')) {
                setCards(prev => prev.filter(c => c.id !== id));
                console.log("Card removed");
            }
        } else {
            alert('Devi avere almeno una cartella per giocare!');
        }
    };

    const clearMarkings = () => {
        console.log("Clearing all markings");
        if (window.confirm('Vuoi pulire tutti i segnaposti da tutte le cartelle?')) {
            setCards(prev => prev.map(c => ({ ...c, marked: [] })));
            console.log("Markings cleared");
        }
    };

    const regenerateAllNumbers = () => {
        console.log("Regenerating all numbers");
        if (window.confirm('Vuoi generare nuovi numeri per tutte le tue cartelle? (I segnaposti verranno persi)')) {
            setCards(prev => prev.map(c => ({ ...c, grid: generateCardGrid(), marked: [] })));
            console.log("Numbers regenerated");
        }
    };

    const toggleMark = (cardId, num) => {
        if (num === null) return;
        setCards(prev => prev.map(c => {
            if (c.id === cardId) {
                const isMarked = c.marked.includes(num);
                return {
                    ...c,
                    marked: isMarked ? c.marked.filter(m => m !== num) : [...c.marked, num]
                };
            }
            return c;
        }));
    };

    return (
        <div className="cartella-container">
            <header className="cartella-header">
                <div className="header-left">
                    <h2>Le Tue Cartelle</h2>
                    <span className="badge">{cards.length}</span>
                </div>
                <div className="header-actions">
                    <button className="icon-btn action-add" onClick={addCard} title="Aggiungi Cartella">
                        <Plus size={24} />
                    </button>
                    <button className="icon-btn action-clear" onClick={clearMarkings} title="Pulisci Segnaposti">
                        <RotateCcw size={24} />
                    </button>
                    <button className="icon-btn action-refresh" onClick={regenerateAllNumbers} title="Nuovi Numeri">
                        <RefreshCw size={24} />
                    </button>
                </div>
            </header>

            <div className="cards-list">
                {cards.map((cardData) => (
                    <div key={cardData.id} className="card-wrapper">
                        <div className="card-controls">
                            <span className="card-id">Cartella #{cardData.id.split('-').pop()}</span>
                            <button
                                className="btn-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeCard(cardData.id);
                                }}
                                title="Elimina Cartella"
                                type="button"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div className="card-grid">
                            {cardData.grid.map((row, rowIndex) => (
                                <div key={rowIndex} className="card-row">
                                    {row.map((num, colIndex) => {
                                        const isMarked = cardData.marked.includes(num);
                                        const isServerDrawn = num !== null && drawnNumbers.includes(num);
                                        return (
                                            <div
                                                key={colIndex}
                                                className={`card-cell ${num === null ? 'empty' : ''} ${isMarked ? 'marked' : ''} ${isServerDrawn && !isMarked ? 'hint' : ''}`}
                                                onClick={() => toggleMark(cardData.id, num)}
                                            >
                                                {num}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="cartella-footer">
                <p>Numeri estratti dal tabellone: <strong>{drawnNumbers.length}</strong> / 90</p>
                <p className="help-text">Tocca un numero per segnarlo. I numeri gialli sono stati estratti!</p>
            </div>
        </div>
    );
}

export default Cartella;

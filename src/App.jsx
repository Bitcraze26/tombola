import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw, Volume2, VolumeX, Trophy, AlertTriangle, PartyPopper, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import Tabellone from './components/Tabellone';
import ExtractionStage from './components/ExtractionStage';
import Cartella from './components/Cartella';
import { smorfia } from './data/smorfia';
import { proverbs } from './data/proverbs';
import { penalties } from './data/penalties';
import './App.css';

import Login from './components/Login';

import socket from './socket';

function App() {
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentProverb, setCurrentProverb] = useState("");
  const [showPenalty, setShowPenalty] = useState(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('tombola_auth') === 'true';
  });
  const [authError, setAuthError] = useState('');

  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If we have a saved password, try to auth immediately
    const savedPass = sessionStorage.getItem('tombola_pass');
    if (savedPass) {
      socket.emit('authenticate', savedPass);
    }

    socket.on('authSuccess', () => {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('tombola_auth', 'true');
    });

    socket.on('authError', (msg) => {
      setAuthError(msg);
      setIsAuthenticated(false);
      sessionStorage.removeItem('tombola_auth');
      sessionStorage.removeItem('tombola_pass');
    });

    socket.on('stateUpdate', (state) => {
      setDrawnNumbers(state.drawnNumbers);
      setCurrentNumber(state.currentNumber);
    });

    return () => {
      socket.off('authSuccess');
      socket.off('authError');
      socket.off('stateUpdate');
    };
  }, []);

  const handleLogin = (pass) => {
    sessionStorage.setItem('tombola_pass', pass);
    socket.emit('authenticate', pass);
  };

  // Update proverbs and speech when a new number is drawn
  useEffect(() => {
    if (currentNumber) {
      const randomProv = proverbs[Math.floor(Math.random() * proverbs.length)];
      setCurrentProverb(randomProv);
      if (soundEnabled) {
        speakNumber(currentNumber);
      }
    }
  }, [currentNumber, soundEnabled]);

  const drawNumber = () => {
    if (drawnNumbers.length >= 90) return;

    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    const available = allNumbers.filter(n => !drawnNumbers.includes(n));
    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    socket.emit('drawNumber', picked);
  };

  const speakNumber = (num) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      const audio = new Audio(`/sounds/${num}.mp3`);
      const isCrazy = Math.random() < 0.1;
      const rate = isCrazy
        ? (Math.random() < 0.5 ? 0.7 : 1.3)
        : 0.9 + (Math.random() * 0.2);

      audio.playbackRate = rate;
      audioRef.current = audio;
      audio.play().catch(e => console.error("Error playing audio:", e));
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const resetGame = () => {
    if (window.confirm('Sicuro di voler ricominciare?')) {
      socket.emit('resetGame');
      setCurrentProverb("");
      setShowPenalty(null);
    }
  };

  const triggerTombola = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    try {
      const randomIndex = Math.floor(Math.random() * 10);
      const tombolaAudio = new Audio(`/sounds/tombola/${randomIndex}.mp3`);
      tombolaAudio.volume = 1.0;
      tombolaAudio.play().catch(e => console.error("Error playing tombola sound:", e));
    } catch (err) {
      console.error("Tombola audio error", err);
    }
  };

  const triggerPenalty = () => {
    const randomPenalty = penalties[Math.floor(Math.random() * penalties.length)];
    setShowPenalty(randomPenalty);
  };

  const lastNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;

  return (
    <div className="app-wrapper">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} error={authError} />
      ) : (
        <Routes>
          <Route path="/" element={
            <div className="container">
              <header className="header">
                <h1>Tombola alla Riscossa</h1>
                <div className="controls-top">
                  <button
                    className="icon-btn"
                    onClick={() => {
                      sessionStorage.removeItem('tombola_auth');
                      sessionStorage.removeItem('tombola_pass');
                      window.location.reload();
                    }}
                    title="Logout"
                    style={{ marginRight: '10px' }}
                  >
                    <Lock size={20} />
                  </button>
                  <button className="icon-btn" onClick={() => setSoundEnabled(!soundEnabled)}>
                    {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </button>
                  <button
                    className="btn-link"
                    onClick={() => navigate('/cartella')}
                    style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Vai alle Cartelle (Mobile)
                  </button>
                </div>
              </header>

              <main className="main-content">
                <section className="left-panel">
                  <ExtractionStage currentNumber={currentNumber} />
                  {currentProverb && (
                    <div className="proverb-box">
                      <p>💡 <em>{currentProverb}</em></p>
                    </div>
                  )}

                  <div className="game-controls">
                    <button className="btn-primary" onClick={drawNumber} disabled={drawnNumbers.length >= 90}>
                      <Sparkles size={20} style={{ marginRight: '8px' }} /> Estrai
                    </button>
                    <button className="btn-secondary" onClick={resetGame}>
                      <RefreshCw size={20} />
                    </button>
                  </div>

                  <div className="fun-controls">
                    <button className="btn-fun btn-penalty" onClick={triggerPenalty}>
                      <AlertTriangle size={18} style={{ marginRight: 4 }} /> Penitenza
                    </button>
                    <button className="btn-fun btn-tombola" onClick={triggerTombola}>
                      <Trophy size={18} style={{ marginRight: 4 }} /> TOMBOLA!
                    </button>
                  </div>

                  <div className="stats">
                    <p>Numeri Estratti: <strong>{drawnNumbers.length}</strong> / 90</p>
                  </div>
                </section>

                <section className="right-panel">
                  <Tabellone drawnNumbers={drawnNumbers} lastNumber={lastNumber} />
                </section>
              </main>

              {showPenalty && (
                <div className="modal-overlay" onClick={() => setShowPenalty(null)}>
                  <div className="modal-content penalty-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-icon"><AlertTriangle size={64} color="#e67e22" /></div>
                    <h2>Penitenza!</h2>
                    <p className="penalty-text">{showPenalty}</p>
                    <button onClick={() => setShowPenalty(null)}>Ho Fatto!</button>
                  </div>
                </div>
              )}
            </div>
          } />
          <Route path="/cartella" element={<Cartella />} />
        </Routes>
      )}
    </div>
  );
}

export default App;

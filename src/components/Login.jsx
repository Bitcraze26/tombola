import { useState } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import './Login.css';

function Login({ onLogin, error }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(password);
    };

    return (
        <div className="login-overlay">
            <div className="login-card">
                <div className="login-icon">
                    <Lock size={48} />
                </div>
                <h2>Sessione Protetta</h2>
                <p>Inserisci la password per partecipare alla partita di Tombola.</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password della sessione"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            <ShieldAlert size={16} />
                            <span>{error}</span>
                        </div>
                    )}
                    <button type="submit" className="login-btn">
                        Entra nel Gioco
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

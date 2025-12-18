import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://tombola-kappa-wine.vercel.app",
    "http://localhost:3001", // For local testing of served static files
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"],
    credentials: true
}));

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'production') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

const SESSION_PASSWORD = "ilfornodiveronica";

let gameState = {
    drawnNumbers: [],
    currentNumber: null,
    gameActive: true
};

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('authenticate', (password) => {
        if (password === SESSION_PASSWORD) {
            socket.join('authenticated');
            socket.emit('authSuccess');
            socket.emit('stateUpdate', gameState);
            console.log('Auth success for:', socket.id);
        } else {
            socket.emit('authError', 'Password errata');
        }
    });

    socket.on('drawNumber', (number) => {
        if (!gameState.drawnNumbers.includes(number)) {
            gameState.drawnNumbers.push(number);
            gameState.currentNumber = number;
            io.to('authenticated').emit('stateUpdate', gameState);
        }
    });

    socket.on('resetGame', () => {
        gameState = {
            drawnNumbers: [],
            currentNumber: null,
            gameActive: true
        };
        io.to('authenticated').emit('stateUpdate', gameState);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

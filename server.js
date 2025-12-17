import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // In production, specify your frontend URL
        methods: ["GET", "POST"]
    }
});

const SESSION_PASSWORD = "tombola2025";

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

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

let gameState = {
    drawnNumbers: [],
    currentNumber: null,
    gameActive: true
};

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current state to new client
    socket.emit('stateUpdate', gameState);

    socket.on('drawNumber', (number) => {
        if (!gameState.drawnNumbers.includes(number)) {
            gameState.drawnNumbers.push(number);
            gameState.currentNumber = number;
            io.emit('stateUpdate', gameState);
            console.log('Number drawn:', number);
        }
    });

    socket.on('resetGame', () => {
        gameState = {
            drawnNumbers: [],
            currentNumber: null,
            gameActive: true
        };
        io.emit('stateUpdate', gameState);
        console.log('Game reset');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

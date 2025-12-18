import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.PROD || import.meta.env.VITE_SERVER_URL === '' ? window.location.origin : (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');
const socket = io(SERVER_URL);

export default socket;

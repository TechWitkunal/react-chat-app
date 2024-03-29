// chatSocket.js
// import io from "socket.io-client";

// const SERVER_PORT = "http://localhost:8000";
const SERVER_PORT = "https://chat-app-server-ojsr.onrender.com";
let socketInstance;

export const getSocketInstance = () => {
    console.log(!socketInstance)
    if (!socketInstance) {
        const socketIO = require("socket.io-client");
        socketInstance = socketIO(SERVER_PORT, { transports: ['websocket'] });
    }
    return socketInstance;
};

// chatSocket.js
// import io from "socket.io-client";

import { serverPath } from "../constants/app";

const SERVER_PORT = `${serverPath}`;
// const SERVER_PORT = "https://chat-app-server-ojsr.onrender.com";
let socketInstance;

export const getSocketInstance = () => {
    if (!socketInstance) {
        const socketIO = require("socket.io-client");
        socketInstance = socketIO(SERVER_PORT, { transports: ['websocket'] });
    }
    return socketInstance;
};

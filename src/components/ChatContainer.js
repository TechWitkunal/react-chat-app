import React, { useEffect, useRef, useState } from 'react';
import "../css/chat.css"

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Image } from 'antd';

import { updateOnlineUser } from '../redux/slice/appSlice';

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import Picker from "emoji-picker-react";
import toast, { Toaster } from 'react-hot-toast';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const { v4: uuidv4 } = require('uuid');


const SERVER_PORT = "https://chat-app-server-ojsr.onrender.com/";
let socket;

const ChatContainer = () => {

    const appSlice = useSelector(state => state.appSlice);
    const authSlice = useSelector(state => state.authSlice);
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({});
    const [messages, setMessages] = useState("");
    const [allMessage, setAllMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const inputRef = useRef();
    const fileRef = useRef();

    const userId = authSlice.user?.id;
    const username = authSlice.user?.name;

    function sortObjectsByCreatedAt(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            // throw new TypeError('Invalid data argument. Please provide an object.');
            return;
        }
        // 2. Extract object values and filter (optional)
        const objects = Object.values(data).filter(obj => obj); // Remove falsy values (optional)

        // 3. Sort by createdAt (descending order: newest to oldest)
        return objects.sort((obj1, obj2) => new Date(obj1.createdAt) - new Date(obj2.createdAt));
    }

    useEffect(() => {
        const socketIO = require("socket.io-client");
        socket = socketIO(SERVER_PORT, { transports: ['websocket'] });

        socket.on('connect', () => {
            socket.emit('user-connect', { userName: authSlice.user?.name });
        });

        socket.on("user-online", ({ userName }) => {
            dispatch(updateOnlineUser({ name: userName }))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const func = async () => {
            let response = await axios.post("https://chat-app-server-ojsr.onrender.com/api/message/getMessage", { from: userId, to: appSlice.currectChat._id }, { headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWViZmU5ZTljN2JhZDA3ZGFjYTQ4OTEiLCJpYXQiOjE3MTAxNDAyNTF9.1BL59VxcpfDE-6gm6hGnszM2YU94yPaRvmSzDXQFxPo" }, })
            // let response = await axios.post("http://localhost:8000/api/message/getMessage", { from: userId, to: appSlice.currectChat._id }, { headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWViZmU5ZTljN2JhZDA3ZGFjYTQ4OTEiLCJpYXQiOjE3MTAxNDAyNTF9.1BL59VxcpfDE-6gm6hGnszM2YU94yPaRvmSzDXQFxPo" }, })
            response = JSON.parse(JSON.stringify(response.data)).data;
            let temp = sortObjectsByCreatedAt(response);
            setAllMessages(temp);
        }

        func();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appSlice.currectChat._id])

    window.addEventListener("beforeunload", () => { socket.disconnect(); })
    const sendTextMessage = () => {
        const value = inputRef.current.value;
        if (checkInputValue(value)) {
            setMessages("");
            // Emit the new message event to the server
            socket.emit("addTextMessage", { "inputValue": value, "from": userId, "to": appSlice.currectChat._id, fileType: "Text" });

            // Listen for the response from the server
            socket.on("updateTextMessage", (msg) => {
                const newMessages = { ...allMessage };
                // let length =Object.keys(allMessage) ? Object.keys(allMessage).length : 0;
                let length = allMessage === undefined ? 0 : Object.keys(allMessage)?.length;
                console.log(length) 
                newMessages[length] = msg.msg;
                const data = sortObjectsByCreatedAt(newMessages);
                setAllMessages(data);
            });
        } else {
            toast.error("Please enter something to send");
        }

    }

    const sendImageMessage = (url) => {
        socket.emit("addImageMessage", { fileUrl: url, "from": userId, "to": appSlice.currectChat._id, fileType: "Media" });

        socket.on("updateImageMessage", (msg) => {
            const newMessages = { ...allMessage };
            newMessages[Object.keys(allMessage).length] = msg.msg;
            const data = sortObjectsByCreatedAt(newMessages);
            setAllMessages(data);
        });
    }

    const socketConn = () => {
        socket.on("textMessageReceive", ({ userName, toUserName, msg }) => {
            if (toUserName === username) {
                const newMessages = { ...allMessage };
                newMessages[Object.keys(allMessage).length] = msg;
                const sortMessage = sortObjectsByCreatedAt(newMessages);
                setAllMessages(sortMessage);
            }
        })

        socket.on("imageMessageReceive", ({ userName, toUserName, msg }) => {
            if (toUserName === username) {
                const newMessages = { ...allMessage };
                newMessages[Object.keys(allMessage).length] = msg;
                const sortMessage = sortObjectsByCreatedAt(newMessages);
                setAllMessages(sortMessage);
            }
        })
    }

    setTimeout(() => { socketConn() }, 1000)



    const imageFormats = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/svg+xml',
        'image/bmp',
        'image/webp',
        // Add more formats as needed
    ];

    useEffect(() => {
        setUserDetails(appSlice.currectChat);
        setMessages("");
        setShowEmojiPicker(false);
    }, [appSlice.currectChat]);

    const handleEmojiClick = (event, emojiObject) => {
        inputRef.current.focus();
        setMessages(prevMessages => prevMessages + event.emoji);
    };

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(prevState => !prevState);
    };

    const checkInputValue = (value) => {
        if (value.trim().length > 0 && value.length > 0) { return true }
        return false
    }

    const handleFile = async (e) => {
        if (!e) return;
        if (imageFormats.includes(e.type)) {
            // file formate is correct now upload it to firebase
            const Imgreference = ref(storage, `users/${authSlice.user.name}/message-to-${appSlice.currectChat.userName || ""}__${uuidv4()}`);
            await uploadBytes(Imgreference, e);

            // Get the download URL of the uploaded image
            const url = await getDownloadURL(Imgreference);
            sendImageMessage(url);

            if (!url) { toast.error("Failed to send"); } else { toast.success("photo send"); }

        } else { toast.error("file type should be of image"); }
    }

    return (
        <>
            <Toaster position="top-center" />
            {/* <h1>Hello</h1> */}
            {Object.keys(userDetails).length > 0 && (
                <>
                    <div className='chat'>
                        {/* <div className="chat-wallpaper"></div> */}
                        <div className="d-flex chat-header">
                            <div className='d-flex'>
                                <Image className='user-chatting-photo' src={userDetails.profilePhoto} alt="Photo" />
                                <div className='d-column'>
                                    <h1 className='name'>{userDetails.userName}</h1>
                                    <p className='about'>{userDetails.about}</p>
                                </div>
                            </div>
                            <div className='d-flex'>
                                <SearchIcon />
                                <MoreVertIcon />
                            </div>
                        </div>
                        <div className="chats">
                            <div className="chat-box">
                                {allMessage && Object.keys(allMessage).map(key => (
                                    <>
                                        {(allMessage[key].from === appSlice.currectChat._id || allMessage[key].to === appSlice.currectChat._id) && (
                                            <div key={key} className={`message ${userId === allMessage[key].from ? "me" : "other"}`}>
                                                {allMessage[key].type === "Text" ? (
                                                    <p>{allMessage[key].text}</p>
                                                ) : (
                                                    // <img src={allMessage[key].fileUrl} alt="Image message" />
                                                    <Image style={{ margin: "2rem 0" }} width={200} src={allMessage[key].fileUrl} />
                                                )}
                                            </div>
                                        )}
                                    </>
                                ))}
                            </div>
                        </div>
                        <div className="chatting d-flex">
                            <div className="chat-field d-flex">
                                <div className="emoji">
                                    <EmojiEmotionsIcon onClick={handleEmojiPickerhideShow} />
                                    {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                                </div>
                                <input
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            sendTextMessage(); // Call the sendTextMessage function 
                                        }
                                    }}
                                    ref={inputRef}
                                    type="text"
                                    className="input"
                                    placeholder='Message'
                                    value={messages}
                                    onChange={(e) => setMessages(e.target.value)}
                                />
                                <AttachFileIcon onClick={() => { fileRef.current.click() }} className='attatch-file' />
                                <input onChange={(e) => { handleFile(e.target.files[0]) }} ref={fileRef} type="file" style={{ "display": "none" }} />
                            </div>
                            <div className="share-option d-flex">
                                {/* <SendIcon className='send-btn' /> */}
                                <svg onClick={sendTextMessage} className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SendIcon"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                            </div>
                        </div>
                    </div >
                </>
            )}
        </>
    );
};

export default ChatContainer;

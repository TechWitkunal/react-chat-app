/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-target-blank */
// import React, { useEffect, useRef, useState } from 'react';
import React, { useState, useRef, useEffect } from 'react';

import "../css/chat.css"
import { documentFormats, imageFormats, videoFormats } from "../constants/fileFormate"
import { getDayName, sortObjectsByCreatedAt } from "../utils/date"

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Image } from 'antd';

import { removeOnlineUser, updateAllMessages, updateAllOnlineUser, updateOnlineUser, updateSelectedContact } from '../redux/slice/appSlice';

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DownloadIcon from '@mui/icons-material/Download';


import Picker from "emoji-picker-react";
import toast, { Toaster } from 'react-hot-toast';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { getSocketInstance } from './chatSocket'; // Import the socket instance
import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/material';
import { limitSentence } from '../utils/limitedSentence';

const { v4: uuidv4 } = require('uuid');
let socket;

const ChatContainer = () => {

    const appSlice = useSelector(state => state.appSlice);
    const authSlice = useSelector(state => state.authSlice);
    const selectedChat = useSelector(state => state.appSlice.selectedContact);
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({});
    const [messages, setMessages] = useState("");
    const [allMessage, setAllMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const searchInputRef = useRef();
    const searchIconRef = useRef();

    const messageDay = []

    const inputRef = useRef();
    const fileRef = useRef();

    const userId = authSlice.user?.id;
    const username = authSlice.user?.name;


    useEffect(() => {
        let name = localStorage.getItem("name") || authSlice.user?.name;
        if (!name) { console.log("___no name") }
        socket = getSocketInstance();

        socket.on('connect', () => {
            console.log(name);
            socket.emit('user-connect', { userName: name });
        });

        socket.on("user-online", ({ userName }) => {
            dispatch(updateOnlineUser({ name: userName }));
        });

        socket.emit("getOnlineUser")
        socket.on("recieveOnlineUser", ({ name }) => {
            console.log(name)
            dispatch(updateAllOnlineUser({ name }))
        })

        socket.on("userDisconnected", ({name}) => {
            console.log(name)
            dispatch(removeOnlineUser({ name }))
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        dispatch(updateAllMessages({ allMessages: allMessage }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allMessage])

    useEffect(() => {
        const func = async () => {
            if (appSlice.currectChat === "") return;
            let response = await axios.post("https://chat-app-server-ojsr.onrender.com/api/message/getMessage", { from: userId, to: appSlice.currectChat._id }, { headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWViZmU5ZTljN2JhZDA3ZGFjYTQ4OTEiLCJpYXQiOjE3MTAxNDAyNTF9.1BL59VxcpfDE-6gm6hGnszM2YU94yPaRvmSzDXQFxPo" }, })
            // let response = await axios.post("http://localhost:8000/api/message/getMessage", { from: userId, to: appSlice.currectChat._id }, { headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWViZmU5ZTljN2JhZDA3ZGFjYTQ4OTEiLCJpYXQiOjE3MTAxNDAyNTF9.1BL59VxcpfDE-6gm6hGnszM2YU94yPaRvmSzDXQFxPo" }, })
            if (response.data.statusCode === 303) {

            }
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

    const sendImageAndVideoMessageSocket = (url) => {
        socket.emit("addImageMessage", { fileUrl: url, "from": userId, "to": appSlice.currectChat._id, fileType: "Media" });

        socket.on("updateImageMessage", (msg) => {
            const newMessages = { ...allMessage };
            newMessages[Object.keys(allMessage).length] = msg.msg;
            const data = sortObjectsByCreatedAt(newMessages);
            setAllMessages(data);
        });
    }

    const sendDocumentSocket = (url, fileName) => {
        socket.emit("addDocumentMessage", { fileName: fileName, fileUrl: url, "from": userId, "to": appSlice.currectChat._id, fileType: "Media" });

        socket.on("updateDocumentMessage", (msg) => {
            const newMessages = { ...allMessage };
            newMessages[Object.keys(allMessage).length] = msg.msg;
            const data = sortObjectsByCreatedAt(newMessages);
            setAllMessages(data);
        });
    }

    const socketConn = () => {
        socket.on("textMessageReceive", ({ userName, toUserName, msg }) => {
            let name = username || authSlice.user?.name;
            if (toUserName === name) {
                setAllMessages(prevMessages => {
                    const newMessages = { ...prevMessages };
                    newMessages[Object.keys(prevMessages).length] = msg;
                    return sortObjectsByCreatedAt(newMessages);
                });
            }
            // console.log(name, userName, toUserName)
            if (name === toUserName) {
                toast.success(`${userName} has sent a message.`);
            }
        })

        socket.on("imageMessageReceive", ({ userName, toUserName, msg }) => {
            if (toUserName === username) {
                setAllMessages(prevMessages => {
                    const newMessages = { ...prevMessages };
                    newMessages[Object.keys(prevMessages).length] = msg;
                    return sortObjectsByCreatedAt(newMessages);
                });
            }
        })
    }


    useEffect(() => {
        socketConn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        let isImage = imageFormats.includes(e.type);
        let isVideo = videoFormats.includes(e.type);
        let isDocument = documentFormats.includes(e.type);

        if (isImage || isVideo || isDocument) {
            // file formate is correct now upload it to firebase
            // console.log(e.type)
            const Imgreference = ref(storage, `users/${authSlice.user.name}/${e.type}_message-to-${appSlice.currectChat.userName || ""}__${uuidv4()}`);
            await uploadBytes(Imgreference, e);

            // Get the download URL of the uploaded image
            const url = await getDownloadURL(Imgreference);
            console.log("file is this ", e.name)
            if (isImage || isVideo) {
                sendImageAndVideoMessageSocket(url);
            } else {
                sendDocumentSocket(url, e.name);
            }

            if (!url) { toast.error("Failed to send"); }
            else {
                isImage ? toast.success("photo send") : isVideo ? toast.success("video send") : toast.success("document send");
            }

        }
        else { toast.error("file type not supported"); }
    }

    const [filteredMessages, setFilteredMessages] = useState();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        // Filter online users
        const allFilteredMessages = allMessage && Object.values(allMessage).filter(message => message.text.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));

        // Set filtered users as search result
        setFilteredMessages(allFilteredMessages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allMessage, searchValue]);



    const handleSearchIconEvent = () => {
        searchInputRef.current.classList.remove("display-none");
        searchIconRef.current.classList.add("display-none");
        searchInputRef.current.focus();
    }

    const handleEnterEvent = (e) => {
        if (e.key === 'Enter') {
            searchInputRef.current.classList.add("display-none");
            searchIconRef.current.classList.remove("display-none");
            searchInputRef.current.blur();
        }
    }

    const selectContact = () => {
        dispatch(updateSelectedContact({ selectedContact: userDetails }))
    }

    const downloadFile = (url) => {
        console.log(url)
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', 'download.pdf'); // Set a default filename
        downloadLink.setAttribute('target', '_blank'); // Set a default filename
        console.log(downloadLink);
        downloadLink.click();

    };

    return (
        <>
            <Toaster position="top-center" />
            {/* <h1>Hello</h1> */}
            {Object.keys(userDetails).length > 0 && (
                <>
                    <div className='chat' style={selectedChat ? { "width": "calc(100% - 50%)" } : { "width": "calc(100% - 25%)" }}>
                        {/* <div className="chat-wallpaper"></div> */}
                        <div className="d-flex chat-header">
                            <div className='d-flex pointer' onClick={() => { selectContact() }}>
                                <img className='user-chatting-photo' src={userDetails.profilePhoto} alt="Photo" />
                                <div className='d-column'>
                                    <h1 className='name'>{userDetails.userName}</h1>
                                    <p className='about'>{userDetails.about}</p>
                                </div>
                            </div>
                            <div className='d-flex'>
                                <input
                                    className='about-input display-none'
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder='Type to search message'
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e) => { handleEnterEvent(e) }}
                                />
                                <SearchIcon ref={searchIconRef} onClick={() => { handleSearchIconEvent() }} />
                                <MoreVertIcon />
                            </div>
                        </div>
                        <div className="chats" key={uuidv4}>
                            <div className="chat-box">
                                {filteredMessages && Object.keys(filteredMessages).map(key => {
                                    let day = getDayName(filteredMessages[key].createdAt);
                                    return (
                                        <>
                                            {(filteredMessages[key].from === appSlice.currectChat._id || filteredMessages[key].to === appSlice.currectChat._id) && (
                                                <>
                                                    <div>
                                                        {!(messageDay.includes(day)) && (
                                                            <>
                                                                {day}
                                                                {messageDay.push(day)}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div key={uuidv4()} className={`message ${userId === filteredMessages[key].from ? "me" : "other"}`}>
                                                        {/* {console.log(filteredMessages[key].type === "Text", filteredMessages[key].type)} */}
                                                        {filteredMessages[key].type === "Text" ? (
                                                            <p key={uuidv4()}>{filteredMessages[key].text}</p>
                                                        ) : (
                                                            <>
                                                                {console.log(filteredMessages[key].fileUrl.split("%2F").pop().split("_")[0])}
                                                                {(imageFormats.includes('image/' + filteredMessages[key].fileUrl.split("%2F").pop().split("_")[0])) && (
                                                                    <Image key={uuidv4()} style={{ margin: "2rem 0" }} width={200} src={filteredMessages[key].fileUrl} />
                                                                )}

                                                                {
                                                                    (videoFormats.includes('video/' + filteredMessages[key].fileUrl.split("%2F").pop().split("_")[0])) && (
                                                                        <a href={`${filteredMessages[key].fileUrl}`} target='_blank'><video key={uuidv4()} controls autoPlay={false} loop={false} muted={true} playsInline={true} className="custom-video">
                                                                            <source src={filteredMessages[key].fileUrl} type={`video/${filteredMessages[key].fileUrl.split("%2F").pop().split("_")[0]}`} />
                                                                            Your browser does not support the video tag.
                                                                        </video></a>
                                                                    )
                                                                }

                                                                {
                                                                    (documentFormats.includes('application/' + filteredMessages[key].fileUrl.split("%2F").pop().split("_")[0])) && (
                                                                        // eslint-disable-next-line react/jsx-no-target-blank
                                                                        <>
                                                                            <ThemeProvider
                                                                                theme={{
                                                                                    palette: {
                                                                                        primary: {
                                                                                            main: '#212121',
                                                                                            dark: '#393939',
                                                                                        },
                                                                                    },
                                                                                }}
                                                                            >
                                                                                <Box
                                                                                    style={{
                                                                                        "height": "5rem",
                                                                                        "width": "17rem",
                                                                                        "margin": "2rem 0",
                                                                                    }}
                                                                                    sx={{
                                                                                        borderRadius: 1,
                                                                                        padding: "0 1rem",
                                                                                        bgcolor: 'primary.main',
                                                                                        '&:hover': {
                                                                                            bgcolor: 'primary.dark',
                                                                                        },
                                                                                    }}
                                                                                    className="d-flex"
                                                                                >
                                                                                    <div className="d-flex gap-0" style={{ "justify-content": "space-between", "width": "100%" }}>
                                                                                        <DocumentScannerIcon />
                                                                                        <p className="text-white bg-clear bold">
                                                                                            {filteredMessages[key].text !== "" ? limitSentence(filteredMessages[key].text, 10) : "Document"}
                                                                                        </p>
                                                                                        {/* <a href={`${filteredMessages[key].fileUrl}`} className='no-decoration m-0 item-center' target='_blank' download={true}> */}
                                                                                        <DownloadIcon style={{
                                                                                            margin: "0 1rem",
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                            onClick={() => { downloadFile(filteredMessages[key].fileUrl) }}
                                                                                        />
                                                                                        {/* </a> */}
                                                                                    </div>
                                                                                </Box>
                                                                            </ThemeProvider>
                                                                        </>
                                                                    )
                                                                }

                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="chatting d-flex">
                            <div className="chat-field d-flex">
                                <div className="emoji">
                                    <EmojiEmotionsIcon onClick={handleEmojiPickerhideShow} />
                                    <div style={{ bottom: "5rem", position: "absolute" }}>
                                        {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                                    </div>
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
                            <div className="share-option d-flex" key={Math.random * 1000}>
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

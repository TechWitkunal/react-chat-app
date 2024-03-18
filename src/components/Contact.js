import React, { useEffect, useState } from 'react';
import '../css/contact.css'
import '../index.css'

import UserHeader from '../components/UserHeader';
import { logIn } from '../redux/slice/authSlice';

import axios from 'axios'
import { getUserDetails, useAuthToken } from '../utils/user';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCurrectChat, updateOnlineUser } from '../redux/slice/appSlice';

import ChatContainer from './ChatContainer';
import { Image } from 'antd';

const Contact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allContact, setAllContact] = useState();
  const { tokenFromStore, tokenFromLocalStorage } = useAuthToken();
  const [currentChatDetails, setCurrentChatDetails] = useState(null);

  useEffect(() => {
    const func = async () => {
      if (tokenFromLocalStorage) {
        try {
          const response = await getUserDetails(tokenFromLocalStorage);
          if (response) {
            dispatch(logIn({ isLoggedIn: true, token: tokenFromLocalStorage, user: { ...response }, user_id: response.id }));
          }
        } catch { }
      }

      if (tokenFromStore) {
        localStorage.setItem("token", tokenFromStore)
      } else {
        navigate("/login");
      }
    };

    func();
  }, [dispatch, navigate, tokenFromLocalStorage, tokenFromStore]);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = tokenFromStore || tokenFromLocalStorage;
      try {
        const response = await axios.post(
          "https://chat-app-server-ojsr.onrender.com/api/user/getAllUsers",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        let data = JSON.parse(JSON.stringify(response.data.data))
        setAllContact(data);
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const user = data[key];
            if (user.isUserOnline) {
              dispatch(updateOnlineUser({ name: user.userName }))
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Add currentChatDetails as a dependency

  const updateChat = async (user) => {
    if (user) {
      setCurrentChatDetails(user);
      dispatch(updateCurrectChat({ chat: user }));
    }
  }

  return (
    <div className='d-flex w-full h-full'>
      <div className="chat-container">
        <UserHeader />
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid black" }}>
          {allContact && Object.values(allContact).map((user) => {
            return (
              <div className='chat-box d-flex' key={user.userName} onClick={() => { updateChat(user) }}>
                <div>
                  <Image className='user-profile' alt='photo' src={`${user.profilePhoto}`} />
                </div>
                <div className='d-column'>
                  <h1 className='user-name'>{user.userName}</h1>
                  <p className='user-info'>{user.about}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div >
      <ChatContainer />
      {/* {currentChatDetails && <ChatContainer />} */}
      {/* {!currentChatDetails && <ChatContainer />} */}
    </div>
  );
};

export default Contact;

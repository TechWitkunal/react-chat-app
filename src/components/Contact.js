/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import '../css/contact.css'
import '../index.css'
import ChatContainer from './ChatContainer';
import UserHeader from '../components/UserHeader';

import { logIn } from '../redux/slice/authSlice';

import axios from 'axios'
import { getUserDetails, useAuthToken } from '../utils/user';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrectChat, updateOnlineUser, updateSelectedContact } from '../redux/slice/appSlice';

import { Image } from 'antd';
import ProfileSetting from './ProfileSetting';
import RightSideBar from './RightSideBar';

const Contact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [allContact, setAllContact] = useState({});
  const { tokenFromStore, tokenFromLocalStorage } = useAuthToken();
  const [currentChatDetails, setCurrentChatDetails] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const selectedChat = useSelector(state => state.appSlice.selectedContact);

  let appSlice = useSelector(state => state.appSlice)

  const [path, setPath] = useState("/");

  const [searchValue, setSearchValue] = useState("");


  const url = useLocation();
  // let socket;
  // useEffect(() => {
  //   socket = getSocketInstance();
  //   let contact = {...allContact};

  //   socket.on("userRegisterReceive", ({ user }) => {
  //     console.log("New USER REGISTER ", user);
  //     console.log("prev USERSSS ", contact);
  //     let prevAllContact = {...contact};
  //     prevAllContact[(Object.keys(prevAllContact).length + 1).toString()] = user;
  //     // prevAllContact[Object.keys(prevAllContact).length + 1] = user;
  //     console.log(prevAllContact);
  //     setAllContact(prevAllContact);
  //   });
  // }, [])

  useEffect(() => {
    let { pathname } = url;
    pathname = pathname.split("/").pop()
    console.log(pathname === "profile", "profile")
    if (pathname === "profile") { setPath("profile"); }
    else { setPath("/"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromLocalStorage]);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = tokenFromStore || tokenFromLocalStorage;
      try {
        const response = await axios.post(
          "https://chat-app-server-ojsr.onrender.com/api/user/getAllUsers",
          // "http://localhost:8000/api/user/getAllUsers",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        let data = JSON.parse(JSON.stringify(response.data.data))
        console.log(data)
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
  }, [currentChatDetails]); // Add currentChatDetails as a dependency

  useEffect(() => {
    console.log("all contact ->>>",allContact);
  },[allContact])

  const updateChat = async (user) => {
    if (user) {
      setCurrentChatDetails(user);
      dispatch(updateCurrectChat({ chat: user }));
      dispatch(updateSelectedContact({ selectedContact: null }));
    }
  }

  useEffect(() => {
    console.log(path)
  }, [path])

  useEffect(() => {
    // Filter online users
    const filteredContacts = allContact && Object.values(allContact).filter(user => user.userName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) || user.email.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));

    // Set filtered users as search result
    setFilteredContacts(filteredContacts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allContact, searchValue]);

  return (
    <div className='d-flex w-full h-full gap-0'>
      {/* is user is on path '/' than we have to show this */}
      {(path === "/") && (<div className="chat-container">
        <UserHeader searchValue={searchValue} setSearchValue={setSearchValue} />
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid black" }} className='all-contact'>
          {filteredContacts && filteredContacts.map((user) => {
            return (
              <div className='chat-box d-flex pointer' style={{ borderBottom: "1px solid white", paddingBottom: "0.5rem", marginBottom: "2rem", }} key={user.userName} onClick={() => { updateChat(user) }}>
                <div>
                  <Image className='user-profile' alt='photo' src={`${user.profilePhoto}`} />
                </div>
                <div className='d-column'>
                  <h1 className='user-name'>{user.userName}</h1>
                  <p className='user-info'>{appSlice?.onlineUser.includes(user.userName) ? "Online" : "offline"}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div >)}

      {(path === "profile") && (<div className="chat-container">
        <ProfileSetting />
      </div >)}
      <ChatContainer />
      {selectedChat && <div className="right-side-bar">
        <RightSideBar />
      </div>}
    </div>
  );
};

export default Contact;

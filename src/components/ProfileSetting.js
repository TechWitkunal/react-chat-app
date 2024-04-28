import React, { useEffect, useRef, useState } from 'react'
import '../css/profileSetting.css';
import '../index.css';
import { signOut, updateUser } from '../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ClickComponent from '../utils/ClickComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';
import { useSelector } from 'react-redux';
import { Box, ThemeProvider } from '@mui/material';
// import CallIcon from '@mui/icons-material/Call';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import InfoIcon from '@mui/icons-material/Info';
import BadgeIcon from '@mui/icons-material/Badge';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios"
import { useAuthToken } from '../utils/user';
import { imageFormats } from '../constants/fileFormate';
import toast from 'react-hot-toast';

import { storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { limitSentence } from '../utils/limitedSentence';
import { serverPath } from '../constants/app';

const ProfileSetting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tokenFromStore, tokenFromLocalStorage } = useAuthToken();

    const [open, setOpen] = useState(false);
    const [updateValue, setUpdateValue] = useState("");
    const [uploadedFile, setUpdatedFile] = useState("");

    let user = useSelector(state => state.authSlice.user)

    const inputRef = useRef();
    const editIconRef = useRef();
    const saveIconRef = useRef();
    const InputFileRef = useRef();
    // const FileRef = useRef();

    useEffect(() => {
        setUpdateValue(user?.about);
    }, [user])

    const handleMenuItemClick = (option) => {
        if (option === 'logout') {
            localStorage.clear();
            dispatch(signOut());
            navigate("/login");
        }
        setOpen(false); // Close the menu after clicking an item
    };

    let pathSlashMenuName = ["Logout"];
    let pathSlashMenuNavigate = ["logout"];

    const editIconClickEvent = () => {
        inputRef.current.classList.remove("display-none");
        editIconRef.current.classList.add("display-none");
        saveIconRef.current.classList.remove("display-none");
        inputRef.current.focus();
    }

    const saveIconClickEvent = () => {
        inputRef.current.classList.add("display-none");
        editIconRef.current.classList.remove("display-none");
        saveIconRef.current.classList.add("display-none");
        inputRef.current.blur();
        updateAboutFetchReq()
    }

    const updateAboutFetchReq = async () => {
        const userToken = tokenFromStore || tokenFromLocalStorage;
        // let response = await axios.post("http://localhost:8000/api/user/updateAbout", {  }, { headers: { "Content-Type": "application/json", }, })
        // // console.log("res", response)
        // response = response.data;
        // if (response.success === true) {
        // }

        if (!(updateValue.length > 5 && updateValue.length <= 30)) {
            toast.error("User about should be of chracter range b/w 5 to 30")
            return
        }

        const response = await axios.post(
            // "https://chat-app-server-ojsr.onrender.com/api/user/getAllUsers",
            `${serverPath}/api/user/updateUserAbout`,
            { newAbout: updateValue },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
            }
        );
        let data = JSON.parse(JSON.stringify(response.data.data));
        let updatedUser = { ...user };
        updatedUser.about = data.about;
        // console.log(updatedUser);
        dispatch(updateUser({ user: updatedUser }))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // Perform save operation or any other action
            saveIconClickEvent();
        }
    };

    const fileUploadFunc = async () => {
        if (uploadedFile === "") return;
        if (!imageFormats.includes(uploadedFile.type)) {
            toast.error("File type is not supported");
            return;
        }

        const storageRef = ref(storage, `users/${user.name}/profilePhoto`);
        await uploadBytes(storageRef, uploadedFile);

        // Get the download URL of the uploaded image
        const url = await getDownloadURL(storageRef);

        if (!url) {
            toast.error("your photo not upload please try later", { position: 'top-center', });
        }

        let prevUser = {...user};

        prevUser.profilePhoto = url;

        dispatch(updateUser({ user: prevUser }))

        // console.log(uploadedFile);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fileUploadFunc() }, [uploadedFile])


    return (
        <>
            <div className="d-flex justify-bw">
                <ArrowBackIcon onClick={() => navigate("/")} />
                <p className='semi-bold'>Profile Settings</p>
                <div className="profile-setting-icon">
                    <CreateIcon ref={editIconRef} onClick={() => { editIconClickEvent() }} />
                    <SaveIcon className='display-none' ref={saveIconRef} onClick={() => { saveIconClickEvent() }} />

                    <ClickComponent
                        pathSlashMenuName={pathSlashMenuName}
                        pathSlashMenuNavigate={pathSlashMenuNavigate}
                        open={open}
                        setOpen={setOpen}
                        handleMenuItemClickPathSlash={handleMenuItemClick}
                    />
                </div>
            </div>
            <div>
                <div className="w-full item-center">
                    <div className="photo-frame">
                        <img className='profile-photo z-0' src={`${user?.profilePhoto}`} alt="" />
                        <img className='profile-photo z-1' onClick={() => { InputFileRef.current.click() }} src="https://firebasestorage.googleapis.com/v0/b/online-chat-app-d822f.appspot.com/o/default%20images%2Fpngtree-file-upload-icon-image_1344393-removebg-preview.png?alt=media&token=f311a9ba-da9e-4087-89f8-718e7d9e875c" alt="" />
                    </div>
                    <input
                        ref={InputFileRef}
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => setUpdatedFile(e.target.files[0])}
                    // onChange={(e) => {console.log(e)}}
                    />
                    {/* <p className="name">{user.name}</p> */}
                    {/* <p className="about">{user.about}</p> */}

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
                                "margin": "2rem 0",
                            }}
                            sx={{
                                width: "100%",
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            <div className="d-flex pv-1">
                                <BadgeIcon className='call-icon' />
                                <div className="d-column align-start">
                                    <p className='bold text-white'>{user?.name}</p>
                                    <p className='semi-bold'>name</p>
                                </div>
                            </div>

                        </Box>
                        <Box
                            style={{
                                "margin": "2rem 0",
                            }}
                            sx={{
                                width: "100%",
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            <div className="d-flex pv-1">
                                <AlternateEmailIcon className='call-icon' />
                                <div className="d-column align-start">
                                    <p className='bold text-white'>{user?.email}</p>
                                    <p className='semi-bold'>email</p>
                                </div>
                            </div>

                        </Box>
                        <Box
                            style={{
                                "margin": "2rem 0",
                            }}
                            sx={{
                                width: "100%",
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            <div className="d-flex pv-1">
                                <InfoIcon className='call-icon' />
                                <div className="d-column align-start">
                                    {/* <Input type="text"/> */}
                                    {/* <input className='about-input display-none' ref={inputRef} type="text" value={updateValue}/> */}
                                    <input
                                        className='about-input display-none'
                                        ref={inputRef}
                                        type="text"
                                        value={updateValue}
                                        onChange={(e) => setUpdateValue(e.target.value)}
                                        onKeyDown={(e) => { handleKeyDown(e) }}
                                    />

                                    <p className='bold text-white'>{limitSentence(user?.about, 15)}</p>
                                    <p className='semi-bold'>about</p>
                                </div>
                            </div>

                        </Box>
                    </ThemeProvider>
                </div>
            </div>
        </>
    )
}

export default ProfileSetting

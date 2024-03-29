import React, { useEffect, useState } from 'react';
import { logIn, updateRegisterEmail } from '../redux/slice/authSlice';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Box, Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid';

import { storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export default function Register() {
  const isLoggedIn = useSelector(state => state.authSlice.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);


  const handleSubmit = async () => {
    try {
      if (password.length < 8) { toast.error('Password must be at least 8 characters long.', { position: 'top-center', }); return; }
      if (!password || !name || !about || !email) { toast.error('All field are required', { position: 'top-center', }); return; }
      if (!image) { toast.error('Please upload your image to set it your profile photo', { position: 'top-center', }); return; }

      if (!(navigator.onLine)) {
        toast.error("Please connect with the network");
        return;
      }

      const imageRef = ref(storage, `users/${name}/profilePhoto`);
      await uploadBytes(imageRef, image);

      // Get the download URL of the uploaded image
      const url = await getDownloadURL(imageRef);
      // const downloadTask = getDownloadBytes(imageRef, 1024); // Download only first 1024 bytes
      // console.log(downloadTask);
      // downloadTask.then((snapshot) => {
      //   const fileBlob = snapshot.bytes;
      //   const fileType = fileBlob.type;

      //   if (fileType) {
      //     console.log("File type:", fileType);
      //   } else {
      //     console.log("File type could not be determined.");
      //   }
      // })
      //   .catch((error) => {
      //     console.error("Error downloading file:", error);
      //   });
      if (!url) {
        toast.error("your photo not upload please try later", { position: 'top-center', });

      }

      // Get download URL for the uploaded image

      let response = await axios.post("https://chat-app-server-ojsr.onrender.com/api/auth/register", { name, email, about, password, imageUrl: url }, { headers: { "Content-Type": "application/json", } });
      // let response = await axios.post("http://localhost:8000/api/auth/register", { name, email, about, password, imageUrl: url }, { headers: { "Content-Type": "application/json", } });
      response = response.data;

      if (response.success === true) {
        localStorage.setItem("token", response.data.token)

        // updating loding state
        dispatch(updateRegisterEmail({ email: email }));

        // upding token isLoggedIn, and user_id
        dispatch(logIn({ isLoggedIn: false, token: response.data.token, user_id: response.data.userId, user: response.data.userDetails }))
        localStorage.setItem("name", response.data.userDetails.name)

        toast.success(response.message, { position: 'top-center', });
        setTimeout(() => { navigate("/"); }, 2000)

        // let socket = getSocketInstance();
        // let user = response.data.userDetails;
        // console.log(user)
        // socket.emit('user-register', {user})
        
        return;
      } else {
        toast.error(response.message, { position: 'top-center', });
        return;
      }
    } catch (error) {
      toast.error('Some isnternal error. Try later', { position: 'top-center', }); return;
    }
  }

  useEffect(() => {
    window.addEventListener('offline', function (event) {
      toast.success("Please connect with the network");
    });
  }, [])

  const selectImage = (imageFile) => {
    setImage(imageFile);
  }

  return (
    <React.Fragment>
      <Toaster position="top-center" />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minHeight="100vh" // This ensures the container takes up the full viewport height
      >
        <Container maxWidth="md">
          <Typography variant="h6" gutterBottom>
            Sign up
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="name"
                name="name"
                label="Enter your full name"
                fullWidth
                autoComplete="given-name"
                variant="standard"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="email"
                name="email"
                label="Enter your email"
                fullWidth
                autoComplete="email"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="about"
                name="about"
                label="Enter few words about you"
                fullWidth
                autoComplete="about"
                variant="standard"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="password"
                name="password"
                label="Enter password of at least 8 characters"
                fullWidth
                autoComplete="new-password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <br />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={(e) => { selectImage(e.target.files[0]) }} />
          </Button>
          <br />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3, ml: 1 }}
          >
            Proceed with Sign up
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3, ml: 1 }}
          >
            {/* already have account &nbsp; <Link to='https://main--online-chat-app-0011.netlify.app/login'>login Now</Link> */}
            already have account &nbsp; <Link to='http://localhost:3000/login'>login Now</Link>
          </Button>
        </Container>
      </Box>
    </React.Fragment>
  );
}

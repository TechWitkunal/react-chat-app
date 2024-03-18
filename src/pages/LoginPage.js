import React, { useEffect, useState } from 'react';
import { logIn, updateRegisterEmail } from '../redux/slice/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthToken } from '../utils/user';

import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios'

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Box, Button, Container,} from '@mui/material';
import Grid from '@mui/material/Grid';


export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { tokenFromStore, tokenFromLocalStorage } = useAuthToken();
  useEffect(() => {
    console.log(tokenFromStore, tokenFromLocalStorage)
    if (tokenFromStore || tokenFromLocalStorage) {
      navigate("/")
    }
  }, [navigate, tokenFromLocalStorage, tokenFromStore])


  const handleSubmit = async () => {
    // console.log("LKJH", "func call")
    try {
      // console.log("fired.../")
      if (password.length < 8) { toast.error('Password must be at least 8 characters long.', { position: 'top-center', }); return; }
      if (!password || !email) { toast.error('All field are required', { position: 'top-center', }); return; }

      let response = await axios.post("https://chat-app-server-ojsr.onrender.com/api/auth/login", { email, password }, { headers: { "Content-Type": "application/json", }, })
      // console.log("res", response)
      response = response.data;
      if (response.success === true) {
        localStorage.setItem("token", response.data.token)

        // updating email
        dispatch(updateRegisterEmail({ email: email }));

        // upding token isLoggedIn, and user_id
        dispatch(logIn({ isLoggedIn: true, token: response.data.token, user_id: response.data.userId, user: response.data.userDetails }))

        toast.success(response.message, { position: 'top-center', });
        setTimeout(() => { navigate('/') }, 1000)
        response = "";
        return;
      } else {
        toast.error(response.message, { position: 'top-center', });
        response = "";
        return;
      }
    } catch (error) {
      toast.error('Some internal error. Try later', { position: 'top-center', }); return;
    }
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
            Login
          </Typography>
          <Grid container spacing={3}>
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
                id="password"
                name="password"
                label="Enter password of at least 8 characters"
                fullWidth
                autoComplete="password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3, ml: 1 }}
          >
            Proceed with Login
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3, ml: 1 }}
          >
           Dont't have account &nbsp; <Link to='https://main--online-chat-app-0011.netlify.app/register'>Register Now</Link>
          </Button>
        </Container>
      </Box>

    </React.Fragment>
  );
}

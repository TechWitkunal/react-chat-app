import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';

const App = () => {
  const isDarkTheme = useSelector(state => state.appSlice.isDarkTheme);

  const prefersDarkMode = useMediaQuery(`(prefers-color-scheme: ${isDarkTheme ? 'dark' : 'light'})`);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        // you can now send notifications
      } else {
        console.log("Notification permission denied.");
        alert("Please grant the permission to send notification. IT IS SAFE")
        // handle denial of permission
      }
    });
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<ChatPage />} />
          <Route path="*" element={<h1>Url not found</h1>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import { useSelector } from 'react-redux';

export function useAuthToken() {
  // Get the token from the Redux store
  const tokenFromStore = useSelector(state => state.authSlice.token);

  // Get the token from localStorage
  const tokenFromLocalStorage = localStorage.getItem("token");

  // Return the tokens
  return { tokenFromStore, tokenFromLocalStorage };
}

export function getUserName() {
  const username = useSelector(state => state.authSlice.user.userName);
  console.log(username);

  // Return the tokens
  return username
}

export async function getUserDetails(tokenFromLocalStorage) {
  try {
    const response = await axios.post("http://localhost:8000/api/user/getUserInfo", {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenFromLocalStorage}`,
      },
    });

    const responseData = response.data;
    // console.log(responseData.data

    if (responseData.success === true) {
      return responseData.data // Return user details
    } else {
      return null;// Return user details

      // throw new Error(responseData.message); // Throw an error for failed login
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}
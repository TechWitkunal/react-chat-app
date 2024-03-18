import { createSlice } from "@reduxjs/toolkit";

// import axios from "../../utils/axios";
// import { showSnackbar } from "./app";

// ----------------------------------------------------------------------

const initialState = {
    isLoggedIn: false,
    token: null,
    user: null,
    user_id: null,
    email: null,
    error: null,
};

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        logIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
            state.user_id = action.payload.user_id;
            state.user = action.payload.user;
        },
        signOut(state, action) {
            state.isLoggedIn = false;
            state.token = "";
            state.user_id = null;
            state.user = null;
            state.email = null;
        },
        updateRegisterEmail(state, action) {
            state.email = action.payload.email;
        },
        updateUser(state, action) {
            state.user = action.payload.user;
        },
        // updateToken(state, action) {
        //     state.token = action.payload.token;
        // },
    },
});

export const { logIn, signOut, updateRegisterEmail }  = authSlice.actions;

// Reducer
export default authSlice.reducer;



// export function RegisterUser(formValues) {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

//         await axios.post("/authSlice/register", { ...formValues, }, { headers: { "Content-Type": "application/json", }, })
//             .then(function (response) {
//                 console.log(response);
//                 dispatch(
//                     slice.actions.updateRegisterEmail({ email: formValues.email })
//                 );

//                 dispatch(
//                     showSnackbar({ severity: "success", message: response.data.message })
//                 );
//                 dispatch(
//                     slice.actions.updateIsLoading({ isLoading: false, error: false })
//                 );
//             })
//             .catch(function (error) {
//                 console.log(error);
//                 dispatch(showSnackbar({ severity: "error", message: error.message }));
//                 dispatch(
//                     slice.actions.updateIsLoading({ error: true, isLoading: false })
//                 );
//             })
//             .finally(() => {
//                 if (!getState().authSlice.error) {
//                     window.location.href = "/authSlice/verify";
//                 }
//             });
//     };
// }
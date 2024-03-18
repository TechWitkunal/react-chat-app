import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loadingMeaage: "",
    isDarkTheme: true,
    currectChat: "",
    onlineUser: [],
};

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        toggleTheme: (state, action) => {
            // Update the isDarkTheme value by toggling it
            state.isDarkTheme = !state.isDarkTheme;
        },
        updateCurrectChat(state, action) {
            state.currectChat = action.payload.chat;
        },
        updateOnlineUser(state, action) {
            if (!state.onlineUser.includes(action.payload.name)) { // Corrected the condition here
                state.onlineUser.push(action.payload.name);
            }
        },
    },
});

export const {toggleTheme, updateCurrectChat, updateOnlineUser } = appSlice.actions;

export default appSlice.reducer;

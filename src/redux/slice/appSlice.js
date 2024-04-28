import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loadingMeaage: "",
    isDarkTheme: true,
    currectChat: "",
    onlineUser: [],
    selectedContact: null,
    allMessages: null,
    deviceWidth: null,
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
        updateAllOnlineUser(state, action) {
            state.onlineUser = action.payload.name;
        },
        removeOnlineUser(state, action) {
            let userNameToRemove = action.payload.name;
            state.onlineUser = state.onlineUser.filter(userName => userName !== userNameToRemove);
        },
        updateSelectedContact(state, action) {
            state.selectedContact = action.payload.selectedContact;
        },
        updateAllMessages(state, action) {
            state.allMessages = action.payload.allMessages;
        },
        updateDeviceWidth(state, action) {
            state.deviceWidth = action.payload.deviceWidth;
        },
    },
});

export const 
{ toggleTheme, updateCurrectChat, updateOnlineUser, updateSelectedContact, 
  updateAllMessages, updateAllOnlineUser, removeOnlineUser, 
  updateDeviceWidth
} = appSlice.actions;

export default appSlice.reducer;

// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './slice/authSlice';
import appReducer from './slice/appSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Combine reducers
const rootReducer = combineReducers({
    authSlice: authReducer,
    appSlice: appReducer,
});

// Apply persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
    reducer: persistedReducer,
    // Add any middleware or enhancers if needed
});

export default store;

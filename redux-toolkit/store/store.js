import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import reducers from '../reducer';
  
const persistConfig = {
    key: 'root',
    blacklist: ['ui','inputState','chat'],
    storage,
};
  
const persistedReducer = persistReducer(persistConfig, reducers);
  
const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});
  
export default store;
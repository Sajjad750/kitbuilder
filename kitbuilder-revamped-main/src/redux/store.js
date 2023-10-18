import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import categorySlice from './Categories/categorySlice';
import modalReducer from './Modal/modalSlice';
import userdataSlice from './userData/userdataSlice';
import loaderSlice from './Loader/loaderSlice';
import usercanvasSlice from './canvasData/canvasData'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userdata'], // Only the 'userdata' slices of the state will be persisted
};

export const rootReducer = combineReducers({
    categories: categorySlice,
    userdata: userdataSlice,
    modal: modalReducer,
    loader: loaderSlice,
    canvas:usercanvasSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    })
});

const persistor = persistStore(store);
export { store, persistor };
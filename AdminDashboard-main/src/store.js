import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import confirmationModalSlice from 'features/confirmationModal/confirmationModal';
import loaderSlice from 'features/Loader/loaderSlice';
import modalSlice from 'features/Modal/modalSlice';
import retailersSlice from 'features/retailersData/retailersSlice';
import adminSlice from 'features/adminData/adminSlice';
import productsSlice from 'features/productsData/productsSlice';
import categoriesSlice from 'features/cartegoriesData/categoriesSlice';
import filesSlice from 'features/filesData/filesSlice';
import ticketsSlice from 'features/ticketsData/ticketsSlice';



const persistConfig = {
    key: 'root',
    storage,
    // whitelist: ['categories', 'userdata'], // Only the 'category' and 'userdata' slices of the state will be persisted
};

export const rootReducer = combineReducers({
    confirmationModal: confirmationModalSlice,
    loader:loaderSlice,
    modal:modalSlice,
    retailers: retailersSlice,
    admin:adminSlice,
    products:productsSlice,
    categories:categoriesSlice,
    files:filesSlice,
    tickets:ticketsSlice
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
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import 'main.css'
// KitBuilder Dashboard React Context Provider and Redux Providers 
import { MaterialUIControllerProvider } from "context";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store';
// import './polyfills';


ReactDOM.render(
  <BrowserRouter>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <MaterialUIControllerProvider>
      <App />
    </MaterialUIControllerProvider>
    </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

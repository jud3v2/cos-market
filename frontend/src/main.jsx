import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store } from './store/gameStore.js'
import { Provider } from "react-redux";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = 'Bearer ' + token;
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

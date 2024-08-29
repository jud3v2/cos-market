import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store } from './store/gameStore.js'
import { Provider } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale('fr');

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

import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './_redux/store';
import { Provider } from 'react-redux';

import './i18n';
import App from './App';
import 'antd/dist/reset.css';
import 'react-quill/dist/quill.snow.css';
import './index.scss';

import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import dayjs from 'dayjs';

dayjs.extend(weekday);
dayjs.extend(localeData);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);

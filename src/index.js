import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { createStore } from 'redux';
import rootReducer from './util/reducers';
import { Provider } from 'react-redux';
Amplify.configure(config);
require("./css");

let preloadedState;

/* when localStorage is utilized

const persistedData = localStorage.getItem("data");

if (persistedData) {
  preloadedState = {
    data: JSON.parse(persistedData)
  };
};
*/

preloadedState = {
  user: null,
  listings: []
};

const store = createStore(rootReducer, preloadedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

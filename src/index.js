import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { createStore } from 'redux';
import rootReducer from './util/reducers';
import { Provider } from 'react-redux';
import { HashRouter } from "react-router-dom";
import { Auth, API } from 'aws-amplify';
import * as queries from './graphql/queries';
const gMapApiKey = require('./util/keys/keys').gMapApiKey;
Amplify.configure(config);
require("./css");

const script = document.createElement('script');
script.id = "google-api";
script.async = true;
script.src = `https://maps.googleapis.com/maps/api/js?key=${gMapApiKey}&region=TW&language=zh-TW&libraries=places`;
window.document.body.appendChild(script);

/* when localStorage is utilized

let preloadedState;
const persistedData = localStorage.getItem("data");

if (persistedData) {
  preloadedState = {
    data: JSON.parse(persistedData)
  };
};
*/

async function initialRender() {

  function renderingDOM(store) {
    return (
      ReactDOM.render(
        <React.StrictMode>
          <HashRouter>
            <Provider store={store}>
              <App />
            </Provider>
          </HashRouter>
        </React.StrictMode>,
        document.getElementById('root')
      )
    );
  };

  try {
    const authUser = await Auth.currentAuthenticatedUser();
    const userData = await API.graphql({
      query: queries.getUser,
      variables: {
        id: authUser.username
      }
    });
    const store = createStore(rootReducer, { user: userData.data.getUser },
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    
    return renderingDOM(store);
  } catch (err) {
    console.log(err);
    const store = createStore(rootReducer, ...[,],
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    
    return renderingDOM(store);
  };
};

initialRender();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

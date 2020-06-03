import React from 'react';
import ReactDOM from 'react-dom';
import './Resources/css/styles.css';
import {BrowserRouter} from 'react-router-dom';
import Routes from './routes';

import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise'; // used to perform action when dispatch anything rejects.
import ReduxThunk from 'redux-thunk'; // similar to redux-promise

import Reducer from './reducers/reducer.js';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware,ReduxThunk)(createStore);

ReactDOM.render(
  //provider is used connect react with redux
  <Provider store={createStoreWithMiddleware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
    {/* BrowserRouter is declared at top most route// used for giving elgiblity to components to change the page.*/}
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>

,document.getElementById('root'));

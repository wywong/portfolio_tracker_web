import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import App from './App';
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';

const store = createStore(rootReducer, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();

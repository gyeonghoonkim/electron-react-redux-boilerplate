import React from 'react'
import { render } from 'react-dom'
import { createStore } from "redux";
import { Provider } from "react-redux";
import DermaView from './components/DermaView';
import reducer from './redux/reducer';

let root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)
document.body.style.margin = 0

const store = createStore(reducer);

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

render(
  <Provider store={store}>
    <DermaView />
  </Provider>,
  rootElement,
);

import React from "react";
import ReactDOM from "react-dom";
import Home from "./views/Home";
import Suggestion from "./views/Suggestion";
import { Router } from "@reach/router";
import "./assets/reset.css";
import "./assets/global.scss";
import "material-design-icons/iconfont/material-icons.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Home path="/" />
        <Suggestion path="/suggestion/:suggestionId" />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

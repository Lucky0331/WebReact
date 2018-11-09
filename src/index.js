import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Root from "./a_container/root";
import registerServiceWorker from "./registerServiceWorker";
import store from "./store";
import "./css/css.css";
import "./css/scss.scss";
import "water-wave/style.css";

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById("app-root")
);
registerServiceWorker();
if (module.hot) {
  module.hot.accept();
}

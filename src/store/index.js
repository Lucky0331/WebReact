import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import RootReducer from "../a_reducer";
const store = createStore(RootReducer, applyMiddleware(ReduxThunk));

if (module.hot) {
  module.hot.accept("../a_reducer/index", () => {
    const nextRootReducer = require("../a_reducer/index");
    store.replaceReducer(nextRootReducer || nextRootReducer.default);
  });
}
export default store;

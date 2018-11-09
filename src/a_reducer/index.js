import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import appReducer from "./app-reducer";
import shopReducer from "./shop-reducer";
import newReducer from "./new-reducer";

const RootReducer = combineReducers({
  routing: routerReducer,
  app: appReducer,
  shop: shopReducer,
  n: newReducer
});

export default RootReducer;

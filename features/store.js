import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logger from "redux-logger";
import userSlice from "./user/userSlice";
import productSlice from "./product/productSlice";

const isDev = process.env.NODE_ENV === 'development';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  product: productSlice.reducer,
});

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(logger)
    ),
    devTools: isDev,
  });
}

const store = makeStore();

export default store;


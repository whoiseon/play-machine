import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import userSlice from "./user/userSlice";
import productSlice from "./product/productSlice";

const isDev = process.env.NODE_ENV === 'development';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  product: productSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat()
    ),
    devTools: isDev,
  });
}

const store = makeStore();

export const persistor = persistStore(store);
export default store;


import {Provider} from "react-redux";

import 'styles/common/_base.scss';
import {PersistGate} from 'redux-persist/integration/react';
import { persistor } from "../features/store";

import store from "../features/store";
import PageLoading from "../components/atoms/PageLoading";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<PageLoading />} persistor={persistor}>
          <Component
            {...pageProps}
          />
        </PersistGate>
      </Provider>
    </>
  )
}

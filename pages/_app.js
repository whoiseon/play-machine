import {useEffect, useState} from "react";
import {Provider} from "react-redux";

import 'styles/common/_base.scss';

import {userList} from "../public/data/user";
import store from "../features/store";
import useLocalStorage from 'hooks/common/useLocalStorage';

export default function App({ Component, pageProps }) {
  const [userData, setUserData] = useLocalStorage('userData', userList);

  // 로컬스토리지에 초기 유저 데이터 저장
  useEffect(() => {
    if(userData) {
      setUserData(userList);
    }
  }, [userData, userList]);

  const now = new Date();
  const minute = now.getMinutes();

  useEffect(() => {
    if (minute === 6) {
      console.log('hid');
    }
  }, [minute]);

  return (
    <>
      <Provider store={store}>
        <Component
          {...pageProps}
        />
      </Provider>
    </>
  )
}

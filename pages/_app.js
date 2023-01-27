import {useEffect, useState} from "react";
import {Provider} from "react-redux";

import 'styles/common/_base.scss';

import {userList} from "../public/data/user";
import store from "../features/store";
import useLocalStorage from 'hooks/common/useLocalStorage';

export default function App({ Component, pageProps }) {
  const [userData, setUserData] = useLocalStorage('userData', null);
  const [productStore, setProductStore] = useLocalStorage('productStore', null);

  // 로컬스토리지에 초기 유저 데이터 저장
  useEffect(() => {
    if (!userData) {
      setUserData(userList);
    }
  }, [userData, userList]);

  // 로컬스토리지에 초키 상품 데이터 저장
  useEffect(() => {
    if (!productStore) {
      setProductStore({
        moneyInvested: 0,
        history: [],
        productList: [],
      })
    }
  }, [productStore]);

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

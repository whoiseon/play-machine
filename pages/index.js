import {useState, useEffect} from "react";
import Head from "next/head";

import Root from "components/templates/Root";
import Auth from "components/templates/Auth";
import {useDispatch, useSelector} from "react-redux";
import Layout from "../components/templates/Layout";
import useLocalStorage from "../hooks/common/useLocalStorage";
import PageLoading from "../components/atoms/PageLoading";
import {updateUserInfo} from "../features/user/userSlice";
import {loadProductsStore} from "../features/product/productSlice";

export default function Home() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const [init, setInit] = useState(false);
  const [loggingUser, setLoggingUser] = useLocalStorage('loggingUser', null);
  const [productStore, setProductStore] = useLocalStorage('productStore', null);

  useEffect(() => {
    if (loggingUser) {
      dispatch(updateUserInfo());
    }

    if (productStore) {
      dispatch(loadProductsStore());
    }

    setInit(true);
  }, [loggingUser, productStore, updateUserInfo]);

  return (
    <>
      <Head>
        <title>play machine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        init
          ? userInfo
            ? (
              <Layout>
                <Root />
              </Layout>
            )
            : <Auth />
          : <PageLoading />
      }
    </>
  )
}

import {useEffect} from "react";
import Head from "next/head";

import Root from "components/templates/Root";
import Auth from "components/templates/Auth";
import {useDispatch, useSelector} from "react-redux";
import Layout from "../components/templates/Layout";

import {loadUserData} from "../features/user/userSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { myInfo, userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) {
      dispatch(loadUserData());
    }
  }, [userData]);

  return (
    <>
      <Head>
        <title>play machine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        myInfo
          ? (
            <Layout>
              <Root />
            </Layout>
          )
          : <Auth />
      }
    </>
  )
}

import {useCallback, useState} from "react";
import Head from "next/head";

import Root from "components/templates/Root";
import Auth from "components/templates/Auth";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleUserDetect = useCallback(() => {
    if (isLoggedIn) {
      return <Root />
    } else {
      return <Auth />
    }
  }, [isLoggedIn]);

  return (
    <>
      <Head>
        <title>play machine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        handleUserDetect()
      }
    </>
  )
}

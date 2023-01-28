import {useEffect} from "react";
import Head from "next/head";

import Root from "components/templates/Root";
import Auth from "components/templates/Auth";
import {useDispatch, useSelector} from "react-redux";
import Layout from "../components/templates/Layout";

import {loadUserData} from "../features/user/userSlice";
import {resetProductCount} from "../features/product/productSlice";
import moment from "moment";

export default function Home() {
  const dispatch = useDispatch();
  const { myInfo, userData } = useSelector((state) => state.user);
  const { productList } = useSelector((state) => state.product);

  const soldOutProduct = productList.filter((v) => v.count === 0);

  useEffect(() => {
    if (!userData) {
      dispatch(loadUserData());
    }
  }, [userData]);

  useEffect(() => { // 매 시간 정각마다 SOLD OUT 제품 초기화
    const timer = setInterval(() => {
      const currentTime = new Date();

      const newHistoryObject = soldOutProduct.map((product) => {
        return ({
          type: '구매',
          buyer: '나사장',
          count: product.initialCount,
          category: product.category,
          dateTime: {
            date: moment().format("YYYY. MM. DD."),
            time: moment().format("h:mm:ss A"),
            timestamp: moment().toISOString(),
          },
          productName: product.name,
          productPrice: product.price,
          margin: product.margin,
          refill: product.refill + 1
        })
      })

      if (currentTime.getMinutes() <= 1 && soldOutProduct.length > 0) {
        dispatch(resetProductCount(newHistoryObject))
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

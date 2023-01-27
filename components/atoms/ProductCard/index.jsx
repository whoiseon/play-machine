import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./ProductCard.module.scss";
import moment from "moment";

import CategoryImage from "../CategoryImage";
import useLocalStorage from "hooks/common/useLocalStorage";
import {removeProduct, buyProduct} from "features/product/productSlice";

export default function ProductCard({ data, alert, openAlert }) {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { moneyInvested } = useSelector((state) => state.product);

  const [productStore, setProductStore] = useLocalStorage("productStore", {});
  const [userData, setUserData] = useLocalStorage("userData", null);

  const [removeButton, setRemoveButton] = useState(false);

  const handleNumberCommaFormat = useCallback((number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  const handleShowRemoveButton = useCallback(() => {
    setRemoveButton((prev) => !prev);
  }, []);

  const handleRemoveProduct = useCallback( async () => {
    await setProductStore((prevData) => ({
      ...prevData,
      productList: productStore.productList.filter((p) => p.name !== data.name)
    }));

    dispatch(removeProduct(data.name));
  }, [productStore]);

  const handleBuyProduct = useCallback(() => {
    // 물건 구매 함수

    if (moneyInvested < data.price) {
      openAlert();
      return;
    }
    // Alert이 켜져있을시 동작 방지
    if (alert) return;

    const newHistoryObject = { // 구매 내역 객체
      type: '판매',
      buyer: userInfo.name,
      dateTime: {
        date: moment().format("YYYY. MM. DD."),
        time: moment().format("h:mm:ss A"),
        timestamp: moment().toISOString(),
      },
      productName: data.name,
      productPrice: data.price,
      purchase: data.cost,
      category: data.category,
      sales: data.margin,
    }

    // 로컬 스토리지 데이터 수정
    const getProductIndex = productStore.productList.findIndex((product) => product.name === data.name);
    let copyProductStore = [...productStore.productList];

    const findProduct = copyProductStore[getProductIndex]
    copyProductStore[getProductIndex] = {
      ...findProduct,
      count: findProduct.count - 1,
      salesCount: findProduct.salesCount + 1,
      totalSales: findProduct.totalSales + (findProduct.price * 0.6),
    }

    setProductStore((prevData) => ({
      ...prevData,
      moneyInvested: moneyInvested - data.price,
      history: [newHistoryObject, ...prevData.history],
      productList: copyProductStore
    }));

    // Redux dispatch
    dispatch(buyProduct({
      name: data.name,
      price: data.price,
      newHistoryObject,
    }));
  }, [data, userData, moneyInvested, openAlert]);

  return (
    <>
      <div
        className={styles.wrapper}
        onMouseEnter={handleShowRemoveButton}
        onMouseLeave={handleShowRemoveButton}
      >
        {
          (userInfo.admin && removeButton) && (
            <button
              type="button"
              className={styles.remove}
              onClick={handleRemoveProduct}
            >
              제거하기
            </button>
          )
        }
        <div className={styles.productInfo}>
          <div className={styles.info}>
            <h2>
              { data.name }
            </h2>
            <p className={styles.price}>
              { handleNumberCommaFormat(data.price) } 원
            </p>
          </div>
          <div className={styles.category}>
            <CategoryImage category={data.category} />
          </div>
        </div>
        <div className={styles.productCount}>
          {
            data.count === 0
              ? <p className={styles.soldOut}>SOLD OUT</p>
              : userInfo.admin
                ? (
                  <p>남은 수량 <i>{ data.count }</i> 개</p>
                )
                : (
                  <button
                    type="button"
                    className={styles.buyButton}
                    onClick={handleBuyProduct}
                  >
                    구매하기
                  </button>
                )
          }
        </div>
      </div>
    </>
  );
};

import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./ProductCard.module.scss";
import moment from "moment";

import CategoryImage from "../CategoryImage";
import {buyProductUser} from "features/user/userSlice";
import {removeProduct, buyProduct} from "features/product/productSlice";

export default function ProductCard({ data, alert, openAlert }) {
  const dispatch = useDispatch();

  const { myInfo } = useSelector((state) => state.user);
  const { moneyInvested } = useSelector((state) => state.product);

  const [removeButton, setRemoveButton] = useState(false);

  const handleNumberCommaFormat = useCallback((number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  const handleShowRemoveButton = useCallback(() => {
    setRemoveButton((prev) => !prev);
  }, []);

  const handleRemoveProduct = useCallback( async () => {
    dispatch(removeProduct({
      productName: data.name,
      timestamp: data.uploadDate
    }));
  }, []);

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
      buyer: myInfo.name,
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

    // Redux dispatch
    dispatch(buyProduct({
      name: data.name,
      price: data.price,
      newHistoryObject,
    }));

    dispatch(buyProductUser({
      userId: myInfo.id,
      price: data.price
    }))
  }, [data, myInfo, moneyInvested, openAlert]);

  return (
    <>
      <div
        className={styles.wrapper}
        onMouseEnter={handleShowRemoveButton}
        onMouseLeave={handleShowRemoveButton}
      >
        {
          (myInfo.admin && removeButton) && (
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
              : myInfo.admin
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

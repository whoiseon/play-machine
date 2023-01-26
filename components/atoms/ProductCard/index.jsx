import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./ProductCard.module.scss";
import CategoryImage from "../CategoryImage";
import useLocalStorage from "hooks/common/useLocalStorage";
import {removeProduct} from "features/product/productSlice";

export default function ProductCard({ data }) {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const [productStore, setProductStore] = useLocalStorage("productStore", []);
  const [removeButton, setRemoveButton] = useState(false);

  const handleNumberCommaFormat = useCallback((number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  const handleShowRemoveButton = useCallback(() => {
    setRemoveButton((prev) => !prev);
  }, []);

  const handleRemoveProduct = useCallback(() => {
    setProductStore(productStore.filter((p) => p.name !== data.name));
    dispatch(removeProduct(data.name));
  }, [productStore]);

  return (
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
                  className={styles.buyButton}
                  type="button"
                >
                  구매하기
                </button>
              )
        }
      </div>
    </div>
  );
};

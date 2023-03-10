import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./AdminPage.module.scss";
import moment from "moment";

import Article from "components/blocks/Article";
import useInput from "hooks/common/useInput";
import ProductCard from "components/atoms/ProductCard";
import {addProduct} from "features/product/productSlice";
import EmptyText from "components/atoms/EmptyText";
import handleCommaFormat from "hooks/utils/handleCommaFormat";

export default function AdminPage() {
  const dispatch = useDispatch();

  const { myInfo } = useSelector((state) => state.user);
  const { productList } = useSelector((state) => state.product);

  const [productName, onChangeProductName, setProductName] = useInput("");
  const [productPrice, setProductPrice] = useState("0");
  const [productCount, onChangeProductCount, setProductCount] = useInput("");
  const [productCategory, setProductCategory] = useState("일반음료");

  const [error, setError] = useState("");

  const handleInputReset = useCallback(() => { // input value 초기화 함수
    setProductName("");
    setProductPrice("0");
    setProductCount("");
    setProductCategory("일반음료");
  }, []);

  const onSubmitAddProduct = useCallback((event) => { // 상품 추가 함수
    event.preventDefault();

    const newHistoryObject = { // 구매 내역 객체
      type: '구매',
      buyer: myInfo.name,
      count: Number(productCount),
      initialCount: Number(productCount),
      category: productCategory,
      dateTime: {
        date: moment().format("YYYY. MM. DD."),
        time: moment().format("h:mm:ss A"),
        timestamp: moment().toISOString(),
      },
      productName: productName,
      productPrice: handleCommaFormat(productPrice),
      purchase: handleCommaFormat(productPrice) * 0.4,
      refill: 1,
      margin: handleCommaFormat(productPrice) * 0.6
    }

    const newProductObject = { // 상품 객체
      name: productName,
      price: handleCommaFormat(productPrice),
      count: Number(productCount),
      initialCount: Number(productCount),
      category: productCategory,
      salesCount: 0,
      totalSales: 0,
      cost: handleCommaFormat(productPrice) * 0.4,
      margin: handleCommaFormat(productPrice) * 0.6,
      refill: 1,
      best: false,
      uploadDate: moment().toISOString()
    }

    // 수량, 가격 0 방지
    if (handleCommaFormat(productPrice) < 100) {
      setError('가격은 100원 이상 입력해주세요!');
      return;
    }
    if (Number(productCount) <= 0) {
      setError('수량은 1개 이상 입력해주세요!');
      return;
    }

    // 중복 체크
    const overlapCheck = productList.find((p) => p.name === productName);

    if (overlapCheck) {
      setError('같은 이름의 상품은 추가할 수 없습니다!');
      return;
    }

    dispatch(addProduct({
      productObject: newProductObject,
      historyObject: newHistoryObject
    }));

    handleInputReset();
  }, [myInfo, productList, productName, productPrice, productCount, productCategory]);

  const onChangePriceInput = useCallback((event) => {
    const value = event.target.value;
    const numberTypeCheck = /^[0-9,]/.test(value);

    if (numberTypeCheck) {
      const removedCommaValue = Number(value.replaceAll(",", ""));
      setProductPrice(removedCommaValue.toLocaleString());
    } else {
      setProductPrice("");
    }
  }, []);

  const onChangeCategory = useCallback((event) => {
    setProductCategory(event.target.value);
  }, [productCategory]);

  return (
    <section className={styles.wrapper}>
      <Article title="상품 추가">
        <form className={styles.addForm} onSubmit={onSubmitAddProduct}>
          <div className={styles.inputWrapper}>
            <div className={styles.item}>
              <input
                type="text"
                value={productName}
                onChange={onChangeProductName}
                required
              />
              <div className={styles.inputLabel}>
                상품명
              </div>
            </div>
            <div className={styles.item}>
              <input
                type="text"
                className={styles.price}
                value={productPrice}
                onChange={onChangePriceInput}
                required
              />
              <div className={styles.inputLabel}>
                판매가격
              </div>
            </div>
            <div className={styles.item}>
              <input
                className={styles.count}
                type="number"
                value={productCount}
                onChange={onChangeProductCount}
                required
              />
              <div className={styles.inputLabel}>
                수량
              </div>
            </div>
            <div className={styles.item}>
              <select
                value={productCategory}
                onChange={onChangeCategory}
              >
                <option value="일반음료">일반음료</option>
                <option value="탄산음료">탄산음료</option>
                <option value="맥주">맥주</option>
                <option value="커피">커피</option>
              </select>
              <div className={styles.inputLabel}>
                카테고리
              </div>
            </div>
          </div>
          <button type="submit">
            상품 추가
          </button>
          { error && <p className={styles.error}>{ error }</p> }
        </form>
      </Article>
      <Article title="상품 현황">
        {
          productList?.length === 0
            ? <EmptyText type="상품" />
            : (
              <div className={styles.productList}>
                {
                  productList?.map((product, i) => {
                    return (
                      <ProductCard
                        key={product.name}
                        data={product}
                      />
                    )
                  })
                }
              </div>
            )
        }
      </Article>
    </section>
  );
};

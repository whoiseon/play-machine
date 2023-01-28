import {useCallback, useState} from "react";
import Image from "next/image";
import {useSelector} from "react-redux";

import styles from "../Calculate/Calculate.module.scss";
import moment from "moment";

export default function CalculateTr({ data, rank, type, getTotalCount }) {
  const { history } = useSelector((state) => state.product);

  const [toggleHistory, setToggleHistory] = useState(false);

  const toggleHistoryTr = useCallback(() => {
    setToggleHistory((prev) => !prev)
  }, []);

  const getMyProductHistory = useCallback(() => {
    return history.filter((h) => h.buyer === data.name);
  }, []);

  return type === '이용자별'
    ? (
      <>
        <tr>
          <td>{ rank }위</td>
          <td className={styles.left}>{ data.name }</td>
          <td>{ data.totalSalesCount } 개</td>
          <td className={`${styles.right} ${styles.sales}`}>{ data.totalSales } 원</td>
          <td>
            <button type="button" onClick={toggleHistoryTr}>
              <Image
                src="/image/icon/arrow-bottom-icon.svg"
                alt="arrow icon"
                className={toggleHistory ? styles.rotation : ''}
                width={12}
                height={8}
              />
            </button>
          </td>
        </tr>
        {
          toggleHistory && (
            <tr className={styles.boughtList}>
              <td colSpan={5}>
                <table>
                  <colgroup>
                    <col style={{width: '160px'}} />
                    <col style={{width: '180px'}} />
                    <col style={{width: '130px'}} />
                    <col style={{width: '130px'}} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>시간</th>
                      <th className={styles.left}>상품명</th>
                      <th>판매가</th>
                      <th>순수익</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      getMyProductHistory().map((h, i) => {
                        return (
                          <tr key={h.dateTime.timestamp}>
                            <td className={styles.datetime}>
                              <p>{ moment(h.dateTime.timestamp).format('YY.MM.DD') } { moment(h.dateTime.timestamp).format('h:mm:ss') }</p>
                            </td>
                            <td className={styles.left}>{ h.productName }</td>
                            <td className={`${styles.right} ${styles.sales}`}>{ h.productPrice } 원</td>
                            <td className={styles.margin}>{ h.sales } 원</td>
                          </tr>
                        )
                      })
                    }
                    <tr>
                      <td >총 합계</td>
                      <td />
                      <td className={`${styles.right} ${styles.sales}`}>
                        {getTotalCount(getMyProductHistory(), 'productPrice')} 원
                      </td>
                      <td className={styles.margin}>
                        {getTotalCount(getMyProductHistory(), 'sales')} 원
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )
        }
      </>
    )
    : (
      <tr>
        {
          type === '상품별' && rank === 1
            ? (
              <td className={styles.bestProduct}>
                <span>
                  BEST
                </span>
              </td>
            )
            : <td>{rank} 위</td>
        }
        <td className={styles.left}>
          { data.name }
          {
            type === '상품별' && rank === 1 && (
              <p className={styles.bestProductGuide}>정산시 가격이 100원 증가합니다!</p>
            )
          }
        </td>
        <td>{ data.salesCount } 개</td>
        <td className={`${styles.right} ${styles.sales}`}>{ data.salesCount * data.price } 원</td>
        <td className={styles.margin}>
          { data.margin * data.salesCount } 원
        </td>
      </tr>
    )
}
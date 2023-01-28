import {useCallback, useState} from "react";
import {useSelector} from "react-redux";

import styles from "../Calculate/Calculate.module.scss";

import CalculateTr from "../CalculateTr";

export default function CalculateTable({ type }) {
  const { myInfo, userData } = useSelector((state) => state.user);
  const { productList } = useSelector((state) => state.product);

  const [userList, setUserList] = useState(userData.filter((user) => !user.admin));

  const getArrayLank = useCallback((array, key) => {
    const copyArrayData = [...array];
    return copyArrayData.sort((a, b) => (
      b[key] - a[key]
    ));
  }, []);

  const getTotalCount = useCallback((array, key, subKey = '') => { // 총 판매 금액을 계산하는 함수
    let totalCount = 0;

    array.map((a) => {
      if (subKey) {
        return totalCount += (a[key] * a[subKey])
      } else {
        return totalCount += a[key]
      }
    })

    return totalCount;
  }, []);

  return type === '이용자별'
    ? (
      <table className={styles.table}>
        <colgroup>
          <col style={{width: '100px'}} />
          <col style={{width: '200px'}} />
          <col style={{width: '100px'}} />
          <col style={{width: '100px'}} />
          <col style={{width: '100px'}} />
        </colgroup>
        <thead>
        <tr>
          <th>순위</th>
          <th className={styles.left}>이용자</th>
          <th>구매량</th>
          <th>구매금액</th>
          <th>구매내역</th>
        </tr>
        </thead>
        <tbody>
        {
          getArrayLank(userList, 'totalSales').map((data, i) => {
            return <CalculateTr
              key={data.name}
              data={data}
              rank={i + 1}
              type={type}
            />
          })
        }
        <tr>
          <td>총 합계</td>
          <td />
          <td className={styles.count}>{ getTotalCount(userList, 'totalSalesCount') } 개</td>
          <td className={`${styles.right} ${styles.sales}`}>{ getTotalCount(userList, 'totalSales') } 원</td>
          <td />
        </tr>
        </tbody>
      </table>
    )
    : (
      <table className={styles.table}>
        <colgroup>
          <col style={{width: '100px'}} />
          <col style={{width: '170px'}} />
          <col style={{width: '110px'}} />
          <col style={{width: '110px'}} />
          <col style={{width: '110px'}} />
        </colgroup>
        <thead>
        <tr>
          <th>순위</th>
          <th className={styles.left}>상품명</th>
          <th>판매량</th>
          <th>판매금액</th>
          <th>순수익</th>
        </tr>
        </thead>
        <tbody>
        {
          getArrayLank(productList, 'salesCount').map((data, i) => {
            return <CalculateTr
              key={data.name}
              data={data}
              rank={i + 1}
              type={type}
            />
          })
        }
        <tr>
          <td>총 합계</td>
          <td />
          <td className={styles.count}>{ getTotalCount(productList, 'salesCount') } 개</td>
          <td className={`${styles.right} ${styles.sales}`}>{ getTotalCount(productList, 'price', 'salesCount') } 원</td>
          <td className={styles.margin}>{ getTotalCount(productList, 'margin', 'salesCount') } 원</td>
        </tr>
        </tbody>
      </table>
    )
};

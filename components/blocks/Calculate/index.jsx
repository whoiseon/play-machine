import {useCallback, useState} from "react";

import styles from "./Calculate.module.scss";
import CalculateTable from "../CalculateTable";
import {useSelector} from "react-redux";
import EmptyText from "../../atoms/EmptyText";

export default function Calculate() {
  const { history } = useSelector((state) => state.product);

  const [tab, setTab] = useState("이용자별");

  const handleChangeTab = useCallback((event) => {
    const { textContent } = event.target;

    setTab(textContent);
  }, []);

  const handleCalculateMachine = useCallback(() => {
    // 정산기능
  }, []);

  return (
    <>
      <div className={styles.tab}>
        <button
          type="button"
          onClick={handleChangeTab}
          className={tab === '이용자별' ? styles.active : ''}
        >
          이용자별
        </button>
        <button
          type="button"
          onClick={handleChangeTab}
          className={tab === '상품별' ? styles.active : ''}
        >
          상품별
        </button>
      </div>
      <div className={styles.wrapper}>
        {
          history.length !== 0
            ? <CalculateTable type={tab} />
            : <EmptyText type="정산" />
        }
      </div>
      <div className={styles.calculateButton}>
        <button type="button" disabled={history.length === 0}>
          정산
        </button>
      </div>
    </>
  );
};

import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./Nav.module.scss";

import useLocalStorage from "../../../hooks/common/useLocalStorage";
import {signOut} from "../../../features/user/userSlice";
import Image from "next/image";

export default function Nav() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const [products, setProducts] = useState([]);
  const [productStore, setProductStore] = useLocalStorage("products", products);

  const [loggingUser, setLoggingUser, removeLoggingUser] = useLocalStorage("loggingUser", null);
  const [myMoney, setMyMoney] = useState(userInfo.money);

  const onLogout = useCallback(() => {
    dispatch(signOut());
    removeLoggingUser();
  }, [signOut, removeLoggingUser]);

  const handleNumberCommaFormat = useCallback((number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  const handleCalculateMachine = useCallback(() => {
    // 정산기능
  }, []);

  return (
    <nav className={styles.wrapper}>
      <div className={styles.myInfo}>
        <div className={styles.profile}>
          <Image
            src="/image/icon/default-profile.svg"
            alt="default profile"
            width={36}
            height={36}
          />
          <span>
            { userInfo.name }님 반갑습니다.
          </span>
          <button type="button" onClick={onLogout}>
            <Image
              src="/image/icon/logout-icon.svg"
              alt="Logout"
              width={20}
              height={20}
            />
          </button>
        </div>
        {
          !userInfo.admin
            ? (
              <div className={styles.seedMoney}>
                <span>보유 금액</span>
                <span className={styles.money}>{ handleNumberCommaFormat(myMoney) } 원</span>
              </div>
            )
            : (
              <button
                type="button"
                className={styles.calculate}
                onClick={handleCalculateMachine}
              >
                정산완료
              </button>
            )
        }
      </div>
      {
        !userInfo.admin && (
          <>
            <ul>
              <li>
                <div>
                  <p>투입 금액</p>
                  <p className={styles.moneyInvested}>0 원</p>
                </div>
                <button type="button">
                  투입
                </button>
              </li>
              <li>
                <div>
                  <p>잔돈</p>
                  <p className={styles.changes}>0 원</p>
                </div>
                <button type="button">
                  반환
                </button>
              </li>
            </ul>
            <button className={styles.history} type="button">
              이용 내역
            </button>
          </>
        )
      }
    </nav>
  );
};

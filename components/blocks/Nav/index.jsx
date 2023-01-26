import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./Nav.module.scss";

import useLocalStorage from "../../../hooks/common/useLocalStorage";
import {signOut} from "../../../features/user/userSlice";
import Image from "next/image";
import Modal from "../../atoms/Modal";
import useModalControl from "../../../hooks/common/useModalControl";

export default function Nav() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const [products, setProducts] = useState([]);
  const [productStore, setProductStore] = useLocalStorage("products", products);

  const [loggingUser, setLoggingUser, removeLoggingUser] = useLocalStorage("loggingUser", null);
  const [myMoney, setMyMoney] = useState(userInfo.money);
  const [moneyInvested, setMoneyInvested] = useState("");
  const [unitError, setUnitError] = useState("");

  const [investedModal, setModal, openModal, closeModal] = useModalControl(false);

  const onLogout = useCallback(() => {
    dispatch(signOut());
    removeLoggingUser();
  }, [signOut, removeLoggingUser]);

  const handleNumberCommaFormat = useCallback((number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  const handleRemoveCommaValue = useCallback((string) => {
    return Number(string.replaceAll(",", ""));
  }, []);

  const handleMoneyUnitCheck = useCallback((number) => {
    if (number % 1000 !== 0) {
      return false;
    }
    return true;
  }, []);

  const handleMoneyIncrement = useCallback((event) => {
    const value = event.target.textContent;
    const removedCommaValue = Number(value.replaceAll(",", ""));

    setMoneyInvested(
      (prev) => (handleRemoveCommaValue(prev) + removedCommaValue).toLocaleString()
    );
  }, [handleRemoveCommaValue]);

  const onChangeMoneyInvested = useCallback((event) => {
    const value = event.target.value;
    const numberTypeCheck = /^[0-9,]/.test(value);
    const removedCommaValue = Number(value.replaceAll(",", ""));

    if (!numberTypeCheck) {
      setMoneyInvested("");
      return;
    }

    if (!handleMoneyUnitCheck(removedCommaValue)) {
      setUnitError("1,000원 단위로만 투입 가능합니다!");
    } else {
      setUnitError("");
    }

    setMoneyInvested(removedCommaValue.toLocaleString());
  }, [handleMoneyUnitCheck]);

  const onCloseModal = useCallback(() => {
    setModal(false);
    setMoneyInvested("");
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
                <button
                  type="button"
                  onClick={openModal}
                >
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
      {
        investedModal && (
          <Modal
            title="투입 하기"
            closeModal={onCloseModal}
          >
            <div className={styles.investedWrapper}>
              {unitError && <p className={styles.warning}>1,000원 단위로만 투입 가능합니다.</p>}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={moneyInvested}
                  placeholder="0"
                  onChange={onChangeMoneyInvested}
                />
                <p className={styles.inputLabel}>투입 금액</p>
                <p className={styles.unit}>원</p>
              </div>
              <div className={styles.investedTools}>
                <button type="button" onClick={handleMoneyIncrement}>
                  1,000
                </button>
                <button type="button" onClick={handleMoneyIncrement}>
                  3,000
                </button>
                <button type="button" onClick={handleMoneyIncrement}>
                  5,000
                </button>
                <button type="button" onClick={handleMoneyIncrement}>
                  10,000
                </button>
              </div>
              <button
                type="button"
                className={styles.invested}
              >
                투입
              </button>
            </div>
          </Modal>
        )
      }
    </nav>
  );
};

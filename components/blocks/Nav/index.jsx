import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./Nav.module.scss";

import useLocalStorage from "hooks/common/useLocalStorage";
import {fetchUserInfo, signOut} from "features/user/userSlice";
import Image from "next/image";
import Modal from "components/atoms/Modal";
import useModalControl from "hooks/common/useModalControl";
import {addMoneyInvest, loadProductsStore, returnMoneyInvested} from "features/product/productSlice";
import UsageHistory from "../../atoms/UsageHistory";

export default function Nav() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { moneyInvested, history, productList } = useSelector((state) => state.product);

  const [productStore, setProductStore] = useLocalStorage("productStore", {});
  const [userData, setUserData] = useLocalStorage("userData", null);
  const [loggingUser, setLoggingUser, removeLoggingUser] = useLocalStorage("loggingUser", null);

  const [moneyInvest, setMoneyInvest] = useState("");
  const [myHistory, setMyHistory] = useState([]);
  const [error, setError] = useState("");

  const [investedModal, setInvestedModal, openInvestedModal, closeInvestedModal] = useModalControl(false);
  const [historyModal, setHistoryModal, openHistoryModal, closeHistoryModal] = useModalControl(false);

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
    // 1000원 단위 체크 함수
    return number % 1000 === 0;
  }, []);

  const handleMoneyIncrement = useCallback((event) => {
    const value = event.target.textContent;
    const removedCommaValue = Number(value.replaceAll(",", ""));
    const removedCommaMoneyInvested = handleRemoveCommaValue(moneyInvest);

    // Increment 버튼을 사용했을 때 보유 머니보다 큰 값 입력 방지
    if (!((removedCommaValue + removedCommaMoneyInvested) <= userInfo.money)) {
      setError("보유 금액을 초과합니다!");
      return;
    }

    setMoneyInvest(
      (prev) => (handleRemoveCommaValue(prev) + removedCommaValue).toLocaleString()
    );
  }, [handleRemoveCommaValue, moneyInvest, userInfo]);

  const onChangeMoneyInvested = useCallback((event) => {
    const value = event.target.value;
    const numberTypeCheck = /^[0-9,]/.test(value);
    const removedCommaValue = Number(value.replaceAll(",", ""));

    // 숫자가 아닌 한글을 입력했을 때
    if (!numberTypeCheck) {
      setMoneyInvest("");
      return;
    }

    // 보유한 금액보다 더 큰 금액을 입력했을때 초기화
    if (removedCommaValue > userInfo.money) {
      setMoneyInvest(handleNumberCommaFormat(userInfo.money));
      setError("보유 금액을 초과했습니다!");
      return;
    }

    // 1,000원 단위 체크
    if (!handleMoneyUnitCheck(removedCommaValue)) {
      setError("1,000원 단위로만 투입 가능합니다!");
    } else {
      setError("");
    }

    setMoneyInvest(removedCommaValue.toLocaleString());
  }, [handleMoneyUnitCheck, handleNumberCommaFormat, userInfo.money]);

  const onCloseModal = useCallback(() => {
    setInvestedModal(false);
    setError("");
    setMoneyInvest("");
  }, []);

  const handleMoneyInvested = useCallback(() => {
    // 보유 머니 투입 함수

    // 로컬스토리지 데이터 수정
    const getMyInfoIndex = userData.findIndex((user) => user.id === userInfo.id);
    let copyUserData = [...userData];

    if(!handleMoneyUnitCheck(handleRemoveCommaValue(moneyInvest))) {
      setError("1,000원 단위로만 투입 가능합니다!");
      return;
    }

    if (!moneyInvest) {
      setError("투입할 금액을 입력해주세요");
      return;
    }

    setProductStore((prevData) => ({
      ...prevData,
      moneyInvested: handleRemoveCommaValue(moneyInvest)
    }));

    copyUserData[getMyInfoIndex] = {
      ...copyUserData[getMyInfoIndex],
      money: userInfo.money - handleRemoveCommaValue(moneyInvest)
    }

    setUserData(copyUserData);
    setLoggingUser(copyUserData[getMyInfoIndex]);

    // redux userInfo update
    dispatch(fetchUserInfo(copyUserData[getMyInfoIndex]));
    dispatch(addMoneyInvest(handleRemoveCommaValue(moneyInvest)));

    // reset
    setMoneyInvest("");
    closeInvestedModal();
  }, [userInfo, moneyInvest, handleRemoveCommaValue, closeInvestedModal]);

  const handleChangesReturn = useCallback(() => {
    // 남은 잔돈 반환 함수
    // 로컬스토리지 데이터 수정
    const getMyInfoIndex = userData.findIndex((user) => user.id === userInfo.id);
    let copyUserData = [...userData];

    if (!(moneyInvested > 0)) return;

    copyUserData[getMyInfoIndex] = {
      ...copyUserData[getMyInfoIndex],
      money: userInfo.money + moneyInvested
    }

    setUserData(copyUserData);
    setLoggingUser(copyUserData[getMyInfoIndex]);

    setProductStore({
      history,
      productList,
      moneyInvested: 0,
    });

    // redux userInfo update
    dispatch(fetchUserInfo(copyUserData[getMyInfoIndex]));
    dispatch(returnMoneyInvested(handleRemoveCommaValue(moneyInvest)));
  }, [history, productList, userInfo, handleRemoveCommaValue, moneyInvest, moneyInvested]);

  const handleCalculateMachine = useCallback(() => {
    // 정산기능
  }, []);

  useEffect(() => {
    setMyHistory(history.filter((h) => h.buyer === userInfo.name))
  }, [history, userInfo]);

  useEffect(() => {
    // 모달이 켜져있을 때 스크롤 방지
    if (investedModal || historyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [investedModal, historyModal]);

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
                <span className={styles.money}>{ handleNumberCommaFormat(userInfo.money) } 원</span>
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
                  <p className={styles.moneyInvested}>{ handleNumberCommaFormat(moneyInvested) } 원</p>
                </div>
                <div className={styles.ctrlButton}>
                  <button
                    type="button"
                    onClick={openInvestedModal}
                  >
                    투입
                  </button>
                  <button
                    type="button"
                    onClick={handleChangesReturn}
                  >
                    반환
                  </button>
                </div>
              </li>
            </ul>
            <button
              type="button"
              className={styles.history}
              onClick={openHistoryModal}
            >
              이용내역 <i>{ myHistory.length }</i> 건
            </button>
          </>
        )
      }
      {
        investedModal && (
          <Modal
            title="투입 하기"
            closeModal={closeInvestedModal}
          >
            <div className={styles.investedWrapper}>
              {error && <p className={styles.warning}>{error}</p>}
              <div className={styles.myMoneyInModal}>
                <p>보유 금액</p>
                <p className={styles.money}>{ handleNumberCommaFormat(userInfo.money) } 원</p>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={moneyInvest}
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
                onClick={handleMoneyInvested}
              >
                투입
              </button>
            </div>
          </Modal>
        )
      }
      {
        historyModal && (
          <Modal title="이용내역" closeModal={closeHistoryModal}>
            <div className={styles.historyWrapper}>
              {
                myHistory.map((history, i) => {
                  return <UsageHistory key={history.dateTime.time} data={history} />
                })
              }
            </div>
          </Modal>
        )
      }
    </nav>
  );
};

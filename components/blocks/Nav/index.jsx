import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";

import styles from "./Nav.module.scss";

import {myMoneyInvest, myMoneyInvestedReturn, signOut} from "features/user/userSlice";
import Modal from "components/atoms/Modal";
import useModalControl from "hooks/common/useModalControl";
import {addMoneyInvest, resetMoneyInvested} from "features/product/productSlice";
import UsageHistory from "components/atoms/UsageHistory";
import EmptyText from "../../atoms/EmptyText";
import Calculate from "../Calculate";

export default function Nav() {
  const dispatch = useDispatch();

  const { myInfo } = useSelector((state) => state.user);
  const { moneyInvested, history, productList } = useSelector((state) => state.product);

  const [moneyInvest, setMoneyInvest] = useState("");
  const [myHistory, setMyHistory] = useState([]);
  const [error, setError] = useState("");

  const [investedModal, setInvestedModal, openInvestedModal, closeInvestedModal] = useModalControl(false);
  const [historyModal, setHistoryModal, openHistoryModal, closeHistoryModal] = useModalControl(false);
  const [calcModal, setCalcModal, openCalcModal, closeCalcModal] = useModalControl(false);

  const onLogout = useCallback(() => {
    dispatch(signOut());
  }, [signOut]);

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
    if (!((removedCommaValue + removedCommaMoneyInvested) <= myInfo.money)) {
      setError("보유 금액을 초과합니다!");
      return;
    }

    setMoneyInvest(
      (prev) => (handleRemoveCommaValue(prev) + removedCommaValue).toLocaleString()
    );
  }, [handleRemoveCommaValue, moneyInvest, myInfo]);

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
    if (removedCommaValue > myInfo.money) {
      setMoneyInvest(handleNumberCommaFormat(myInfo.money));
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
  }, [handleMoneyUnitCheck, handleNumberCommaFormat, myInfo.money]);

  const handleMoneyInvested = useCallback(() => { // 보유 머니 투입 함수
    if(!handleMoneyUnitCheck(handleRemoveCommaValue(moneyInvest))) {
      setError("1,000원 단위로만 투입 가능합니다!");
      return;
    }

    if (!moneyInvest) {
      setError("투입할 금액을 입력해주세요");
      return;
    }

    dispatch(myMoneyInvest({
      userId: myInfo.id,
      moneyInvested: handleRemoveCommaValue(moneyInvest)
    }));
    dispatch(addMoneyInvest(handleRemoveCommaValue(moneyInvest)));

    // reset
    setMoneyInvest("");
    closeInvestedModal();
  }, [myInfo, moneyInvest, handleRemoveCommaValue, closeInvestedModal]);

  const handleChangesReturn = useCallback(() => {
    // 남은 잔돈 반환 함수
    if (moneyInvested <= 0) return;

    dispatch(myMoneyInvestedReturn({
      userId: myInfo.id,
      changes: moneyInvested
    }))
    dispatch(resetMoneyInvested(handleRemoveCommaValue(moneyInvest)));
  }, [history, productList, myInfo, handleRemoveCommaValue, moneyInvest, moneyInvested]);

  useEffect(() => {
    setMyHistory(history.filter((h) => h.buyer === myInfo.name))
  }, [history, myInfo]);

  useEffect(() => {
    // 모달이 켜져있을 때 스크롤 방지
    if (investedModal || historyModal || calcModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [investedModal, historyModal, calcModal]);

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
            { myInfo.name }님 반갑습니다.
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
          !myInfo.admin
            ? (
              <div className={styles.seedMoney}>
                <span>보유 금액</span>
                <span className={styles.money}>{ handleNumberCommaFormat(myInfo.money) } 원</span>
              </div>
            )
            : (
              <button
                type="button"
                className={styles.calculate}
                onClick={openCalcModal}
              >
                정산하기
              </button>
            )
        }
      </div>
      {
        !myInfo.admin && (
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
                <p className={styles.money}>{ handleNumberCommaFormat(myInfo.money) } 원</p>
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
                myHistory.length > 0
                  ? (
                    myHistory.map((history, i) => {
                      return <UsageHistory key={history.dateTime.time} data={history} />
                    })
                  )
                  : <EmptyText type="이용내역" />
              }
            </div>
          </Modal>
        )
      }
      {
        calcModal && (
          <Modal title="정산하기" closeModal={closeCalcModal}>
            <Calculate />
          </Modal>
        )
      }
    </nav>
  );
};

import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";

import styles from "./Nav.module.scss";

import {myMoneyInvest, myMoneyInvestedReturn, signOut, updateRestartUserMoney} from "features/user/userSlice";
import Modal from "components/atoms/Modal";
import useModalControl from "hooks/common/useModalControl";
import {addMoneyInvest, resetMoneyInvested, updateRestartProduct} from "features/product/productSlice";
import UsageHistory from "components/atoms/UsageHistory";
import EmptyText from "components/atoms/EmptyText";
import Calculate from "../Calculate";
import handleCommaFormat from "hooks/utils/handleCommaFormat";

export default function Nav() {
  const dispatch = useDispatch();

  const { myInfo } = useSelector((state) => state.user);
  const { sales, moneyInvested, history } = useSelector((state) => state.product);

  const [moneyInvest, setMoneyInvest] = useState("");
  const [myHistory, setMyHistory] = useState([]);
  const [error, setError] = useState("");

  const [investedModal, setInvestedModal, openInvestedModal, closeInvestedModal] = useModalControl(false, () => { setMoneyInvest("") });
  const [historyModal, setHistoryModal, openHistoryModal, closeHistoryModal] = useModalControl(false);
  const [calcModal, setCalcModal, openCalcModal, closeCalcModal] = useModalControl(false);

  const onLogout = useCallback(() => {
    dispatch(signOut());
  }, [signOut]);

  const handleMoneyUnitCheck = useCallback((number) => { // 1000원 단위 체크 후 boolean을 반환함
    return number % 1000 === 0;
  }, []);

  const handleMoneyIncrement = useCallback((event) => { // 버튼을 통한 투입 금액 입력 함수
    const value = event.target.textContent;
    const removedCommaValue = Number(value.replaceAll(",", ""));
    const removedCommaMoneyInvested = handleCommaFormat(moneyInvest);

    if (!((removedCommaValue + removedCommaMoneyInvested) <= myInfo.money)) { // 버튼을 사용해 금액을 증가 시킬 때 보유 머니보다 큰 값 입력 방지
      setError("보유 금액을 초과합니다!");
      return;
    }

    setMoneyInvest(
      (prev) => (handleCommaFormat(prev) + removedCommaValue).toLocaleString()
    );
  }, [handleCommaFormat, moneyInvest, myInfo]);

  const onChangeMoneyInvested = useCallback((event) => {
    const value = event.target.value;
    const numberTypeCheck = /^[0-9,]/.test(value);
    const removedCommaValue = Number(value.replaceAll(",", ""));

    if (!numberTypeCheck) { // number가 아닌 string을 입력했을 때
      setMoneyInvest("");
      return;
    }

    if (removedCommaValue > myInfo.money) { // 보유한 금액보다 더 큰 금액을 입력했을때 초기화
      setMoneyInvest(handleCommaFormat(myInfo.money));
      setError("보유 금액을 초과했습니다!");
      return;
    }

    if (!handleMoneyUnitCheck(removedCommaValue)) { // 1,000원 단위 체크 함수로 단위 체크
      setError("1,000원 단위로만 투입 가능합니다!");
    } else {
      setError("");
    }

    setMoneyInvest(removedCommaValue.toLocaleString());
  }, [handleMoneyUnitCheck, handleCommaFormat, myInfo.money]);

  const handleMoneyInvested = useCallback(() => { // 보유 머니 투입 함수
    if(!handleMoneyUnitCheck(handleCommaFormat(moneyInvest))) { // 1,000원 단위 체크
      setError("1,000원 단위로만 투입 가능합니다!");
      return;
    }

    if (!moneyInvest) { // 금액을 입력하지 않았을 때
      setError("투입할 금액을 입력해주세요");
      return;
    }

    dispatch(myMoneyInvest({
      userId: myInfo.id,
      moneyInvested: handleCommaFormat(moneyInvest)
    }));
    dispatch(addMoneyInvest(handleCommaFormat(moneyInvest)));

    // state를 초기화시켜주고 modal 종료
    setMoneyInvest("");
    closeInvestedModal();
  }, [myInfo, moneyInvest, handleCommaFormat, closeInvestedModal]);

  const handleChangesReturn = useCallback(() => { // 남은 잔돈 반환 함수
    if (moneyInvested <= 0) return; // 투입된 금액이 0원일 때 코드 실행 방지

    dispatch(myMoneyInvestedReturn({
      userId: myInfo.id,
      changes: moneyInvested
    }));
    dispatch(resetMoneyInvested(handleCommaFormat(moneyInvest)));
  }, [myInfo, handleCommaFormat, moneyInvest, moneyInvested]);

  const handleSalesRestart = useCallback(() => { // 판매 재시작 함수
    dispatch(updateRestartUserMoney());
    dispatch(updateRestartProduct());
    closeCalcModal();
  }, [])

  useEffect(() => { // 컴포넌트가 mount되면 myHistory state에 이용내역을 푸쉬
    setMyHistory(history.filter((h) => h.buyer === myInfo.name))
  }, [history, myInfo]);

  useEffect(() => { // 모달이 켜져있을 때 background 스크롤 방지
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
                <span className={styles.money}>{ handleCommaFormat(myInfo.money) } 원</span>
              </div>
            )
            : sales
              ? (
                <button
                  type="button"
                  className={styles.calculate}
                  onClick={openCalcModal}
                >
                  정산하기
                </button>
              )
              : (
                <button
                  type="button"
                  className={styles.restart}
                  onClick={handleSalesRestart}
                >
                  영업 재시작
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
                  <p className={styles.moneyInvested}>{ handleCommaFormat(moneyInvested) } 원</p>
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
                <p className={styles.money}>{ handleCommaFormat(myInfo.money) } 원</p>
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
                      return <UsageHistory key={history.dateTime.timestamp} data={history} />
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
            <Calculate handleSalesRestart={handleSalesRestart} />
          </Modal>
        )
      }
    </nav>
  );
};

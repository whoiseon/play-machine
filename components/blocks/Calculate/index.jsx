import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";

import styles from "./Calculate.module.scss";
import { utils, writeFile } from "xlsx";
import moment from "moment";

import CalculateTable from "../CalculateTable";
import EmptyText from "../../atoms/EmptyText";
import {stopSalesState} from "features/product/productSlice";

export default function Calculate({ handleSalesRestart }) {
  const dispatch = useDispatch();

  const { history, sales, productList } = useSelector((state) => state.product);

  const [complete, setComplete] = useState(false);
  const [nowDate, setNowDate] = useState(moment().format("YYYY년 MM월 DD일 HH시 MM분"));

  const [tab, setTab] = useState("이용자별");

  const getHistoryTotalMoney = useCallback((type) => {
    let totalMoney = 0;

    history.map((h) => {
      switch (type) {
        case '매입':
          return totalMoney += h.type === '구매' ? (h.purchase * h.count) : 0;
        case '매출':
          return totalMoney += h.type === '판매' ? h.productPrice : 0;
        case '순수익':
          return totalMoney += h.type === '판매' ? h.sales : 0
      }
    });

    return totalMoney;
  }, [history]);

  const getArrayLank = useCallback((array, key) => {
    const copyArrayData = [...array];
    return copyArrayData.sort((a, b) => (
      b[key] - a[key]
    ));
  }, []);

  const excelDownloader = useCallback(() => {
    const newExcelHeader = {
      header: ['구분', '시간', '이름', '상품명', '매입', '매출', '순수익'],
    }
    let newExcelObjects = [{
      '구분': '총 합계',
      '시간': '',
      '이름': '',
      '상품명': '',
      '매입': getHistoryTotalMoney('매입'),
      '매출': getHistoryTotalMoney('매출'),
      '순수익': getHistoryTotalMoney('순수익') - getHistoryTotalMoney('매입'),
    }];

    history.map((h, i) => {
      return newExcelObjects.unshift({
        '구분': h.type,
        '시간': moment(h.dateTime?.timestamp).format("YYYY-MM-DD hh:mm:ss"),
        '이름': h.buyer,
        '상품명': h.productName,
        '매입': h.type === '구매' ? (h.purchase * h.count) : '',
        '매출': h.type === '판매' ? h.productPrice : '',
        '순수익': h.type === '판매' ? h.sales : '',
      })
    });

    const workBook = utils.book_new();

    const calculateSheet =  utils.json_to_sheet(newExcelObjects, newExcelHeader);
    calculateSheet["!cors"] = [
      {wpx: 60}, // 구분
      {wpx: 140}, // 시간
      {wpx: 100}, // 이름
      {wpx: 100}, // 상품명
      {wpx: 120}, // 매입
      {wpx: 120}, // 매출
      {wpx: 120}, // 순수익
    ]

    utils.book_append_sheet(workBook, calculateSheet, "playmachine");
    writeFile(workBook, `${moment().format("YYMMDDHHMMSS")}_플레이머신_정산.xlsx` );
  }, [history, moment])

  const handleNumberCommaFormat = useCallback((number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  const handleChangeTab = useCallback((event) => {
    const { textContent } = event.target;

    setTab(textContent);
  }, []);

  const handleCalculateMachine = useCallback(() => {
    excelDownloader();
    setComplete(true);
    dispatch(stopSalesState(getArrayLank(productList, 'salesCount')[0]));
  }, [excelDownloader]);

  return sales && !complete
    ? (
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
          <button
            type="button"
            onClick={handleCalculateMachine}
            disabled={history.length === 0}
          >
            정산
          </button>
        </div>
      </>
    )
    : (
      <>
        <div className={styles.complete}>
          <div className={styles.icon}>
            <Image
              src="/image/icon/completed-icon.svg"
              alt="Completed!"
              width={94}
              height={84}
            />
          </div>
          <div className={styles.text}>
            <h1>성공적으로 <i>정산</i>이 완료되었습니다!</h1>
            <p>
              정산 내역은 엑셀로 자동으로 다운로드 됩니다!<br />
              다운로드가 되지 않았다면 아래 버튼을 클릭해서 다시 다운로드해주세요!
            </p>
          </div>
          <div className={styles.box}>
            <div className={styles.line}>
              <p>시간</p>
              <p>{ nowDate }</p>
            </div>
            <div className={styles.line}>
              <p>매입</p>
              <p>{ handleNumberCommaFormat(getHistoryTotalMoney('매입')) } 원</p>
            </div>
            <div className={styles.line}>
              <p>매출</p>
              <p>{ handleNumberCommaFormat(getHistoryTotalMoney('매출')) } 원</p>
            </div>
            <div className={styles.line}>
              <p>순수익</p>
              <p>{ handleNumberCommaFormat(getHistoryTotalMoney('순수익') - getHistoryTotalMoney('매입')) } 원</p>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <button type="button" onClick={handleSalesRestart}>
              영업 재시작
            </button>
            <button type="button" onClick={excelDownloader}>
              엑셀 파일 내보내기
            </button>
          </div>
        </div>
      </>
    )
};

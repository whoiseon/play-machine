import styles from "./UsageHistory.module.scss";
import moment from "moment";

import CategoryImage from "../CategoryImage";

export default function UsageHistory({ data }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.category}>
        <CategoryImage category={data.category} />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{ data.productName }</p>
        <p>{ moment(data.dateTime.timestamp).format('MM-DD h:mm') }</p>
      </div>
      <div className={styles.price}>
        <p>-{ data.productPrice } 원</p>
      </div>
    </div>
  )
}
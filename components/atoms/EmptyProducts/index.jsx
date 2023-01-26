import styles from "./EmptyProducts.module.scss";

export default function EmptyProducts() {
  return (
    <div className={styles.wrapper}>
      <h2>현재 등록된 상품이 없습니다!</h2>
    </div>
  )
}
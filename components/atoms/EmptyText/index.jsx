import styles from "./EmptyProducts.module.scss";

export default function EmptyText({ type }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={type === '상품' ? styles.product : styles.history}>
        {
          type === '상품'
            ? '현재 등록된 상품이 없습니다!'
            : type === '정산'
              ? '정산할 상품이 없습니다!'
              : '아직 이용내역이 없으시군요!'
        }
      </h2>
    </div>
  )
}
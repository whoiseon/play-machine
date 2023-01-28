import Image from "next/image";
import styles from "./Modal.module.scss";

export default function Modal({ children, title, closeModal }) {
  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>{ title }</h1>
          <button
            type="button"
            onClick={closeModal}
          >
            <Image
              src="/image/icon/close-icon.svg"
              alt="close icon"
              width={20}
              height={20}
            />
          </button>
        </div>
        { children }
      </div>
    </div>
  );
};

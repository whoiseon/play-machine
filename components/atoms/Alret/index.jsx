import {useEffect} from "react";

import styles from "./Alret.module.scss";

export default function Alert({ children, closeAlert }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeAlert();
    }, 1800);

    return () => clearTimeout(timer);
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        {children}
      </div>
    </div>
  );
};

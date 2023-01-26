import styles from "./Auth.module.scss";

import AuthBox from "../../blocks/AuthBox";

export default function Auth() {
  return (
    <div className={styles.wrapper}>
      <div>
        <AuthBox />
        <div className={styles.warning}>
          플레이게임즈 직원분들을 위한 자판기 서비스입니다. <br />
          타 직원분은 사용하실 수 없습니다.
        </div>
      </div>
    </div>
  );
};

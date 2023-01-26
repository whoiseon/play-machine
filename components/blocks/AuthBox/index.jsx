import styles from "./AuthBox.module.scss";
import Logo from "../../atoms/Logo";
import {useCallback} from "react";
import useInput from "../../../hooks/useInput";

export default function AuthBox() {
  const [name, onChangeName, setName] = useInput('');

  const onSubmitAuth = useCallback((event) => {
    event.preventDefault();
    console.log(name);
  }, [name]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <p className={styles.intro}>플레이게임즈 사원증 검사 후 이용 가능합니다.</p>
      <form onSubmit={onSubmitAuth}>
        <h2>사원증</h2>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="성함을 입력해주세요"
            value={name}
            onChange={onChangeName}
          />
          <button type="submit">검사</button>
        </div>
      </form>
    </div>
  );
};

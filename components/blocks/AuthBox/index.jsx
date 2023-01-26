import {useCallback, useEffect, useRef, useState} from "react";

import styles from "./AuthBox.module.scss";

import Logo from "../../atoms/Logo";
import useInput from "../../../hooks/common/useInput";
import {useDispatch} from "react-redux";
import {fetchUserInfo} from "../../../features/user/userSlice";
import useLocalStorage from "../../../hooks/common/useLocalStorage";

export default function AuthBox() {
  const dispatch = useDispatch();

  const NameInputRef = useRef(null);

  const [name, onChangeName, setName] = useInput('');

  const [userData] = useLocalStorage("userData", null);
  const [loggingUser, setLoggingUser] = useLocalStorage("loggingUser", null);

  const [error, setError] = useState("");

  const onSubmitAuth = useCallback((event) => {
    event.preventDefault();

    const userInfo = userData.find((user) => user.name === name);

    if (userInfo) {
      dispatch(fetchUserInfo(userInfo));
      setLoggingUser(userInfo);
    } else {
      setError('플레이 게임즈 직원이 아니시군요!');
    }

    setName("");
  }, [name, userData, setName, setError, fetchUserInfo]);

  useEffect(() => {
    NameInputRef.current.focus();
  }, [NameInputRef]);

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
            ref={NameInputRef}
            type="text"
            placeholder="성함을 입력해주세요"
            value={name}
            onChange={onChangeName}
          />
          <button type="submit">검사</button>
        </div>
      </form>
      { error && <p className={styles.errorMessage}>{error}</p> }
    </div>
  );
};

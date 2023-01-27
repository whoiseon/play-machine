import {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from "./AuthBox.module.scss";

import Logo from "components/atoms/Logo";
import useInput from "hooks/common/useInput";
import {requestLoginUser} from "features/user/userSlice";

export default function AuthBox() {
  const dispatch = useDispatch();

  const NameInputRef = useRef(null);
  const { userData } = useSelector((state) => state.user);

  const [name, onChangeName, setName] = useInput('');
  const [error, setError] = useState("");

  const onSubmitAuth = useCallback((event) => {
    event.preventDefault();

    const userInfo = userData.find((user) => user.name === name);

    if (userInfo) {
      dispatch(requestLoginUser(userInfo));
    } else {
      setError('플레이 게임즈 직원이 아니시군요!');
    }

    setName("");
  }, [name, userData, setName, setError, requestLoginUser]);

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

import {useCallback, useState} from "react";

export default (initialValue, callback) => {
  const [value, setValue] = useState(initialValue);

  const openModal = useCallback(() => {
    setValue(true);
  }, []);

  const closeModal = useCallback(() => {
    setValue(false);

    if (callback) {
      callback();
    }
  }, [callback]);

  return [value, setValue, openModal, closeModal];
}
import {useCallback, useState} from "react";

export default (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const openModal = useCallback(() => {
    setValue(true);
  }, []);

  const closeModal = useCallback(() => {
    setValue(false);
  }, []);

  return [value, setValue, openModal, closeModal];
}
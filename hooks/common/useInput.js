import React from 'react';
import {useCallback, useState} from "react";

export default (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return [value, onChange, setValue];
};

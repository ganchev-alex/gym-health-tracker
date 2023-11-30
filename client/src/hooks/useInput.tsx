import { useState } from "react";

const useInput = (
  validateFunction: (enteredValue: string) => boolean,
  defaultValue = ""
) => {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  const validationStatus = validateFunction(enteredValue);
  const errorState = !validationStatus && isTouched;

  const valueChangeHandler = function (
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = function () {
    setIsTouched(true);
  };

  const setValue = function (resetValue: string) {
    setEnteredValue(resetValue);
  };

  const reset = function () {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    validationStatus,
    errorState,
    valueChangeHandler,
    inputBlurHandler,
    setValue,
    reset,
  };
};

export default useInput;

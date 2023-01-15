import React, { useState } from "react";

const NewFormInput = ({ data }) => {
  const {
    type,
    placeholder,
    label,
    name,
    validationFunc,
    invalidMessage,
    isInputDisabledAttribute,
    dispatchForm,
    min,
    max,
  } = data;

  const [isInputValid, setIsInputValid] = useState(true);
  const [isNoValue, setIsNoValue] = useState(false);
  const onChangeSetInput = (e) => {
    const inputValue = e.target.value;
      if (!validationFunc(inputValue.trim())) {
      inputValue.trim().length == 0 ? setIsNoValue(true) : setIsNoValue(false);  
      setIsInputValid(false);
      dispatchForm({
        type: name,
        payload: { value: "", isValidInput: false },
      });
    } else {
      setIsInputValid(true);
      dispatchForm({
        type: name,
        payload: { value: inputValue.trim(), isValidInput: true },
      });
    }
  };

  return (
    <>
      <label>
        {label}:
        <input
          className={isInputValid ? "input-valid" : "input-invalid"}
          onChange={onChangeSetInput}
          type={type}
          placeholder={placeholder}
          disabled={isInputDisabledAttribute}
          name={name}
          min={min}
          max={max}
        />
        {!isInputValid && (
          <div className="invalid-message">
            {!isNoValue ? invalidMessage : "A value must be entered"}
          </div>
        )}
      </label>
    </>
  );
};

export default NewFormInput;

import React, { useState } from "react";

const FormInput = ({data}) => {
  const {
    type,
    placeholder,
    label,
    name,
    validationFunc,
    invalidMessage,
    isInputDisabledAttribute,
    dispatchForm,
  } = data;
  
  const [isInputValid, setIsInputValid] = useState(true);
  
  const onChangeSetInput = (e) => {
    const inputValue = e.target.value;
    if (!validationFunc(inputValue.trim())) {
      if (inputValue.length == 0) {
        setIsInputValid(true);
        dispatchForm({
          type: name,
          payload: { value: "", isValidInput: true },
        });
      } else {
        setIsInputValid(false);
        dispatchForm({
          type: name,
          payload: { value: "", isValidInput: false },
        });
      }
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
      <label className={isInputDisabledAttribute ? "disabled" : "undisabled"}>
        {label}:
        <input
          className={isInputValid ? "input-valid" : "input-invalid"}
          onChange={onChangeSetInput}
          type={type}
          placeholder={placeholder}
          disabled={isInputDisabledAttribute}
          name={name}
        />
        {!isInputValid && (
          <div className="invalid-message">{invalidMessage}</div>
        )}
      </label>
    </>
  );
};

export default FormInput;

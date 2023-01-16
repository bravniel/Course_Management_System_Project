import React, { useState } from "react";

const FormInput = ({ data }) => {
  const {
    type,
    placeholder,
    label,
    name,
    validationFunc,
    invalidMessage,
    isInputDisabledAttribute,
    dispatchForm,
    formState,
    min,
    max,
    formType
  } = data;
  console.log("formType",formType);
  const [isNoValue, setIsNoValue] = useState(false);
  const onChangeSetInput = (e) => {
    const inputValue = e.target.value;
    if (!validationFunc(inputValue.trim())) {
      switch (formType) {
        case "new": {
          inputValue.trim().length == 0
            ? setIsNoValue(true)
            : setIsNoValue(false);
          dispatchForm({
            type: "SET",
            payload: { type: name, value: "", isValidInput: false },
          });
          break;
        }
        case "edit": {
          setIsNoValue(false);
          if (inputValue.length == 0) {
            dispatchForm({
              type: "SET",
              payload: { type: name, value: "", isValidInput: true },
            });
          } else {
            dispatchForm({
              type: "SET",
              payload: { type: name, value: "", isValidInput: false },
            });
          }
          break;
        }
      }
    } else {
      dispatchForm({
        type: "SET",
        payload: { type: name, value: inputValue.trim(), isValidInput: true },
      });
    }
  };

  return !isInputDisabledAttribute ? (
    <>
      <label className={isInputDisabledAttribute ? "disabled" : "undisabled"}>
        {label}:
        <input
          className={formState.isValid[name] ? "input-valid" : "input-invalid"}
          onChange={onChangeSetInput}
          type={type}
          placeholder={placeholder}
          disabled={isInputDisabledAttribute}
          name={name}
          min={min}
          max={max}
        />
        {!formState.isValid[name] && (
          <div className="invalid-message">
            {!isNoValue ? invalidMessage : "A value must be entered"}
          </div>
        )}
      </label>
    </>
  ) : (
    <>
      <label className={isInputDisabledAttribute ? "disabled" : "undisabled"}>
        {label}:
        <input
          className="input-disabled"
          type={type}
          value={placeholder}
          placeholder={placeholder}
          disabled={isInputDisabledAttribute}
          name={name}
        />
      </label>
    </>
  );
};

export default FormInput;

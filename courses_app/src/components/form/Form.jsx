import React from "react";
import { inputProperties } from "../../utils/utils";
import FormInput from "./FormInput";

const Form = ({
  inputsValues,
  inputDisabledAttributes,
  formState,
  dispatchForm,
  isEmailExists,
    onSubmitFunc,
  formType
}) => {
  const isPasswordRepeatValid = (value) => {
    return value.toString() === formState.values.password.toString();
  };

  const onSubmitform = (event) => {
    event.preventDefault();
    onSubmitFunc(event);
  };

  const onClickClear = () => {
    document.getElementById("form").reset();
  };

  return (
    <form onSubmit={onSubmitform} id="form">
      {Object.entries(inputsValues).map(([key, value], index) => (
        <FormInput
          key={index}
          data={{
            type: inputProperties[key].type,
            placeholder: value,
            label: inputProperties[key].label,
            name: key,
            validationFunc:
              key != "repeatPassword"
                ? inputProperties[key].validationFunc
                : isPasswordRepeatValid,
            invalidMessage: inputProperties[key].invalidMessage,
            isInputDisabledAttribute: inputDisabledAttributes[key],
            dispatchForm: dispatchForm,
            formState: formState,
            min: inputProperties[key].minValue,
              max: inputProperties[key].maxValue,
            formType: formType
          }}
        />
      ))}
      {isEmailExists && <div className="invalid-message">Mail exist.</div>}
      <div className="edit-form__nav">
        <button type="submit" disabled={!formState.isFormValid}>
          Update
        </button>
        <div onClick={onClickClear}>Clear</div>
      </div>
    </form>
  );
};

export default Form;

export const editFormInitialState = {
  values: {
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
  },
  isValid: {
    firstName: true,
    lastName: true,
    address: true,
    phoneNumber: true,
    email: true,
    password: true,
    repeatPassword: true,
  },
  isFormValid: false,
};

export function FormReducer(state, action) {
  console.log(state);
  console.log(action);
  switch (action.type) {
    case "FIRST_NAME": {
      const newValues = { ...state.values, firstName: action.payload.value };
      console.log(newValues);
      const newIsValid = {
        ...state.isValid,
        firstName: action.payload.isValidInput,
      };
      console.log(newIsValid);
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      console.log(newIsFormValid);
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
    case "LAST_NAME": {
      const newValues = { ...state.values, lastName: action.payload.value };
      console.log(newValues);
      const newIsValid = {
        ...state.isValid,
        lastName: action.payload.isValidInput,
      };
      console.log(newIsValid);
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      console.log(newIsFormValid);
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
    case "ADDRESS": {
      const newValues = { ...state.values, address: action.payload.value };
      console.log(newValues);
      const newIsValid = {
        ...state.isValid,
        address: action.payload.isValidInput,
      };
      console.log(newIsValid);
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      console.log(newIsFormValid);
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
    case "PHONE_NUMBER": {
      const newValues = { ...state.values, phoneNumber: action.payload.value };
      console.log(newValues);
      const newIsValid = {
        ...state.isValid,
        phoneNumber: action.payload.isValidInput,
      };
      console.log(newIsValid);
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      console.log(newIsFormValid);
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
    case "EMAIL": {
      const newValues = { ...state.values, email: action.payload.value };
      console.log(newValues);
      const newIsValid = {
        ...state.isValid,
        email: action.payload.isValidInput,
      };
      console.log(newIsValid);
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      console.log(newIsFormValid);
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
    case "PASSWORD": {
      const newValues = { ...state.values, password: action.payload.value };
      console.log(newValues);
      const newIsValid = {
        ...state.isValid,
        password: action.payload.isValidInput,
      };
      console.log(newIsValid);
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      console.log(newIsFormValid);
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
    case "REPEAT_PASSWORD": {
      const newValues = {
        ...state.values,
        repeatPassword: action.payload.value,
      };
      console.log(newValues);
      const newIsValid = {
        ...state.isValid,
        repeatPassword: action.payload.isValidInput,
      };
      console.log(newIsValid);
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      console.log(newIsFormValid);
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
  }
}

function IsFormValid(state) {
  return (
    // state.values.firstName.length > 0 &&
    // state.values.lastName.length > 0 &&
    // state.values.email.length > 0 &&
    // state.values.password.length > 0 &&
    // state.values.repeatedPassword.length > 0 &&
    // state.values.address.length > 0 &&
    // state.values.phoneNumber.length > 0 &&
    state.isValid.firstName &&
    state.isValid.lastName &&
    state.isValid.email &&
    state.isValid.password &&
    state.isValid.repeatPassword &&
    state.isValid.address &&
    state.isValid.phoneNumber
  );
}

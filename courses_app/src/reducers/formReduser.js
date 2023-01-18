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
  switch (action.type) {
    case "SET": {
      const newValues = { ...state.values };
      newValues[action.payload.type] = action.payload.value;
      const newIsValid = { ...state.isValid };
      newIsValid[action.payload.type] = action.payload.isValidInput;
      const newIsFormValid = IsFormValid({
        isValid: { ...newIsValid },
        values: { ...newValues },
      });
      return {
        isValid: { ...newIsValid },
        values: { ...newValues },
        isFormValid: newIsFormValid,
      };
    }
    case "INIT": {
      return { ...editFormInitialState };
    }
    default:
      return state;
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

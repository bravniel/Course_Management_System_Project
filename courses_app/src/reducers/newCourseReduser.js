export const newCourseFormInitialState = {
  values: {
    name: "",
    startDate: "",
    endDate: "",
    scheduleDays: {},
  },
  isValid: {
    name: true,
    startDate: true,
    endDate: true,
    scheduleDays: true,
  },
  isFormValid: false,
};

export function NewCourseFormReducer(state, action) {
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
    case "ADD": {
      const newDay = {
        day: action.payload.day,
        hours: {
          startHour: action.payload.startHour,
          endHour: action.payload.endHour,
        },
      };
      const newValues = { ...state.values };
      const newScheduleDays = { ...newValues.scheduleDays };
      newScheduleDays[action.payload.day] = newDay;
      newValues.scheduleDays = newScheduleDays;
      const newIsValid = { ...state.isValid };
      newIsValid.scheduleDays =
        Object.keys(newValues.scheduleDays).length !== 0;
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
    case "REMOVE": {
      const newValues = { ...state.values };
      const newScheduleDays = { ...newValues.scheduleDays };
      delete newScheduleDays[action.payload.day];
      newValues.scheduleDays = newScheduleDays;
      const newIsValid = { ...state.isValid };
      newIsValid.scheduleDays =
        Object.keys(newValues.scheduleDays).length !== 0;
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
      return { ...newCourseFormInitialState };
    }
    default:
      return state;
  }
}

function IsFormValid(state) {
  return (
    state.values.name.length > 0 &&
    state.values.startDate.length > 0 &&
    state.values.endDate.length > 0 &&
    Object.keys(state.values.scheduleDays).length !== 0 &&
    state.isValid.name &&
    state.isValid.startDate &&
    state.isValid.endDate &&
    state.isValid.scheduleDays
  );
}

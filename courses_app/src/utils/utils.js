import validator from "validator";

const phoneRegex = /^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

export const isTextValid = (value) => {
  return value.length >= 3;
};
export const isPhoneNumberValid = (value) => {
  return phoneRegex.test(value);
};
export const isEmailValid = (value) => {
  return !!validator.isEmail(value);
};
export const isPasswordValid = (value) => {
  return passwordRegex.test(value);
};

const currentDate = new Date();
const minDate = new Date(
  currentDate.getFullYear() - 120,
  currentDate.getMonth(),
  currentDate.getDate()
);
const minNewDate = new Date(
  currentDate.getFullYear() - 100,
  currentDate.getMonth(),
  currentDate.getDate()
);
const maxDate = new Date(
  currentDate.getFullYear() - 18,
  currentDate.getMonth(),
  currentDate.getDate()
);
export const isBirthDateValid = (value) => {
  const newValue = new Date(value);
  return (
    newValue.getTime() <= maxDate.getTime() &&
    newValue.getTime() >= minNewDate.getTime()
  );
};

export const inputProperties = {
  firstName: {
    type: "text",
    label: "First Name",
    validationFunc: isTextValid,
    invalidMessage: "First name could not be shorter than 2 letters",
  },
  lastName: {
    type: "text",
    label: "Last Name",
    validationFunc: isTextValid,
    invalidMessage: "Last name could not be shorter than 2 letters",
  },
  birthDate: {
    type: "date",
    label: "Birth Date",
    validationFunc: isBirthDateValid,
    invalidMessage: "Incorrect age, too young/old!",
    minValue: minDate.toISOString().substring(0, 10),
    maxValue: currentDate.toISOString().substring(0, 10),
  },
  address: {
    type: "text",
    label: "Address",
    validationFunc: isTextValid,
    invalidMessage: "Address could not be shorter than 2 letters",
  },
  phoneNumber: {
    type: "text",
    label: "Phone Number",
    validationFunc: isPhoneNumberValid,
    invalidMessage: "Invalid phone number",
  },
  email: {
    type: "text",
    label: "Email",
    validationFunc: isEmailValid,
    invalidMessage: "Invalid email",
  },
  password: {
    type: "password",
    label: "Password",
    validationFunc: isPasswordValid,
    invalidMessage:
      "Password must contain capital and regular characters, numbers and must have at least 6 characters",
  },
  repeatPassword: {
    type: "password",
    label: "Repeat Password",
    // validationFunc: "isPasswordRepeatValid",
    invalidMessage: "The two passwords not identical",
  },
  role: {
    type: "text",
    label: "Role",
    // validationFunc: null,
    // invalidMessage: "",
  },
};

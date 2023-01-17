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

const maxStartDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() + 7
);
const maxEndDate = new Date(
  maxStartDate.getFullYear(),
  maxStartDate.getMonth() + 4,
  maxStartDate.getDate()
);
export const isCourseStartDateValid = (value) => {
  const newValue = new Date(value);
  return (
    newValue.getTime() <= maxStartDate.getTime() &&
    newValue.getTime() >= currentDate.getTime()
  );
};
export const isCourseEndDateValid = (value) => {
  const newValue = new Date(value);
  return (
    newValue.getTime() <= maxEndDate.getTime() &&
    newValue.getTime() >= maxStartDate.getTime()
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
  name: {
    type: "text",
    label: "Course Name",
    validationFunc: isTextValid,
    invalidMessage: "Course name must be at least 2 letters long",
  },
  startDate: {
    type: "date",
    label: "Start date",
    validationFunc: isCourseStartDateValid,
    invalidMessage: "Incorrect start course date, too early/late!",
    minValue: currentDate.toISOString().substring(0, 10),
    maxValue: maxStartDate.toISOString().substring(0, 10),
  },
  endDate: {
    type: "date",
    label: "End date",
    validationFunc: isCourseEndDateValid,
    invalidMessage: "Incorrect end course date, too early/late!",
    minValue: maxStartDate.toISOString().substring(0, 10),
    maxValue: maxEndDate.toISOString().substring(0, 10),
  },
};

export const initialCourseStartHours = {
  Sunday: "07:00",
  Monday: "07:30",
  Tuesday: "08:00",
  Wednesday: "08:30",
  Thursday: "09:00",
};

export const initialCourseEndHours = {
  Sunday: "12:00",
  Monday: "12:30",
  Tuesday: "13:00",
  Wednesday: "13:30",
  Thursday: "14:00",
};

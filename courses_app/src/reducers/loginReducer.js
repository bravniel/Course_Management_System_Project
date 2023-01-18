export const userDataInitialState = {
  user: null,
  isProfessor: null,
  token: "",
};

const loginReducer = (userData, action) => {
  switch (action.type) {
    case "LOGIN": {
      return { ...action.payload };
    }
    case "LOGOUT": {
      const newLoginState = { ...userData };
      newLoginState.user = null;
      newLoginState.isProfessor = null;
      newLoginState.token = null;
      return newLoginState;
    }
    default:
      return userData;
  }
};

export default loginReducer;

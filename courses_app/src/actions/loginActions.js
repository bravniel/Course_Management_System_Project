export const loginAction = ({ user, isProfessor, token }) => ({
  type: "LOGIN",
  payload:{user,
  isProfessor,
  token}
});

export const logoutAction = () => ({
  type: "LOGOUT",
});

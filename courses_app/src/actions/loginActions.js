// export const loginAction = () => ({
//     type: "LOGIN",
//     user: {
//         username: "ReactIsTheBest",
//         id: "11"
//     }
// });

export const loginAction = ({ user, isProfessor, token }) => ({
  type: "LOGIN",
  payload:{user,
  isProfessor,
  token}
});

export const logoutAction = () => ({
  type: "LOGOUT",
});

import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export const loginToSite = async (email, password, role) => {
  const body = {
    email,
    password,
  };
  switch (role) {
    case "student": {
      const student = await axios.post(url + "students/login", body);
      console.log(student);
      return student.data;
    }
    case "professor": {
      const professor = await axios.post(url + "professors/login", body);
      return professor.data;
    }
  }
};

export const getUserInfo = async (token) => {
  console.log(token);
  const routeUrl = url + "connected-user-info";
  const headers = { Authorization: "Bearer " + token };
  const user = await axios.get(routeUrl, {headers});

  return user.data;
};

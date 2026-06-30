import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const login = async (username, password) => {
  const response = await axios.post(API_URL + 'token/', {
    username,
    password
  });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout
};

export default authService;
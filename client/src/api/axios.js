import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://skillswap-w89k.onrender.com",
});

export default instance;

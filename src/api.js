import axios from "axios";

const API = axios.create({
  baseURL: "https://todobev2.onrender.com"  // ใช้ URL ของ backend
});

export default API;

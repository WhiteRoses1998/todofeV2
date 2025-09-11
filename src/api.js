import axios from "axios";

const API = axios.create({
  baseURL: "https://be-todo-private.onrender.com"  // ใช้ URL ของ backend
});

export default API;

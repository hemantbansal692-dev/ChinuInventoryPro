import axios from "axios";

const API = axios.create({
  baseURL: "https://chinuinventoryserver-production.up.railway.app/api",
});

export default API;
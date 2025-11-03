import axios from "axios";

const makeQueryRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
})

export default makeQueryRequest;
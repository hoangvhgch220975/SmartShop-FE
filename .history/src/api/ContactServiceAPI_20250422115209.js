import axios from "axios";

const API_URL = "http://localhost:3333/api"; // hoặc domain backend thật nếu deploy

export const sendContactMessage = (data) => {
  return axios.post(`${API_URL}/contact`, data);
};
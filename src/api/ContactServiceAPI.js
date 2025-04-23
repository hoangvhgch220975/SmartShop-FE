import axios from "axios";

const API_URL = "https://smartshop-be.onrender.com/api"; // hoặc domain backend thật nếu deploy

export const sendContactMessage = (data) => {
  return axios.post(`${API_URL}/contact`, data);
};
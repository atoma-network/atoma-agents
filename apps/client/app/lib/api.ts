import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2512/';
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
  //timeout: 50000,
});
export default api;

import axios from 'axios';

const sentioApi = axios.create({
  baseURL: 'https://app.sentio.xyz/api/v1/analytics/navi/navi-production-new',
  headers: {
    'Content-Type': 'application/json',
    'api-key': process.env.SENTIO_API_KEY,
  },
});

sentioApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  },
);

export default sentioApi;

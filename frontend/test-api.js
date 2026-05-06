import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

(async () => {
  try {
    const res = await axios.get(`${API_URL}/health`);
    console.log('TEST_FROM_FRONTEND_SUCCESS', res.status, res.data);
    process.exit(0);
  } catch (err) {
    console.error('TEST_FROM_FRONTEND_ERROR', err.response?.status, err.response?.data || err.message);
    process.exit(1);
  }
})();

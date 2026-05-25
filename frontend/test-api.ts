import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

(async () => {
  try {
    const res = await axios.get(`${API_URL}/health`);
    console.log('TEST_FROM_FRONTEND_SUCCESS', res.status, res.data);
    process.exit(0);
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: unknown }; message?: string };
    console.error('TEST_FROM_FRONTEND_ERROR', error.response?.status, error.response?.data || error.message);
    process.exit(1);
  }
})();

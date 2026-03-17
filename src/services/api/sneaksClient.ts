import axios from 'axios';

const sneaksClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    timeout: 15000,  // Sneaks scrapes live — allow extra time
    headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — unwrap data, handle errors globally
sneaksClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.error || 'Something went wrong';
        console.error(`[SneaksAPI Error]: ${message}`);
        return Promise.reject(error);
    }
);

export default sneaksClient;

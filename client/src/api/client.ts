import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

export const api = axios.create({ baseURL });

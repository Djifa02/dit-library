import { recoAPI } from './api';

export const getRecommendations = (user_id, n = 5) => recoAPI.get(`/recommendations/${user_id}?n=${n}`);
export const trainModel = () => recoAPI.post('/train');
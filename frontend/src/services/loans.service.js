import { loansAPI } from './api';

export const getAllLoans = () => loansAPI.get('/');
export const getLoansByUser = (user_id) => loansAPI.get(`/user/${user_id}`);
export const getOverdueLoans = () => loansAPI.get('/overdue');
export const createLoan = (data) => loansAPI.post('/', data);
export const returnLoan = (id, rating) => loansAPI.patch(`/${id}/return`, { rating });

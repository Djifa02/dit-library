import axios from 'axios';

const BOOKS_API = process.env.REACT_APP_BOOKS_API || 'http://localhost:3001';
const USERS_API = process.env.REACT_APP_USERS_API || 'http://localhost:3002';
const LOANS_API = process.env.REACT_APP_LOANS_API || 'http://localhost:3003';
const RECO_API = process.env.REACT_APP_RECO_API || 'http://localhost:8000';

export const booksAPI = axios.create({ baseURL: `${BOOKS_API}/api/books` });
export const usersAPI = axios.create({ baseURL: `${USERS_API}/api/users` });
export const loansAPI = axios.create({ baseURL: `${LOANS_API}/api/loans` });
export const recoAPI = axios.create({ baseURL: RECO_API });
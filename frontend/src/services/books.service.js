import { booksAPI } from './api';

export const getAllBooks = () => booksAPI.get('/');
export const getBookById = (id) => booksAPI.get(`/${id}`);
export const searchBooks = (query) => booksAPI.get(`/search?q=${query}`);
export const createBook = (data) => booksAPI.post('/', data);
export const updateBook = (id, data) => booksAPI.put(`/${id}`, data);
export const deleteBook = (id) => booksAPI.delete(`/${id}`);

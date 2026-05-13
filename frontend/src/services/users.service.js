import { usersAPI } from './api';

export const getAllUsers = () => usersAPI.get('/');
export const getUserById = (id) => usersAPI.get(`/${id}`);
export const getUsersByType = (type) => usersAPI.get(`/type/${type}`);
export const createUser = (data) => usersAPI.post('/', data);
export const updateUser = (id, data) => usersAPI.put(`/${id}`, data);
export const deleteUser = (id) => usersAPI.delete(`/${id}`);

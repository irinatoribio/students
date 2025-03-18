import api from "./axios";

export const getAllUsers = () => api.get("/user");
export const getUserById = (id) => api.get(`/user/${id}`);
export const create = (data) => api.post("/register", data);
export const updateUser = (id, data) => api.put(`/user/update/${id}`, data);
export const deleteUser = (id) => api.delete(`/user/delete/${id}`);

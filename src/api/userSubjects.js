import api from "./axios";

export const getUsersSubjects = () => api.get(`/users/subjects`);
export const userSubjects = (id) => api.get(`/user/${id}/subjects`);
export const assignSubjects = (id, payload) =>
  api.post(`/user/${id}/subjects`, payload);
export const removeSubjects = (id) => api.delete(`/user/${id}/subjects`);

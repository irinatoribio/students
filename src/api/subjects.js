import api from "./axios";

export const getAllSubjects = () => api.get("/subjects");
export const getSubjectsById = (id) => api.get(`/fetch/${id}`);
export const updateSubjects = (id, data) =>
  api.put(`/subjects/update/${id}`, data);
export const deleteSubjects = (id) => api.delete(`/subjects/delete/${id}`);
export const createSubjects = (data) => api.post("/subject", data);

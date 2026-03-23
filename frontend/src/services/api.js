import axios from "axios";

const BASE_URL = "http://localhost:5000/api/tasks";
export const fetchAllTasks = () => axios.get(BASE_URL);
export const createNewTask = (data) => axios.post(BASE_URL, data);
export const updateTaskById = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);
export const deleteTaskById = (id) =>
  axios.delete(`${BASE_URL}/${id}`);
import api from "./api";

export const getSessions = async () => {
  return api.get("/sessions");
};

export const getActiveSession = async () => {
  return api.get("/sessions/active");
};

export const setActiveSession = async (id) => {
  return api.put(`/sessions/active/${id}`);
};

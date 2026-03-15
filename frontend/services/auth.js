import api from "./api";

export async function registerUser({ username, email, password }) {
  const res = await api.post("/api/auth/register", { username, email, password });
  const { token, user_id, username: name } = res.data;
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", String(user_id));
    localStorage.setItem("username", name);
  }
  return res.data;
}

export async function loginUser({ username, password }) {
  const res = await api.post("/api/auth/login", { username, password });
  const { token, user_id, username: name } = res.data;
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", String(user_id));
    localStorage.setItem("username", name);
  }
  return res.data;
}


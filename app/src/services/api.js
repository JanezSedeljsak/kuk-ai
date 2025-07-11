import axios from "axios";
import useAuthStore from "../store/auth";

const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export async function login({ email, password }) {
  const response = await api.post("api/v1/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function register({ name, email, password }) {
  const response = await api.post("api/v1/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
}

export async function saveRecipe({
  title,
  ingredients,
  instructions,
  totalTime,
}) {
  const response = await api.post("api/v1/recipes", {
    title,
    ingredients,
    instructions,
    totalTime,
  });
  return response.data;
}

export async function getRecipes() {
  const response = await api.get("api/v1/recipes");
  return response.data;
}

export async function aiGenerateRecipe({ prompt }) {
  const response = await api.post("api/v1/ai/generate-recipe", {
    prompt,
  });
  return response.data;
}
const mode = import.meta.env.MODE;
const envApiUrl = import.meta.env.VITE_API_URL;

if (!envApiUrl) {
  throw new Error(`Missing VITE_API_URL for ${mode} mode`);
}

const API_BASE_URL = envApiUrl.replace(/\/+$/, "");

export default API_BASE_URL;

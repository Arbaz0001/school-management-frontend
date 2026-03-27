const mode = import.meta.env.MODE;
const envApiUrl = import.meta.env.VITE_API_URL;

const API_BASE_URL = envApiUrl;

if (!API_BASE_URL) {
  throw new Error(`Missing VITE_API_URL for ${mode} mode`);
}

const normalizedApiBaseUrl = API_BASE_URL.replace(/\/+$/, "");

export default normalizedApiBaseUrl;

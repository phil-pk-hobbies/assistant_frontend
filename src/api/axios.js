import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

let accessToken = null;
let refreshToken = null;
let updateAccess = null;
let logoutFn = null;

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
}

export function registerAuthHooks(opts) {
  updateAccess = opts.updateAccess;
  logoutFn = opts.logout;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
}

function refreshExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      refreshToken &&
      !refreshExpired(refreshToken) &&
      !original._retry
    ) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          '/api/token/refresh/',
          { refresh: refreshToken },
          { baseURL: api.defaults.baseURL },
        );
        accessToken = data.access;
        updateAccess && updateAccess(data.access);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch (err) {
        clearTokens();
        logoutFn && logoutFn();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

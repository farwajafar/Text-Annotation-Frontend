import axios from "axios";
import urljoin from "url-join";
import jwtDecode from "jwt-decode";

import jwtService from "app/services/jwtService";

const tokenHeaderKey = "x-auth-token";
const localTokenKey = "jwt_access_token";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const setInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return new Promise((resolve, reject) => {
        // console.log(error, error.response);
        if (error.response) {
          if (
            error.response.status === 401 &&
            error.config &&
            !error.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            if (error.response.data)
              jwtService.emit("onAutoLogout", error.response.data.message);
            setSession(null);
          } else if (
            error.response.status !== 401 &&
            error.response.status >= 400 &&
            error.response.status < 500
          ) {
        
              console.log(error.response);
            jwtService.emit("onLoginError", error.response.statusText);
          }
        } else if (error.message === "Network Error") {
          jwtService.emit(
            "onNetworkError",
            "Network Error!, Please try again later."
          );
        }
        return reject(error);
      });
    }
  );
};

const setSession = (access_token) => {
  if (access_token) {
    localStorage.setItem(localTokenKey, access_token);
    axios.defaults.headers.common[tokenHeaderKey] = access_token;
  } else {
    localStorage.removeItem(localTokenKey);
    delete axios.defaults.headers.common[tokenHeaderKey];
  }
};

const getAccessToken = () => {
  return localStorage.getItem(localTokenKey);
};

const getAccessTokenDecoded = () => {
  try {
    return jwtDecode(localStorage.getItem(localTokenKey));
  } catch (error) {
    return null;
  }
};

const getServerUrl = (name) => {
  return urljoin(process.env.REACT_APP_API_URL, name);
};

setInterceptors();

export default {
  delete: axios.delete,
  post: axios.post,
  get: axios.get,
  put: axios.put,
  getAccessToken,
  setSession,
  getServerUrl,
  getAccessTokenDecoded,
};

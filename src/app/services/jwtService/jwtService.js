import jwtDecode from "jwt-decode";
import FuseUtils from "@fuse/FuseUtils";
import http from "../httpService";

class jwtService extends FuseUtils.EventEmitter {
  init() {
    // this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    http.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response &&
            err.response.status === 401 &&
            err.config &&
            !err.conaccess_tokenfig.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            // Invalide access_token
            this.emit(
              "onAutoLogout",
              "We detected an authorized request, please login again."
            );
            http.setSession(null);
          } else if (err.message === "Network Error") {
            this.emit(
              "onNetworkError",
              "Network Error!, Please try again later."
            );
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    let access_token = http.getAccessToken();
    if (!access_token) {
      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      http.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      http.setSession(null);
      this.emit(
        "onAutoLogout",
        "Unfortunately, your login session have expired!"
      );
    }
  };

  /* To-Do Create user api response to follow message,status structure */
  createUser = (data) => {
    return new Promise((resolve, reject) => {
      http.post(`admin/add-annotator`, data).then((response) => {
        if (response.data) {
          resolve("Account created succefully.");
        } else {
          reject(response.data.message);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    // console.log();
    return new Promise((resolve, reject) => {
      http
        .post(`/auth/login`, {
          username: email,
          password,
        })
        .then((response) => {
          // console.log(response.data.token);
          if (response.data.token) {
            http.setSession(response.data.token);
            resolve(response.data.token);
            // console.log(response.data.token);
          } else {
            reject(response.data.message);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      http
        .get(`/loginwithjwt`, {
          jwt: http.getAccessToken(),
        })
        .then((response) => {
          if (response.data.token) {
            http.setSession(response.data.token);
            resolve(response.data.token);
          } else {
            reject(response.data.message);
          }
        });
    });
  };

  updateUserData = (user) => {
    return http.post(`user/update`, {
      user: user,
    });
  };

  logout = () => {
    http.setSession(null);
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("Unfortunately, your login session have expired!");
      return false;
    } else {
      return true;
    }
  };

  getMappedUser = (token) => {
    // console.log("before", user);

    const user = jwtDecode(token);
    // console.log("after", user);

    return {
      uuid: user.id,
      // from: "custom-db",
      // password: "admin",
      role: user.role.toLowerCase(),
      data: {
        displayName: user.name,
        photoURL: "assets/images/avatars/profile.jpg",
        email: user.name,
        settings: {
          layout: {
            style: "layout1",
            config: {
              mode: "fullwidth",
              scroll: "content",
              navbar: {
                display: true,
                folded: true,
                position: "left",
              },
              toolbar: {
                display: true,
                position: "below",
              },
              footer: {
                display: true,
                style: "static",
              },
            },
          },
          customScrollbars: true,
          theme: {
            main: "tech",
            navbar: "tech",
            toolbar: "tech",
            footer: "tech",
          },
        },
        shortcuts: [],
      },
    };
  };
}

const instance = new jwtService();

export default instance;

import * as Actions from "../actions";

const initialState = {
  role: [], //guest
  data: {
    displayName: "",
    photoURL: "assets/images/logos/ncai.png",

    shortcuts: [],
  },
};

const user = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_USER_DATA: {
      // console.log("action", action);
      return {
        ...initialState,
        ...action.payload,
      };
    }
    case Actions.REMOVE_USER_DATA: {
      return {
        ...initialState,
      };
    }
    case Actions.USER_LOGGED_OUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default user;

import {
  LOGIN,
  LOGOUT,
  REGISTER,
  REQ_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "./ActionType";

const initialValue = {
  signup: null,
  signin: null,
  reqUser: null,
  searchUser: [],
  updateUser: null,
};

export const authReducer = (
  store = initialValue,
  { type, payload }
) => {
  switch (type) {
    case REGISTER:
      return {
        ...store,
        signup: payload,
      };

    case LOGIN:
      return {
        ...store,
        signin: payload,
      };

    case REQ_USER:
      return {
        ...store,
        reqUser: payload,
      };

    case SEARCH_USER:
      return {
        ...store,
        searchUser: Array.isArray(payload) ? payload : [],
      };

    case UPDATE_USER:
      return {
        ...store,
        updateUser: payload,
      };

    case LOGOUT:
      return {
        ...initialValue,
      };

    default:
      return store;
  }
};

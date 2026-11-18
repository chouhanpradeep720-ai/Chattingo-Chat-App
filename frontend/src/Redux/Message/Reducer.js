import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType.js";

const initialValue = {
  messages: [],
  newMessage: null,
};

export const messageReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case GET_ALL_MESSAGE:
      return {
        ...store,
        messages: Array.isArray(payload) ? payload : [],
      };

    case CREATE_NEW_MESSAGE:
      return {
        ...store,
        newMessage: payload,
      };

    default:
      return store;
  }
};

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

    case CREATE_NEW_MESSAGE: {
      const alreadyExists = payload?.id != null &&
        store.messages.some(
          (message) =>
            message.id != null &&
            String(message.id) === String(payload.id)
        );

      return {
        ...store,
        messages: alreadyExists
          ? store.messages.map((message) =>
              String(message.id) === String(payload?.id)
                ? { ...message, ...payload }
                : message
            )
          : [...store.messages, payload],
        newMessage: payload,
      };
    }

    default:
      return store;
  }
};

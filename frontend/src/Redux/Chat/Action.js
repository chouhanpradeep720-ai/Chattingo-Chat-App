import { BASE_API_URL } from "../../config/api";
import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from "./ActionType";

// Create a single chat
export const createChat = (chatData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/single`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
      body: JSON.stringify(chatData.data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to create chat");
    }

    const data = await res.json();

    console.log("Single chat created successfully:", data);

    dispatch({
      type: CREATE_CHAT,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Create chat error:", error);
    return null;
  }
};

// Create a group chat
export const createGroupChat = (chatData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
      body: JSON.stringify(chatData.group),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to create group chat");
    }

    const data = await res.json();

    console.log("Group chat created successfully:", data);

    dispatch({
      type: CREATE_GROUP,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Create group chat error:", error);
    return null;
  }
};

// Get all chats of the logged-in user
export const getUsersChat = (chatData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch user chats");
    }

    const data = await res.json();

    const payload = Array.isArray(data) ? data : [];

    console.log("User chats fetched successfully:", payload);

    dispatch({
      type: GET_USERS_CHAT,
      payload,
    });

    return payload;
  } catch (error) {
    console.error("Get user chats error:", error);

    dispatch({
      type: GET_USERS_CHAT,
      payload: [],
    });

    return [];
  }
};

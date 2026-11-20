import { BASE_API_URL } from "../../config/api";
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType.js";

// Upload media file
export const uploadMedia = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_API_URL}/api/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload file");
    }

    const data = await res.json();

    console.log("Media uploaded successfully:", data);

    return data;
  } catch (error) {
    console.error("Media upload error:", error);
    return null;
  }
};

// Create a new message
export const createMessage = (messageData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${messageData.token}`,
      },
      body: JSON.stringify(messageData.data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to send message");
    }

    const data = await res.json();

    console.log("Message created successfully:", data);

    dispatch({
      type: CREATE_NEW_MESSAGE,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error("Create message error:", error);
    return null;
  }
};

// Get all messages for the selected chat
export const getAllMessages = (reqData) => async (dispatch) => {
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/messages/${reqData.chatId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${reqData.token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch messages");
    }

    const data = await res.json();

    console.log("Fetched chat messages:", data);

    dispatch({
      type: GET_ALL_MESSAGE,
      payload: Array.isArray(data) ? data : [],
    });

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Get messages error:", error);

    dispatch({
      type: GET_ALL_MESSAGE,
      payload: [],
    });

    return [];
  }
};
// Delete message from backend
export const deleteMessage = (messageId, token) => async () => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete message");
    }

    return true;
  } catch (error) {
    console.error("Delete message error:", error);
    return false;
  }
};

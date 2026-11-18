import { BASE_API_URL } from "../../config/api";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  REQ_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "./ActionType";

// User registration
export const register = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (res.ok && resData?.jwt) {
      localStorage.setItem("token", resData.jwt);
      dispatch({ type: REGISTER, payload: resData });
    }

    return resData;
  } catch (error) {
    console.error("Register error:", error);
    return null;
  }
};

// User login
export const login = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (res.ok && resData?.jwt) {
      localStorage.setItem("token", resData.jwt);
      dispatch({ type: LOGIN, payload: resData });
    }

    return resData;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

// Fetch current user
export const currentUser = (token) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch current user");
    }

    const resData = await res.json();

    console.log("Current user:", resData);

    dispatch({
      type: REQ_USER,
      payload: resData,
    });

    return resData;
  } catch (error) {
    console.error("Current user error:", error);
    return null;
  }
};

// Search users
export const searchUser = (data) => async (dispatch) => {
  try {
    const keyword = data.keyword?.trim() || "";

    if (!keyword) {
      dispatch({
        type: SEARCH_USER,
        payload: [],
      });
      return [];
    }

    const res = await fetch(
      `${BASE_API_URL}/api/users/${encodeURIComponent(keyword)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to search users");
    }

    const resData = await res.json();

    const users = Array.isArray(resData) ? resData : [];

    console.log("Search results:", users);

    dispatch({
      type: SEARCH_USER,
      payload: users,
    });

    return users;
  } catch (error) {
    console.error("Search user error:", error);

    dispatch({
      type: SEARCH_USER,
      payload: [],
    });

    return [];
  }
};

// Update user
export const updateUser = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data.data),
    });

    if (!res.ok) {
      throw new Error("Failed to update user");
    }

    const resData = await res.json();

    console.log("Updated user:", resData);

    dispatch({
      type: UPDATE_USER,
      payload: resData,
    });

    return resData;
  } catch (error) {
    console.error("Update user error:", error);
    return null;
  }
};

// User logout
export const logoutAction = () => async (dispatch) => {
  localStorage.removeItem("token");

  dispatch({
    type: LOGOUT,
    payload: null,
  });

  dispatch({
    type: REQ_USER,
    payload: null,
  });

  dispatch({
    type: SEARCH_USER,
    payload: [],
  });
};

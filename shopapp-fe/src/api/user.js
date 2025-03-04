import { message } from "antd";
import { setUserInfo } from "../reducers/userReducer";
import { getToken } from "../services/localStorageService";
import { API } from "./auth";

export const createUser = async (data) => {
  try {
    const response = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng ký thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Đăng ký thành công!");
    return result.result;
  } catch (error) {
    message.error(error.message);
    throw error;
  }
};

export const createGuest = async (data) => {
  try {
    const response = await fetch(`${API}/users/guests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng ký thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    return result.result;
  } catch (error) {
    message.error(error.message);
    throw error;
  }
};

export const updateUser = async (data, id) => {
  try {
    const response = await fetch(`${API}/users/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Cập nhật thông tin thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Cập nhật tài khoản thành công!");
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const getMyInfo = (accessToken) => {
  return async (dispatch, getState) => {
    const { user } = getState();
    if (user.id) {
      return;
    }

    try {
      const response = await fetch(`${API}/users/myInfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Tải thông tin người dùng thất bại!"
        );
      }

      const result = await response.json();

      if (result.code !== 1000) {
        throw new Error(result.message);
      }

      // Gọi action để lưu thông tin vào Redux store
      dispatch(setUserInfo(result.result));
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const searchUser = async (request, page, size) => {
  try {
    const response = await fetch(
      `${API}/users?id=${request.id}&username=${request.username}&fullName=${request.fullName}&phone=${request.phone}&role=${request.role}&isGuest=${request.isGuest}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Tải thông tin người dùng thất bại!"
      );
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Xoá thông tin người dùng thất bại!"
      );
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Xóa tài khoản thành công");
  } catch (error) {
    message.error(error.message);
  }
};

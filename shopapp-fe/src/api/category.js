import { message } from "antd";
import { API } from "./auth";
import { getToken } from "../services/localStorageService";
import { validateInput } from "../utils/ValidateInputUtil";

export const getAll = async () => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tải danh mục thất bại!");
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

export const createCategory = async (data) => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateInput(data)),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thêm danh mục thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    window.location.reload();
    message.success("Thêm mới danh mục thành công")
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const updateCategory = async (code, data) => {
  try {
    const response = await fetch(`${API}/categories/${code}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateInput(data)),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Cập nhật danh mục thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Cập nhật danh mục thành công")
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Xoá danh mục thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Xóa danh mục thành công")
  } catch (error) {
    message.error(error.message);
  }
};

import { message } from "antd";
import { getToken } from "../services/localStorageService";
import { API } from "./auth";

export const searchProduct = async (request, page, size, sortBy) => {
  try {
    const response = await fetch(
      `${API}/products?id=${request.id}&categoryCode=${request.categoryCode}&supplierCode=${request.supplierCode}&code=${request.code}&name=${request.name}&minPrice=${request.minPrice}&maxPrice=${request.maxPrice}&page=${page}&size=${size}&sortBy=${sortBy || ""}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tải sản phẩm thất bại!");
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

export const getProductByCode = async (code) => {
  try {
    const response = await fetch(`${API}/products/${code}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tải sản phẩm thất bại!");
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

export const createProduct = async (data) => {
  try {
    const response = await fetch(`${API}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thêm sản phẩm thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Thêm sản phẩm thành công!");
    return result.result;
  } catch (error) {
    message.error(error.message);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await fetch(`${API}/products/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Cập nhật sản phẩm thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Cập nhật sản phẩm thành công!");
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Xoá sản phẩm thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Xóa sản phẩm thành công");
  } catch (error) {
    message.error(error.message);
  }
};

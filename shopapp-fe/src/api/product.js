import { message } from "antd";
import { getToken } from "../services/localStorageService";
import { API } from "./auth";
import { validateInput } from "../utils/ValidateInputUtil";

export const searchProduct = async (request, page, size, sortBy, direction) => {
  try {
    const response = await fetch(
      `${API}/products?id=${request.id}&categoryCode=${
        request.categoryCode
      }&supplierCode=${request.supplierCode}&code=${
        request.code
      }&name=${validateInput(request.name)}&minPrice=${
        request.minPrice
      }&maxPrice=${request.maxPrice}&page=${page}&size=${size}&sortBy=${
        sortBy || ""
      }&direction=${direction || ""}`,
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
      body: JSON.stringify(validateInput(data)),
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
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateInput(data)),
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

export const uploadProductImages = async (id, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${API}/products/${id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Tải ảnh lên thành công!");
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const updateProductImages = async (id, keepImages, files) => {
  try {
    const formData = new FormData();
    
    keepImages.forEach((image) => formData.append("keepImages", image));

    files.forEach((file) => formData.append("newImages", file));

    const response = await fetch(`${API}/products/${id}/images`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Cập nhật ảnh thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Cập nhật ảnh thành công!");
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const importFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Chỉ thêm một file duy nhất

    const response = await fetch(`${API}/products/import-excel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
    }

    message.success("Tải lên danh sách sản phẩm thành công! Hãy kiểm tra log ...");
  } catch (error) {
    message.error(error.message);
  }
};


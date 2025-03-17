import { message } from "antd";
import { API } from "./auth";
import { getToken } from "../services/localStorageService";
import { validateInput } from "../utils/ValidateInputUtil";

export const searchInventory = async (data, page, size) => {
  try {
    const response = await fetch(
      `${API}/inventory-receipts?id=${data?.id || ""}&email=${
        data?.email || ""
      }&startDate=${data?.startDate || ""}&endDate=${
        data?.endDate || ""
      }&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
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

export const getInventoryReceipts = async (status, page, size) => {
  try {
    const response = await fetch(
      `${API}/inventory-receipts/status/${status}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
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

export const getInventoryReceiptById = async (id) => {
  try {
    const response = await fetch(`${API}/inventory-receipts/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
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

export const getInventoryReceiptDetailByProductId = async (
  productId,
  page,
  size
) => {
  try {
    const response = await fetch(
      `${API}/inventory-receipt-details?productId=${productId}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
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

export const createInventoryReceipt = async (data, navigate) => {
  try {
    const response = await fetch(`${API}/inventory-receipts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateInput(data)),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Thêm thành công");
    navigate("/admin/inventory-receipts/status/PENDING");
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const updateInventoryReceipt = async (id, data) => {
  try {
    const response = await fetch(`${API}/inventory-receipts/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateInput(data)),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Cập nhật thành công");
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const updateInventoryReceiptStatus = async (id, data) => {
  try {
    const response = await fetch(`${API}/inventory-receipts/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateInput(data)),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
    }

    const result = await response.json();

    if (result.code !== 1000) {
      throw new Error(result.message);
    }

    message.success("Cập nhật trạng thái thành công");
    return result.result;
  } catch (error) {
    message.error(error.message);
  }
};

export const countTotalPendingReceipts = async () => {
  try {
    const response = await fetch(
      `${API}/inventory-receipts/status/PENDING/count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thất bại!");
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

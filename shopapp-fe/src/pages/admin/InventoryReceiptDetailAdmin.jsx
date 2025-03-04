import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Table,
} from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createInventoryReceipt,
  getInventoryReceiptById,
  updateInventoryReceipt,
  updateInventoryReceiptStatus,
} from "../../api/inventoryReceipt";
import { searchProduct } from "../../api/product";
import { hasPermission } from "../../services/authService";

const { Option } = Select;

export default function InventoryReceiptDetailAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    if (id) fetchReceiptDetails(id);
  }, [id]);

  // Khi lấy detailResponses từ API, đảm bảo mỗi item có productId duy nhất.
  const fetchReceiptDetails = async (receiptId) => {
    try {
      const data = await getInventoryReceiptById(receiptId);
      setNote(data.note);
      setStatus(data.status);
      setCurrentStatus(data.status);

      const updatedProducts = data.detailResponses
        .filter((item) => item.productId) // Chỉ lấy sản phẩm có productId hợp lệ
        .map((item) => ({
          productId: item.productId, // Giữ nguyên ID từ API
          code: item.productCode, // Hiển thị mã sản phẩm
          quantity: item.quantity,
          price: item.price,
          isExisting: true,
        }));

      setSelectedProducts(updatedProducts);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết nhập kho:", error);
    }
  };

  const fetchProducts = async (search = "") => {
    setLoading(true);
    try {
      const request = {
        id: "",
        categoryCode: "",
        supplierCode: "",
        code: "",
        name: search,
        minPrice: "",
        maxPrice: "",
      };

      const data = await searchProduct(request, 1, 10);
      setProducts(data.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
    setLoading(false);
  };

  const debouncedSearch = useMemo(
    () => debounce((value) => fetchProducts(value), 300),
    []
  );

  const handleSearch = useCallback(
    (value) => {
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSelect = (value, option) => {
    // Tránh trùng lặp: Nếu đã có, không thêm lại
    if (!selectedProducts.some((p) => p.productId === value)) {
      setSelectedProducts((prev) => [
        ...prev,
        {
          productId: value,
          code: option.children,
          quantity: 1,
          price: 0,
          isExisting: false,
        },
      ]);
    }
  };

  const handleQuantityChange = (value, productId) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, quantity: value } : p
      )
    );
  };

  const handlePriceChange = (value, productId) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, price: value } : p))
    );
  };

  const handleRemove = (productId) => {
    // Chỉ xóa những item có productId khớp
    setSelectedProducts((prev) =>
      prev.filter((p) => p.productId !== productId)
    );
  };

  const totalAmount = selectedProducts.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  const handleSubmit = async () => {
    const payload = {
      totalAmount,
      note,
      details: selectedProducts.map(({ productId, quantity, price }) => ({
        productId,
        quantity,
        price,
      })),
    };

    if (id) {
      await updateInventoryReceipt(id, payload);
    } else {
      await createInventoryReceipt(payload);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setOpen(false);
  };

  const handleSubmitStatusChange = async (newStatus) => {
    if (!id) return;

    try {
      const data = {
        status: newStatus,
      };
      await updateInventoryReceiptStatus(id, data);
      console.log(data);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      render: (code) => (
        <a href={`/admin/products/${code}`}>
          {code}
        </a>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(value, record.productId)}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (text, record) => (
        <InputNumber
          min={0}
          value={record.price}
          style={{
            minWidth: 100,
          }}
          onChange={(value) => handlePriceChange(value, record.productId)}
        />
      ),
    },
    {
      title: "Thành tiền",
      render: (_, record) =>
        (record.quantity * record.price).toLocaleString("vi-VN") + "đ",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleRemove(record.productId)}
          disabled={status && status !== "PENDING"}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Nhập kho</h2>

      {hasPermission(["ROLE_ADMIN"]) && id ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ fontWeight: "bold" }}>Trạng thái:</label>
            <Select
              style={{ width: 150 }}
              value={status}
              open={open}
              onDropdownVisibleChange={setOpen} // Theo dõi mở/đóng dropdown
              onChange={handleStatusChange}
              disabled={status && status !== "PENDING"}
            >
              {status === "PENDING" && !open ? (
                <Option value="PENDING">PENDING</Option>
              ) : (
                <>
                  <Option value="COMPLETED">COMPLETED</Option>
                  <Option value="CANCELED">CANCELED</Option>
                </>
              )}
            </Select>
            <Button
              type="primary"
              onClick={() => handleSubmitStatusChange(status)} // Gọi API khi bấm nút
              disabled={currentStatus === status}
            >
              Cập nhật
            </Button>
          </div>

          <Divider />
        </div>
      ) : null}

      <Select
        showSearch
        placeholder="Chọn sản phẩm"
        style={{ width: 300 }}
        filterOption={false}
        onSearch={handleSearch}
        onSelect={handleSelect}
        notFoundContent={loading ? <Spin size="small" /> : "Không có sản phẩm"}
        disabled={status && status !== "PENDING"}
      >
        {products.map((product) => (
          <Option key={product.id} value={product.id}>
            {product.code}
          </Option>
        ))}
      </Select>

      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={selectedProducts}
        rowKey="productId"
        pagination={false}
      />

      <Form layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item label="Ghi chú">
          <Input.TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú..."
          />
        </Form.Item>

        <Form.Item label="Tổng tiền">
          <InputNumber value={totalAmount} disabled style={{ width: "100%" }} />
        </Form.Item>

        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={
            !selectedProducts.length || (status && status !== "PENDING")
          }
        >
          Gửi dữ liệu
        </Button>
      </Form>
    </>
  );
}

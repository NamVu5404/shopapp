import {
  DeleteOutlined,
  FileTextOutlined,
  PlusOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createInventoryReceipt,
  getInventoryReceiptById,
  updateInventoryReceipt,
  updateInventoryReceiptStatus,
} from "../../api/inventoryReceipt";
import { searchProduct } from "../../api/product";
import { hasPermission } from "../../services/authService";

const { Option } = Select;
const { Title, Text } = Typography;

// Status configuration for consistent UI
const STATUS_CONFIG = {
  PENDING: { color: "warning", text: "Chờ xử lý" },
  COMPLETED: { color: "success", text: "Hoàn thành" },
  CANCELED: { color: "error", text: "Đã hủy" },
};

export default function InventoryReceiptDetailAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setFetchingDetails(true);
      fetchReceiptDetails(id).finally(() => setFetchingDetails(false));
    }
  }, [id]);

  // Khi lấy detailResponses từ API, đảm bảo mỗi item có productCode duy nhất.
  const fetchReceiptDetails = async (receiptId) => {
    try {
      const data = await getInventoryReceiptById(receiptId);
      setNote(data.note);
      setStatus(data.status);
      setCurrentStatus(data.status);

      const updatedProducts = data.detailResponses
        .filter((item) => item.productCode) // Chỉ lấy sản phẩm có productCode hợp lệ
        .map((item) => ({
          productCode: item.productCode, // Giữ nguyên ID từ API
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
    if (!selectedProducts.some((p) => p.productCode === value)) {
      setSelectedProducts((prev) => [
        {
          productCode: value,
          code: option.children,
          quantity: 1,
          price: 0,
          isExisting: false,
        },
        ...prev,
      ]);
    }
  };

  const handleQuantityChange = (value, productCode) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productCode === productCode ? { ...p, quantity: value } : p
      )
    );
  };

  const handlePriceChange = (value, productCode) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productCode === productCode ? { ...p, price: value } : p
      )
    );
  };

  const handleRemove = (productCode) => {
    // Chỉ xóa những item có productCode khớp
    setSelectedProducts((prev) =>
      prev.filter((p) => p.productCode !== productCode)
    );
  };

  const totalAmount = selectedProducts.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  const handleSubmit = async () => {
    Modal.confirm({
      title: id ? "Xác nhận cập nhật" : "Xác nhận tạo phiếu",
      content: id
        ? "Bạn có chắc chắn muốn cập nhật phiếu nhập kho này không?"
        : "Bạn có chắc chắn muốn tạo phiếu nhập kho mới không?",
      okText: id ? "Cập nhật" : "Tạo phiếu",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setSubmitting(true);
          const payload = {
            totalAmount,
            note,
            details: selectedProducts.map(({ productCode, quantity, price }) => ({
              productCode,
              quantity,
              price,
            })),
          };
          console.log(payload);

          if (id) {
            await updateInventoryReceipt(id, payload);
          } else {
            await createInventoryReceipt(payload, navigate);
          }
        } catch (error) {
          console.error("Lỗi khi lưu phiếu nhập kho:", error);
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setOpen(false);
  };

  const handleSubmitStatusChange = async (newStatus) => {
    if (!id) return;

    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: `Bạn có chắc chắn muốn thay đổi trạng thái phiếu nhập kho thành "${
        STATUS_CONFIG[newStatus]?.text || newStatus
      }" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okButtonProps: {
        danger: newStatus === "CANCELED",
      },
      onOk: async () => {
        try {
          setSubmitting(true);
          const data = {
            status: newStatus,
          };
          await updateInventoryReceiptStatus(id, data);
          setCurrentStatus(newStatus);
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      render: (code) => (
        <Link to={`/admin/products/${code}`} target="_blank">
          <TagOutlined style={{ marginRight: 8 }} />
          {code}
        </Link>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(value, record.productCode)}
          disabled={status && status !== "PENDING"}
          style={{ width: 100 }}
          addonAfter="cái"
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
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          style={{ width: 150 }}
          onChange={(value) => handlePriceChange(value, record.productCode)}
          disabled={status && status !== "PENDING"}
          addonAfter="đ"
        />
      ),
    },
    {
      title: "Thành tiền",
      render: (_, record) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          {(record.quantity * record.price).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record.productCode)}
          disabled={status && status !== "PENDING"}
        >
          Xóa
        </Button>
      ),
    },
  ];

  if (fetchingDetails) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" tip="Đang tải chi tiết phiếu nhập kho..." />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          {
            title: (
              <Link to="/admin/inventory-receipts/status/PENDING">
                Quản lý nhập kho
              </Link>
            ),
          },
          { title: id ? `#${id}` : "Tạo phiếu nhập kho" },
        ]}
      />

      <div style={{ marginBottom: 24 }}>
        <Title level={4}>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          {id ? `Chi tiết phiếu nhập kho #${id}` : "Tạo phiếu nhập kho mới"}
        </Title>
      </div>

      {id ? (
        <Card
          size="small"
          title={<Text strong>Trạng thái phiếu</Text>}
          style={{ marginBottom: 24 }}
        >
          <Row align="middle" gutter={16}>
            <Col>
              <Text>Trạng thái hiện tại:</Text>
            </Col>
            <Col>
              <Tag color={STATUS_CONFIG[currentStatus]?.color || "default"}>
                {STATUS_CONFIG[currentStatus]?.text || currentStatus}
              </Tag>
            </Col>
            <Col flex="auto">
              {currentStatus !== "PENDING" && (
                <Alert
                  type="info"
                  showIcon
                  message="Phiếu nhập kho đã được xử lý và không thể chỉnh sửa"
                  style={{ marginLeft: 16 }}
                />
              )}
            </Col>
          </Row>

          {currentStatus === "PENDING" && hasPermission(["ROLE_ADMIN"]) && (
            <>
              <Divider style={{ margin: "16px 0" }} />
              <Row align="middle" gutter={16}>
                <Col>
                  <Text>Thay đổi trạng thái:</Text>
                </Col>
                <Col>
                  <Select
                    style={{ width: 180 }}
                    value={status}
                    open={open}
                    onDropdownVisibleChange={setOpen}
                    onChange={handleStatusChange}
                  >
                    <Option value="PENDING">
                      {STATUS_CONFIG.PENDING.text}
                    </Option>
                    <Option value="COMPLETED">
                      {STATUS_CONFIG.COMPLETED.text}
                    </Option>
                    <Option value="CANCELED">
                      {STATUS_CONFIG.CANCELED.text}
                    </Option>
                  </Select>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={() => handleSubmitStatusChange(status)}
                    disabled={currentStatus === status || submitting}
                    loading={submitting}
                  >
                    Cập nhật trạng thái
                  </Button>
                </Col>
                <Col flex="auto">
                  {status === "CANCELED" && (
                    <Alert
                      type="warning"
                      showIcon
                      message="Hủy phiếu sẽ không thể hoàn tác!"
                      style={{ marginLeft: 16 }}
                    />
                  )}
                </Col>
              </Row>
            </>
          )}
        </Card>
      ) : null}

      <Card
        size="small"
        title={<Text strong>Danh sách sản phẩm</Text>}
        extra={
          <Select
            showSearch
            placeholder="Tìm và chọn sản phẩm"
            style={{ width: 300 }}
            filterOption={false}
            onSearch={handleSearch}
            onSelect={handleSelect}
            notFoundContent={
              loading ? <Spin size="small" /> : "Không có sản phẩm"
            }
            disabled={status && status !== "PENDING"}
            suffixIcon={<PlusOutlined />}
          >
            {products.map((product) => (
              <Option key={product.code} value={product.code}>
                {product.code}
              </Option>
            ))}
          </Select>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={columns}
          dataSource={selectedProducts}
          rowKey="productCode"
          pagination={false}
          bordered
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    Chưa có sản phẩm nào. Vui lòng tìm và chọn sản phẩm từ danh
                    sách.
                  </span>
                }
              />
            ),
          }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3} align="right">
                  <Text strong>Tổng tiền:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      <Card size="small" title={<Text strong>Thông tin bổ sung</Text>}>
        <Form layout="vertical" form={form}>
          <Form.Item
            label={
              <span>
                <FileTextOutlined style={{ marginRight: 8 }} />
                Ghi chú
              </span>
            }
          >
            <Input.TextArea
              maxLength={255}
              showCount
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú về phiếu nhập kho..."
              rows={4}
              disabled={status && status !== "PENDING"}
            />
          </Form.Item>

          <Form.Item label="Tổng tiền">
            <InputNumber
              value={totalAmount}
              disabled
              style={{ width: "100%", color: "#ff4d4f" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter="đ"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                disabled={
                  !selectedProducts.length ||
                  (status && status !== "PENDING") ||
                  submitting
                }
                loading={submitting}
              >
                {id ? "Cập nhật phiếu" : "Tạo phiếu nhập kho"}
              </Button>
              <Button>
                <Link to="/admin/inventory-receipts/status/PENDING">
                  Quay lại
                </Link>
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

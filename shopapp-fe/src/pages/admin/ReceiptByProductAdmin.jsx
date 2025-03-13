import { CalendarOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Divider,
  Empty,
  Pagination,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getInventoryReceiptDetailByProductId } from "../../api/inventoryReceipt";

const { Text } = Typography;

// Status configuration for better UI consistency
const STATUS_CONFIG = {
  COMPLETED: { color: "success", text: "Hoàn thành" },
  CANCELED: { color: "error", text: "Đã hủy" },
  PENDING: { color: "warning", text: "Chờ xử lý" },
};

// Format date or display placeholder
const formatDate = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-";

// Format currency with Vietnamese locale
const formatCurrency = (amount) =>
  amount ? amount.toLocaleString("vi-VN") + "đ" : "-";

export default function ReceiptByProductAdmin() {
  const location = useLocation();
  const productCode = location.state?.productCode || "N/A";
  const productName = location.state?.productName || "N/A";

  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getReceiptDetailByProductId = async () => {
      setLoading(true);
      try {
        const response = await getInventoryReceiptDetailByProductId(
          productId,
          currentPage,
          pageSize
        );
        setData(response.data);
        setTotalItems(response.totalElements);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử nhập kho:", error);
      }
      setLoading(false);
    };

    getReceiptDetailByProductId();
  }, [currentPage, productId]);

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Mã phiếu",
      dataIndex: "receiptId",
      key: "receiptId",
      width: 250,
      render: (receiptId) => (
        <Typography.Text copyable>{receiptId}</Typography.Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 70,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (_, record) => (
        <Typography.Text strong style={{ color: "#ff4d4f" }}>
          {formatCurrency(record.price)}
        </Typography.Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 60,
      render: (status) => {
        const config = STATUS_CONFIG[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: Object.entries(STATUS_CONFIG).map(([key, value]) => ({
        text: value.text,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thông tin thời gian",
      key: "timeInfo",
      width: 160,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tooltip title="Ngày nhập">
            <Typography.Text type="secondary">
              <CalendarOutlined /> Tạo: {formatDate(record.createdDate)}
            </Typography.Text>
          </Tooltip>
          {record.modifiedDate && (
            <Tooltip title="Ngày sửa">
              <Typography.Text type="secondary">
                <CalendarOutlined /> Sửa: {formatDate(record.modifiedDate)}
              </Typography.Text>
            </Tooltip>
          )}
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Người thực hiện",
      key: "userInfo",
      width: 240,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tooltip title="Người nhập">
            <Typography.Text type="secondary">
              <UserOutlined /> Tạo: {record.createdBy || "-"}
            </Typography.Text>
          </Tooltip>
          {record.modifiedBy && (
            <Tooltip title="Người sửa">
              <Typography.Text type="secondary">
                <UserOutlined /> Sửa: {record.modifiedBy}
              </Typography.Text>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 10,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(`/admin/inventory-receipts/${record.receiptId}`)
            }
            aria-label="Xem chi tiết"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: <Link to="/admin/products">Quản lý sản phẩm</Link> },
          {
            title: (
              <Link to={`/admin/products/${productCode}`}>{productName}</Link>
            ),
          },
          { title: "Lịch sử nhập kho" },
        ]}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text strong>Tổng số: {totalItems || 0} lần nhập</Text>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            size="middle"
            bordered
            locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
            scroll={{ x: "max-content" }}
          />
          {totalItems > 0 && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

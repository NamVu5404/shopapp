import {
  CalendarOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Pagination,
  Row,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  countTotalPendingReceipts,
  getInventoryReceipts,
} from "../../api/inventoryReceipt";
import MyButton from "../../components/MyButton";

const { Text } = Typography;

const InventoryReceiptByStatus = ({
  data,
  selectedStatus,
  onStatusChange,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const [totalPendingItems, setTotalPendingItems] = useState(0);

  useEffect(() => {
    const countTotalPendingItem = async () => {
      const result = await countTotalPendingReceipts();
      setTotalPendingItems(result);
    };

    countTotalPendingItem();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#fa8c16"; // orange
      case "COMPLETED":
        return "#52c41a"; // green
      case "CANCELED":
        return "#ff4d4f"; // red
      default:
        return "#d9d9d9"; // gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Format date or display placeholder
  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-";

  // Format currency with Vietnamese locale
  const formatCurrency = (amount) =>
    amount ? amount.toLocaleString("vi-VN") + "đ" : "-";

  const RECEIPT_STATUSES = [
    { code: "PENDING", label: "Chờ xử lý" },
    { code: "COMPLETED", label: "Hoàn thành" },
    { code: "CANCELED", label: "Đã hủy" },
  ];

  return (
    <>
      <Card style={{ marginBottom: 16, borderRadius: "8px" }}>
        <Space
          size="large"
          wrap
          style={{ justifyContent: "center", width: "100%" }}
        >
          {RECEIPT_STATUSES.map((status) => (
            <Badge
              count={status.code === "PENDING" ? totalPendingItems : 0}
              key={status.code}
              offset={[-5, 0]}
            >
              <Button
                type={selectedStatus === status.code ? "primary" : "text"}
                onClick={() => onStatusChange(status.code)}
                style={{
                  borderRadius: "20px",
                  padding: "4px 16px",
                  backgroundColor:
                    selectedStatus === status.code
                      ? getStatusColor(status.code)
                      : "transparent",
                  borderColor:
                    selectedStatus === status.code
                      ? getStatusColor(status.code)
                      : "transparent",
                }}
              >
                {status.label}
              </Button>
            </Badge>
          ))}
        </Space>
      </Card>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text strong>Tổng số: {data?.totalElements || 0} phiếu nhập</Text>
        <div>
          <Link to={"/admin/inventory-receipts"}>
            <MyButton style={{ marginRight: 16 }} icon={<SearchOutlined />}>
              Tìm kiếm
            </MyButton>
          </Link>
          <Link to={"/admin/inventory-receipts/create"}>
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo phiếu nhập kho
            </Button>
          </Link>
        </div>
      </div>

      {data ? (
        <>
          <div style={{ minHeight: "300px" }}>
            {data.data.length > 0 ? (
              <div>
                {data.data.map((receipt) => (
                  <Card
                    key={receipt.id}
                    hoverable
                    bordered={false}
                    bodyStyle={{ padding: "16px" }}
                    style={{ marginBottom: "16px", borderRadius: "8px" }}
                  >
                    <Row gutter={[24, 16]}>
                      {/* Phần thông tin phiếu nhập kho */}
                      <Col xs={24} md={6}>
                        <Space
                          direction="vertical"
                          size={3}
                          style={{ width: "100%" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Badge
                              color={getStatusColor(receipt.status)}
                              text={
                                <Text strong>
                                  {getStatusLabel(receipt.status)}
                                </Text>
                              }
                            />
                            <Text
                              type="secondary"
                              copyable={{ text: receipt.id }}
                            >
                              #{receipt.id}
                            </Text>
                          </div>
                          <Divider style={{ margin: "8px 0" }} />

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text>Tổng tiền:</Text>
                            <Text strong style={{ color: "#ff4d4f" }}>
                              {formatCurrency(receipt.totalAmount)}
                            </Text>
                          </div>
                        </Space>
                      </Col>

                      {/* Phần thông tin thời gian */}
                      <Col xs={24} md={6}>
                        <Space
                          direction="vertical"
                          size={3}
                          style={{ width: "100%" }}
                        >
                          <Text strong>Thông tin thời gian</Text>
                          <Divider style={{ margin: "8px 0" }} />
                          <Space size={8}>
                            <CalendarOutlined />
                            <Text>Tạo: {formatDate(receipt.createdDate)}</Text>
                          </Space>
                          {receipt.modifiedDate && (
                            <Space size={8}>
                              <CalendarOutlined />
                              <Text>
                                Sửa: {formatDate(receipt.modifiedDate)}
                              </Text>
                            </Space>
                          )}
                        </Space>
                      </Col>

                      {/* Phần thông tin người thực hiện */}
                      <Col xs={24} md={8}>
                        <Space
                          direction="vertical"
                          size={3}
                          style={{ width: "100%" }}
                        >
                          <Text strong>Người thực hiện</Text>
                          <Divider style={{ margin: "8px 0" }} />
                          <Space size={8}>
                            <UserOutlined />
                            <Text>Tạo: {receipt.createdBy || "-"}</Text>
                          </Space>
                          {receipt.modifiedBy && (
                            <Space size={8}>
                              <UserOutlined />
                              <Text>Sửa: {receipt.modifiedBy}</Text>
                            </Space>
                          )}
                        </Space>
                      </Col>

                      {/* Phần hành động */}
                      <Col
                        xs={24}
                        md={4}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link to={`/admin/inventory-receipts/${receipt.id}`}>
                          <Button
                            type="primary"
                            shape="round"
                            icon={<RightOutlined />}
                          >
                            Chi tiết
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            ) : (
              <Card style={{ textAlign: "center", padding: "40px 0" }}>
                <ShoppingOutlined
                  style={{ fontSize: "48px", color: "#d9d9d9" }}
                />
                <p style={{ marginTop: "16px" }}>Không có dữ liệu</p>
              </Card>
            )}
          </div>
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
              total={data.totalElements}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Card style={{ textAlign: "center", padding: "40px 0" }}>
          <ShoppingOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
          <p style={{ marginTop: "16px" }}>Đang tải dữ liệu...</p>
        </Card>
      )}
    </>
  );
};

export default function InventoryReceiptAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const initialPage = parseInt(urlSearchParams.get("page")) || 1;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getInventoryReceipts(
          selectedStatus,
          currentPage,
          pageSize
        );
        setData(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu nhập:", error);
        setData({ data: [], totalElements: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedStatus, currentPage, pageSize]);

  // Cập nhật URL khi thay đổi trạng thái hoặc trang
  const updateURL = (status, page) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("size", pageSize.toString());

    let path = `/admin/inventory-receipts`;
    if (status) {
      path += `/status/${status}`;
    }

    navigate(`${path}?${params.toString()}`);
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    updateURL(status, 1);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(selectedStatus, page);
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: "Quản lý nhập kho" },
        ]}
      />

      <InventoryReceiptByStatus
        data={data}
        loading={loading}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </>
  );
}

import React from "react";
import {
  Result,
  Card,
  Row,
  Col,
  Button,
  Descriptions,
  Table,
  Divider,
  Typography,
  Space,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <Result
        status="error"
        title="Không tìm thấy thông tin đơn hàng"
        extra={
          <Button type="primary">
            <Link to="/">Trở về trang chủ</Link>
          </Button>
        }
      />
    );
  }

  const address = order.address || "Không có thông tin địa chỉ";

  // Cấu hình cột cho bảng chi tiết đơn hàng
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_, record) => (
        <Link to={`/products/${record.productCode}`}>
          <Text strong style={{ wordBreak: "break-word" }}>
            {record.productName}
          </Text>
        </Link>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "center",
      render: (quantity) => <Text>{quantity}</Text>,
    },
    {
      title: "Giá",
      dataIndex: "priceAtPurchase",
      key: "priceAtPurchase",
      render: (price) => <Text type="danger">{price.toLocaleString()}đ</Text>,
      width: 120,
      align: "right",
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
      <Card
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
        bodyStyle={{ padding: "0" }}
      >
        {/* Header với background gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
            // background: "var(--primary-color)",
            padding: "35px 20px",
            borderRadius: "8px 8px 0 0",
            textAlign: "center",
          }}
        >
          <CheckCircleOutlined style={{ fontSize: 60, color: "white" }} />
          <Title level={2} style={{ color: "white", margin: "16px 0 8px" }}>
            Cảm ơn bạn đã đặt hàng!
          </Title>
          <Text style={{ fontSize: 16, color: "white" }}>
            Email xác nhận đã được gửi tới{" "}
            <span style={{ fontWeight: "bold" }}>{order.username}</span>
          </Text>
          <div style={{ marginTop: 15 }}>
            <Text
              style={{
                fontSize: "18px",
                color: "white",
                background: "rgba(255,255,255,0.2)",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
              copyable={{ text: order.id }}
            >
              Đơn hàng #{order.id}
            </Text>
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          <Row gutter={[24, 24]}>
            {/* Cột trái - Thông tin đơn hàng */}
            <Col xs={24} md={14}>
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>Thông tin mua hàng</span>
                  </Space>
                }
                bordered={false}
                style={{ marginBottom: 16 }}
                headStyle={{
                  background: "#f0f5ff",
                  borderBottom: "1px solid #d6e4ff",
                }}
              >
                <Descriptions
                  column={1}
                  size="small"
                  bordered={false}
                  layout="vertical"
                >
                  <Descriptions.Item label="Tên">
                    <Text strong>{order.fullName || "Không có"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text copyable style={{ wordBreak: "break-word" }}>
                      {order.username}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Text>{order.phone}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card
                title={
                  <Space>
                    <CreditCardOutlined />
                    <span>Phương thức thanh toán</span>
                  </Space>
                }
                bordered={false}
                style={{ marginBottom: 16 }}
                headStyle={{
                  background: "#f0f5ff",
                  borderBottom: "1px solid #d6e4ff",
                }}
              >
                <Text strong>{order.paymentMethod}</Text>
              </Card>

              <Card
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Địa chỉ nhận hàng</span>
                  </Space>
                }
                bordered={false}
                headStyle={{
                  background: "#f0f5ff",
                  borderBottom: "1px solid #d6e4ff",
                }}
              >
                <Descriptions
                  column={1}
                  size="small"
                  bordered={false}
                  layout="vertical"
                >
                  <Descriptions.Item label="Tên">
                    <Text strong>{order.fullName || "Không có"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    <Text style={{ wordBreak: "break-word" }}>{address}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Text>{order.phone}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Cột phải - Tóm tắt đơn hàng */}
            <Col xs={24} md={10}>
              <Card
                title={
                  <Space>
                    <ShoppingOutlined />
                    <span>Tóm tắt đơn hàng</span>
                  </Space>
                }
                bordered={false}
                headStyle={{
                  background: "#f0f5ff",
                  borderBottom: "1px solid #d6e4ff",
                }}
              >
                <Table
                  dataSource={order.details}
                  columns={columns}
                  rowKey="productId"
                  pagination={false}
                  size="small"
                  scroll={{ y: 240 }}
                  bordered={false}
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell
                          colSpan={2}
                          style={{ textAlign: "right", paddingRight: "10px" }}
                        >
                          <Text strong>Tổng cộng:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text
                            strong
                            style={{ fontSize: "16px", color: "#f5222d" }}
                          >
                            {order.totalPrice.toLocaleString()}đ
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />

                <Divider style={{ margin: "16px 0" }} />

                <div style={{ textAlign: "center" }}>
                  <Link to="/products">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingOutlined />}
                      style={{
                        height: "auto",
                        padding: "10px 24px",
                        borderRadius: "6px",
                        background:
                          "linear-gradient(to right, #1890ff, #096dd9)",
                        // background: "var(--primary-color)",
                      }}
                    >
                      Tiếp tục mua hàng
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;

import React from "react";
import { Result, Card, Row, Col, Button, Descriptions, Table } from "antd";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return <Result status="error" title="Không tìm thấy thông tin đơn hàng" />;
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
          <span style={{ wordBreak: "break-word", maxWidth: "150px" }}>
            {record.productName}
          </span>
        </Link>
      ),
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity", width: 80 },
    {
      title: "Giá",
      dataIndex: "priceAtPurchase",
      key: "priceAtPurchase",
      render: (price) => `${price.toLocaleString()}đ`,
      width: 120,
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f0f2f5" }}>
      <Result
        status="success"
        title="Cảm ơn bạn đã đặt hàng!"
        subTitle={
          <span>
            Email xác nhận đã được gửi tới{" "}
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>
              {order.username}
            </span>
            . Xin vui lòng kiểm tra email của bạn.
          </span>
        }
        extra={
          <div style={{ fontSize: "16px", color: "#1890ff" }}>
            Đơn hàng #{order.id}
          </div>
        }
      />

      <Card style={{ marginTop: 20 }}>
        <Row gutter={[16, 16]}>
          {/* Cột trái - Thông tin đơn hàng */}
          <Col span={16}>
            <Descriptions
              title="Thông tin mua hàng"
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="Tên">
                {order.fullName || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <span style={{ wordBreak: "break-word", maxWidth: "200px" }}>
                  {order.username}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.phone}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Phương thức thanh toán"
              bordered
              column={1}
              size="small"
              style={{ marginTop: 16 }}
            >
              <Descriptions.Item>{order.paymentMethod}</Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Địa chỉ nhận hàng"
              bordered
              column={1}
              size="small"
              style={{ marginTop: 16 }}
            >
              <Descriptions.Item label="Tên">
                {order.fullName || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                <span style={{ wordBreak: "break-word", maxWidth: "250px" }}>
                  {address}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.phone}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* Cột phải - Tóm tắt đơn hàng */}
          <Col span={8}>
            <h3 style={{ marginBottom: 16, fontSize: "18px", color: "#333" }}>
              Tóm tắt đơn hàng
            </h3>
            <Table
              dataSource={order.details}
              columns={columns}
              rowKey="productId"
              pagination={false}
              size="small"
              scroll={{ y: 200 }} // Kích thước cố định cho bảng
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      colSpan={2}
                      style={{ textAlign: "right" }}
                    >
                      Tổng cộng
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <span style={{ fontWeight: "bold", color: "#d4380d" }}>
                        {order.totalPrice.toLocaleString()}đ
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Col>
        </Row>
      </Card>

      {/* Phần chân trang */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" size="large">
          <Link to="/products">Tiếp tục mua hàng</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;

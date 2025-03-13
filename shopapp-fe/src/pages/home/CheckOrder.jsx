import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Modal,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getOneByOrderIdAndEmail } from "../../api/order";
import OrderDetailComponent from "../../components/OrderDetailComponent";

export default function CheckOrder() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State để vô hiệu hóa nút
  const [orderDetails, setOrderDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle search with debounce
  const handleSearch = async (values) => {
    if (loading || isButtonDisabled) return; // Ngăn chặn nếu đang tải hoặc nút bị vô hiệu hóa

    try {
      setLoading(true);
      setIsButtonDisabled(true); // Vô hiệu hóa nút

      const response = await getOneByOrderIdAndEmail(
        values.orderId,
        values.email
      );

      if (response) {
        setOrderDetails(response);
        setIsModalVisible(true);
      } else {
        message.error("Không tìm thấy đơn hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm đơn hàng:", error);
      message.error("Không thể tìm kiếm đơn hàng. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);

      // Kích hoạt lại nút sau 2 giây
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000);
    }
  };

  // Reset search form
  const handleReset = () => {
    form.resetFields();
    setOrderDetails(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: "Tra cứu đơn hàng" },
        ]}
      />

      <Row>
        <Col xl={12}>
          <Card>
            <Form
              form={form}
              name="orderSearch"
              layout="vertical"
              onFinish={handleSearch}
            >
              <Form.Item
                label="Mã đơn hàng"
                name="orderId"
                rules={[
                  { required: true, message: "Vui lòng nhập mã đơn hàng!" },
                ]}
              >
                <Input
                  placeholder="Nhập mã đơn hàng (VD: ba627655-d88b-4736-brf2-9a6dfrt4548e)"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="Nhập email đã đăng ký khi mua hàng"
                  allowClear
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                    disabled={loading || isButtonDisabled} // Vô hiệu hóa nút khi đang tải hoặc bị chặn
                  >
                    Kiểm tra
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    Làm mới
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal to show order details */}
      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        style={{ minWidth: 1100 }}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
      >
        {orderDetails && (
          <OrderDetailComponentWrapper orderData={orderDetails} />
        )}
      </Modal>
    </>
  );
}

// Wrapper component to handle passing data to OrderDetailComponent
function OrderDetailComponentWrapper({ orderData }) {
  return (
    <div>
      <OrderDetailComponent isAdminView={false} initialOrderData={orderData} />
    </div>
  );
}

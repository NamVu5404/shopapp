import {
  CheckCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Table,
  Tag,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createAddress, getAddressesByUserId } from "../../api/address";
import { clearCart, getCartByUser } from "../../api/cart";
import { createOrder } from "../../api/order";
import { createGuest } from "../../api/user";
import { getToken } from "../../services/localStorageService";

// Giả sử API để lấy thông tin sản phẩm bằng productCode
import { getProductByCode } from "../../api/product"; // Cần định nghĩa hàm này

const { Text } = Typography;

export default function Checkout() {
  const user = useSelector((state) => state.user);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("other");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu giỏ hàng
        if (getToken() && user?.id) {
          const data = await getCartByUser(user.id);
          setCart(data);
        } else {
          const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
            items: [],
          };
          setCart(guestCart);
        }

        // Lấy địa chỉ của người dùng
        if (user?.id) {
          const result = await getAddressesByUserId(user.id);
          setAddresses(result);
          if (result.length > 0) {
            setSelectedAddress(result[0].id);
            form.setFieldsValue(result[0]);
          }
        }

        // Điền thông tin người dùng vào form
        if (user?.id) form.setFieldValue("username", user.username);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, form]);

  const handleAddressChange = (value) => {
    setSelectedAddress(value);
    if (value !== "other") {
      const selected = addresses.find((addr) => addr.id === value);
      if (selected) form.setFieldsValue(selected);
    } else {
      form.resetFields();
      if (user?.id) form.setFieldValue("username", user.username);
    }
  };

  const calculateTotal = () => {
    return (
      cart?.items?.reduce(
        (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
        0
      ) || 0
    );
  };

  const totalPrice = calculateTotal().toLocaleString("vi-VN") + "đ";

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_, item) => (
        <Space>
          <img
            src="/logo/wallpaperflare.com_wallpaper.jpg"
            alt={item.productName}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link to={`/products/${item.productCode}`}>
              <Space direction="vertical" size={0} style={{ width: "100%" }}>
                <Text strong>{item.productName}</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Mã: {item.productCode}
                </Text>
              </Space>
            </Link>
            {item.discountPrice && item.discountPrice < item.price && (
              <Tag color="orange">Giảm giá</Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 150,
      render: (_, item) => (
        <Space direction="vertical" size={0}>
          {item.discountPrice && item.discountPrice < item.price ? (
            <>
              <Text delete type="secondary">
                {item.price.toLocaleString("vi-VN")}đ
              </Text>
              <Text type="danger" strong>
                {item.discountPrice.toLocaleString("vi-VN")}đ
              </Text>
            </>
          ) : (
            <Text strong>{item.price.toLocaleString("vi-VN")}đ</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 100,
    },
    {
      title: "Thành tiền",
      key: "total",
      align: "right",
      width: 150,
      render: (_, item) => (
        <Text strong style={{ color: "#f50" }}>
          {((item.discountPrice || item.price) * item.quantity).toLocaleString(
            "vi-VN"
          )}
          đ
        </Text>
      ),
    },
  ];

  // Hàm kiểm tra số lượng so với tồn kho dựa trên productCode
  const checkInventory = async () => {
    for (const item of cart.items) {
      const product = await getProductByCode(item.productCode);
      if (product && item.quantity > product.inventoryQuantity) {
        message.error(
          `Số lượng sản phẩm "${item.productName}" vượt quá tồn kho (${product.inventoryQuantity} cái). Vui lòng kiểm tra lại!`
        );
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async (values) => {
    if (isSubmitting) return;

    // Kiểm tra số lượng tồn kho trước khi xử lý
    const hasEnoughInventory = await checkInventory();
    if (!hasEnoughInventory) {
      return;
    }

    setIsSubmitting(true);

    let guest, otherAddress;

    try {
      if (!user?.id) {
        const guestData = {
          username: values.username,
          fullName: values.fullName,
          phone: values.phone,
        };
        guest = await createGuest(guestData);
      }

      if (selectedAddress === "other") {
        const otherAddressData = { ...values, userId: guest?.id || user?.id };
        otherAddress = await createAddress(otherAddressData);
      }

      const orderRequest = {
        userId: user?.id || guest.id,
        orderType: "ONLINE",
        totalPrice: calculateTotal(),
        paymentMethod: paymentMethod,
        note: values.note,
        addressId:
          selectedAddress !== "other" ? selectedAddress : otherAddress.id,
        details: cart?.items?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.discountPrice || item.price,
        })),
      };

      // Gọi API tạo đơn hàng và nhận response
      const orderResponse = await createOrder(orderRequest);

      // Điều hướng đến trang OrderSuccess và truyền dữ liệu qua state
      navigate("/order-success", { state: { order: orderResponse } });

      if (user?.id) {
        await clearCart(user?.id);
      } else {
        localStorage.removeItem("guestCart");
        setCart({ items: [] });
      }

      // Kích hoạt sự kiện để cập nhật cartCount trong Header cho guest user
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      message.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p>Đang tải thông tin thanh toán...</p>
        </div>
      </Card>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Card>
        <Alert
          message="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng."
          type="info"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate("/products")}>
              Tiếp tục mua sắm
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to="/cart">Giỏ hàng</Link> },
          { title: "Thanh toán" },
        ]}
      />

      <Card
        bordered={false}
        style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.08)" }}
      >
        <Steps
          current={1}
          style={{ marginBottom: 30 }}
          items={[
            {
              title: "Giỏ hàng",
              icon: <ShoppingCartOutlined />,
            },
            {
              title: "Thanh toán",
              icon: <CreditCardOutlined />,
            },
            {
              title: "Hoàn tất",
              icon: <CheckCircleOutlined />,
            },
          ]}
        />

        <Card
          title={
            <Space>
              <ShoppingCartOutlined />
              <span>Thông tin đơn hàng</span>
              <Badge
                count={cart?.items?.length || 0}
                style={{ backgroundColor: "#52c41a" }}
              />
            </Space>
          }
          type="inner"
          style={{ marginBottom: 24 }}
        >
          <Table
            dataSource={cart?.items}
            columns={columns}
            rowKey="productId"
            pagination={false}
            bordered
          />
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Space direction="vertical" align="end">
              <Text>
                Tổng số lượng:{" "}
                <Text strong>
                  {cart?.items?.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </Text>
              <Text>
                Tổng tiền:{" "}
                <Text strong style={{ fontSize: 18, color: "#f50" }}>
                  {totalPrice}
                </Text>
              </Text>
            </Space>
          </div>
        </Card>

        <Card
          title={
            <Space>
              <HomeOutlined />
              <span>Địa chỉ giao hàng</span>
            </Space>
          }
          type="inner"
          style={{ marginBottom: 24 }}
        >
          {addresses.length > 0 && (
            <Form.Item label="Chọn địa chỉ có sẵn" style={{ marginBottom: 24 }}>
              <Select
                value={selectedAddress}
                onChange={handleAddressChange}
                style={{ width: "100%" }}
                placeholder="Chọn địa chỉ giao hàng"
                dropdownStyle={{ maxWidth: 500 }}
              >
                {addresses.map((addr) => (
                  <Select.Option key={addr.id} value={addr.id}>
                    <Space>
                      <EnvironmentOutlined />
                      <span>
                        {addr.fullName} | {addr.phone} | {addr.detail},{" "}
                        {addr.ward}, {addr.district}, {addr.province}
                      </span>
                    </Space>
                  </Select.Option>
                ))}
                <Select.Option value="other">
                  <Space>
                    <PlusOutlined />
                    <span>Thêm địa chỉ mới</span>
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleCheckout}
            requiredMark="optional"
          >
            <Divider orientation="left">Thông tin người nhận</Divider>
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="username"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    prefix={
                      <MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Email của bạn"
                    disabled={user?.id}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Họ và tên người nhận"
                    disabled={selectedAddress !== "other"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^0\d{9}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Số điện thoại liên hệ"
                    disabled={selectedAddress !== "other"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Địa chỉ giao hàng</Divider>
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="province"
                  label="Tỉnh/Thành phố"
                  rules={[
                    { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
                  ]}
                >
                  <Input
                    placeholder="Tỉnh/Thành phố"
                    disabled={selectedAddress !== "other"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[
                    { required: true, message: "Vui lòng nhập quận/huyện" },
                  ]}
                >
                  <Input
                    placeholder="Quận/Huyện"
                    disabled={selectedAddress !== "other"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[
                    { required: true, message: "Vui lòng nhập phường/xã" },
                  ]}
                >
                  <Input
                    placeholder="Phường/Xã"
                    disabled={selectedAddress !== "other"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="detail"
              label="Địa chỉ cụ thể"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ cụ thể" },
              ]}
            >
              <Input
                prefix={
                  <EnvironmentOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Số nhà, tên đường, tòa nhà, v.v."
                disabled={selectedAddress !== "other"}
              />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú">
              <TextArea
                prefix={
                  <FileTextOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Ghi chú thêm về đơn hàng hoặc giao hàng (nếu có)"
                rows={3}
              />
            </Form.Item>

            <Divider orientation="left">
              <Space>
                <CreditCardOutlined />
                <span>Phương thức thanh toán</span>
              </Space>
            </Divider>

            <div style={{ marginBottom: 24 }}>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Card
                    hoverable
                    size="small"
                    style={{
                      border:
                        paymentMethod === "COD"
                          ? "2px solid #1890ff"
                          : undefined,
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                    bodyStyle={{ padding: "12px 16px" }}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <Radio value="COD">
                      <Space>
                        <DollarOutlined style={{ fontSize: 18 }} />
                        <span style={{ fontWeight: 500 }}>
                          Thanh toán khi nhận hàng (COD)
                        </span>
                      </Space>
                    </Radio>
                  </Card>
                  <Card
                    hoverable
                    size="small"
                    style={{
                      border:
                        paymentMethod === "E_WALLET"
                          ? "2px solid #1890ff"
                          : undefined,
                      borderRadius: 8,
                    }}
                    bodyStyle={{ padding: "12px 16px" }}
                    onClick={() => setPaymentMethod("E_WALLET")}
                  >
                    <Radio value="E_WALLET">
                      <Space>
                        <CreditCardOutlined style={{ fontSize: 18 }} />
                        <span style={{ fontWeight: 500 }}>
                          Chuyển khoản ngân hàng
                        </span>
                      </Space>
                    </Radio>
                  </Card>
                </Space>
              </Radio.Group>
            </div>

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button onClick={() => navigate("/cart")}>
                <Space>
                  <ShoppingCartOutlined />
                  <span>Quay lại giỏ hàng</span>
                </Space>
              </Button>
              <Space align="end" direction="vertical">
                <Text>
                  <InfoCircleOutlined /> Bằng cách nhấn nút "Đặt hàng", bạn đồng
                  ý với <Link to="/terms">điều khoản</Link> của chúng tôi
                </Text>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Space direction="vertical" align="end">
                    <Text>Tổng thanh toán:</Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#f50",
                      }}
                    >
                      {totalPrice}
                    </Text>
                  </Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={isSubmitting}
                    disabled={isSubmitting || cart?.items.length === 0}
                    style={{ height: 50, fontSize: 16, width: 200 }}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </Space>
            </div>
          </Form>
        </Card>
      </Card>
    </>
  );
}

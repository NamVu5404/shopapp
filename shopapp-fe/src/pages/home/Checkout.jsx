import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  message,
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

export default function Checkout() {
  const user = useSelector((state) => state.user);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("other");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  useEffect(() => {
    const getCartData = async () => {
      if (getToken() && user?.id) {
        const data = await getCartByUser(user.id);
        setCart(data);
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
          items: [],
        };
        setCart(guestCart);
      }
    };

    const getAddressData = async () => {
      if (user?.id) {
        const result = await getAddressesByUserId(user.id);
        setAddresses(result);
        if (result.length > 0) {
          setSelectedAddress(result[0].id);
          form.setFieldsValue(result[0]);
        }
      }
    };

    getCartData();
    getAddressData();
    if (user?.id) form.setFieldValue("username", user.username);
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

  const totalPrice =
    cart?.items
      ?.reduce(
        (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
        0
      )
      .toLocaleString("vi-VN") + "đ" || "0đ";

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_, item) => (
        <Link to={`/products/${item.productCode}`}>{item.productName}</Link>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_, item) =>
        (item.discountPrice || item.price).toLocaleString("vi-VN") + "đ",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, item) =>
        ((item.discountPrice || item.price) * item.quantity).toLocaleString(
          "vi-VN"
        ) + "đ",
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
        totalPrice: cart?.items?.reduce(
          (sum, item) =>
            sum + (item.discountPrice || item.price) * item.quantity,
          0
        ),
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
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Thanh toán">
      <Table
        dataSource={cart?.items}
        columns={columns}
        rowKey="productId"
        pagination={false}
      />
      <div style={{ marginTop: 20 }}>
        <h3>Địa chỉ giao hàng</h3>
        <Select
          value={selectedAddress}
          onChange={handleAddressChange}
          style={{ width: "100%", marginBottom: 10 }}
        >
          {addresses.map((addr) => (
            <Select.Option key={addr.id} value={addr.id}>
              {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
            </Select.Option>
          ))}
          <Select.Option value="other">Khác</Select.Option>
        </Select>

        <Form form={form} layout="vertical" onFinish={handleCheckout}>
          <Row gutter={[20, 10]}>
            <Col xl={8}>
              <Form.Item
                name="username"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="Email" disabled={user?.id} />
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input
                  placeholder="Họ và tên"
                  disabled={selectedAddress !== "other"}
                />
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input
                  placeholder="Số điện thoại"
                  disabled={selectedAddress !== "other"}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20, 10]}>
            <Col xl={8}>
              <Form.Item
                name="province"
                label="Tỉnh/Thành phố"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Tỉnh/Thành phố"
                  disabled={selectedAddress !== "other"}
                />
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item
                name="district"
                label="Quận/Huyện"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Quận/Huyện"
                  disabled={selectedAddress !== "other"}
                />
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item
                name="ward"
                label="Phường/Xã"
                rules={[{ required: true }]}
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
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Địa chỉ cụ thể"
              disabled={selectedAddress !== "other"}
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <TextArea />
          </Form.Item>
          <div style={{ marginTop: 20 }}>
            <h3>Phương thức thanh toán</h3>
            <Select
              value={paymentMethod}
              onChange={setPaymentMethod}
              style={{ width: 250 }}
            >
              <Select.Option value="COD">
                Thanh toán khi nhận hàng
              </Select.Option>
              <Select.Option value="E_WALLET">
                Chuyển khoản ngân hàng
              </Select.Option>
            </Select>
          </div>
          <h3 style={{ marginTop: 20 }}>Tổng tiền: {totalPrice}</h3>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: 20 }}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Xác nhận đặt hàng
          </Button>
        </Form>
      </div>
    </Card>
  );
}

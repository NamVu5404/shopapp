import { useState, useEffect } from "react";
import {
  Table,
  Button,
  InputNumber,
  Card,
  Empty,
  Spin,
  Typography,
  Space,
  Tag,
  Divider,
  Popconfirm,
  Breadcrumb,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  addCartItem,
  clearCart,
  getCartByUser,
  removeItem,
} from "../../api/cart";
import { useSelector } from "react-redux";
import { getToken } from "../../services/localStorageService";
import { Link, useNavigate } from "react-router-dom";
import { DEFAULT_IMAGE, IMAGE_URL } from "../../api/auth";

const { Title, Text } = Typography;

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    const getCartData = async () => {
      setLoading(true);
      try {
        if (getToken()) {
          const data = await getCartByUser(userId);
          setCart(data);
        } else {
          // Guest cart từ localStorage
          const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
            items: [],
          };
          setCart(guestCart);
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    getCartData();
  }, [userId, navigate]);

  // Hàm cập nhật số lượng (quantity) sản phẩm
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      };
      if (!getToken()) {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));

        // Kích hoạt sự kiện để cập nhật cartCount trong Header cho guest user
        window.dispatchEvent(new Event("cartUpdated"));
      }
      return updatedCart;
    });

    if (updateTimeout) clearTimeout(updateTimeout);
    setUpdateTimeout(
      setTimeout(async () => {
        if (getToken()) {
          await addCartItem({ userId, productId, quantity });

          // Kích hoạt sự kiện để cập nhật cartCount trong Header cho logged-in user
          window.dispatchEvent(new Event("cartUpdated"));
        }
      }, 500)
    );
  };

  // Xóa một item khỏi giỏ hàng
  const handleRemoveItem = async (productId) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        items: prevCart.items.filter((item) => item.productId !== productId),
      };
      if (!getToken()) {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));

        // Kích hoạt sự kiện để cập nhật cartCount trong Header cho guest user
        window.dispatchEvent(new Event("cartUpdated"));
      }
      return updatedCart;
    });

    if (getToken()) {
      await removeItem(userId, productId);

      // Kích hoạt sự kiện để cập nhật cartCount trong Header cho logged-in user
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // Xóa toàn bộ giỏ hàng
  const handleClearCart = async () => {
    setCart({ items: [] });
    if (getToken()) {
      await clearCart(userId);
    } else {
      localStorage.removeItem("guestCart");
    }

    // Kích hoạt sự kiện để cập nhật cartCount trong Header
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cart?.items.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );

  const formattedTotalPrice = totalPrice?.toLocaleString("vi-VN") + "đ";

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_, item) => (
        <Space>
          <img
            src={
              item.images.length !== 0
                ? `${IMAGE_URL}/${item.images[0]}`
                : DEFAULT_IMAGE
            }
            alt={item.productName}
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
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
      render: (_, item) => (
        <InputNumber
          min={1}
          max={100}
          value={item.quantity}
          onChange={(value) => updateQuantity(item.productId, value)}
          style={{ width: "70px" }}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      align: "right",
      render: (_, item) => (
        <Text strong style={{ color: "#f50" }}>
          {((item.discountPrice || item.price) * item.quantity).toLocaleString(
            "vi-VN"
          )}
          đ
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, item) => (
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"
          onConfirm={() => handleRemoveItem(item.productId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            shape="circle"
          />
        </Popconfirm>
      ),
    },
  ];

  const renderCartContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      );
    }

    if (!cart || cart.items.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng của bạn đang trống"
        >
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/products")}
          >
            Tiếp tục mua sắm
          </Button>
        </Empty>
      );
    }

    return (
      <>
        <Table
          dataSource={cart.items}
          columns={columns}
          rowKey="productId"
          pagination={false}
          bordered
          className="cart-table"
          rowClassName="cart-table-row"
        />
        <Divider />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          <div>
            <Text type="secondary">
              Tổng số sản phẩm: <Text strong>{cart.items.length}</Text>
            </Text>
          </div>
          <Space>
            <Popconfirm
              title="Xóa giỏ hàng"
              description="Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?"
              onConfirm={handleClearCart}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa giỏ hàng
              </Button>
            </Popconfirm>
          </Space>
        </div>
        <div
          style={{
            backgroundColor: "#f8f8f8",
            borderRadius: "8px",
            padding: "15px 20px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            Tổng tiền:{" "}
            <Text style={{ color: "#f50", fontSize: 20 }}>
              {formattedTotalPrice}
            </Text>
          </Title>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/checkout")}
            style={{ height: "48px", fontSize: "16px" }}
            icon={<ArrowRightOutlined />}
          >
            Tiến hành thanh toán
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: "Giỏ hàng" },
        ]}
      />

      <Card
        title={
          <Space style={{ display: "flex", alignItems: "center" }}>
            <ShoppingCartOutlined style={{ fontSize: "24px" }} />
            <Title level={4} style={{ margin: 0 }}>
              Giỏ hàng của tôi
            </Title>
          </Space>
        }
        bordered={false}
        className="cart-container"
        style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.08)" }}
      >
        {renderCartContent()}
      </Card>
    </>
  );
}

import { useState, useEffect } from "react";
import { Table, Button, InputNumber, Card } from "antd";
import {
  addCartItem,
  clearCart,
  getCartByUser,
  removeItem,
} from "../../api/cart";
import { useSelector } from "react-redux";
import { getToken } from "../../services/localStorageService";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    const getCartData = async () => {
      if (getToken()) {
        const data = await getCartByUser(userId);
        setCart(data);
      } else {
        // Guest cart từ localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || { items: [] };
        setCart(guestCart);
      }
    };
    getCartData();
  }, [userId, navigate]);

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
      }
      return updatedCart;
    });

    if (updateTimeout) clearTimeout(updateTimeout);
    setUpdateTimeout(
      setTimeout(async () => {
        if (getToken()) {
          await addCartItem({ userId, productId, quantity });
        }
      }, 500)
    );
  };

  const handleRemoveItem = async (productId) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        items: prevCart.items.filter((item) => item.productId !== productId),
      };
      if (!getToken()) {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      }
      return updatedCart;
    });

    if (getToken()) {
      await removeItem(userId, productId);
    }
  };

  const handleClearCart = async () => {
    setCart({ items: [] });
    if (getToken()) {
      await clearCart(userId);
    } else {
      localStorage.removeItem("guestCart");
    }
  };

  const totalPrice =
    cart?.items
      .reduce(
        (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
        0
      )
      .toLocaleString("vi-VN") + "đ";

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
      render: (_, item) => (
        <InputNumber
          min={1}
          max={100}
          value={item.quantity}
          onChange={(value) => updateQuantity(item.productId, value)}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, item) =>
        ((item.discountPrice || item.price) * item.quantity).toLocaleString(
          "vi-VN"
        ) + "đ",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, item) => (
        <Button
          danger
          type="link"
          onClick={() => handleRemoveItem(item.productId)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Card title="Giỏ hàng">
      <Table
        dataSource={cart?.items}
        columns={columns}
        rowKey="productId"
        pagination={false}
      />
      {cart && cart.items.length !== 0 && (
        <>
          <h3 style={{ marginTop: 10 }}>Tổng tiền: {totalPrice}</h3>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" style={{ marginRight: 10 }} onClick={() => navigate("/checkout")}>
              Thanh toán
            </Button>
            <Button danger onClick={handleClearCart}>
              Xóa giỏ hàng
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Col,
  message,
  Row,
  Tag,
  Rate,
  Badge,
  Card,
  Typography,
  Space,
  Tooltip,
} from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addCartItem } from "../api/cart";
import { getWishListByUser, toggleWishlist } from "../api/wishList";
import { useCategories } from "../context/CategoryContext";
import { getToken } from "../services/localStorageService";

const { Text, Title } = Typography;

export default function ProductItem({ data }) {
  const [wishlist, setWishlist] = useState({});
  const userId = useSelector((state) => state.user.id);
  const categories = useCategories();

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.code] = category.name;
    return acc;
  }, {});

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishListByUser(userId, 1, 50);
        const likedProducts = response.data;
        const wishlistMap = likedProducts.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        setWishlist(wishlistMap);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách wishlist:", error);
      }
    };

    const loadGuestWishlist = () => {
      const guestWishlist =
        JSON.parse(localStorage.getItem("guestWishlist")) || {};
      setWishlist(guestWishlist);
    };

    if (getToken() && userId) {
      fetchWishlist();
    } else {
      loadGuestWishlist();
    }
  }, [userId]);

  const handleToggleWishlist = async (productId, product) => {
    const isFavorite = !!wishlist[productId];
    const newWishlist = { ...wishlist };

    if (getToken() && userId) {
      try {
        await toggleWishlist(userId, productId);
        if (isFavorite) {
          delete newWishlist[productId];
        } else {
          newWishlist[productId] = product;
        }
        setWishlist(newWishlist);
        isFavorite
          ? message.error("Đã xóa khỏi danh sách yêu thích")
          : message.success("Đã thêm vào danh sách yêu thích");
      } catch (error) {
        console.error("Lỗi khi cập nhật wishlist:", error);
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
        setWishlist(wishlist);
      }
    } else {
      if (isFavorite) {
        delete newWishlist[productId];
      } else {
        newWishlist[productId] = product;
      }
      localStorage.setItem("guestWishlist", JSON.stringify(newWishlist));
      setWishlist(newWishlist);
      isFavorite
        ? message.error("Đã xóa khỏi danh sách yêu thích")
        : message.success("Đã thêm vào danh sách yêu thích");
    }
  };

  // Function to dispatch cart update event
  const dispatchCartUpdatedEvent = () => {
    const cartUpdatedEvent = new Event("cartUpdated");
    window.dispatchEvent(cartUpdatedEvent);
  };

  const handleAddToCart = debounce(async (product) => {
    if (!getToken()) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
        items: [],
      };
      const existingItem = guestCart.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        guestCart.items.push({
          productId: product.id,
          productCode: product.code,
          productName: product.name,
          price: product.price,
          discountPrice: product.discountPrice || null,
          quantity: 1,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      console.log("Giỏ hàng guest:", guestCart);
      message.success("Đã thêm vào giỏ hàng");

      // Trigger cart update event for guest
      dispatchCartUpdatedEvent();
      return;
    }

    try {
      const data = {
        userId: userId,
        productId: product.id,
        quantity: 1,
        updatedQuantity: 1,
      };
      await addCartItem(data);
      message.success("Đã thêm vào giỏ hàng");

      // Trigger cart update event for logged-in user
      dispatchCartUpdatedEvent();
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }, 500);

  return (
    <Row gutter={[16, 24]} className="product-grid" style={{ marginTop: 16 }}>
      {data.map((product) => (
        <Col xl={6} lg={8} md={12} sm={24} xs={24} key={product.code}>
          <Badge.Ribbon
            text={product.discountName || " "}
            color="orange"
            style={{ display: product.discountName ? "block" : "none" }}
          >
            <Card
              hoverable
              className="product-card"
              cover={
                <Link to={`/products/${product.code}`}>
                  <div
                    className="image-container"
                    style={{
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "#f5f5f5",
                    }}
                  >
                    <img
                      src="/logo/wallpaperflare.com_wallpaper.jpg"
                      alt={product.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Link>
              }
              actions={[
                <Tooltip
                  title={
                    wishlist[product.id]
                      ? "Xóa khỏi danh sách yêu thích"
                      : "Thêm vào danh sách yêu thích"
                  }
                >
                  <span
                    onClick={() => handleToggleWishlist(product.id, product)}
                    style={{
                      color: wishlist[product.id]
                        ? "#ff4d4f"
                        : "rgba(0, 0, 0, 0.45)",
                      fontSize: 20,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {wishlist[product.id] ? <HeartFilled /> : <HeartOutlined />}
                  </span>
                </Tooltip>,
                <Rate
                  disabled
                  allowHalf
                  value={Math.round(product.avgRating * 2) / 2}
                  style={{ fontSize: 14 }}
                />,
                product.inventoryQuantity > 0 ? (
                  <Tooltip title="Thêm vào giỏ hàng">
                    <span
                      onClick={() => handleAddToCart(product)}
                      style={{
                        fontSize: 20,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ShoppingCartOutlined />
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title="Hết hàng">
                    <span
                      style={{
                        color: "rgba(0, 0, 0, 0.25)",
                        fontSize: 20,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ShoppingCartOutlined />
                    </span>
                  </Tooltip>
                ),
              ]}
            >
              <Link
                to={`/products/${product.code}`}
                style={{ color: "inherit" }}
              >
                <Space direction="vertical" size={0} style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {categoryMap[product.categoryCode]}
                  </Text>
                  <Title
                    level={5}
                    ellipsis={{ rows: 2 }}
                    style={{ marginTop: 0, height: 48, overflow: "hidden" }}
                  >
                    {product.name}
                  </Title>
                  <Space align="baseline">
                    {product.discountPrice ? (
                      <>
                        <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                          {product.discountPrice?.toLocaleString("vi-VN")}đ
                        </Text>
                        <Text delete type="secondary" style={{ fontSize: 14 }}>
                          {product.price?.toLocaleString("vi-VN")}đ
                        </Text>
                      </>
                    ) : (
                      <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                        {product.price?.toLocaleString("vi-VN")}đ
                      </Text>
                    )}
                  </Space>
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <Text type="secondary" size="small">
                      Đã bán: <Text strong>{product.soldQuantity}</Text>
                    </Text>
                    {product.inventoryQuantity === 0 && (
                      <Tag color="red">Hết hàng</Tag>
                    )}
                  </Space>
                </Space>
              </Link>
            </Card>
          </Badge.Ribbon>
        </Col>
      ))}
    </Row>
  );
}

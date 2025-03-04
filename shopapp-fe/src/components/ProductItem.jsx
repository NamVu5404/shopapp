import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Col, message, Row, Tag } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addCartItem } from "../api/cart";
import { getWishListByUser, toggleWishlist } from "../api/wishList";
import { useCategories } from "../context/CategoryContext";
import { getToken } from "../services/localStorageService";

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
        const response = await getWishListByUser(userId, 1, 100);
        const likedProducts = response.data;
        const wishlistMap = likedProducts.reduce((acc, item) => {
          acc[item.id] = item; // Lưu toàn bộ thông tin sản phẩm từ API
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
      // User đã đăng nhập, gọi API
      try {
        await toggleWishlist(userId, productId);
        if (isFavorite) {
          delete newWishlist[productId];
        } else {
          newWishlist[productId] = product; // Lưu toàn bộ thông tin sản phẩm
        }
        setWishlist(newWishlist);
        isFavorite
          ? message.error("Đã xóa khỏi danh sách yêu thích")
          : message.success("Đã thêm vào danh sách yêu thích");
      } catch (error) {
        console.error("Lỗi khi cập nhật wishlist:", error);
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
        setWishlist(wishlist); // Rollback nếu thất bại
      }
    } else {
      // User chưa đăng nhập, lưu vào localStorage
      if (isFavorite) {
        delete newWishlist[productId];
      } else {
        newWishlist[productId] = product; // Lưu toàn bộ thông tin sản phẩm
      }
      localStorage.setItem("guestWishlist", JSON.stringify(newWishlist));
      setWishlist(newWishlist);
      isFavorite
        ? message.error("Đã xóa khỏi danh sách yêu thích")
        : message.success("Đã thêm vào danh sách yêu thích");
    }
  };

  const handleAddToCart = debounce(async (product) => {
    if (!getToken()) {
      // Lấy giỏ hàng guest từ localStorage
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
      console.log("Giỏ hàng guest:", guestCart); // Kiểm tra dữ liệu lưu
      message.success("Đã thêm vào giỏ hàng");
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
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }, 500);

  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 16, color: "var(--primary-color)" }}
      >
        {data.map((product) => (
          <Col xl={6} key={product.code}>
            <div
              style={{
                padding: 0,
                borderRadius: "8px",
                overflow: "hidden",
                height: "auto",
                border: "1px solid #ccc",
              }}
            >
              <Link to={`/products/${product.code}`}>
                <img
                  src="/logo/wallpaperflare.com_wallpaper.jpg"
                  alt="Product"
                  style={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "contain",
                    display: "block",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                />
                <Tag color="orange">
                  <b>{product.discountName}</b>
                </Tag>
              </Link>

              <div style={{ padding: 8 }}>
                <h4 style={{ marginBottom: 16 }}>
                  [
                  <span style={{ fontSize: 12 }}>
                    {categoryMap[product.categoryCode]}
                  </span>
                  ] {product.name}
                </h4>
                {product.discountPrice ? (
                  <>
                    <h3 style={{ color: "red", marginBottom: 5 }}>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "red",
                          marginRight: 5,
                        }}
                      >
                        {product.discountPrice?.toLocaleString("vi-VN")}đ
                      </span>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "gray",
                          fontSize: 14,
                        }}
                      >
                        {product.price?.toLocaleString("vi-VN")}đ
                      </span>
                    </h3>
                  </>
                ) : (
                  <>
                    <h3 style={{ color: "red", marginBottom: 5 }}>
                      {product.price?.toLocaleString("vi-VN") + "đ"}
                    </h3>
                  </>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>
                    Đã bán: <b>{product.soldQuantity}</b>
                  </p>
                  {product.inventoryQuantity === 0 && (
                    <Tag color="red">
                      <b>Hết hàng</b>
                    </Tag>
                  )}
                </div>

                {/* Nút yêu thích và giỏ hàng */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 5,
                    gap: 15,
                  }}
                >
                  <span
                    style={{
                      fontSize: 24,
                      cursor: "pointer",
                      color: wishlist[product.id] ? "red" : "gray",
                    }}
                    onClick={() => handleToggleWishlist(product.id, product)}
                  >
                    {wishlist[product.id] ? <HeartFilled /> : <HeartOutlined />}
                  </span>
                  {product.inventoryQuantity !== 0 && (
                    <span
                      style={{
                        fontSize: 24,
                        cursor: "pointer",
                      }}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartOutlined />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
}

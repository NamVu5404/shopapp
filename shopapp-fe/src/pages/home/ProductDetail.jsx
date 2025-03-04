import { Button, Col, InputNumber, message, Row, Tag } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { FaTruckFast } from "react-icons/fa6";
import { MdSwapHorizontalCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addCartItem } from "../../api/cart";
import { getProductByCode, searchProduct } from "../../api/product";
import MyButton from "../../components/MyButton";
import ProductItem from "../../components/ProductItem";
import { useCategories } from "../../context/CategoryContext";
import { getToken } from "../../services/localStorageService";

export default function ProductDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedData, setRelatedData] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const categories = useCategories();

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.code] = category.name;
    return acc;
  }, {});

  useEffect(() => {
    const getProductDetail = async () => {
      const data = await getProductByCode(code);
      data ? setProductDetail(data) : navigate("/404-not-found");
    };

    getProductDetail();
  }, [code, navigate]);

  useEffect(() => {
    const getProduct = async () => {
      const request = {
        id: "",
        categoryCode: productDetail?.categoryCode ?? "",
        supplierCode: productDetail?.supplierCode ?? "",
        code: "",
        name: "",
        minPrice: "",
        maxPrice: "",
      };

      const data = await searchProduct(request, 1, 4);
      setRelatedData(data);
    };

    getProduct();
  }, [productDetail]);

  const handleAddToCart = debounce(async (product, isBuy) => {
    if (!getToken()) {
      // Lấy giỏ hàng guest từ localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
        items: [],
      };
      const existingItem = guestCart.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.items.push({
          productId: product.id,
          productCode: product.code,
          productName: product.name,
          price: product.price,
          discountPrice: product.discountPrice || null,
          quantity: quantity,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      console.log("Giỏ hàng guest:", guestCart); // Kiểm tra dữ liệu lưu
      if (!isBuy) message.success("Đã thêm vào giỏ hàng");
      else navigate("/checkout");
      return;
    }

    const data = {
      userId: userId,
      productId: product.id,
      quantity: quantity,
      updatedQuantity: quantity,
    };

    await addCartItem(data);

    if (isBuy) {
      navigate("/checkout");
    }
  }, 500);

  return (
    <>
      {productDetail && (
        <div style={{ color: "var(--primary-color)" }}>
          <Row gutter={[30]} style={{ marginBottom: 20 }}>
            <Col xl={14}>
              <img
                src="/logo/wallpaperflare.com_wallpaper.jpg"
                alt="Product"
                style={{
                  width: "100%",
                  maxHeight: 750,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Col>

            <Col xl={10}>
              <h2 style={{ fontSize: 26, marginBottom: 10 }}>
                [
                <span style={{ fontSize: 18 }}>
                  {categoryMap[productDetail.categoryCode]}
                </span>
                ] {productDetail.name}
              </h2>

              <p style={{ marginBottom: 20 }}>
                Mã sản phẩm: {productDetail.code}
              </p>

              {productDetail.discountPrice ? (
                <>
                  <div>
                    <Tag color="orange">
                      <b>{productDetail.discountName}</b>
                    </Tag>
                  </div>
                  <h2 style={{ color: "red", marginBottom: 20 }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "red",
                        marginRight: 10,
                      }}
                    >
                      {productDetail.discountPrice?.toLocaleString("vi-VN")}đ
                    </span>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "gray",
                        fontSize: 18,
                      }}
                    >
                      {productDetail.price?.toLocaleString("vi-VN")}đ
                    </span>
                  </h2>
                </>
              ) : (
                <>
                  <h2 style={{ color: "red", marginBottom: 20 }}>
                    {productDetail.price?.toLocaleString("vi-VN") + "đ"}
                  </h2>
                </>
              )}

              <p style={{ marginBottom: 20 }}>{productDetail.description}</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <p>
                  Đã bán: <b>{productDetail.soldQuantity}</b>
                </p>
              </div>

              <div style={{ marginBottom: 10 }}>
                Số lượng: {` `}
                <InputNumber
                  min={1}
                  max={100}
                  defaultValue={1}
                  onChange={(quantity) => setQuantity(quantity)}
                  onBeforeInput={(event) => {
                    if (!/^\d+$/.test(event.data)) {
                      event.preventDefault();
                    }
                  }}
                />
              </div>

              <div>
                {productDetail.inventoryQuantity ? (
                  <>
                    <MyButton
                      style={{
                        width: "100%",
                        height: 40,
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                      onClick={() => handleAddToCart(productDetail, true)}
                    >
                      Mua ngay
                    </MyButton>
                    <Button
                      style={{
                        width: "100%",
                        height: 40,
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                      onClick={() => handleAddToCart(productDetail, false)}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </>
                ) : (
                  <>
                    <MyButton
                      style={{
                        width: "100%",
                        height: 40,
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                      disabled={true}
                    >
                      Hết hàng
                    </MyButton>
                  </>
                )}

                <div
                  style={{
                    fontSize: 16,
                    marginTop: 20,
                  }}
                >
                  <div style={{ marginBottom: 20, display: "flex" }}>
                    <FaTruckFast style={{ fontSize: 50, marginRight: 20 }} />
                    <div>
                      <p>
                        <b>Miễn phí vận chuyển</b>
                      </p>
                      <p>Giao hỏa tốc Hồ Chí Minh & Hà Nội</p>
                    </div>
                  </div>

                  <div style={{ display: "flex" }}>
                    <MdSwapHorizontalCircle
                      style={{ fontSize: 50, marginRight: 20 }}
                    />
                    <div>
                      <p>
                        <b>Hỗ trợ bảo hành</b>
                      </p>
                      <p>Đổi trả trong 7 ngày</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <h3>Sản phẩm cùng loại</h3>
          {relatedData && <ProductItem data={relatedData.data} />}
        </div>
      )}
    </>
  );
}

import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  InputNumber,
  List,
  message,
  Popconfirm,
  Rate,
  Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { FaTruckFast } from "react-icons/fa6";
import { MdSwapHorizontalCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addCartItem } from "../../api/cart";
import { getProductByCode, searchProduct } from "../../api/product";
import { deleteReiew, getProductReviews } from "../../api/review";
import MyButton from "../../components/MyButton";
import ProductItem from "../../components/ProductItem";
import { useCategories } from "../../context/CategoryContext";
import { getToken } from "../../services/localStorageService";
import { useSuppliers } from "../../context/SupplierContext";
import { hasPermission } from "../../services/authService";

const { Title, Text, Paragraph } = Typography;

export default function ProductDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedData, setRelatedData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewSize = 5;
  const [reviewTotal, setReviewTotal] = useState(0);
  const userId = useSelector((state) => state.user.id);
  const categories = useCategories();
  const suppliers = useSuppliers();

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.code] = category.name;
    return acc;
  }, {});

  const supplierMap = suppliers.reduce((acc, supplier) => {
    acc[supplier.code] = supplier.name;
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

      // Lấy 5 sản phẩm thay vì 4 để đề phòng trường hợp 1 sản phẩm bị loại bỏ
      const response = await searchProduct(request, 1, 5);
      const data = response.data;

      // Lọc bỏ sản phẩm hiện tại (giả sử sản phẩm có thuộc tính id để so sánh)
      const filteredData = data.filter((item) => item.id !== productDetail?.id);

      // Chỉ lấy 4 sản phẩm đầu tiên
      setRelatedData(filteredData.slice(0, 4));
    };

    getProduct();
  }, [productDetail]);

  // Lấy đánh giá sản phẩm
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productDetail) return;

      try {
        setReviewsLoading(true);
        const response = await getProductReviews(
          productDetail.id,
          reviewPage,
          reviewSize
        );
        setReviews(response.data);
        setReviewTotal(response.totalElements);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productDetail, reviewPage, reviewSize]);

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

      // Kích hoạt sự kiện để cập nhật cartCount trong Header cho guest user
      window.dispatchEvent(new Event("cartUpdated"));

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

    if (isBuy) navigate("/checkout");
    else message.success("Đã thêm vào giỏ hàng");

    // Kích hoạt sự kiện để cập nhật cartCount trong Header cho guest user
    window.dispatchEvent(new Event("cartUpdated"));
  }, 500);

  // Format date for reviews
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!productDetail) {
    return (
      <div style={{ padding: "40px 0" }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  const handleDelReview = async (id) => {
    await deleteReiew(id);
  };

  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to="/products">Sản phẩm</Link> },
          { title: productDetail.name },
        ]}
      />

      <Card bordered={false} style={{ marginBottom: 24, overflow: "hidden" }}>
        <Row gutter={[40, 20]}>
          {/* Product image */}
          <Col xs={24} sm={24} md={12} lg={14} xl={14}>
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 8,
                padding: 16,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <img
                src="/logo/wallpaperflare.com_wallpaper.jpg"
                alt={productDetail.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 500,
                  objectFit: "contain",
                }}
              />
            </div>
          </Col>

          {/* Product information */}
          <Col xs={24} sm={24} md={12} lg={10} xl={10}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Product title and category */}
              <div>
                <Tag color="blue" style={{ marginBottom: 8 }}>
                  {categoryMap[productDetail.categoryCode]}
                </Tag>
                <Tag color="green" style={{ marginBottom: 8 }}>
                  {supplierMap[productDetail.supplierCode]}
                </Tag>
                <Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
                  {productDetail.name}
                </Title>
                <Text type="secondary">Mã sản phẩm: {productDetail.code}</Text>
              </div>

              {/* Ratings */}
              <Space align="center">
                <Rate
                  disabled
                  allowHalf
                  value={Math.round(productDetail.avgRating * 2) / 2}
                  style={{ fontSize: 16 }}
                />
                <Text>{productDetail.avgRating?.toFixed(1) || 0}</Text>
                <Divider type="vertical" />
                <Text type="secondary">
                  ({productDetail.reviewCount || 0} đánh giá)
                </Text>
                <Divider type="vertical" />
                <Text>
                  Đã bán: <Text strong>{productDetail.soldQuantity}</Text>
                </Text>
              </Space>

              {/* Price section with discount */}
              <Card
                style={{
                  background: productDetail.discountPrice
                    ? "#fff8f0"
                    : "#f8f8f8",
                  borderColor: productDetail.discountPrice
                    ? "#ffbb96"
                    : "#e8e8e8",
                }}
                bodyStyle={{ padding: 16 }}
              >
                {productDetail.discountPrice ? (
                  <>
                    <Space direction="vertical" size="small">
                      {productDetail.discountName && (
                        <Badge.Ribbon
                          text={productDetail.discountName}
                          color="orange"
                        >
                          <div style={{ height: 5 }}></div>
                        </Badge.Ribbon>
                      )}
                      <div
                        style={{
                          marginTop: productDetail.discountName ? 20 : 0,
                        }}
                      >
                        <Title
                          level={2}
                          style={{ color: "#f5222d", margin: 0 }}
                        >
                          {productDetail.discountPrice?.toLocaleString("vi-VN")}
                          đ
                        </Title>
                        <Text delete type="secondary" style={{ fontSize: 16 }}>
                          {productDetail.price?.toLocaleString("vi-VN")}đ
                        </Text>
                      </div>
                    </Space>
                  </>
                ) : (
                  <Title level={2} style={{ color: "#f5222d", margin: 0 }}>
                    {productDetail.price?.toLocaleString("vi-VN")}đ
                  </Title>
                )}
              </Card>

              {/* Product description */}
              <div>
                <Title level={5}>Mô tả sản phẩm</Title>
                <Paragraph>{productDetail.description}</Paragraph>
              </div>

              {/* Quantity selector */}
              <Space align="center">
                <Text strong>Số lượng:</Text>
                <InputNumber
                  min={1}
                  max={productDetail.inventoryQuantity || 100}
                  value={quantity}
                  onChange={(qty) => setQuantity(qty)}
                  style={{ width: 100 }}
                />
                {productDetail.inventoryQuantity > 0 ? (
                  <Text type="success">Còn hàng</Text>
                ) : (
                  <Text type="danger">Hết hàng</Text>
                )}
              </Space>

              {/* Action buttons */}
              <Space direction="vertical" style={{ width: "100%" }}>
                {productDetail.inventoryQuantity > 0 ? (
                  <>
                    <MyButton
                      type="primary"
                      size="large"
                      style={{
                        width: "100%",
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                      onClick={() => handleAddToCart(productDetail, true)}
                    >
                      MUA NGAY
                    </MyButton>
                    <Button
                      size="large"
                      style={{
                        width: "100%",
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                      onClick={() => handleAddToCart(productDetail, false)}
                    >
                      THÊM VÀO GIỎ HÀNG
                    </Button>
                  </>
                ) : (
                  <Button
                    danger
                    size="large"
                    disabled
                    style={{
                      width: "100%",
                      height: 48,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    HẾT HÀNG
                  </Button>
                )}
              </Space>

              {/* Shipping and return policy info */}
              <Card style={{ backgroundColor: "#f8f8f8" }}>
                <Space direction="vertical" size="middle">
                  <Space align="start">
                    <div
                      style={{
                        backgroundColor: "#e6f7ff",
                        padding: 12,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaTruckFast style={{ fontSize: 24, color: "#1890ff" }} />
                    </div>
                    <div>
                      <Text strong>Miễn phí vận chuyển</Text>
                      <br />
                      <Text type="secondary">
                        Giao hỏa tốc Hồ Chí Minh & Hà Nội
                      </Text>
                    </div>
                  </Space>

                  <Space align="start">
                    <div
                      style={{
                        backgroundColor: "#f6ffed",
                        padding: 12,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MdSwapHorizontalCircle
                        style={{ fontSize: 24, color: "#52c41a" }}
                      />
                    </div>
                    <div>
                      <Text strong>Hỗ trợ bảo hành</Text>
                      <br />
                      <Text type="secondary">Đổi trả trong 7 ngày</Text>
                    </div>
                  </Space>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Reviews section */}
      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              Đánh giá sản phẩm
            </Title>
            <Tag color="blue">{reviewTotal}</Tag>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {reviewsLoading ? (
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        ) : reviews.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={reviews}
            pagination={{
              onChange: (page) => setReviewPage(page),
              pageSize: reviewSize,
              total: reviewTotal,
              current: reviewPage,
            }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: "#1890ff" }}>
                      {item.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong>{item.fullName}</Text>
                      <Tooltip title={formatDate(item.createdDate)}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDate(item.createdDate)}
                        </Text>
                      </Tooltip>
                      {hasPermission(["ROLE_ADMIN"]) && (
                        <Popconfirm
                          title="Bạn chắc chắn muốn xóa đánh giá này?"
                          onConfirm={() => handleDelReview(item.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="link" danger>
                            Xóa
                          </Button>
                        </Popconfirm>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <Rate
                        disabled
                        value={item.rating}
                        style={{ fontSize: 14, marginBottom: 8 }}
                      />
                      <Paragraph style={{ margin: 0 }}>
                        {item.comment}
                      </Paragraph>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="Chưa có đánh giá nào cho sản phẩm này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {/* Related products */}
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Sản phẩm cùng loại
          </Title>
        }
        style={{ marginBottom: 24 }}
      >
        {relatedData && <ProductItem data={relatedData} />}
      </Card>
    </>
  );
}

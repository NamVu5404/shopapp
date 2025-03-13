import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Tooltip,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllDiscount } from "../../api/discount";
import {
  deleteProduct,
  getProductByCode,
  updateProduct,
} from "../../api/product";
import MyButton from "../../components/MyButton";
import { useCategories } from "../../context/CategoryContext";
import { useSuppliers } from "../../context/SupplierContext";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function ProductDetailAdmin() {
  const [form] = Form.useForm();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const categories = useCategories();
  const suppliers = useSuppliers();
  const { code } = useParams();
  const navigate = useNavigate();
  const [discountData, setDiscountData] = useState(null);

  useEffect(() => {
    const getProductDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductByCode(code);
        setProductDetail(data);
      } catch (error) {
        message.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    getProductDetail();
  }, [code, navigate]);

  useEffect(() => {
    if (productDetail) {
      form.setFieldsValue({
        ...productDetail,
        createdBy: productDetail.createdBy,
        createdDate: productDetail.createdDate
          ? dayjs(productDetail.createdDate)
          : null,
        modifiedDate: productDetail.modifiedDate
          ? dayjs(productDetail.modifiedDate)
          : null,
        modifiedBy: productDetail.modifiedBy,
      });
    }
  }, [productDetail, form]);

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.code] = category.id;
    return acc;
  }, {});

  const supplierMap = suppliers.reduce((acc, supplier) => {
    acc[supplier.code] = supplier.id;
    return acc;
  }, {});

  const handleCancel = () => {
    confirm({
      title: "Hủy thay đổi?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Bạn có chắc chắn muốn hủy các thay đổi? Tất cả dữ liệu chưa lưu sẽ bị mất.",
      onOk() {
        form.resetFields();
        if (productDetail) {
          form.setFieldsValue({
            ...productDetail,
            createdDate: dayjs(productDetail.createdDate),
            modifiedDate: dayjs(productDetail.modifiedDate),
          });
        }
        message.info("Đã hủy thay đổi");
      },
    });
  };

  const onSubmit = async (values) => {
    confirm({
      title: "Xác nhận cập nhật",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn cập nhật thông tin sản phẩm này?",
      async onOk() {
        setSaveLoading(true);
        try {
          const discountId =
            discountData.find((d) => d.name === values.discountName)?.id ||
            values.discountName ||
            null;

          const data = {
            categoryId: categoryMap[values.categoryCode],
            supplierId: supplierMap[values.supplierCode],
            name: values.name,
            description: values.description,
            price: values.price,
            discountId: discountId,
          };

          await updateProduct(values.id, data);

          // Reload product data after update
          const updatedProduct = await getProductByCode(code);
          setProductDetail(updatedProduct);
        } catch (error) {
          message.error("Cập nhật sản phẩm thất bại");
        } finally {
          setSaveLoading(false);
        }
      },
    });
  };

  const handleDelete = () => {
    confirm({
      title: "Xác nhận xóa sản phẩm",
      icon: <ExclamationCircleOutlined />,
      content:
        "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      async onOk() {
        setDeleteLoading(true);
        try {
          await deleteProduct(productDetail.id);
          navigate("/admin/products");
        } catch (error) {
          message.error("Xóa sản phẩm thất bại");
          setDeleteLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    const getDiscounts = async () => {
      try {
        const data = await getAllDiscount();
        setDiscountData(data);
      } catch (error) {
        message.error("Không thể tải danh sách mã giảm giá");
      }
    };

    getDiscounts();
  }, []);

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: <Link to="/admin/products">Quản lý sản phẩm</Link> },
          { title: productDetail?.name || "Chi tiết sản phẩm" },
        ]}
      />

      <Card
        loading={loading}
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              {productDetail?.name || "Chi tiết sản phẩm"}
            </Title>
          </Space>
        }
        extra={
          <Space>
            <Tooltip title="Hủy thay đổi">
              <Button onClick={handleCancel} icon={<ReloadOutlined />}>
                Hủy
              </Button>
            </Tooltip>
            <Tooltip title="Cập nhật sản phẩm">
              <MyButton
                type="primary"
                icon={<SaveOutlined />}
                loading={saveLoading}
                onClick={() => form.submit()}
              >
                Cập nhật
              </MyButton>
            </Tooltip>
            <Tooltip title="Xóa sản phẩm">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={deleteLoading}
              >
                Xóa
              </Button>
            </Tooltip>
            {productDetail && (
              <Tooltip title="Xem lịch sử nhập kho">
                <Link
                  to={`/admin/inventory-receipt-details?productId=${productDetail.id}`}
                  state={{
                    productCode: productDetail.code,
                    productName: productDetail.name,
                  }}
                >
                  <Button type="primary" ghost icon={<HistoryOutlined />}>
                    Lịch sử nhập kho
                  </Button>
                </Link>
              </Tooltip>
            )}
          </Space>
        }
        style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Row gutter={[24, 0]}>
            <Col span={24} lg={8}>
              <Form.Item label="ID" name="id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24} lg={16}>
              <Form.Item label="Mã sản phẩm" name="code">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Space>
              <ShopOutlined />
              <span>Thông tin cơ bản</span>
            </Space>
          </Divider>

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Row gutter={[24, 0]}>
            <Col span={24} lg={12}>
              <Form.Item
                label="Danh mục"
                name="categoryCode"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  showSearch
                  optionFilterProp="children"
                >
                  {categories.map((category) => (
                    <Select.Option key={category.code} value={category.code}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24} lg={12}>
              <Form.Item
                label="Hãng sản xuất"
                name="supplierCode"
                rules={[
                  { required: true, message: "Vui lòng chọn hãng sản xuất!" },
                ]}
              >
                <Select
                  placeholder="Chọn hãng sản xuất"
                  showSearch
                  optionFilterProp="children"
                >
                  {suppliers.map((supplier) => (
                    <Select.Option key={supplier.code} value={supplier.code}>
                      {supplier.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Space>
              <TagOutlined />
              <span>Giá và khuyến mãi</span>
            </Space>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col span={24} lg={8}>
              <Form.Item
                label="Giá gốc"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber
                  min={0}
                  max={1e9}
                  addonAfter="VNĐ"
                  placeholder="Nhập giá"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>

            <Col span={24} lg={8}>
              <Form.Item label="Giá sau giảm" name="discountPrice">
                <InputNumber
                  disabled
                  style={{ width: "100%" }}
                  addonAfter="VNĐ"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>

            <Col span={24} lg={8}>
              <Form.Item label="Chọn mã giảm giá" name="discountName">
                {discountData && (
                  <Select
                    placeholder="--- Chọn mã giảm giá ---"
                    style={{ width: "100%" }}
                  >
                    <Select.Option value={""}>Bỏ chọn</Select.Option>
                    {discountData.map((discount) => (
                      <Select.Option key={discount.id} value={discount.name}>
                        {discount.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          {productDetail?.discountPrice && productDetail?.price && (
            <div style={{ marginBottom: 24 }}>
              <Card
                size="small"
                style={{
                  background: "#f9f9f9",
                  border: "1px dashed #d9d9d9",
                }}
              >
                <Text>
                  Giá gốc:{" "}
                  <Text strong>{productDetail.price.toLocaleString()} VNĐ</Text>{" "}
                  → Giá khuyến mãi:{" "}
                  <Text strong type="danger">
                    {productDetail.discountPrice.toLocaleString()} VNĐ{" "}
                  </Text>
                  (Tiết kiệm:{" "}
                  {(
                    productDetail.price - productDetail.discountPrice
                  ).toLocaleString()}{" "}
                  VNĐ)
                </Text>
              </Card>
            </div>
          )}

          <Divider orientation="left">
            <Space>
              <ShoppingOutlined />
              <span>Thông tin kho hàng và đánh giá</span>
            </Space>
          </Divider>

          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Card size="small" bordered>
                <Statistic
                  title={<Text strong>Số lượng tồn kho</Text>}
                  value={productDetail?.inventoryQuantity || 0}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Form.Item name="inventoryQuantity" hidden>
                  <Input />
                </Form.Item>
              </Card>
            </Col>

            <Col span={8}>
              <Card size="small" bordered>
                <Statistic
                  title={<Text strong>Số lượng đã bán</Text>}
                  value={productDetail?.soldQuantity || 0}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Form.Item name="soldQuantity" hidden>
                  <Input />
                </Form.Item>
              </Card>
            </Col>

            <Col span={8}>
              <Card size="small" bordered>
                <div>
                  <Text strong>Đánh giá sản phẩm</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <Rate
                      disabled
                      value={Math.round(productDetail?.avgRating * 2) / 2 || 2.5}
                      allowHalf
                    />
                    <Text style={{ marginLeft: 8 }}>
                      {productDetail?.avgRating?.toFixed(1) || "0.0"}
                      <Text type="secondary">{` (${
                        productDetail?.reviewCount || 0
                      } đánh giá)`}</Text>
                    </Text>
                  </div>
                </div>
                <Form.Item name="point" hidden>
                  <Input />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Form.Item
            label="Mô tả sản phẩm"
            name="description"
            tooltip={{
              title: "Mô tả chi tiết về sản phẩm",
              icon: <InfoCircleOutlined />,
            }}
            style={{
              marginTop: 24,
            }}
          >
            <TextArea
              rows={6}
              placeholder="Nhập mô tả sản phẩm"
              showCount
              maxLength={5000}
            />
          </Form.Item>

          <Divider orientation="left">
            <Space>
              <InfoCircleOutlined />
              <span>Thông tin thêm</span>
            </Space>
          </Divider>

          <Row gutter={[24, 16]}>
            <Col span={24} md={12}>
              <Card size="small" title="Thông tin tạo" bordered>
                <Form.Item label="Ngày tạo" name="createdDate">
                  <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    disabled
                    format="DD/MM/YYYY HH:mm:ss"
                  />
                </Form.Item>

                <Form.Item label="Người tạo" name="createdBy">
                  <Input disabled />
                </Form.Item>
              </Card>
            </Col>

            <Col span={24} md={12}>
              <Card size="small" title="Thông tin cập nhật" bordered>
                <Form.Item label="Ngày cập nhật" name="modifiedDate">
                  <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    disabled
                    format="DD/MM/YYYY HH:mm:ss"
                  />
                </Form.Item>

                <Form.Item label="Người cập nhật" name="modifiedBy">
                  <Input disabled />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

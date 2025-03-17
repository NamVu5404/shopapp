import {
  AppstoreOutlined,
  BarcodeOutlined,
  CaretRightOutlined,
  DollarOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Rate,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addDiscountProduct, getAllDiscount } from "../../api/discount";
import { createProduct, searchProduct } from "../../api/product";
import ProductSeachForm from "../../components/ProductSeachForm";
import { useCategories } from "../../context/CategoryContext";
import { useSuppliers } from "../../context/SupplierContext";
import { hasPermission } from "../../services/authService";

const { Panel } = Collapse;
const { Text } = Typography;

// Improved ProductForm component
const ProductFormImproved = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const categories = useCategories();
  const suppliers = useSuppliers();

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="supplierId"
            label="Nhà cung cấp"
            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
          >
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map((supplier) => (
                <Select.Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="code"
        label="Mã sản phẩm"
        rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm!" }]}
      >
        <Input placeholder="Nhập mã sản phẩm" prefix={<BarcodeOutlined />} />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên sản phẩm"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input placeholder="Nhập tên sản phẩm" prefix={<AppstoreOutlined />} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá (VNĐ)"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
      >
        <InputNumber
          min={0}
          max={1e9}
          placeholder="Nhập giá sản phẩm"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          prefix={<DollarOutlined />}
        />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <TextArea
          rows={6}
          placeholder="Nhập mô tả sản phẩm"
          prefix={<FileTextOutlined />}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Thêm mới
        </Button>
      </Form.Item>
    </Form>
  );
};

const ProductAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [productData, setProductData] = useState([]);
  const [id, setId] = useState(queryParams.get("id") || "");
  const [categoryCode, setCategoryCode] = useState(
    queryParams.get("categoryCode") || ""
  );
  const [supplierCode, setSupplierCode] = useState(
    queryParams.get("supplierCode") || ""
  );
  const direc = queryParams.get("direction");

  const [code, setCode] = useState(queryParams.get("code") || "");
  const [name, setName] = useState(queryParams.get("name") || "");
  const [minPrice, setMinPrice] = useState(queryParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(queryParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "point");
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page"), 10) || 1
  );
  const pageSize = 20;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = useCategories();
  const suppliers = useSuppliers();
  const [direction, setDirection] = useState(direc || "DESC");

  // Get category and supplier names from codes
  const getCategoryName = (categoryCode) => {
    const category = categories.find((c) => c.code === categoryCode);
    return category ? category.name : categoryCode;
  };

  const getSupplierName = (supplierCode) => {
    const supplier = suppliers.find((s) => s.code === supplierCode);
    return supplier ? supplier.name : supplierCode;
  };

  // Function to update URL
  const updateURL = (newParams) => {
    const params = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });

    navigate(`?${params.toString()}`, { replace: true });
  };

  // Modal functions
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const showDiscountModal = () => {
    setIsDiscountModalVisible(true);
  };

  const handleCancelDiscountModal = () => {
    setIsDiscountModalVisible(false);
  };

  const handleCancel = () => {
    setCurrentPage(1);
    setId("");
    setCategoryCode("");
    setSupplierCode("");
    setCode("");
    setName("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("point");
    setDirection("DESC");
    form.resetFields();

    updateURL({}); // Reset URL when clearing filters
  };

  const handleSubmit = (values) => {
    const newParams = {
      id: values.id ?? id,
      categoryCode: values.categoryCode ?? categoryCode,
      supplierCode: values.supplierCode ?? supplierCode,
      code: values.code ?? code,
      name: values.name ?? name,
      minPrice: values.minPrice ?? minPrice,
      maxPrice: values.maxPrice ?? maxPrice,
      sortBy: values.sortBy ?? sortBy,
      direction: values.direction ?? direction,
      page: 1, // Reset to first page with new filters
    };

    setCurrentPage(1);
    setId(newParams.id);
    setCategoryCode(newParams.categoryCode);
    setSupplierCode(newParams.supplierCode);
    setCode(newParams.code);
    setName(newParams.name);
    setMinPrice(newParams.minPrice);
    setMaxPrice(newParams.maxPrice);
    setSortBy(newParams.sortBy);
    setDirection(newParams.direction);

    updateURL(newParams); // Update URL with new filters
  };

  useEffect(() => {
    const getDiscounts = async () => {
      try {
        const data = await getAllDiscount();
        setDiscountData(data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    getDiscounts();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const request = {
          id,
          categoryCode,
          supplierCode,
          code,
          name,
          minPrice,
          maxPrice,
        };
        const data = await searchProduct(
          request,
          currentPage,
          pageSize,
          sortBy,
          direction
        );
        setProductData(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();

    form.setFieldsValue({
      id,
      categoryCode,
      supplierCode,
      code,
      name,
      minPrice,
      maxPrice,
      sortBy,
    });
  }, [
    id,
    categoryCode,
    supplierCode,
    code,
    name,
    minPrice,
    maxPrice,
    sortBy,
    direction,
    currentPage,
    pageSize,
    form,
  ]);

  const handleAddDiscount = async (values) => {
    try {
      await addDiscountProduct(values.id, { productIds: selectedProducts });
      setIsDiscountModalVisible(false);

      // Refresh product list after adding discount
      const request = {
        id,
        categoryCode,
        supplierCode,
        code,
        name,
        minPrice,
        maxPrice,
      };
      const refreshedData = await searchProduct(
        request,
        currentPage,
        pageSize,
        sortBy
      );
      setProductData(refreshedData);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  const handleCreateProduct = async (values) => {
    try {
      await createProduct(values);
      setIsModalVisible(false);

      // Refresh product list after creating new product
      const request = {
        id,
        categoryCode,
        supplierCode,
        code,
        name,
        minPrice,
        maxPrice,
      };
      const refreshedData = await searchProduct(
        request,
        currentPage,
        pageSize,
        sortBy
      );
      setProductData(refreshedData);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Navigate to product detail
  const navigateToProductDetail = (id) => {
    navigate(`/admin/products/${id}`);
  };

  // Table row selection configuration
  const rowSelection = {
    selectedRowKeys: selectedProducts,
    onChange: (selectedRowKeys) => {
      setSelectedProducts(selectedRowKeys);
    },
  };

  // Columns definition
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Thông tin sản phẩm",
      key: "productInfo",
      render: (_, record) => (
        <Space>
          <img
            src="/logo/wallpaperflare.com_wallpaper.jpg"
            alt={record.productName}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
          <div style={{ cursor: "pointer" }}>
            <div>
              <Space direction="vertical" size={0}>
                <Text strong>{record.name || "N/A"}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Mã: {record.code}
                </Text>
              </Space>
            </div>
            {record.discountPrice && record.discountPrice < record.price && (
              <Tag color="orange">{record.discountName}</Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Danh mục & Hãng",
      key: "categorySupplier",
      render: (_, record) => (
        <Space direction="vertical" size={1}>
          <Tag color="blue">{getCategoryName(record.categoryCode)}</Tag>
          <Tag color="green">{getSupplierName(record.supplierCode)}</Tag>
        </Space>
      ),
      width: 200,
    },
    {
      title: "Giá",
      key: "price",
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
      width: 150,
    },
    {
      title: "Đã bán",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
      width: 100,
    },
    {
      title: "Tồn kho",
      dataIndex: "inventoryQuantity",
      key: "inventoryQuantity",
      width: 100,
      render: (inventoryQuantity) => (
        <Tag color={inventoryQuantity > 0 ? "processing" : "error"}>
          {inventoryQuantity}
        </Tag>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Rate
            disabled
            value={Math.round(record.avgRating * 2) / 2}
            allowHalf
            style={{ fontSize: 12 }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            ({record.reviewCount} đánh giá)
          </Text>
        </Space>
      ),
      width: 150,
    },
    {
      title: "",
      key: "actions",
      width: 10,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigateToProductDetail(record.code)}
            aria-label="Xem chi tiết"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: "Quản lý sản phẩm" },
        ]}
      />

      {/* Search Form */}
      <Collapse
        style={{
          borderRadius: "8px",
          marginBottom: 24,
        }}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            style={{ fontSize: "16px", color: "#1890ff" }}
          />
        )}
      >
        <Panel
          header={
            <div style={{ display: "flex", alignItems: "center" }}>
              <FilterOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              <span style={{ fontWeight: 500, fontSize: "15px" }}>
                Bộ lọc tìm kiếm
              </span>
            </div>
          }
          key="1"
          style={{ borderRadius: "8px", backgroundColor: "#fafafa" }}
        >
          <ProductSeachForm
            form={form}
            onSearch={handleSubmit}
            handleCancel={handleCancel}
          />
        </Panel>
      </Collapse>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {hasPermission(["ROLE_ADMIN", "ROLE_STAFF_SALE"]) && <Space>
          <Text strong>
            Tổng số: {productData?.totalElements || 0} sản phẩm
          </Text>
          <Button
            type="primary"
            danger
            disabled={!selectedProducts.length}
            onClick={showDiscountModal}
            icon={<TagOutlined />}
          >
            Thêm mã giảm giá ({selectedProducts.length})
          </Button>
        </Space>}
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm mới
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        dataSource={productData.data}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        bordered
        style={{ marginBottom: 16 }}
      />

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={productData.totalElements}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        title={
          <Space>
            <AppstoreOutlined />
            <span>Thêm mới sản phẩm</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        style={{ top: 20 }}
        width={600}
        destroyOnClose={true}
      >
        <ProductFormImproved onSubmit={handleCreateProduct} />
      </Modal>

      {/* Add Discount Modal */}
      {discountData && discountData.length > 0 && (
        <Modal
          title={
            <Space>
              <TagOutlined />
              <span>Áp dụng mã giảm giá</span>
            </Space>
          }
          open={isDiscountModalVisible}
          onCancel={handleCancelDiscountModal}
          footer={null}
          destroyOnClose={true}
        >
          <Form onFinish={handleAddDiscount} layout="vertical">
            <Form.Item
              name="id"
              label="Chọn mã giảm giá"
              rules={[
                { required: true, message: "Vui lòng chọn mã giảm giá!" },
              ]}
            >
              <Select placeholder="Chọn mã giảm giá">
                {discountData.map((discount) => (
                  <Select.Option key={discount.id} value={discount.id}>
                    {discount.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ marginBottom: 8 }}>
              <Text type="secondary">
                Đang chọn {selectedProducts.length} sản phẩm
              </Text>
            </div>

            <Button type="primary" htmlType="submit" block>
              Áp dụng
            </Button>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ProductAdmin;

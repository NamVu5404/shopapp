import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { createProduct, searchProduct } from "../../api/product";
import ListProductAdmin from "../../components/ListProductAdmin";
import MyButton from "../../components/MyButton";
import { useCategories } from "../../context/CategoryContext";
import { useSuppliers } from "../../context/SupplierContext";
import ProductSeachForm from "../../components/ProductSeachForm";
import { useLocation, useNavigate } from "react-router-dom";
import { addDiscountProduct, getAllDiscount } from "../../api/discount";

const ProductAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryQuery = queryParams.get("categoryCode");
  const supplierQuery = queryParams.get("supplierCode");

  const [id, setId] = useState(queryParams.get("id") || "");
  const [categoryCode, setCategoryCode] = useState(categoryQuery || "");
  const [supplierCode, setSupplierCode] = useState(supplierQuery || "");
  const [code, setCode] = useState(queryParams.get("code") || "");
  const [name, setName] = useState(queryParams.get("name") || "");
  const [minPrice, setMinPrice] = useState(queryParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(queryParams.get("maxPrice") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page"), 10) || 1
  );
  const pageSize = 20;
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const categories = useCategories();
  const suppliers = useSuppliers();
  const [data, setData] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [discountData, setDiscountData] = useState(null);

  // ✅ Hàm cập nhật URL
  const updateURL = (newParams) => {
    const params = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        // ❌ Không thêm page vào URL
        params.set(key, value);
      }
    });

    navigate(`?${params.toString()}`, { replace: true });
  };

  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
    createForm.resetFields();
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
    form.resetFields();

    updateURL({}); // ✅ Reset URL khi xoá bộ lọc
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
      page: 1, // Reset về trang đầu khi lọc mới
    };

    setCurrentPage(1);
    setId(newParams.id);
    setCategoryCode(newParams.categoryCode);
    setSupplierCode(newParams.supplierCode);
    setCode(newParams.code);
    setName(newParams.name);
    setMinPrice(newParams.minPrice);
    setMaxPrice(newParams.maxPrice);

    updateURL(newParams); // ✅ Cập nhật URL khi thay đổi bộ lọc
  };

  useEffect(() => {
    const getDiscounts = async () => {
      const data = await getAllDiscount();
      setDiscountData(data);
    };

    getDiscounts();
  }, []);

  useEffect(() => {
    setCategoryCode(categoryQuery || "");
    setSupplierCode(supplierQuery || "");

    form.setFieldsValue({
      categoryCode: categoryQuery || "",
      supplierCode: supplierQuery || "",
    });
  }, [categoryQuery, supplierQuery, form]);

  useEffect(() => {
    const getProduct = async () => {
      const request = {
        id,
        categoryCode,
        supplierCode,
        code,
        name,
        minPrice,
        maxPrice,
      };

      const data = await searchProduct(request, currentPage, pageSize);
      setData(data);
    };

    getProduct();

    form.setFieldsValue({
      id,
      categoryCode,
      supplierCode,
      code,
      name,
      minPrice,
      maxPrice,
    });
  }, [
    id,
    categoryCode,
    supplierCode,
    code,
    name,
    minPrice,
    maxPrice,
    currentPage,
    pageSize,
    form,
  ]);

  const submitCreateProduct = async (data) => {
    try {
      await createProduct(data);
      handleCancelModal();
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
    }
  };

  const handleAddDiscount = async (values) => {
    await addDiscountProduct(values.id, { productIds: selectedProducts });
    handleCancelDiscountModal();
  };

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Quản lý sản phẩm</h2>

      {/* Search Form */}
      <ProductSeachForm
        form={form}
        onSearch={handleSubmit}
        handleCancel={handleCancel}
        isAdmin={true}
        showModal={showModal}
      />

      {/* Create Form */}
      <Modal
        title="Thêm mới"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form
          form={createForm}
          onFinish={submitCreateProduct}
          style={{
            marginBottom: 10,
            width: 600,
          }}
        >
          <Row gutter={[20]}>
            <Col xl={12}>
              <Form.Item
                name="categoryId"
                rules={[{ required: true, message: "Please enter category!" }]}
              >
                <Select placeholder="Category">
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xl={12}>
              <Form.Item
                name="supplierId"
                rules={[{ required: true, message: "Please enter supplier!" }]}
              >
                <Select placeholder="Supplier">
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
            rules={[{ required: true, message: "Please enter code!" }]}
          >
            <Input placeholder="Code" />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="price"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <InputNumber
              min={0}
              max={1e9}
              addonAfter="VNĐ"
              placeholder="Price"
              style={{ width: "100%" }}
              onBeforeInput={(event) => {
                if (!/^\d+$/.test(event.data)) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item name="description">
            <TextArea rows={10} placeholder="Description" />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={handleCancelModal}
              style={{ width: "100%", marginBottom: 10 }}
            >
              Hủy
            </Button>

            <MyButton style={{ width: "100%" }} htmlType="submit">
              Thêm
            </MyButton>
          </Form.Item>
        </Form>
      </Modal>

      <Button
        type="primary"
        disabled={!selectedProducts.length}
        onClick={() => setIsDiscountModalVisible(!isDiscountModalVisible)}
      >
        Add mã giảm giá
      </Button>

      <Divider />

      {data && (
        <ListProductAdmin
          data={data}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}

      {discountData && (
        <Modal
          title="Chọn mã giảm giá"
          open={isDiscountModalVisible}
          onCancel={handleCancelDiscountModal}
          footer={null}
        >
          <Form onFinish={handleAddDiscount}>
            <Form.Item
              name="id"
              rules={[
                { required: true, message: "Vui lòng chọn mã giảm giá!" },
              ]}
            >
              <Select placeholder="Chọn mã giảm giá" style={{ width: "100%" }}>
                {discountData.map((discount) => (
                  <Select.Option key={discount.id} value={discount.id}>
                    {discount.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <MyButton
              style={{ width: "100%", marginTop: 20 }}
              htmlType="submit"
            >
              Lưu
            </MyButton>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ProductAdmin;

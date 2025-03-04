import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
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

export default function ProductDetailAdmin() {
  const [form] = Form.useForm();
  const [productDetail, setProductDetail] = useState(null);
  const categories = useCategories();
  const suppliers = useSuppliers();
  const { code } = useParams();
  const navigate = useNavigate();
  const [discountData, setDiscountData] = useState(null);

  useEffect(() => {
    const getProductDetail = async () => {
      const data = await getProductByCode(code);
      data ? setProductDetail(data) : navigate("/404-not-found");
    };

    getProductDetail();
  }, [code, navigate]);

  useEffect(() => {
    if (productDetail) {
      form.setFieldsValue({
        ...productDetail,
        createdBy: productDetail.createdBy,
        createdDate: dayjs(productDetail.createdDate),
        modifiedDate: dayjs(productDetail.modifiedDate),
        modifiedBy: productDetail.modifiedBy,
      });
    }
  }, [productDetail, form, navigate]);

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.code] = category.id;
    return acc;
  }, {});

  const supplierMap = suppliers.reduce((acc, supplier) => {
    acc[supplier.code] = supplier.id;
    return acc;
  }, {});

  const handleCancel = () => {
    form.resetFields();
    window.location.reload();
  };

  const onSubmit = async (values) => {
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
  };

  const handleDelete = async () => {
    await deleteProduct(productDetail.id);
    navigate("/admin/products");
  };

  useEffect(() => {
    const getDiscounts = async () => {
      const data = await getAllDiscount();
      setDiscountData(data);
    };

    getDiscounts();
  }, []);

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Chi tiết sản phẩm</h2>

      <Card style={{ width: 600 }}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item label="ID" name="id" required>
            <Input disabled />
          </Form.Item>

          <Row gutter={[20]}>
            <Col xl={12}>
              <Form.Item
                label="Danh mục"
                name="categoryCode"
                rules={[{ required: true, message: "Please enter category!" }]}
              >
                <Select placeholder="Category">
                  {categories.map((category) => (
                    <Select.Option key={category.code} value={category.code}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xl={12}>
              <Form.Item
                label="Hãng"
                name="supplierCode"
                rules={[{ required: true, message: "Please enter supplier!" }]}
              >
                <Select placeholder="Supplier">
                  {suppliers.map((supplier) => (
                    <Select.Option key={supplier.code} value={supplier.code}>
                      {supplier.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Code" name="code" required>
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Please enter name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            label="Giá"
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

          <Form.Item label="Giá mới" name="discountPrice">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Chọn mã giảm giá" name="discountName">
            {discountData && (
              <Select
                placeholder="--- Chọn mã giảm giá ---"
                style={{ width: "100%" }}
              >
                <Select.Option value={""}>
                  --- Chọn mã giảm giá ---
                </Select.Option>
                {discountData.map((discount) => (
                  <Select.Option key={discount.id} value={discount.id}>
                    {discount.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={10} placeholder="Description" />
          </Form.Item>

          <Row gutter={[20]}>
            <Col xl={8}>
              <Form.Item label="Số lượng tồn kho" name="inventoryQuantity">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xl={8}>
              <Form.Item label="Số lượng đã bán" name="soldQuantity">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xl={8}>
              <Form.Item label="Điểm đánh giá" name="point">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ngày tạo" name="createdDate">
            <DatePicker showTime style={{ width: "100%" }} disabled />
          </Form.Item>

          <Form.Item label="Người tạo" name="createdBy">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Ngày chỉnh sửa" name="modifiedDate">
            <DatePicker showTime style={{ width: "100%" }} disabled />
          </Form.Item>

          <Form.Item label="Người chỉnh sửa" name="modifiedBy">
            <Input disabled />
          </Form.Item>

          <div>
            <Form.Item>
              <Button onClick={handleCancel} style={{ marginRight: 20 }}>
                Hủy
              </Button>
              <MyButton
                type="primary"
                htmlType="submit"
                style={{ marginRight: 20 }}
              >
                Cập nhật
              </MyButton>
              <Button danger onClick={handleDelete} style={{ marginRight: 20 }}>
                Xóa
              </Button>
              {productDetail && (
                <Link
                  to={`/admin/inventory-receipt-details?productId=${productDetail.id}`}
                >
                  <Button type="primary">Lịch sử nhập kho →</Button>
                </Link>
              )}
            </Form.Item>
          </div>
        </Form>
      </Card>
    </>
  );
}

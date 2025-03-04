import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import MyButton from "./MyButton";
import { useCategories } from "../context/CategoryContext";
import { useSuppliers } from "../context/SupplierContext";

export default function ProductSeachForm({
  form,
  onSearch,
  handleCancel,
  isAdmin,
  showModal,
}) {
  const categories = useCategories();
  const suppliers = useSuppliers();

  const handleSubmit = (values) => {
    onSearch(values);
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={20}>
          <Col xl={8}>
            <Form.Item name="id">
              <Input placeholder="Nhập ID" />
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item name="code">
              <Input placeholder="Nhập Code" />
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item name="name">
              <Input placeholder="Nhập Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col xl={6}>
            <Form.Item name="minPrice">
              <InputNumber
                min={0}
                max={1e9}
                addonAfter="VNĐ"
                placeholder="Giá từ"
                style={{ width: "100%" }}
                onBeforeInput={(event) => {
                  if (!/^\d+$/.test(event.data)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col xl={6}>
            <Form.Item name="maxPrice">
              <InputNumber
                min={0}
                max={1e9}
                addonAfter="VNĐ"
                placeholder="Giá đến"
                style={{ width: "100%" }}
                onBeforeInput={(event) => {
                  if (!/^\d+$/.test(event.data)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col xl={6}>
            <Form.Item name="categoryCode">
              <Select placeholder="---Chọn danh mục ---">
                <Select.Option value={""}>--- Chọn danh mục ---</Select.Option>
                {categories.map((category) => (
                  <Select.Option key={category.code} value={category.code}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xl={6}>
            <Form.Item name="supplierCode">
              <Select placeholder="---Chọn hãng ---">
                <Select.Option value={""}>--- Chọn hãng ---</Select.Option>
                {suppliers.map((supplier) => (
                  <Select.Option key={supplier.code} value={supplier.code}>
                    {supplier.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          {isAdmin && (
            <Button type="primary" onClick={showModal}>
              Thêm mới
            </Button>
          )}

          <Form.Item>
            <Button onClick={handleCancel} style={{ marginRight: 20 }}>
              Hủy
            </Button>
            <MyButton htmlType="submit">Tìm kiếm</MyButton>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
}

import {
  AppstoreOutlined,
  ClearOutlined,
  IdcardOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
} from "antd";
import { useLocation } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import { useSuppliers } from "../context/SupplierContext";

const sortOptions = [
  { label: "Phổ biến", value: "point" },
  { label: "Bán chạy", value: "soldQuantity" },
  { label: "Mới nhất", value: "createdDate" },
  { label: "Giá", value: "price" },
];

export default function ProductSeachForm({ form, onSearch, handleCancel }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const categories = useCategories();
  const suppliers = useSuppliers();

  const handleSubmit = (values) => {
    onSearch(values);
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          {isAdminPath && (
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <Form.Item name="id" label="ID sản phẩm">
                <Input placeholder="Nhập ID" prefix={<IdcardOutlined />} />
              </Form.Item>
            </Col>
          )}

          {isAdminPath && (
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <Form.Item name="code" label="Mã code">
                <Input placeholder="Nhập Code" prefix={<AppstoreOutlined />} />
              </Form.Item>
            </Col>
          )}

          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <Form.Item name="name" label="Tên sản phẩm">
              <Input
                placeholder="Nhập tến sản phẩm"
                prefix={<ShopOutlined />}
              />
            </Form.Item>
          </Col>

          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <Form.Item label="Khoảng giá">
              <Space style={{ width: "100%" }}>
                <Form.Item name="minPrice" noStyle>
                  <InputNumber
                    min={0}
                    max={1e9}
                    placeholder="Giá từ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="đ"
                    onBeforeInput={(event) => {
                      if (!/^\d+$/.test(event.data)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item name="maxPrice" noStyle>
                  <InputNumber
                    min={0}
                    max={1e9}
                    placeholder="Giá đến"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="đ"
                    onBeforeInput={(event) => {
                      if (!/^\d+$/.test(event.data)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
          </Col>

          <Col xl={4} lg={4} md={12} sm={24} xs={24}>
            <Form.Item name="categoryCode" label="Danh mục">
              <Select placeholder="Chọn danh mục">
                <Select.Option value={""}>Tất cả danh mục</Select.Option>
                {categories.map((category) => (
                  <Select.Option key={category.code} value={category.code}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xl={4} lg={4} md={12} sm={24} xs={24}>
            <Form.Item name="supplierCode" label="Nhà cung cấp">
              <Select placeholder="Chọn nhà cung cấp">
                <Select.Option value={""}>Tất cả nhà cung cấp</Select.Option>
                {suppliers.map((supplier) => (
                  <Select.Option key={supplier.code} value={supplier.code}>
                    {supplier.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <Row gutter={16} align="middle">
              <Col span={14}>
                <Form.Item name="sortBy" label="Sắp xếp theo">
                  <Select defaultValue="point">
                    {sortOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="direction" noStyle>
                  <Radio.Group defaultValue="DESC">
                    <Radio value="DESC">Giảm dần</Radio>
                    <Radio value="ASC">Tăng dần</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {isAdminPath ? (
            <Col
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{ textAlign: "right" }}
            >
              <Space>
                <Button icon={<ClearOutlined />} onClick={handleCancel}>
                  Xóa bộ lọc
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  Tìm kiếm
                </Button>
              </Space>
            </Col>
          ) : (
            <Col
              xl={16}
              lg={16}
              md={12}
              sm={24}
              xs={24}
              style={{ textAlign: "right", marginTop: 29 }}
            >
              <Space>
                <Button icon={<ClearOutlined />} onClick={handleCancel}>
                  Xóa bộ lọc
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  Tìm kiếm
                </Button>
              </Space>
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
}

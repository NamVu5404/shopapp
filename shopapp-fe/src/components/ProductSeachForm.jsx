import {
  AppstoreOutlined,
  ClearOutlined,
  IdcardOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchProduct } from "../api/product";
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

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState([]);

  const fetchProducts = async (search = "") => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const request = {
        id: "",
        categoryCode: "",
        supplierCode: "",
        code: "",
        name: search,
        minPrice: "",
        maxPrice: "",
      };

      const data = await searchProduct(request, 1, 10);
      setProducts(data.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  // Chuyển đổi products thành options khi products thay đổi
  useEffect(() => {
    if (products && products.length > 0) {
      // Chuyển đổi kết quả thành định dạng options cho AutoComplete
      const formattedOptions = products.map(product => ({
        value: product.name,
        label: <div>{product.name}</div>
      }));

      setOptions(formattedOptions);
    } else {
      setOptions([]);
    }
  }, [products]);

  const debouncedSearch = useMemo(
    () => debounce((value) => fetchProducts(value), 300),
    []
  );

  const handleSearch = useCallback(
    (value) => {
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

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
              <AutoComplete
                options={options}
                onSearch={handleSearch}
                placeholder="Nhập tên sản phẩm"
                style={{ width: '100%' }}
                notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy sản phẩm"}
              >
                <Input />
              </AutoComplete>
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
                {categories?.map((category) => (
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
                {suppliers?.map((supplier) => (
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
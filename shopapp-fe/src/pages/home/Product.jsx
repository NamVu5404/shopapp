import { Breadcrumb, Collapse, Form, Pagination } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { searchProduct } from "../../api/product";
import ProductItem from "../../components/ProductItem";
import ProductSeachForm from "../../components/ProductSeachForm";
import { CaretRightOutlined, FilterOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

export default function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const nameQuery = queryParams.get("name");
  const categoryQuery = queryParams.get("categoryCode");
  const supplierQuery = queryParams.get("supplierCode");
  const page = queryParams.get("page");
  const sort = queryParams.get("sortBy");

  const [id, setId] = useState(queryParams.get("id") || "");
  const [categoryCode, setCategoryCode] = useState(categoryQuery || "");
  const [supplierCode, setSupplierCode] = useState(supplierQuery || "");
  const [code, setCode] = useState(queryParams.get("code") || "");
  const [name, setName] = useState(nameQuery || "");
  const [minPrice, setMinPrice] = useState(queryParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(queryParams.get("maxPrice") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page"), 10) || 1
  );
  const pageSize = 20;
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState(sort || "point");

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
      sortBy: values.sortBy ?? sortBy,
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

    updateURL(newParams); // ✅ Cập nhật URL khi thay đổi bộ lọc
  };

  useEffect(() => {
    setCategoryCode(categoryQuery || "");
    setSupplierCode(supplierQuery || "");
    setName(nameQuery || "");
    setCurrentPage(page || 1);
    setSortBy(sort || "point");

    form.setFieldsValue({
      name: nameQuery || "",
      categoryCode: categoryQuery || "",
      supplierCode: supplierQuery || "",
      currentPage: page || 1,
      sortBy: sort || "point",
    });
  }, [categoryQuery, supplierQuery, nameQuery, page, sort, form]);

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

      const data = await searchProduct(request, currentPage, pageSize, sortBy);
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
    sortBy,
    form,
  ]);

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: "Sản phẩm" },
        ]}
      />

      <Collapse
        style={{
          borderRadius: "8px",
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

      {data && (
        <>
          <ProductItem data={data.data} />

          {data.data.length === 0 && <p>Không có kết quả phù hợp!</p>}

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data.totalElements}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </>
  );
}

import { Table } from "antd";
import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import { useSuppliers } from "../context/SupplierContext";

export default function ListProductAdmin({
  data,
  currentPage,
  setCurrentPage,
  selectedProducts,
  setSelectedProducts,
}) {
  const pageSize = 20;
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

  // Xử lý chọn sản phẩm
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedProducts(newSelectedRowKeys);
  };

  // Cấu hình rowSelection
  const rowSelection = {
    selectedProducts, // Danh sách key của các sản phẩm đã chọn
    onChange: onSelectChange, // Hàm xử lý khi chọn/bỏ chọn
  };

  // Columns definition
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => {
        return <Link to={`/admin/products/${code}`}>{code}</Link>;
      },
    },
    {
      title: "Category",
      dataIndex: "categoryCode",
      key: "category",
      render: (categoryCode) => categoryMap[categoryCode] || "Unknown",
    },
    {
      title: "Supplier",
      dataIndex: "supplierCode",
      key: "supplier",
      render: (supplierCode) => supplierMap[supplierCode] || "Unknown",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <>
          {record.discountPrice ? (
            <>
              <span
                style={{ fontWeight: "bold", color: "red", marginRight: 5 }}
              >
                {record.discountPrice?.toLocaleString("vi-VN")}đ
              </span>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "gray",
                }}
              >
                {record.price?.toLocaleString("vi-VN")}đ
              </span>
            </>
          ) : (
            <>
              <span
                style={{ fontWeight: "bold", color: "red", marginRight: 5 }}
              >
                {record.price?.toLocaleString("vi-VN")}đ
              </span>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        rowSelection={rowSelection}
        dataSource={data.data}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.totalElements,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
        }}
      />
    </>
  );
}

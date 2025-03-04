import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getInventoryReceiptDetailByProductId } from "../../api/inventoryReceipt";
import dayjs from "dayjs";
import { Spin, Table, Tag } from "antd";

const formatDate = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-";

export default function ReceiptByProductAdmin() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const [data, setData] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getReceiptDetailByProductId = async () => {
      setLoading(true);
      const response = await getInventoryReceiptDetailByProductId(
        productId,
        currentPage,
        pageSize
      );
      setLoading(false);

      setData(response.data);
      setTotalItems(response.totalElements);
    };

    getReceiptDetailByProductId();
  }, [currentPage, productId]);

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_, item) => item?.price.toLocaleString("vi-VN") + "đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors = {
          COMPLETED: "green",
          CANCELED: "red",
          PENDING: "yellow",
        };
        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Ngày nhập",
      dataIndex: "createdDate",
      key: "createdDate",
      render: formatDate,
    },
    { title: "Người nhập", dataIndex: "createdBy", key: "createdBy" },
    {
      title: "Ngày sửa",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      render: formatDate,
    },
    { title: "Người sửa", dataIndex: "modifiedBy", key: "modifiedBy" },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>
        Lịch sử nhập kho: {data ? data[0].productCode : null}
      </h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            onRow={(record) => ({
              onClick: () =>
                navigate(`/admin/inventory-receipts/${record.receiptId}`),
            })}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </>
      )}
    </>
  );
}

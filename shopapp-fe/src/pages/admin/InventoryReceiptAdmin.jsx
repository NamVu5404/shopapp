import { Divider, Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getInventoryReceipts } from "../../api/inventoryReceipt";
import MyButton from "../../components/MyButton";

const formatDate = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-";

export default function InventoryReceiptAdmin() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchReceipts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getInventoryReceipts(page, pageSize);
      setReceipts(response.data);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhập kho:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReceipts(currentPage);
  }, [currentPage]);

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, item) => item.totalAmount?.toLocaleString("vi-VN") + "đ",
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
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Quản lý nhập kho</h2>

      <Link to={"/admin/inventory-receipts/create"}>
        <MyButton>Nhập kho</MyButton>
      </Link>

      <Divider />

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={receipts}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => navigate(`/admin/inventory-receipts/${record.id}`),
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

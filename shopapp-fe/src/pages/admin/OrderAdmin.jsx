import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Breadcrumb, message } from "antd";
import { getAllOrder, cancelOrder } from "../../api/order";
import OrderByStatus from "../../components/OrderByStatus";

export default function OrderAdmin() {
  const { status } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const urlSearchParams = new URLSearchParams(location.search);
  const initialPage = parseInt(urlSearchParams.get("page")) || 1;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState(status || "PENDING");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllOrder(
          selectedStatus,
          currentPage,
          pageSize
        );
        setData(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        setData({ data: [], totalElements: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedStatus, currentPage, pageSize]);

  // Cập nhật URL khi thay đổi trạng thái hoặc trang
  const updateURL = (status, page) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    let path = `/admin/orders`;
    if (status) {
      path += `/status/${status}`;
    }

    navigate(`${path}?${params.toString()}`);
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    updateURL(status, 1);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(selectedStatus, page);
  };

  // Hàm xử lý hủy đơn hàng cho admin
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      message.success("Đã hủy đơn hàng thành công!");

      // Làm mới dữ liệu sau khi hủy
      const response = await getAllOrder(selectedStatus, currentPage, pageSize);
      setData(response);
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      message.error("Hủy đơn hàng thất bại!");
    }
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: "Quản lý đơn hàng" },
        ]}
      />
      
      <OrderByStatus
        data={data}
        loading={loading}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onCancelOrder={handleCancelOrder}
      />
    </>
  );
}

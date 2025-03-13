import { Breadcrumb, Pagination } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getWishListByUser } from "../../api/wishList";
import ProductItem from "../../components/ProductItem";
import { getToken } from "../../services/localStorageService";

export default function WishList() {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchWishlist = async () => {
      if (getToken() && user?.id) {
        // Người dùng đã đăng nhập, lấy dữ liệu từ API
        try {
          const response = await getWishListByUser(
            user.id,
            currentPage,
            pageSize
          );
          setData(response);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách wishlist:", error);
          setData({ data: [], totalElements: 0 }); // Đặt giá trị mặc định nếu lỗi
        }
      } else {
        // Người dùng chưa đăng nhập, lấy dữ liệu từ localStorage
        const guestWishlist =
          JSON.parse(localStorage.getItem("guestWishlist")) || {};
        const likedProducts = Object.values(guestWishlist); // Lấy danh sách sản phẩm chi tiết
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = likedProducts.slice(startIndex, endIndex);
        setData({
          data: paginatedData,
          totalElements: likedProducts.length,
        });
      }
    };

    fetchWishlist();
  }, [user, currentPage]);

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: "Sản phẩm yêu thích" },
        ]}
      />

      {data && (
        <>
          <ProductItem data={data.data} />

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

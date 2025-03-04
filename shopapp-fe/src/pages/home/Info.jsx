import { Col, Menu, Row, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getMyInfo } from "../../api/user";
import { getToken } from "../../services/localStorageService";

export default function Info() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = getToken();
  const [loading, setLoading] = useState(true);
  const userDetails = useSelector((state) => state.user);

  const menuItems = [
    { key: "1", label: "Thông tin cá nhân", path: "/users" },
    { key: "2", label: "Đơn hàng của tôi", path: "/users/orders" },
    { key: "3", label: "Mật khẩu và bảo mật", path: "/users/password" },
    { key: "4", label: "Địa chỉ của tôi", path: "/users/addresses" },
  ];

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else {
      dispatch(getMyInfo(accessToken));
    }
  }, [accessToken, navigate, dispatch]);

  useEffect(() => {
    if (userDetails.id) {
      setLoading(false); // Cập nhật loading khi có userDetails
    } else {
      setLoading(true); // Giữ loading nếu chưa có thông tin người dùng
    }
  }, [userDetails]);

  return (
    <>
      <h2 style={{ marginBottom: 5 }}>Thông tin tài khoản</h2>
      <h3 style={{ marginBottom: 30 }}>
        Xin chào{" "}
        <span style={{ color: "var(--primary-color)" }}>
          {userDetails.fullName || "Quý khách"}
        </span>{" "}
        !
      </h3>

      <Row gutter={[30]}>
        <Col xl={6}>
          <Menu
            mode="vertical"
            items={menuItems.map((item) => ({
              key: item.key,
              label: (
                <Link
                  to={item.path}
                  className="primary-link"
                  style={{ fontSize: 16 }}
                >
                  {item.label}
                </Link>
              ),
              className: "custom-menu-item",
            }))}
          />
        </Col>

        <Col xl={18}>
          {loading ? (
            <Space
              direction="vertical"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Spin size="large" />
              <Typography>Loading ...</Typography>
            </Space>
          ) : (
            <Outlet context={{ userDetails }} />
          )}
        </Col>
      </Row>
    </>
  );
}

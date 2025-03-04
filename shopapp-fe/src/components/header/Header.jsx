import {
  CaretDownOutlined,
  HeartTwoTone,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { introspect, logout } from "../../api/auth";
import { useCategories } from "../../context/CategoryContext";
import { hasPermission } from "../../services/authService";
import { getToken } from "../../services/localStorageService";
import "./Header.css";

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [isLogin, setIsLogin] = useState(false);
  const token = getToken();
  const location = useLocation();
  const dispatch = useDispatch();
  const categories = useCategories();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const menuCategory = categories.map((category) => ({
    key: category.id,
    label: (
      <Link to={`products?categoryCode=${category.code}&page=1`}>{category.name}</Link>
    ),
    children: category.suppliers
      ? category.suppliers.map((supplier) => ({
          key: `${category.code}-${supplier.code}`,
          label: (
            <Link
              to={`products?categoryCode=${category.code}&supplierCode=${supplier.code}&page=1`}
            >
              {supplier.name}
            </Link>
          ),
        }))
      : [],
  }));

  const onSearch = (event) => {
    event.preventDefault();
    navigate(`/products?name=${query}&page=1`);
  };

  useEffect(() => {
    const isValidToken = async () => {
      try {
        const isValid = await introspect(token);
        setIsLogin(isValid);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (token) {
      isValidToken();
    } else {
      setIsLogin(false);
    }
  }, [token]);

  const handleLogout = async () => {
    setIsLogin(false);
    dispatch(logout());
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setIsHidden(currentScrollPos > prevScrollPos && currentScrollPos > 150);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <>
      <header className="header">
        <div className="header-top">
          <Link to={"/"} className="secondary-link">
            <div className="logo">
              <img
                src="/logo/image_processing20221028-18903-1oprry3.jpg"
                alt="logo"
              />
              <h1>SHOPAPP</h1>
            </div>
          </Link>

          <div className="input-search">
            <form onSubmit={onSearch}>
              <Space.Compact
                style={{
                  // width: "100%",
                  width: "500px",
                }}
              >
                <Input
                  placeholder="Nhập tên sản phẩm bạn mong muốn"
                  allowClear
                  size="large"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                    padding: "0 30px",
                  }}
                />
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    border: "1px solid var(--secondary-color)",
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                  }}
                >
                  Tìm kiếm
                </Button>
              </Space.Compact>
            </form>
          </div>

          <Link className="cart" to={"/wish-list"}>
            <HeartTwoTone />
          </Link>
          
          <Link className="cart" to={"/cart"}>
            <ShoppingCartOutlined />
          </Link>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="login">
              <UserOutlined
                style={{
                  fontSize: "24px",
                  marginRight: "10px",
                }}
              />
              <div
                style={{
                  fontSize: "18px",
                }}
              >
                {isLogin ? (
                  <>
                    <Link className="secondary-link" to={"/users"}>
                      Tài khoản
                    </Link>{" "}
                    |{" "}
                    <Link className="secondary-link" onClick={handleLogout}>
                      Đăng xuất
                    </Link>
                  </>
                ) : (
                  <>
                    <Link className="secondary-link" to={"/login"}>
                      Đăng nhập
                    </Link>{" "}
                    |{" "}
                    <Link className="secondary-link" to={"/register"}>
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
            {isLogin &&
              hasPermission([
                "ROLE_ADMIN",
                "ROLE_STAFF_INVENTORY",
                "ROLE_STAFF_SALE",
                "ROLE_STAFF_CUSTOMER_SERVICE",
              ]) && (
                <div
                  style={{
                    fontSize: "18px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Link
                    className="secondary-link"
                    to={"/admin"}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <MdOutlineAdminPanelSettings
                      style={{
                        fontSize: "24px",
                        marginRight: "10px",
                      }}
                    />
                    Quản trị viên
                  </Link>
                </div>
              )}
          </div>
        </div>

        <div className={`header-bottom ${isHidden ? "hidden" : ""}`}>
          <ol className="menu">
            <li
              className={`menu-item ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <Link to={"/"} className="primary-link">
                Trang chủ
              </Link>
            </li>
            <li
              className={`menu-item ${
                location.pathname.startsWith("/products") ? "active" : ""
              }`}
            >
              <Dropdown
                menu={{ items: menuCategory }}
                trigger={["hover"]}
                mouseEnterDelay={0.05} // Hiển thị nhanh hơn
                mouseLeaveDelay={0.1} // Ẩn nhanh hơn
              >
                <Link to={"/products"} className="primary-link">
                  Sản phẩm <CaretDownOutlined />
                </Link>
              </Dropdown>
            </li>
            <li
              className={`menu-item ${
                location.pathname === "/check-order" ? "active" : ""
              }`}
            >
              <Link to={"/check-order"} className="primary-link">
                Tra cứu đơn hàng
              </Link>
            </li>
            <li
              className={`menu-item ${
                location.pathname === "/contact" ? "active" : ""
              }`}
            >
              <Link to={"/contact"} className="primary-link">
                Liên hệ
              </Link>
            </li>
          </ol>

          <div className="contact-phone">
            <PhoneOutlined /> Hotline: 099 999 9999
          </div>
        </div>
      </header>
    </>
  );
}

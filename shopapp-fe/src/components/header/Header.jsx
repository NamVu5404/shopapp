import {
  CaretDownOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Badge, Button, Dropdown, Input, Space, Spin, Tooltip, Typography } from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_IMAGE, IMAGE_URL, introspect, logout } from "../../api/auth";
import { getTotalItemsByUser } from "../../api/cart";
import { searchProduct } from "../../api/product";
import { useCategories } from "../../context/CategoryContext";
import { hasPermission } from "../../services/authService";
import { getToken } from "../../services/localStorageService";
import "./Header.css";

const { Text } = Typography;

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [isLogin, setIsLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const token = getToken();
  const location = useLocation();
  const dispatch = useDispatch();
  const categories = useCategories();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const userId = useSelector((state) => state.user.id);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hàm tìm kiếm sản phẩm từ API
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

      const data = await searchProduct(request, 1, 5);
      setProducts(data.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  // Debounce search để tránh gọi API liên tục
  const debouncedSearch = useMemo(
    () => debounce((value) => fetchProducts(value), 300),
    []
  );

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      debouncedSearch(value);
      setDropdownOpen(true);
    } else {
      setProducts([]);
      setDropdownOpen(false);
    }
  };

  // Xử lý khi chọn sản phẩm từ gợi ý
  const handleSelectProduct = (product) => {
    setQuery(product.name);
    setDropdownOpen(false);
    navigate(`/products?name=${product.name}&page=1`);
  };

  // Xử lý submit form tìm kiếm
  const onSearch = (event) => {
    if (event) event.preventDefault();
    navigate(`/products?name=${query}&page=1`);
    setDropdownOpen(false);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Cấu trúc menu category với CSS tùy chỉnh
  const menuCategory = categories?.map((category) => ({
    key: category.id,
    label: (
      <Link
        to={`products?categoryCode=${category.code}&page=1`}
        className="category-link"
      >
        <span>{category.name}</span>
        {category.suppliers && category.suppliers.length > 0 && (
          <span style={{ float: "right", color: "#aaa" }}>
            <CaretDownOutlined />
          </span>
        )}
      </Link>
    ),
    children: category?.suppliers
      ? category?.suppliers?.map((supplier) => ({
        key: `${category.code}-${supplier.code}`,
        label: (
          <Link
            to={`products?categoryCode=${category.code}&supplierCode=${supplier.code}&page=1`}
            className="supplier-link"
          >
            {supplier.name}
          </Link>
        ),
      }))
      : [],
    popupClassName: "custom-dropdown-submenu",
  }));

  // Function to fetch cart count for logged-in users
  const fetchCartCount = useCallback(async () => {
    try {
      if (token && userId) {
        const totalItems = await getTotalItemsByUser(userId);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error.message);
    }
  }, [token, userId]);

  // Function to get cart count for guest users
  const getGuestCartCount = () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {
      items: [],
    };
    const count = guestCart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(count);
  };

  const updateCartCount = useCallback(() => {
    if (token && userId) {
      fetchCartCount();
    } else {
      getGuestCartCount();
    }
  }, [token, userId, fetchCartCount]);

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

  useEffect(() => {
    updateCartCount(); // Gọi khi component mount hoặc userId/token thay đổi

    // Lắng nghe sự kiện cartUpdated
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [userId, token, updateCartCount]);

  const handleLogout = async () => {
    setIsLogin(false);
    dispatch(logout());
    // Reset cart count when logging out
    setCartCount(0);
    // Update cart count for guest after logout
    setTimeout(getGuestCartCount, 100);
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

  // Dropdown menu với danh sách gợi ý
  const dropdownMenu = (
    <div
      className="suggestion-dropdown"
      style={{
        background: '#fff',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
        borderRadius: '8px',
        width: '500px',
        maxHeight: '600px',
        overflowY: 'auto',
        marginTop: '5px',
        position: 'absolute',
        zIndex: 1000
      }}
      onClick={e => e.stopPropagation()}
    >
      {loading ? (
        <div style={{ padding: '15px', textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      ) : products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.code}
            className="suggestion-item"
            onClick={() => handleSelectProduct(product)}
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={
                  product.images.length !== 0
                    ? `${IMAGE_URL}/${product.images[0]}`
                    : DEFAULT_IMAGE
                }
                alt={product.name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{product.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Mã: {product.code}</div>
              </div>
            </div>
            <Space align="baseline">
              {product.discountPrice ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Text delete type="secondary" style={{ fontSize: 14 }}>
                    {product.price?.toLocaleString("vi-VN")}đ
                  </Text>
                  <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                    {product.discountPrice?.toLocaleString("vi-VN")}đ
                  </Text>
                </div>
              ) : (
                <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                  {product.price?.toLocaleString("vi-VN")}đ
                </Text>
              )}
            </Space>
          </div>
        ))
      ) : (
        <div style={{ padding: '15px', textAlign: 'center', color: '#888' }}>
          Không tìm thấy sản phẩm
        </div>
      )}
    </div>
  );

  // CSS nội tuyến cho dropdown
  const dropdownCSS = `
    .custom-dropdown .ant-dropdown-menu {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
      padding: 8px 0;
      min-width: 220px;
      border: 1px solid #f0f0f0;
    }
    
    .custom-dropdown .ant-dropdown-menu-item,
    .custom-dropdown .ant-dropdown-menu-submenu-title {
      padding: 10px 16px;
      transition: all 0.2s ease;
    }
    
    .custom-dropdown .ant-dropdown-menu-item:hover,
    .custom-dropdown .ant-dropdown-menu-submenu-title:hover {
      background-color: #f5f5f5;
      color: var(--primary-color);
    }
    
    .custom-dropdown .ant-dropdown-menu-item-active,
    .custom-dropdown .ant-dropdown-menu-submenu-title-active {
      background-color: #e6f7ff;
      color: var(--primary-color);
    }
    
    .custom-dropdown .ant-dropdown-menu-submenu > .ant-dropdown-menu {
      border-radius: 8px;
    }
    
    .custom-dropdown .category-link,
    .custom-dropdown .supplier-link {
      display: block;
      color: #333;
      text-decoration: none;
      font-weight: 500;
      width: 100%;
    }
    
    .custom-dropdown .supplier-link {
      font-weight: normal;
    }
    
    .custom-dropdown .ant-dropdown-menu-item:hover .category-link,
    .custom-dropdown .ant-dropdown-menu-item:hover .supplier-link {
      color: var(--primary-color);
    }
    
    .custom-dropdown .ant-dropdown-menu-submenu-arrow {
      color: #aaa;
      font-size: 10px;
    }
    
    .custom-dropdown-submenu {
      min-width: 180px !important;
    }
  `;

  return (
    <>
      <style>{dropdownCSS}</style>
      <header className="header">
        <div className="header-top">
          <Link to={"/"} className="secondary-link">
            <div className="logo">
              <img
                src="/logo/logo.webp?v=1.0.0"
                alt="logo"
                // style={{ height: 80, margin: "10px -30px 0 -5px" }}
                style={{
                  height: 50,
                }}
              />
            </div>
          </Link>

          <div className="search-container" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <form onSubmit={onSearch}>
              <Space.Compact style={{ width: '500px' }}>
                <Input
                  placeholder="Nhập tên sản phẩm bạn mong muốn"
                  allowClear
                  size="large"
                  value={query}
                  onChange={handleInputChange}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (query.trim() && products.length > 0) {
                      setDropdownOpen(true);
                    }
                  }}
                  style={{
                    borderTopLeftRadius: '20px',
                    borderBottomLeftRadius: '20px',
                    padding: '0 30px',
                  }}
                />
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    border: '1px solid var(--secondary-color)',
                    borderTopRightRadius: '20px',
                    borderBottomRightRadius: '20px',
                  }}
                >
                  Tìm kiếm
                </Button>
              </Space.Compact>
            </form>

            {/* Hiển thị dropdown gợi ý nếu có */}
            {dropdownOpen && dropdownMenu}
          </div>

          <Link
            className="cart heart-icon"
            to={"/wish-list"}
            style={{ fontSize: 28, marginTop: 6 }}
          >
            <Tooltip title="Sản phẩm yêu thích">
              <FaHeart />
            </Tooltip>
          </Link>

          <Link className="cart cart-simple" to={"/cart"}>
            <Tooltip title="Giỏ hàng">
              <Badge
                count={cartCount}
                size="small"
                offset={[0, 3]}
                showZero
                style={{ backgroundColor: "#ff4d4f" }}
              >
                <ShoppingCartOutlined
                  style={{
                    fontSize: 30,
                    color: "#FFF",
                    transition: "all 0.2s ease",
                  }}
                />
              </Badge>
            </Tooltip>
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
                  fontSize: "22px",
                  marginRight: "5px",
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
                    <Link
                      className="secondary-link"
                      onClick={handleLogout}
                      to={"/"}
                    >
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
                        marginRight: "5px",
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
              className={`menu-item ${location.pathname === "/" ? "active" : ""
                }`}
            >
              <Link to={"/"} className="primary-link">
                Trang chủ
              </Link>
            </li>
            <li
              className={`menu-item ${location.pathname.startsWith("/products") ? "active" : ""
                }`}
            >
              <Dropdown
                menu={{ items: menuCategory }}
                trigger={["hover"]}
                mouseEnterDelay={0.05}
                mouseLeaveDelay={0.1}
                overlayClassName="custom-dropdown"
              >
                <Link to={"/products"} className="primary-link">
                  Sản phẩm <CaretDownOutlined />
                </Link>
              </Dropdown>
            </li>
            <li
              className={`menu-item ${location.pathname === "/check-order" ? "active" : ""
                }`}
            >
              <Link to={"/check-order"} className="primary-link">
                Tra cứu đơn hàng
              </Link>
            </li>
            <li
              className={`menu-item ${location.pathname === "/contact" ? "active" : ""
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

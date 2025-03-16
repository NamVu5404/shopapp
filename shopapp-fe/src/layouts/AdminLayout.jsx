import { Badge, Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import {
  FaBoxOpen,
  FaEnvelopeOpenText,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import {
  MdOutlineDiscount,
  MdOutlineHomeWork,
  MdOutlineInventory2,
} from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import { getUnreadCount } from "../api/contact";
import { countTotalPendingReceipts } from "../api/inventoryReceipt";
import { countTotalPendingOrders } from "../api/order";
import AdminHeader from "../components/header/AdminHeader";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { hasPermission } from "../services/authService";

const { Sider } = Layout;

function getItem(label, key, icon, count = 0, children) {
  // Nếu có số lượng > 0, hiển thị badge
  const labelWithBadge =
    count > 0 ? (
      <span>
        {label} <Badge size="small" count={count} style={{ marginLeft: 8 }} />
      </span>
    ) : (
      label
    );

  return {
    key,
    icon,
    children,
    label: labelWithBadge,
  };
}

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingReceipts, setPendingReceipts] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  // Fetch counts on component mount and every 1 minute
  useEffect(() => {
    const fetchCounts = async () => {
      if (hasPermission(["ROLE_ADMIN", "ROLE_STAFF_SALE"])) {
        const orders = await countTotalPendingOrders();
        setPendingOrders(orders || 0);
      }

      if (hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])) {
        const receipts = await countTotalPendingReceipts();
        setPendingReceipts(receipts || 0);
      }

      if (hasPermission(["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"])) {
        const messages = await getUnreadCount();
        setUnreadMessages(messages || 0);
      }
    };

    fetchCounts();
  }, []);

  const items = [
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_SALE"])
      ? [
          getItem(
            "Quản lý đơn hàng",
            "/admin/orders/status/PENDING",
            <FaShoppingCart />,
            pendingOrders
          ),
        ]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"])
      ? [getItem("Quản lý tài khoản", "/admin/users", <FaUsers />)]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY", "ROLE_STAFF_SALE"])
      ? [getItem("Quản lý sản phẩm", "/admin/products", <FaBoxOpen />)]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])
      ? [
          getItem(
            "Quản lý nhập kho",
            "/admin/inventory-receipts/status/PENDING",
            <MdOutlineInventory2 />,
            pendingReceipts
          ),
        ]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])
      ? [getItem("Quản lý danh mục", "/admin/categories", <BiCategory />)]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])
      ? [
          getItem(
            "Quản lý nhà cung cấp",
            "/admin/suppliers",
            <MdOutlineHomeWork />
          ),
        ]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_SALE"])
      ? [
          getItem(
            "Quản lý mã giảm giá",
            "/admin/discounts",
            <MdOutlineDiscount />
          ),
        ]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"])
      ? [
          getItem(
            "Quản lý liên hệ",
            "/admin/contacts",
            <FaEnvelopeOpenText />,
            unreadMessages
          ),
        ]
      : []),
    ...(hasPermission(["ROLE_ADMIN"])
      ? [
          getItem(
            "Báo cáo & Thống kê",
            "/admin/statistics",
            <FaEnvelopeOpenText />,
          ),
        ]
      : []),
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AdminHeader />

      <div style={{ marginTop: 90 }}>
        <Layout
          style={{
            minHeight: "calc(100vh - 90px)",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
          >
            <Menu
              theme="light"
              mode="inline"
              items={items}
              onClick={(e) => navigate(e.key)}
            />
          </Sider>
          <Layout>
            <Content
              style={{
                padding: "20px",
              }}
            >
              <div
                style={{
                  padding: 40,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default AdminLayout;

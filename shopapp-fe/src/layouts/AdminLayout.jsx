import { Badge, Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FaBoxOpen, FaEnvelopeOpenText, FaUsers } from "react-icons/fa";
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
    ...[getItem("Báo cáo & Thống kê", "/admin", <FaEnvelopeOpenText />)],
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])
      ? [
          getItem(
            "Quản lý đơn hàng",
            "/admin/orders/status/PENDING",
            <MdOutlineInventory2 />,
            pendingOrders
          ),
        ]
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
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"])
      ? [getItem("Quản lý tài khoản", "/admin/users", <FaUsers />)]
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
  ];

  return (
    <div className="nice-admin-layout">
      <AdminHeader
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
      />

      <div className="nice-admin-container">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="nice-admin-sidebar"
          trigger={null}
          width={200}
        >
          <Menu
            theme="light"
            mode="inline"
            items={items}
            onClick={(e) => navigate(e.key)}
            className="nice-admin-menu"
          />
        </Sider>
        <Layout className="nice-admin-content-container">
          <Content className="nice-admin-content">
            <div
              className="nice-admin-content-inner"
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </div>

      <ScrollToTopButton />

      <style jsx>{`
        .nice-admin-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .nice-admin-container {
          display: flex;
          flex: 1;
          margin-top: 60px;
        }
        .nice-admin-sidebar {
          background-color: #fff !important;
          box-shadow: 0px 0px 20px rgba(1, 41, 112, 0.1);
          border-right: none !important;
          height: calc(100vh - 60px);
          position: fixed !important;
          left: 0;
          top: 60px;
          z-index: 996;
        }
        .nice-admin-sidebar .ant-layout-sider-children {
          overflow-y: auto;
          height: 100%;
        }
        .sidebar-header {
          padding: 10px 20px;
          background: #fff;
          border-bottom: 1px solid #eee;
        }
        .logo img {
          max-height: 40px;
          margin-right: 10px;
        }
        .logo-small img {
          max-height: 30px;
        }
        .nice-admin-menu {
          border-right: none !important;
        }
        .nice-admin-menu .ant-menu-item {
          height: 50px;
          line-height: 50px;
          margin: 0;
          padding: 0 20px !important;
          font-size: 15px;
        }
        .nice-admin-menu .ant-menu-item-selected {
          background-color: #f6f9ff !important;
          color: #4154f1;
          border-left: 3px solid #4154f1;
        }
        .nice-admin-content-container {
          margin-left: ${collapsed ? "80px" : "220px"};
          transition: all 0.3s;
          width: calc(100% - ${collapsed ? "80px" : "220px"});
        }
        .nice-admin-content {
          padding: 20px;
          margin-top: 10px;
        }
        .nice-admin-content-inner {
          padding: 30px;
          min-height: calc(100vh - 120px);
          background: #fff;
          border-radius: 8px;
          box-shadow: 0px 0px 20px rgba(1, 41, 112, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

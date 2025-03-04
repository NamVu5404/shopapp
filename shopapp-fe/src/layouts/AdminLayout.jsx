import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { BiCategory } from "react-icons/bi";
import {
  MdOutlineDiscount,
  MdOutlineHomeWork,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "../components/header/AdminHeader";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { hasPermission } from "../services/authService";
import { MdOutlineInventory2 } from "react-icons/md";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const items = [
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"])
      ? [getItem("Quản lý tài khoản", "/admin/users", <UserOutlined />)]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])
      ? [
          getItem(
            "Quản lý sản phẩm",
            "/admin/products",
            <MdProductionQuantityLimits />
          ),
        ]
      : []),
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])
      ? [getItem("Quản lý nhập kho", "/admin/inventory-receipts", <MdOutlineInventory2 />)]
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
    ...(hasPermission(["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"])
      ? [
          getItem(
            "Quản lý mã giảm giá",
            "/admin/discounts",
            <MdOutlineDiscount />
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
              // defaultSelectedKeys={["/admin/users"]}
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

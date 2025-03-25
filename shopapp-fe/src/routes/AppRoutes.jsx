import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ScrollRestoration from "../components/ScrollRestoration";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import CategoryAdmin from "../pages/admin/CategoryAdmin";
import ContactAdmin from "../pages/admin/ContactAdmin";
import DiscountAdmin from "../pages/admin/DiscountAdmin";
import InventoryReceiptAdmin from "../pages/admin/InventoryReceiptAdmin";
import InventoryReceiptDetailAdmin from "../pages/admin/InventoryReceiptDetailAdmin";
import InventorySearchAdmin from "../pages/admin/InventorySearchAdmin";
import OrderAdmin from "../pages/admin/OrderAdmin";
import OrderByUser from "../pages/admin/OrderByUser";
import OrderCreationAdmin from "../pages/admin/OrderCreationAdmin";
import OrderDetailAdmin from "../pages/admin/OrderDetailAdmin";
import OrderSearchAdmin from "../pages/admin/OrderSearchAdmin";
import ProductAdmin from "../pages/admin/ProductAdmin";
import ProductDetailAdmin from "../pages/admin/ProductDetailAdmin";
import ReceiptByProductAdmin from "../pages/admin/ReceiptByProductAdmin";
import StatisticsAdmin from "../pages/admin/StatisticsAdmin";
import SupplierAdmin from "../pages/admin/SupplierAdmin";
import UserAdmin from "../pages/admin/UserAdmin";
import UserDetailAdmin from "../pages/admin/UserDetailAdmin";
import NotFound from "../pages/home/404NotFound";
import Authenticate from "../pages/home/Authenticate";
import Cart from "../pages/home/Cart";
import CheckOrder from "../pages/home/CheckOrder";
import Checkout from "../pages/home/Checkout";
import Contact from "../pages/home/Contact";
import Home from "../pages/home/Home";
import Info from "../pages/home/Info";
import Login from "../pages/home/Login";
import MyAddresses from "../pages/home/MyAddresses";
import MyInfo from "../pages/home/MyInfo";
import MyPassword from "../pages/home/MyPassword";
import OrderDetail from "../pages/home/OrderDetail";
import OrderSuccess from "../pages/home/OrderSuccess";
import Product from "../pages/home/Product";
import ProductDetail from "../pages/home/ProductDetail";
import Register from "../pages/home/Register";
import WishList from "../pages/home/WishList";
import PrivateRoute from "./PrivateRoutes";

const AppRoutes = () => {
  return (
    <Router>
      <ScrollRestoration />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:code" element={<ProductDetail />} />
          <Route path="/check-order" element={<CheckOrder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route
            path="/orders/user/:userId/status/:status"
            element={<OrderByUser />}
          />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/wish-list" element={<WishList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/authenticate" element={<Authenticate />} />

          {/* private routes */}
          <Route path="/users" element={<PrivateRoute element={<Info />} />}>
            <Route path="" element={<MyInfo />} />
            <Route path="password" element={<MyPassword />} />
            <Route path="addresses" element={<MyAddresses />} />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              element={<AdminLayout />}
              requiredRoles={[
                "ROLE_ADMIN",
                "ROLE_STAFF_INVENTORY",
                "ROLE_STAFF_SALE",
                "ROLE_STAFF_CUSTOMER_SERVICE",
              ]}
            />
          }
        >
          {/* <Route index element={<UserAdmin />} /> */}
          <Route
            path="orders"
            element={
              <PrivateRoute
                element={<OrderCreationAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_SALE"]}
              />
            }
          />
          <Route
            path="orders/search"
            element={
              <PrivateRoute
                element={<OrderSearchAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_SALE"]}
              />
            }
          />
          <Route
            path="orders/status/:status"
            element={
              <PrivateRoute
                element={<OrderAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_SALE"]}
              />
            }
          />
          <Route
            path="orders/:orderId"
            element={
              <PrivateRoute
                element={<OrderDetailAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_SALE"]}
              />
            }
          />
          <Route
            path="orders/order-success"
            element={
              <PrivateRoute
                element={<OrderSuccess />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_SALE"]}
              />
            }
          />
          <Route
            path="orders/user/:userId/status/:status"
            element={
              <PrivateRoute
                element={<OrderByUser />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_SALE"]}
              />
            }
          />
          <Route
            path="users"
            element={
              <PrivateRoute
                element={<UserAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"]}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <PrivateRoute
                element={<UserDetailAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"]}
              />
            }
          />
          <Route
            path="products"
            element={
              <PrivateRoute
                element={<ProductAdmin />}
                requiredRoles={[
                  "ROLE_ADMIN",
                  "ROLE_STAFF_INVENTORY",
                  "ROLE_STAFF_SALE",
                ]}
              />
            }
          />
          <Route
            path="products/:code"
            element={
              <PrivateRoute
                element={<ProductDetailAdmin />}
                requiredRoles={[
                  "ROLE_ADMIN",
                  "ROLE_STAFF_INVENTORY",
                  "ROLE_STAFF_SALE",
                ]}
              />
            }
          />
          <Route
            path="inventory-receipts/status/:status"
            element={
              <PrivateRoute
                element={<InventoryReceiptAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"]}
              />
            }
          />
          <Route
            path="inventory-receipts"
            element={
              <PrivateRoute
                element={<InventoryReceiptDetailAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"]}
              />
            }
          />
          <Route
            path="inventory-receipts/:id"
            element={
              <PrivateRoute
                element={<InventoryReceiptDetailAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"]}
              />
            }
          />
          <Route
            path="inventory-receipts/search"
            element={
              <PrivateRoute
                element={<InventorySearchAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"]}
              />
            }
          />
          <Route
            path="inventory-receipt-details"
            element={
              <PrivateRoute
                element={<ReceiptByProductAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"]}
              />
            }
          />
          <Route
            path="categories"
            element={
              <PrivateRoute
                element={<CategoryAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"]}
              />
            }
          />
          <Route
            path="suppliers"
            element={
              <PrivateRoute
                element={<SupplierAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_INVENTORY"]}
              />
            }
          />
          <Route
            path="discounts"
            element={
              <PrivateRoute
                element={<DiscountAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_SALE"]}
              />
            }
          />
          <Route
            path="contacts"
            element={
              <PrivateRoute
                element={<ContactAdmin />}
                requiredRoles={["ROLE_ADMIN", "ROLE_STAFF_CUSTOMER_SERVICE"]}
              />
            }
          />
          <Route
            index
            element={<PrivateRoute element={<StatisticsAdmin />} />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

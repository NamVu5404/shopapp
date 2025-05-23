import { useEffect, useState } from "react";
import { MdOutlineAdminPanelSettings, MdOutlineMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Header.css";

export default function AdminHeader({ collapsed, toggleSidebar }) {
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const myInfo = useSelector((state) => state.user);

  useEffect(() => {
    if (myInfo.id) {
      setLoading(false);
    }
  }, [myInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="nice-admin-header">
      <div className="header-container">
        <div
          className="sidebar-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "50px",
            padding: "0 0",
          }}
        >
          <a
            href="/admin"
            className="logo d-flex align-items-center"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/logo/logo.png?v=1.0.0"
              alt="logo"
              style={{ maxHeight: 26, marginRight: 6 }}
            />
            <span style={{ fontSize: 30, fontWeight: 500, marginRight: 85 }}>
              ADMIN
            </span>
          </a>

          <button
            className="toggle-sidebar-btn"
            onClick={toggleSidebar}
            style={{
              display: "flex",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <MdOutlineMenu size={30} />
          </button>
        </div>

        <nav className="header-nav">
          <ul className="d-flex align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <MdOutlineAdminPanelSettings />
                <span>Trang chủ</span>
              </Link>
            </li>

            <li className="nav-item dropdown">
              <div
                className="nav-link profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="profile-name">{myInfo.fullName}</span>
              </div>

              {showProfileMenu && (
                <div className="dropdown-menu profile-dropdown">
                  <h6 className="dropdown-header">
                    Xin chào {myInfo.fullName}
                  </h6>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .nice-admin-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          padding: 0 20px;
          z-index: 997;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .header-toggle {
          display: flex;
          align-items: center;
        }
        .toggle-sidebar-btn {
          border: none;
          background: none;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          color: #012970;
        }
        .toggle-sidebar-btn:hover {
          background-color: #f6f9ff;
        }
        .search-bar {
          margin-right: auto;
          margin-left: 25px;
        }
        .search-form {
          position: relative;
          max-width: 300px;
        }
        .search-form input {
          border: 1px solid #eee;
          border-radius: 20px;
          padding: 7px 15px 7px 30px;
          width: 100%;
          font-size: 14px;
          color: #012970;
        }
        .search-form button {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          border: 0;
          background: none;
          font-size: 16px;
          padding: 0 15px;
          color: #012970;
          cursor: pointer;
        }
        .header-nav {
          margin-left: auto;
        }
        .header-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .nav-item {
          margin-left: 20px;
          position: relative;
        }
        .nav-link {
          display: flex;
          align-items: center;
          color: #012970;
          cursor: pointer;
          position: relative;
          padding: 8px 0;
        }
        .nav-link svg {
          font-size: 20px;
          margin-right: 5px;
        }
        .nav-link:hover {
          color: #4154f1;
        }
        .badge {
          position: absolute;
          top: 0;
          right: -5px;
          background: #ff0000;
          color: #fff;
          border-radius: 50%;
          font-size: 10px;
          width: 15px;
          height: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile {
          display: flex;
          align-items: center;
        }
        .profile-name {
          margin-right: 8px;
          font-size: 14px;
          color: #012970;
        }
        .profile img {
          width: 36px;
          height: 36px;
          object-fit: cover;
          border: 2px solid #eee;
        }
        .profile-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          background: #fff;
          box-shadow: 0 0 30px rgba(1, 41, 112, 0.1);
          border-radius: 4px;
          padding: 10px 0;
          min-width: 200px;
          z-index: 9999;
          margin-top: 10px;
        }
        .dropdown-header {
          padding: 8px 15px;
          color: #012970;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 0;
        }
        .dropdown-divider {
          border-top: 1px solid #eee;
          margin: 10px 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          color: #012970;
          font-size: 14px;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background-color: #f6f9ff;
        }
        .dropdown-icon {
          margin-right: 10px;
          font-size: 18px;
        }
      `}</style>
    </header>
  );
}

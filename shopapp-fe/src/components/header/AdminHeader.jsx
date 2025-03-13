import { useEffect, useState } from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyInfo } from "../../api/user";
import { getToken } from "../../services/localStorageService";
import "./Header.css";

export default function AdminHeader() {
  const [loading, setLoading] = useState(true);
  const myInfo = useSelector((state) => state.user);
  const token = getToken();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getMyInfo(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (myInfo.id) {
      setLoading(false);
    }
  }, [myInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="header">
        <div className="header-top">
          <Link to={"/admin"} className="secondary-link">
            <div className="logo">
              <img src="/logo/logo.webp" alt="logo" />
            </div>
          </Link>

          <h1>Trang Quản Trị Viên</h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              Xin chào <b>{myInfo.fullName}</b> !
            </div>

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
                to={"/"}
                style={{ display: "flex", alignItems: "center" }}
              >
                <MdOutlineAdminPanelSettings
                  style={{
                    fontSize: "24px",
                    marginRight: "5px",
                  }}
                />
                Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

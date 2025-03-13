import "./Footer.css";
import { FaLocationDot, FaClock, FaSquarePhone } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaFacebookSquare, FaYoutube, FaAmazon } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="section-1">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="/logo/logo.webp" alt="logo" style={{ width: 200 }} />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <FaLocationDot
                style={{
                  marginRight: "30px",
                  fontSize: "40px",
                }}
              />
              <span style={{ fontSize: "18px" }}>
                HCM: Lầu 2 - 219B Nơ Trang Long, P12, Bình Thạnh Hà Nội: 116 Hà
                Huy Tập, Yên Viên, Gia Lâm
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <FaClock
                style={{
                  marginRight: "30px",
                  fontSize: "35px",
                }}
              />
              <span style={{ fontSize: "18px" }}>
                Giờ làm việc: Từ 9:00 đến 18:00 các ngày trong tuần từ Thứ 2 đến
                Chủ nhật
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaSquarePhone
                style={{
                  marginRight: "30px",
                  fontSize: "25px",
                }}
              />
              <span style={{ fontSize: "18px" }}>
                Hotline: <b>099 999 9999</b>
              </span>
            </div>
          </div>

          <div
            className="section-2"
            style={{
              fontSize: "18px",
            }}
          >
            <h3 style={{ color: "#000", marginBottom: "20px" }}>
              Về chúng tôi
            </h3>

            <ol>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"/"} className="primary-link">
                  Trang chủ
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"/products"} className="primary-link">
                  Sản phẩm
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"/contact"} className="primary-link">
                  Liên hệ
                </Link>
              </li>
            </ol>
          </div>

          <div
            className="section-3"
            style={{
              fontSize: "18px",
            }}
          >
            <h3 style={{ color: "#000", marginBottom: "20px" }}>
              Hỗ trợ khách hàng
            </h3>

            <ol>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"#"} className="primary-link">
                  Chính sách bào hành
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"#"} className="primary-link">
                  Chính sách đổi trả
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"#"} className="primary-link">
                  Chính sách kiểm hàng
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"/check-order"} className="primary-link">
                  Tra cứu đơn hàng
                </Link>
              </li>
            </ol>
          </div>

          <div
            className="section-4"
            style={{
              fontSize: "18px",
            }}
          >
            <h3 style={{ color: "#000", marginBottom: "20px" }}>Hướng dẫn</h3>

            <ol>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"#"} className="primary-link">
                  Tải ứng dụng
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"#"} className="primary-link">
                  Hướng dẫn
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"#"} className="primary-link">
                  Sản phẩm
                </Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <Link to={"#"} className="primary-link">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to={"#"} className="primary-link">
                  <FaFacebookSquare size={30} style={{ marginRight: "10px" }} />
                </Link>
                <Link to={"#"} className="primary-link">
                  <FaYoutube size={30} style={{ marginRight: "10px" }} />
                </Link>
                <Link to={"#"} className="primary-link">
                  <FaAmazon size={30} />
                </Link>
              </li>
            </ol>
          </div>
        </div>

        <div className="container-end">
          <div className="footer-end">© Bản quyền thuộc về VNN</div>
        </div>
      </footer>
    </>
  );
}

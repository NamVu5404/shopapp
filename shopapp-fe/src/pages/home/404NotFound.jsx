import { Button, Result, Row, Col } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReturn = () => {
    if (location.pathname.startsWith("/admin")) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <Col>
        <Result
          status="404"
          title="404"
          subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
          extra={
            <Button type="primary" onClick={handleReturn}>
              {location.pathname.startsWith("/admin") ? "Về trang Admin" : "Về trang chủ"}
            </Button>
          }
        />
      </Col>
    </Row>
  );
}
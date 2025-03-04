import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>404 NOT FOUND !!!</h1>
      <div style={{ textAlign: "center" }}>
        <Button type="primary" onClick={handleReturn}>
          Về trang chủ
        </Button>
      </div>
    </>
  );
}

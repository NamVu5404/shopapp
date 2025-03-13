import { Navigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import { useEffect, useState } from "react";
import { introspect } from "../api/auth";
import { message, Space, Spin, Typography } from "antd";
import { hasPermission } from "../services/authService";

const PrivateRoute = ({ element, requiredRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const token = getToken();

  useEffect(() => {
    const isValidToken = async () => {
      if (token) {
        try {
          const isValid = await introspect(token);
          setIsLogin(isValid);
        } catch (error) {
          console.error("lỗi ở private route");
          setIsLogin(false);
        }
      } else {
        setIsLogin(false);
      }

      setIsLoading(false);
    };

    isValidToken();
  }, [token]);

  if (isLoading) {
    return (
      <>
        <Space
          direction="vertical"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
          <Typography>Loading ...</Typography>
        </Space>
      </>
    );
  }

  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  if (!hasPermission(requiredRoles)) {
    message.error("Bạn không được ủy quyền!");
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;

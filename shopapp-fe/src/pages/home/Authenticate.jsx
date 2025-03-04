import { message, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/localStorageService";
import { useDispatch } from "react-redux";
import { getMyInfo } from "../../api/user";

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const authCodeRegex = /code=([^&#]+)/;
    const isMatch = window.location.href.match(authCodeRegex);
    const provider = localStorage.getItem("oauth_provider");

    if (isMatch) {
      const authCode = isMatch[1];

      fetch(
        `http://localhost:8088/api/v1/auth/outbound/authentication?provider=${provider}&code=${authCode}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const token = data.result?.token;
          if (token) {
            setToken(token);
            setIsLoggedin(true);

            // Dispatch để lấy thông tin người dùng và lưu vào Redux store
            dispatch(getMyInfo(token));

            localStorage.removeItem("oauth_provider");
          }
        })
        // .then((data) => {
        //   setToken(data.result?.token);
        //   setIsLoggedin(true);

        //   dispatch(getMyInfo(token));

        //   localStorage.removeItem("oauth_provider");
        // })
        .catch((error) => {
          message.error(error.message);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
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
      <Typography>Authenticating...</Typography>
    </Space>
  );
}

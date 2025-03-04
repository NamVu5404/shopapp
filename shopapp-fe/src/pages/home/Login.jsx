import { GoogleOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { introspect, login } from "../../api/auth";
import MyButton from "../../components/MyButton";
import { OAuthConfig } from "../../configurations/configuration";
import { getToken } from "../../services/localStorageService";

export default function Login() {
  const navigate = useNavigate();
  const token = getToken();

  const handleContinueWithFacebook = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const facebookAuthUrl = OAuthConfig.authUri_facebook;
    const facebookClientId = OAuthConfig.clientId_facebook;

    // Lưu provider vào localStorage
    localStorage.setItem("oauth_provider", "facebook");

    const targetUrl = `${facebookAuthUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${facebookClientId}&scope=email%20public_profile`;

    window.location.href = targetUrl;
  };

  const handleContinueWithGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const googleAuthUrl = OAuthConfig.authUri_google;
    const googleClientId = OAuthConfig.clientId_google;

    // Lưu provider vào localStorage
    localStorage.setItem("oauth_provider", "google");

    const targetUrl = `${googleAuthUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
  };

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const isValid = await introspect(token);

        if (isValid) {
          navigate("/");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (token) {
      checkTokenValidity();
    }
  }, [navigate, token]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (values) => {
    const data = {
      username: values.username,
      password: values.password,
    };
    
    login(data, navigate);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            minWidth: 420,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 10,
            padding: 20,
            color: "var(--primary-color)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>Đăng nhập</h2>
          <Form
            onFinish={handleLogin}
            initialValues={{ username, password }}
            style={{ marginBottom: -10 }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                placeholder="Email"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <MyButton style={{ width: "100%" }} htmlType="submit">
                Đăng nhập
              </MyButton>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Link
              to={"/password/forgot"}
              style={{
                fontSize: "16px",
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <span
              style={{
                fontSize: "16px",
              }}
            >
              Hoặc đăng nhập bằng
            </span>
          </div>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              icon={<FaFacebookF style={{ fontSize: "18px" }} />}
              onClick={handleContinueWithFacebook}
              block
              style={{
                backgroundColor: "#0866FF",
                color: "#fff",
              }}
            >
              Continue with Facebook
            </Button>
            <Button
              icon={<GoogleOutlined style={{ fontSize: "18px" }} />}
              onClick={handleContinueWithGoogle}
              block
              style={{
                backgroundColor: "#E34133",
                color: "#fff",
              }}
            >
              Continue with Google
            </Button>
            <Divider />
            <div style={{ fontSize: 16, textAlign: "center" }}>
              Bạn chưa có tài khoản?
              <Link to={"/register"}> Đăng ký ngay</Link>
            </div>
          </Space>
        </Card>
      </div>
    </>
  );
}

import { Button, Form, Input, message } from "antd";
import { useOutletContext } from "react-router-dom";
import { changePassword, setPassword } from "../../api/password";
import MyButton from "../../components/MyButton";

export default function MyPassword() {
  const { userDetails } = useOutletContext();
  const [formSet] = Form.useForm();
  const [formChange] = Form.useForm();

  const handleCancel = () => {
    // Reset form về giá trị ban đầu (initialValues)
    formSet.resetFields();
    formChange.resetFields();
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.reNewPassword) {
      message.error("Nhập lại mật khẩu không khớp!");
      return;
    }

    if (values.newPassword === values.oldPassword) {
      message.error("Mật khẩu mới phải khác mật khẩu cũ!");
      return;
    }

    const body = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };

    await changePassword(body);
    formChange.resetFields();
  };

  const handleSetPassword = async (values) => {
    if (values.password !== values.rePassword) {
      message.error("Nhập lại mật khẩu không khớp!");
      return;
    }

    const body = {
      password: values.password,
    };

    await setPassword(body);
  };

  return (
    <>
      <h3 style={{ marginBottom: 5 }}>Mật Khẩu Và Bảo Mật</h3>

      {userDetails.hasPassword ? (
        <>
          <p style={{ marginBottom: 20 }}>Đổi mật khẩu</p>

          <Form
            form={formChange}
            onFinish={handleChangePassword}
            style={{ marginBottom: 10, maxWidth: 350 }}
          >
            <Form.Item
              name="oldPassword"
              rules={[
                { required: true, message: "Please enter your old password!" },
              ]}
            >
              <Input.Password placeholder="Mật khẩu cũ" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your new password!",
                },
              ]}
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item
              name="reNewPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please enter your new password again!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("New password do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>

            <Button
              onClick={handleCancel}
              style={{ width: "100%", marginBottom: 10 }}
            >
              Hủy
            </Button>
            <Form.Item>
              <MyButton style={{ width: "100%" }} htmlType="submit">
                Lưu
              </MyButton>
            </Form.Item>
          </Form>
        </>
      ) : (
        <>
          <p style={{ marginBottom: 20 }}>Bạn chưa có mật khẩu? Tạo ngay</p>

          <Form
            form={formSet}
            onFinish={handleSetPassword}
            style={{ marginBottom: 10, maxWidth: 350 }}
          >
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="rePassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your password again!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Button
              onClick={handleCancel}
              style={{ width: "100%", marginBottom: 10 }}
            >
              Hủy
            </Button>
            <Form.Item>
              <MyButton style={{ width: "100%" }} htmlType="submit">
                Lưu
              </MyButton>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
}

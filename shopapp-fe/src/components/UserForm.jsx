import { Button, Checkbox, DatePicker, Form, Input } from "antd";
import MyButton from "./MyButton";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRoles } from "../context/RoleContext";

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

export default function UserForm({
  initValues,
  onSubmit,
  submitButtonText,
  isUpdate,
  isAdmin,
}) {
  const [form] = Form.useForm();
  const roles = useRoles();

  // Convert `dob` to moment object if exists
  const formattedInitValues = {
    ...initValues,
    dob: initValues?.dob ? dayjs(initValues.dob, "YYYY-MM-DD", true) : null,
  };

  const handleCancel = () => {
    // Reset form về giá trị ban đầu (initialValues)
    form.resetFields();
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onSubmit}
        style={{ marginBottom: 10, maxWidth: 350 }}
        initialValues={formattedInitValues}
      >
        <Form.Item name="id" style={{ display: "none" }}>
          <Input />
        </Form.Item>
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input placeholder="Email" disabled={isUpdate} />
        </Form.Item>

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "20px" }}>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: "Please enter your phone!" }]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </div>
          <div>
            <Form.Item name="dob">
              <DatePicker placeholder="Ngày sinh" format={dateFormat} />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="password"
          rules={[
            { required: !isUpdate, message: "Please enter your password!" },
          ]}
          style={{ display: isUpdate && "none" }}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        {isAdmin && (
          <Form.Item name="roles">
            <Checkbox.Group>
              {roles.map((role) => (
                <Checkbox key={role.code} value={role.code}>
                  {role.description}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        )}

        {isUpdate && (
          <Button
            onClick={handleCancel}
            style={{ width: "100%", marginBottom: 10 }}
          >
            Hủy chỉnh sửa
          </Button>
        )}
        <Form.Item>
          <MyButton style={{ width: "100%" }} htmlType="submit">
            {submitButtonText}
          </MyButton>
        </Form.Item>
      </Form>
    </>
  );
}

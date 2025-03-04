import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/password";
import { deleteUser, updateUser } from "../../api/user";
import MyButton from "../../components/MyButton";
import {
  createAddress,
  deleteAddress,
  getAddressesByUserId,
  updateAddress,
} from "../../api/address";
import AddressModal from "../../components/AddressModal";
import { useRoles } from "../../context/RoleContext";
import { hasPermission } from "../../services/authService";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const customFormat = (value) => {
  return value && dayjs(value).isValid()
    ? dayjs(value).format(dateFormat)
    : null;
};

const { Text } = Typography;

export default function UserDetailAdmin() {
  const location = useLocation();
  const initialUser = location.state?.user || {};
  const [user, setUser] = useState(initialUser);
  const [form] = Form.useForm();
  const [addressData, setAddressData] = useState(null);
  const [initValues, setInitValues] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const roles = useRoles();
  const navigate = useNavigate();

  // Address
  useEffect(() => {
    const getAddressData = async () => {
      const result = await getAddressesByUserId(user.id);
      setAddressData(result);
    };

    getAddressData();
  }, [user]);

  const refreshAddressList = async () => {
    const updatedData = await getAddressesByUserId(user.id);
    setAddressData(updatedData);
  };

  const handleAddAddress = () => {
    setInitValues(null);
    setIsModalOpen(true);
  };

  const handleUpdateAddress = (address) => {
    setInitValues(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    await deleteAddress(addressId);
    await refreshAddressList();
  };

  const handleModalSubmit = async (address) => {
    if (initValues?.id) {
      await updateAddress(initValues.id, address);
    } else {
      address.userId = user.id;
      await createAddress(address);
    }
    setIsModalOpen(false);
    await refreshAddressList();
  };

  // User
  const handleCancel = () => {
    form.resetFields();
    window.location.reload();
  };

  const onSubmit = async (values) => {
    const data = {
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
      dob: customFormat(values.dob),
      roles: values.roles,
      isGuest: values.isGuest,
    };

    await updateUser(data, user.id);

    setUser({
      ...user,
      ...data,
    });
  };

  const handleDelete = async () => {
    await deleteUser(user.id);
    navigate("/admin/users")
  };

  const handleResetPassword = async () => {
    await resetPassword(user.id);
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        phone: user.phone,
        dob: dayjs(user.dob),
        createdDate: dayjs(user.createdDate),
        modifiedBy: user.modifiedBy,
        modifiedDate: dayjs(user.modifiedDate),
        isActive: user.isActive,
        isGuest: user.isGuest,
        roles: user.roles,
      });
    }
  }, [user, form]);

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Chi tiết tài khoản</h2>

      <div style={{ display: "flex" }}>
        <Card style={{ width: 500 }}>
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item label="ID" name="id">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Email" name="username">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Họ và tên" name="fullName">
              <Input required />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input required />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dob">
              <DatePicker style={{ width: "100%" }} dateFormat={dateFormat} />
            </Form.Item>

            <Form.Item label="Ngày tạo" name="createdDate">
              <DatePicker showTime style={{ width: "100%" }} disabled />
            </Form.Item>

            <Form.Item label="Ngày chỉnh sửa" name="modifiedDate">
              <DatePicker showTime style={{ width: "100%" }} disabled />
            </Form.Item>

            <Form.Item label="Người chỉnh sửa" name="modifiedBy">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Trạng thái tài khoản"
              name="isActive"
              valuePropName="checked"
            >
              <span
                style={{
                  color: user.isActive === 0 ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                {user.isActive === 0 ? "Đã xóa" : "Hoạt động"}
              </span>
            </Form.Item>

            <Form.Item
              label="Loại tài khoản"
              name="isGuest"
              valuePropName="checked"
            >
              <span
                style={{
                  color: user.isGuest === 0 ? "green" : "#FFA500",
                  fontWeight: "bold",
                }}
              >
                {user.isGuest === 0 ? "Người dùng hệ thống" : "Khách"}
              </span>
            </Form.Item>

            <Form.Item label="Vai trò" name="roles">
              <Checkbox.Group>
                {roles.map((role) => (
                  <Checkbox key={role.code} value={role.code}>
                    {role.description}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>

            {user.isActive === 1 && (
              <Form.Item>
                <Button onClick={handleCancel} style={{ marginRight: 20 }}>
                  Hủy
                </Button>
                <MyButton
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 20 }}
                >
                  Cập nhật
                </MyButton>
                {hasPermission(["ROLE_ADMIN"]) && (
                  <Button
                    danger
                    onClick={handleDelete}
                    style={{ marginRight: 20 }}
                  >
                    Xóa tài khoản
                  </Button>
                )}
                {user.hasPassword && (
                  <Button onClick={handleResetPassword} type="primary">
                    Reset mật khẩu
                  </Button>
                )}
              </Form.Item>
            )}
          </Form>
        </Card>

        {/* Address */}
        <div style={{ flex: 1, marginLeft: 20 }}>
          <MyButton onClick={handleAddAddress}>Thêm địa chỉ</MyButton>
          <Divider />
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {(addressData || []).map((address) => (
              <Card key={address.id}>
                <Row>
                  <Col xl={18}>
                    <div>
                      <Text strong>{address.fullName}</Text> | {address.phone}
                    </div>
                    <div>{address.detail}</div>
                    <div>
                      {address.ward}, {address.district}, {address.province}
                    </div>
                  </Col>

                  <Col xl={6} style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      type="link"
                      onClick={() => handleUpdateAddress(address)}
                    >
                      Cập nhật
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Xóa
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>

          <AddressModal
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initValues={initValues}
            isUpdateAdmin={!!initValues && !!initValues.id}
          />
        </div>
      </div>
    </>
  );
}

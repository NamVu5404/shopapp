import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createUser, searchUser } from "../../api/user";
import MyButton from "../../components/MyButton";
import UserForm from "../../components/UserForm";
import { useRoles } from "../../context/RoleContext";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const customFormat = (value) => (value ? `${value.format(dateFormat)}` : null);

const UserAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [userData, setUserData] = useState([]);
  const [id, setId] = useState(queryParams.get("id") || "");
  const [username, setUsername] = useState(queryParams.get("username") || "");
  const [fullName, setFullName] = useState(queryParams.get("fullName") || "");
  const [phone, setPhone] = useState(queryParams.get("phone") || "");
  const [role, setRole] = useState(queryParams.get("role") || "");
  const [isGuest, setIsGuest] = useState(queryParams.get("isGuest") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page"), 10) || 1
  );
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const roles = useRoles();

  // ✅ Hàm cập nhật URL
  const updateURL = (newParams) => {
    const params = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        // ❌ Không thêm page vào URL
        params.set(key, value);
      }
    });

    navigate(`?${params.toString()}`, { replace: true });
  };

  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setCurrentPage(1);
    setId("");
    setUsername("");
    setFullName("");
    setPhone("");
    setRole("");
    setIsGuest("");
    form.resetFields();

    updateURL({}); // ✅ Reset URL khi xoá bộ lọc
  };

  const handleSubmit = (values) => {
    const newParams = {
      id: values.id ?? id,
      username: values.username ?? username,
      fullName: values.fullName ?? fullName,
      phone: values.phone ?? phone,
      role: values.role ?? role,
      isGuest: values.isGuest ?? isGuest,
      page: 1, // Reset về trang đầu khi lọc mới
    };

    setCurrentPage(1);
    setId(newParams.id);
    setUsername(newParams.username);
    setFullName(newParams.fullName);
    setPhone(newParams.phone);
    setRole(newParams.role);
    setIsGuest(newParams.isGuest);

    updateURL(newParams); // ✅ Cập nhật URL khi thay đổi bộ lọc
  };

  useEffect(() => {
    const getUsers = async () => {
      const request = {
        id,
        username,
        fullName,
        phone,
        role,
        isGuest,
      };
      const data = await searchUser(request, currentPage, pageSize);
      setUserData(data.data);
      setTotalItems(data.totalElements);
    };

    getUsers();

    form.setFieldsValue({
      id,
      username,
      fullName,
      phone,
      role,
      isGuest,
    });
  }, [
    id,
    username,
    fullName,
    phone,
    role,
    isGuest,
    currentPage,
    pageSize,
    form,
  ]);

  // Columns definition
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <Link
            to={`/admin/users/${id}`}
            state={{ user: record }}
            style={record.isActive ? {} : { color: "red" }}
          >
            {id}
          </Link>
        );
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => (
        <>
          {roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "isGuest",
      key: "isGuest",
      render: (isGuest) => {
        return (
          isGuest === 1 && (
            <span
              style={{
                color: "#FFA500",
                fontWeight: "bold",
              }}
            >
              Khách
            </span>
          )
        );
      },
    },
  ];

  const handleRegister = async (values) => {
    const dob = customFormat(values.dob);

    const data = {
      username: values.username,
      password: values.password,
      fullName: values.fullName,
      phone: values.phone,
      dob: dob,
      roles: values.roles,
    };

    try {
      await createUser(data);
    } catch (e) {
      return;
    }
  };

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Quản lý tài khoản</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={20}>
          <Col xl={9}>
            <Form.Item name="id">
              <Input placeholder="Nhập ID" />
            </Form.Item>
          </Col>
          <Col xl={9}>
            <Form.Item name="username">
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </Col>
          <Col xl={6}>
            <Form.Item name="role">
              <Select placeholder="---Chọn role ---">
                <Select.Option value={""}>--- Chọn role ---</Select.Option>
                {roles.map((role) => (
                  <Select.Option key={role.code} value={role.code}>
                    {role.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col xl={9}>
            <Form.Item name="fullName">
              <Input placeholder="Nhập Full Name" />
            </Form.Item>
          </Col>

          <Col xl={9}>
            <Form.Item name="phone">
              <Input placeholder="Nhập Phone" />
            </Form.Item>
          </Col>

          <Col xl={6}>
            <Form.Item name="isGuest">
              <Radio.Group>
                <Radio value={"0"}>Người dùng hệ thống</Radio>
                <Radio value={"1"}>Khách</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="primary" onClick={showModal}>
            Thêm mới
          </Button>

          <Form.Item>
            <Button onClick={handleCancel} style={{ marginRight: 20 }}>
              Hủy
            </Button>
            <MyButton htmlType="submit">Tìm kiếm</MyButton>
          </Form.Item>
        </Row>
      </Form>

      <Modal
        title="Thêm mới"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <UserForm
          onSubmit={handleRegister}
          submitButtonText="Thêm"
          isDisabled={false}
          isAdmin={true}
        />
      </Modal>

      <Divider />

      <Table
        dataSource={userData}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </>
  );
};

export default UserAdmin;

import {
  CaretRightOutlined,
  ClearOutlined,
  EyeOutlined,
  FilterOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createUser, searchUser } from "../../api/user";
import UserForm from "../../components/UserForm";
import { useRoles } from "../../context/RoleContext";

const { Panel } = Collapse;
const { Text } = Typography;

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const customFormat = (value) => (value ? `${value.format(dateFormat)}` : null);

// Form thêm mới người dùng được cải tiến
const UserFormImproved = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <UserForm
      onSubmit={onFinish}
      submitButtonText="Thêm"
      isDisabled={false}
      isAdmin={true}
    />
  );
};

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
  const pageSize = 20;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const roles = useRoles();
  const [loading, setLoading] = useState(false);

  // Hàm lấy chữ cái đầu của tên người dùng
  const getFirstLetterAvatar = (fullName) => {
    if (!fullName) return null;
    return fullName.trim().charAt(0).toUpperCase();
  };

  // Hàm cập nhật URL
  const updateURL = (newParams) => {
    const params = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && key !== "page") {
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

    updateURL({}); // Reset URL khi xoá bộ lọc
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

    updateURL(newParams); // Cập nhật URL khi thay đổi bộ lọc
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const request = {
          id,
          username,
          fullName,
          phone,
          role,
          isGuest,
        };
        const data = await searchUser(request, currentPage, pageSize);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  // Lấy tên role từ code
  const getRoleName = (roleCode) => {
    const role = roles.find((r) => r.code === roleCode);
    return role ? role.description : roleCode;
  };

  // Hàm chuyển hướng đến trang chi tiết người dùng
  const navigateToUserDetail = (id) => {
    navigate(`/admin/users/${id}`);
  };

  // Columns definition
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Thông tin người dùng",
      key: "userInfo",
      render: (_, record) => (
        <div style={{ cursor: "pointer" }}>
          <Space size="middle">
            <Avatar
              style={{
                backgroundColor: "#1890ff",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
            >
              {getFirstLetterAvatar(record.fullName)}
            </Avatar>
            <Space direction="vertical" size={0}>
              <Text strong style={!record.isActive ? { color: "#ff4d4f" } : {}}>
                {record.fullName || "N/A"}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ID: {record.id}
              </Text>
            </Space>

            {record.isGuest === 1 && <Tag color="orange">Khách</Tag>}
            {!record.isActive && <Tag color="red">Không hoạt động</Tag>}
          </Space>
        </div>
      ),
    },
    {
      title: "Vai trò",
      key: "roles",
      render: (_, record) => (
        <>
          {record.roles && record.roles.length > 0 ? (
            <Space wrap>
              {record.roles.map((roleCode) => (
                <Tag color="blue" key={roleCode}>
                  {getRoleName(roleCode)}
                </Tag>
              ))}
            </Space>
          ) : (
            <Text type="secondary">Chưa phân quyền</Text>
          )}
        </>
      ),
      width: 200,
    },
    {
      title: "Thông tin liên hệ",
      key: "contactInfo",
      render: (_, record) => (
        <Space direction="vertical" size={1}>
          <Space>
            <MailOutlined style={{ color: "#1890ff" }} />
            <Text>{record.username || "N/A"}</Text>
          </Space>
          <Space>
            <PhoneOutlined style={{ color: "#52c41a" }} />
            <Text>{record.phone || "N/A"}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => formatDate(dob),
      width: 120,
    },
    {
      title: "",
      key: "actions",
      width: 10,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigateToUserDetail(record.id)}
            aria-label="Xem chi tiết"
          />
        </Tooltip>
      ),
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
      setIsModalVisible(false);
      // Refresh danh sách sau khi tạo thành công
      const request = {
        id,
        username,
        fullName,
        phone,
        role,
        isGuest,
      };
      const refreshedData = await searchUser(request, currentPage, pageSize);
      setUserData(refreshedData);
    } catch (e) {
      return;
    }
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: "Quản lý tài khoản" },
        ]}
      />

      <Collapse
        style={{
          borderRadius: "8px",
          marginBottom: 24,
        }}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            style={{ fontSize: "16px", color: "#1890ff" }}
          />
        )}
      >
        <Panel
          header={
            <div style={{ display: "flex", alignItems: "center" }}>
              <FilterOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              <span style={{ fontWeight: 500, fontSize: "15px" }}>
                Bộ lọc tìm kiếm
              </span>
            </div>
          }
          key="1"
          style={{ borderRadius: "8px", backgroundColor: "#fafafa" }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item name="id" label="ID người dùng">
                  <Input placeholder="Nhập ID" prefix={<IdcardOutlined />} />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item name="username" label="Email">
                  <Input placeholder="Nhập Email" prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item name="role" label="Vai trò">
                  <Select placeholder="Chọn vai trò">
                    <Select.Option value="">Tất cả vai trò</Select.Option>
                    {roles.map((role) => (
                      <Select.Option key={role.code} value={role.code}>
                        {role.description}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item name="fullName" label="Họ và tên">
                  <Input placeholder="Nhập họ tên" prefix={<UserOutlined />} />
                </Form.Item>
              </Col>

              <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input
                    placeholder="Nhập số điện thoại"
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item name="isGuest" label="Loại tài khoản">
                  <Radio.Group>
                    <Radio value="">Tất cả</Radio>
                    <Radio value="0">Người dùng hệ thống</Radio>
                    <Radio value="1">Khách</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <Space>
                  <Button icon={<ClearOutlined />} onClick={handleCancel}>
                    Xóa bộ lọc
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    Tìm kiếm
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>Tổng số: {userData.totalElements || 0} người dùng</Text>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm mới
        </Button>
      </div>

      <Table
        dataSource={userData.data}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        bordered
        rowClassName={(record) => (!record.isActive ? "inactive-row" : "")}
        style={{ marginBottom: 16 }}
      />

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={userData.totalElements}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>Thêm mới người dùng</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        style={{ top: 20 }}
        width={400}
        destroyOnClose={true}
      >
        <UserFormImproved onSubmit={handleRegister} />
      </Modal>

      <style>
        {`
          .inactive-row {
            background-color: #fff1f0;
          }
        `}
      </style>
    </>
  );
};

export default UserAdmin;

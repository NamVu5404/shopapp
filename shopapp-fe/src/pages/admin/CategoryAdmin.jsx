import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Divider,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../api/category";
import CategoryForm from "../../components/CategoryForm";
import { useCategories } from "../../context/CategoryContext";

const { Text } = Typography;

export default function CategoryAdmin() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const categories = useCategories();

  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const showUpdateModal = (category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  const handleCreate = async (data) => {
    const createdCategory = {
      ...data,
      supplierCodes: data.suppliers || [],
    };
    await createCategory(createdCategory);
  };

  const handleUpdate = async (data) => {
    const updatedCategory = {
      ...data,
      supplierCodes: data.suppliers || [],
    };
    await updateCategory(editingCategory.code, updatedCategory);
    window.location.reload();
  };

  const handleDelete = async (category) => {
    await deleteCategory(category.code);
    window.location.reload();
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <Link to={`/admin/products?categoryCode=${code}`}>{code}</Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Suppliers",
      dataIndex: "suppliers",
      key: "suppliers",
      render: (suppliers) => (
        <Space size={[0, 4]} wrap>
          {suppliers.map((supplier) => (
            <Tag color="blue" key={supplier.code}>
              {supplier.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center",
      render: (category) => (
        <Space size="small">
          <Tooltip title="Cập nhật">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => showUpdateModal(category)}
            >

            </Button>
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(category)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
              >
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: "Quản lý danh mục" },
        ]}
      />

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>Tổng số: {categories?.length || 0} danh mục</Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          size="middle"
        >
          Thêm mới
        </Button>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="code"
        pagination={false}
        bordered
        size="middle"
        scroll={{ x: 800 }}
        loading={categories.length === 0}
      />

      <Modal
        title={
          <span>
            {editingCategory ? "Cập nhật danh mục" : "Thêm mới danh mục"}
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnClose={true}
        width={500}
        maskClosable={false}
        centered
      >
        <CategoryForm
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          submitButtonText={editingCategory ? "Cập nhật" : "Thêm mới"}
          initValues={editingCategory}
          isUpdate={editingCategory}
          isCategory={true}
        />
      </Modal>
    </>
  );
}

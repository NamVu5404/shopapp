import { Button, Divider, Modal, Table, Tag } from "antd";
import { useState } from "react";
import { useCategories } from "../../context/CategoryContext";
import CategoryForm from "../../components/CategoryForm";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../api/category";
import { Link } from "react-router-dom";

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
      supplierIds: data.suppliers || [],
    };
    await createCategory(createdCategory);
  };

  const handleUpdate = async (data) => {
    const updatedCategory = {
      ...data,
      supplierIds: data.suppliers || [],
    };
    await updateCategory(editingCategory.code, updatedCategory);
    window.location.reload();
  };

  const handleDelete = async (category) => {
    await deleteCategory(category.id);
    window.location.reload();
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => {
        return <Link to={`/admin/products?categoryCode=${code}`}>{code}</Link>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Suppliers",
      dataIndex: "suppliers",
      key: "suppliers",
      render: (suppliers) => {
        return (
          <>
            {suppliers.map((supplier) => (
              <Tag color="blue" key={supplier.id}>
                {supplier.name}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (category) => {
        return (
          <>
            <Button type="link" onClick={() => showUpdateModal(category)}>
              Cập nhật
            </Button>
            <Button type="link" danger onClick={() => handleDelete(category)}>
              Xóa
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Quản lý danh mục</h2>

      <Button type="primary" onClick={showModal}>
        Thêm mới
      </Button>

      <Divider />

      <Modal
        title={editingCategory ? "Cập nhật" : "Thêm mới"}
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CategoryForm
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          submitButtonText={editingCategory ? "Cập nhật" : "Thêm"}
          initValues={editingCategory}
          isUpdate={editingCategory}
          isCategory={true}
        />
      </Modal>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </>
  );
}

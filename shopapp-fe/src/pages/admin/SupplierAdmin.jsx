import { Button, Divider, Modal, Table } from "antd";
import { useState } from "react";
import {
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "../../api/supplier";
import CategoryForm from "../../components/CategoryForm";
import { useSuppliers } from "../../context/SupplierContext";
import { Link } from "react-router-dom";

export default function SupplierAdmin() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const suppliers = useSuppliers();

  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
    setEditingSupplier(null);
  };

  const showUpdateModal = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalVisible(true);
  };

  const handleCreate = async (data) => {
    await createSupplier(data);
  };

  const handleUpdate = async (data) => {
    await updateSupplier(editingSupplier.code, data);
    window.location.reload();
  };

  const handleDelete = async (supplier) => {
    await deleteSupplier(supplier.id);
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
        return <Link to={`/admin/products?supplierCode=${code}`}>{code}</Link>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (supplier) => {
        return (
          <>
            <Button type="link" onClick={() => showUpdateModal(supplier)}>
              Cập nhật
            </Button>
            <Button type="link" danger onClick={() => handleDelete(supplier)}>
              Xóa
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Quản lý nhà cung cấp</h2>

      <Button type="primary" onClick={showModal}>
        Thêm mới
      </Button>

      <Divider />

      <Modal
        title={editingSupplier ? "Cập nhật" : "Thêm mới"}
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
          onSubmit={editingSupplier ? handleUpdate : handleCreate}
          submitButtonText={editingSupplier ? "Cập nhật" : "Thêm"}
          initValues={editingSupplier}
          isUpdate={editingSupplier}
          isCategory={false}
        />
      </Modal>

      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </>
  );
}

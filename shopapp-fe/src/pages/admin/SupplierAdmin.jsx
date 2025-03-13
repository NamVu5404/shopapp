import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Divider,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "../../api/supplier";
import CategoryForm from "../../components/CategoryForm";
import { useSuppliers } from "../../context/SupplierContext";

const { Text } = Typography;

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
    await deleteSupplier(supplier.code);
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
        <Link to={`/admin/products?supplierCode=${code}`}>{code}</Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      align: "center",
      render: (supplier) => (
        <Space size="small">
          <Tooltip title="Cập nhật">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => showUpdateModal(supplier)}
            >
              Cập nhật
            </Button>
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
            onConfirm={() => handleDelete(supplier)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
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
          { title: "Quản lý nhà cung cấp" },
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
        <Text strong>Tổng số: {suppliers?.length || 0} nhà cung cấp</Text>
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
        dataSource={suppliers}
        columns={columns}
        rowKey="code"
        pagination={{
          defaultPageSize: 20,
        }}
        bordered
        size="middle"
        scroll={{ x: 800 }}
        loading={suppliers.length === 0}
      />

      <Modal
        title={
          <span>
            {editingSupplier
              ? "Cập nhật nhà cung cấp"
              : "Thêm mới nhà cung cấp"}
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
          onSubmit={editingSupplier ? handleUpdate : handleCreate}
          submitButtonText={editingSupplier ? "Cập nhật" : "Thêm mới"}
          initValues={editingSupplier}
          isUpdate={editingSupplier}
          isCategory={false}
        />
      </Modal>
    </>
  );
}

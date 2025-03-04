import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  createOrUpdateDiscount,
  deleteDiscount,
  getAllDiscount,
} from "../../api/discount";
import MyButton from "../../components/MyButton";

const { RangePicker } = DatePicker;

export default function DiscountAdmin() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountData, setDiscountData] = useState(null);
  const [form] = Form.useForm();

  // Fetch data
  useEffect(() => {
    const getDiscounts = async () => {
      const data = await getAllDiscount();
      setDiscountData(data);
    };

    getDiscounts();
  }, []);

  // 🟢 Mở modal cho "Thêm mới"
  const showCreateModal = () => {
    setEditingDiscount(null); // Không có dữ liệu cũ
    form.resetFields(); // Reset form
    setIsModalVisible(true);
  };

  // 🟡 Mở modal cho "Cập nhật"
  const showUpdateModal = (discount) => {
    setEditingDiscount(discount);
    form.setFieldsValue({
      ...discount,
      range:
        discount.startDate && discount.endDate
          ? [dayjs(discount.startDate), dayjs(discount.endDate)]
          : [],
    });
    setIsModalVisible(true);
  };

  // 🔴 Đóng modal và reset form
  const handleCancelModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      startDate: values.range ? values.range[0].format("YYYY-MM-DD") : null,
      endDate: values.range ? values.range[1].format("YYYY-MM-DD") : null,
    };

    await createOrUpdateDiscount(formattedValues);

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (discount) => {
    await deleteDiscount(discount.id);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Hành động",
      key: "action",
      render: (discount) => (
        <>
          <Button type="link" onClick={() => showUpdateModal(discount)}>
            Cập nhật
          </Button>
          <Button type="link" danger onClick={() => handleDelete(discount)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Quản lý mã giảm giá</h2>

      <Button type="primary" onClick={showCreateModal}>
        Thêm mới
      </Button>

      <Divider />

      <Table
        dataSource={discountData}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      {/* Modal thêm/sửa */}
      <Modal
        title={editingDiscount ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ marginBottom: 10, maxWidth: 450, minWidth: 300 }}
        >
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Tên mã giảm giá" />
          </Form.Item>

          <Form.Item
            name="percent"
            rules={[{ required: true, message: "Vui lòng nhập phần trăm" }]}
          >
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
              placeholder="Phần trăm giảm giá"
              style={{ width: "100%" }}
              step={0.01}
            />
          </Form.Item>

          <Form.Item name="range">
            <RangePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Form.Item>

          <Form.Item>
            <MyButton style={{ width: "100%" }} htmlType="submit">
              {editingDiscount ? "Cập nhật" : "Lưu"}
            </MyButton>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

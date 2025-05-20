import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createDiscount,
  deleteDiscount,
  getAllDiscount,
  updateDiscount,
} from "../../api/discount";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function DiscountAdmin() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountData, setDiscountData] = useState([]);
  const [form] = Form.useForm();

  // Fetch data
  useEffect(() => {
    const getDiscounts = async () => {
      const data = await getAllDiscount();
      setDiscountData(data);
    };

    getDiscounts();
  }, []);

  // Mở modal cho "Thêm mới"
  const showCreateModal = () => {
    setEditingDiscount(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal cho "Cập nhật"
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

  // Đóng modal và reset form
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

    if (values?.id) {
      await updateDiscount(values.id, formattedValues);
    } else {
      await createDiscount(formattedValues);
    }

    // Reload data after update
    const data = await getAllDiscount();
    setDiscountData(data);

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (discount) => {
    await deleteDiscount(discount.id);

    // Reload data after delete
    const data = await getAllDiscount();
    setDiscountData(data);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
      render: (percent) => <span>{percent.toFixed(2)}%</span>,
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
      width: 100,
      align: "center",
      render: (discount) => (
        <Space size="small">
          <Tooltip title="Cập nhật">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => showUpdateModal(discount)}
            >
            </Button>
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa mã giảm giá này?"
            onConfirm={() => handleDelete(discount)}
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
          { title: "Quản lý mã giảm giá" },
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
        <Text strong>Tổng số: {discountData?.length || 0} mã giảm giá</Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          size="middle"
        >
          Thêm mới
        </Button>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      <Table
        dataSource={discountData}
        columns={columns}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
        }}
        bordered
        size="middle"
        scroll={{ x: 800 }}
        loading={discountData.length === 0}
      />

      <Modal
        title={
          <span>
            {editingDiscount ? "Cập nhật mã giảm giá" : "Thêm mới mã giảm giá"}
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
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
          layout="vertical"
        >
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên mã giảm giá"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Nhập tên mã giảm giá" />
          </Form.Item>

          <Form.Item
            name="percent"
            label="Phần trăm giảm giá"
            rules={[{ required: true, message: "Vui lòng nhập phần trăm" }]}
          >
            <InputNumber
              min={0}
              max={99}
              addonAfter="%"
              placeholder="Nhập phần trăm giảm giá"
              style={{ width: "100%" }}
              step={0.01}
              precision={2}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="range"
            label="Thời gian áp dụng"
            rules={[
              { required: true, message: "Vui lòng chọn khoảng thời gian!" },
            ]}
          >
            <RangePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{ width: "100%" }} htmlType="submit">
              {editingDiscount ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

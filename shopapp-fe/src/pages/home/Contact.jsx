import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createContact } from "../../api/contact";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Contact() {
  const user = useSelector((state) => state.user);
  const [initialData, setInitialData] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      const newData = {
        email: user.username,
        fullName: user.fullName,
        phone: user.phone,
      };
      setInitialData(newData);
      form.setFieldsValue(newData);
    }
  }, [user, form]);

  const onFinish = async (values) => {
    await createContact(values);
    form.resetFields();
    message.success("Đã gửi tin nhắn thành công");
  };

  // Reset search form
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[{ title: <Link to="/">Trang chủ</Link> }, { title: "Liên hệ" }]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Title
            level={4}
            style={{
              color: "var(--primary-color)",
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            GACE STORE - PHỤ KIỆN GAME
          </Title>

          <div style={{ marginBottom: 12 }}>
            <Text
              strong
              style={{ display: "flex", alignItems: "center", fontSize: 15 }}
            >
              <EnvironmentOutlined style={{ marginRight: 8 }} /> Địa chỉ:
            </Text>
            <div style={{ marginLeft: 24, fontSize: 15 }}>
              <div>
                <span style={{ color: "#e91e63", marginRight: 4 }}>•</span> HCM
                - 11 Đường Số 39, An Khánh, Q2, TP. Thủ Đức
              </div>
              <div>
                <span style={{ color: "#e91e63", marginRight: 4 }}>•</span> HN -
                116 Hà Huy Tập, Yên Viên, Gia Lâm, Hà Nội
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Text
              strong
              style={{ display: "flex", alignItems: "center", fontSize: 15 }}
            >
              <MailOutlined style={{ marginRight: 8 }} /> Email:
            </Text>
            <div style={{ marginLeft: 24, fontSize: 15 }}>admin@gmail.com</div>
          </div>

          <div>
            <Text
              strong
              style={{ display: "flex", alignItems: "center", fontSize: 15 }}
            >
              <PhoneOutlined style={{ marginRight: 8 }} /> Hotline:
            </Text>
            <div style={{ marginLeft: 24, fontSize: 15 }}>099 999 9999</div>
          </div>

          <div
            style={{
              height: "calc(100% - 250px)",
              minHeight: 270,
              maxHeight: 450,
              marginTop: 16,
            }}
          >
            <iframe
              title="loaction"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1448565606004!2d106.75097037465777!3d10.790282889362753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317526152c1aaaab%3A0x1b4539189e944c93!2zMTEgxJDGsOG7nW5nIFPhu5EgMzksIEFuIEtow6FuaCwgVFAuIFRo4bunIMSQ4bupYywgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1710208353911!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <div style={{ color: "var(--primary-color)" }}>
                LIÊN HỆ VỚI CHÚNG TÔI
              </div>
            }
          >
            <Form
              form={form}
              name="contact"
              layout="vertical"
              onFinish={onFinish}
              initialValues={initialData}
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập địa chỉ email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^0\d{9}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Nội dung"
                rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
              >
                <TextArea
                  maxLength={500}
                  showCount
                  rows={6}
                  placeholder="Nhập nội dung liên hệ"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Gửi thông tin
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    Làm mới
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

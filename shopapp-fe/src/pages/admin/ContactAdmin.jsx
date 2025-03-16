import {
  CheckOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Divider,
  Empty,
  List,
  message,
  Pagination,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getContactByIsRead,
  getUnreadCount,
  markContactAsRead,
} from "../../api/contact";

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const ContactAdmin = () => {
  const [activeTab, setActiveTab] = useState("unread");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [totalItems, setTotalItems] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch contacts based on active tab and pagination
  const fetchContacts = useCallback(() => {
    setLoading(true);
    const isRead = activeTab === "read";

    getContactByIsRead(isRead, currentPage, pageSize)
      .then((result) => {
        if (result && result.data) {
          setContacts(result.data);
          setTotalItems(result.totalElements || 0);
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        message.error("Không thể tải dữ liệu liên hệ");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab, currentPage]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(() => {
    getUnreadCount()
      .then((count) => {
        setUnreadCount(count || 0);
      })
      .catch((error) => {
        console.error("Error fetching unread count:", error);
      });
  }, []);

  // Mark contact as read
  const handleMarkAsRead = async (id) => {
    try {
      await markContactAsRead(id);
      message.success("Đã đọc");
      fetchContacts();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking contact as read:", error);
      message.error("Không thể đánh dấu đã đọc");
    }
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Effect for fetching contacts
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Effect for fetching unread count periodically
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // Contact List Component
  const ContactList = ({
    contacts,
    loading,
    onMarkAsRead,
    isUnread,
    formatDate,
  }) => {
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Spin />
        </div>
      );
    }

    if (!contacts || contacts.length === 0) {
      return <Empty description="Không có liên hệ nào" />;
    }

    return (
      <List
        itemLayout="vertical"
        dataSource={contacts}
        renderItem={(contact) => (
          <List.Item key={contact.id}>
            <Card
              style={{
                width: "100%",
                borderRadius: "4px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
                borderLeft: isUnread ? "3px solid #1890ff" : "none",
                backgroundColor: isUnread ? "#fafafa" : "white",
              }}
            >
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    {contact.fullName}
                  </Title>
                  <Text type="secondary">
                    <ClockCircleOutlined style={{ marginRight: "8px" }} />
                    {formatDate(contact.createdDate)}
                  </Text>
                </div>

                <Space>
                  <Text>
                    <MailOutlined style={{ marginRight: "8px" }} />
                    {contact.email}
                  </Text>
                  <Text>
                    <PhoneOutlined style={{ marginRight: "8px" }} />
                    {contact.phone}
                  </Text>
                </Space>

                <Divider style={{ margin: "12px 0" }} />

                <Paragraph
                  style={{
                    padding: "12px",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                    margin: 0,
                    marginBottom: "12px",
                  }}
                >
                  {contact.message}
                </Paragraph>

                {isUnread && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => onMarkAsRead(contact.id)}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  </div>
                )}
              </Space>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          <Link to="/admin">Admin</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý liên hệ</Breadcrumb.Item>
      </Breadcrumb>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span>
              Chưa đọc{" "}
              <Badge count={unreadCount} style={{ marginLeft: "5px" }} />
            </span>
          }
          key="unread"
        >
          <ContactList
            contacts={contacts}
            loading={loading}
            onMarkAsRead={handleMarkAsRead}
            isUnread={true}
            formatDate={formatDate}
          />
        </TabPane>
        <TabPane tab="Đã đọc" key="read">
          <ContactList
            contacts={contacts}
            loading={loading}
            formatDate={formatDate}
            isUnread={false}
          />
        </TabPane>
      </Tabs>

      {contacts.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default ContactAdmin;

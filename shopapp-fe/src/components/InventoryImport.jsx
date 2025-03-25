import {
  CloudUploadOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  List,
  message,
  Modal,
  Space,
  Upload,
} from "antd";
import React, { useState } from "react";
import { importFromExcel } from "../api/inventoryReceipt";
import ExcelTemplateDownload from "./ExcelTemplateDownload";

const { Dragger } = Upload;

const InventoryImport = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
  };

  const handleImport = async () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng chọn file Excel!");
      return;
    }

    setUploading(true);
    try {
      const file = fileList[0]?.originFileObj || fileList[0];
      await importFromExcel(file);
      setIsModalVisible(false);
      setFileList([]);
    } catch (error) {
      console.error("Import error:", error);
      message.error("Đã xảy ra lỗi khi tải lên file!");
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList((prev) => {
        const index = prev.indexOf(file);
        const newFileList = prev.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      // Check if file is Excel
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";

      if (!isExcel) {
        message.error("Chỉ hỗ trợ tải lên file Excel!");
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
  };

  const tips = [
    "File Excel phải đúng định dạng như mẫu",
    "Mã sản phẩm (productCode) phải tồn tại trong hệ thống",
    "Số lượng (quantity) phải là số nguyên dương",
    "Đơn giá (price) phải lớn hơn 1.000đ",
    "Ghi chú (note) không được vượt quá 255 ký tự",
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<FileExcelOutlined />}
        onClick={showModal}
        style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
      >
        Tải lên phiếu nhập kho
      </Button>

      <Modal
        title={
          <Space>
            <FileExcelOutlined />
            <span>Tải lên phiếu nhập kho từ Excel</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="download" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={handleImport}
            icon={<CloudUploadOutlined />}
          >
            Tải lên
          </Button>,
        ]}
        width={600}
      >
        <Alert
          message="Lưu ý khi tải lên"
          description={
            <List
              size="small"
              dataSource={tips}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Divider>Tải file mẫu</Divider>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <ExcelTemplateDownload templateType="inventory" />
        </div>

        <Divider>Chọn file Excel</Divider>
        <Dragger {...uploadProps} maxCount={1}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Kéo thả hoặc nhấn để chọn file Excel
          </p>
          <p className="ant-upload-hint">
            Chỉ hỗ trợ tải lên file Excel (.xlsx, .xls)
          </p>
        </Dragger>
      </Modal>
    </>
  );
};

export default InventoryImport;

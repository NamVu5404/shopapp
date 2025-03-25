import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const ExcelTemplateDownload = () => {
  const handleDownloadClick = () => {
    // Đường dẫn đến file Excel trong thư mục public
    const templateUrl = "/template.xlsx";

    const link = document.createElement("a");
    link.href = templateUrl;
    link.setAttribute("download", "mau.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handleDownloadClick}
      style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
    >
      Tải xuống file mẫu Excel
    </Button>
  );
};

export default ExcelTemplateDownload;

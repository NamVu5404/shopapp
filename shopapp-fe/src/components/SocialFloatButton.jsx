import { PlusOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";

import { FaFacebookMessenger, FaFacebookSquare } from "react-icons/fa";
import { SiInstagram } from "react-icons/si";

const SocialFloatButton = () => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  // Các URL mạng xã hội của bạn
  const socialLinks = {
    facebook: "https://facebook.com/your-page",
    messenger: "https://m.me/your-id",
    instagram: "https://instagram.com/your-profile",
  };

  // Xử lý chuyển hướng tới mạng xã hội
  const handleSocialClick = (url) => {
    window.open(url, "_blank");
  };

  // Xử lý hover vào và ra
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 300); // Delay 0.3 giây
  };

  const calculatePosition = (index, total) => {
    // Góc của vòng cung (90 độ cho góc phần tư thứ 2)
    const arcAngle = 90;
    // Bán kính vòng cung
    const radius = 80;
    // Góc bắt đầu (90°: điểm trên cùng)
    const startAngle = 90;

    // Tính góc cho mỗi nút (từ 90° đến 180°)
    const angle = startAngle + (index * arcAngle) / (total - 1);
    // Chuyển đổi từ độ sang radian
    const rad = (angle * Math.PI) / 180;

    // Tính toán vị trí x và y (x âm, y âm)
    const x = -radius * Math.cos(rad);
    const y = radius * Math.sin(rad);

    return { x, y };
  };

  // Các nút mạng xã hội
  const socialButtons = [
    {
      name: "Instagram",
      icon: <SiInstagram />,
      url: socialLinks.instagram,
      color: "#E1306C",
    },
    {
      name: "Facebook",
      icon: <FaFacebookSquare />,
      url: socialLinks.facebook,
      color: "#1877F2",
    },
    {
      name: "Messager",
      icon: <FaFacebookMessenger />,
      url: socialLinks.messenger,
      color: "#0099FF",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        right: 60,
        bottom: 60,
        zIndex: 1000,
      }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hiển thị các nút mạng xã hội khi hover */}
      {socialButtons.map((button, index) => {
        const position = calculatePosition(index, socialButtons.length);
        return (
          <div
            key={button.name}
            onClick={button.onClick || (() => handleSocialClick(button.url))}
            onMouseEnter={handleMouseEnter}
            style={{
              position: "absolute",
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: button.color,
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              right: open ? position.x : 0,
              bottom: open ? position.y : 0,
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              fontSize: "24px",
              zIndex: 1000 - index,
            }}
          >
            {button.icon}
          </div>
        );
      })}

      {/* Nút chính để mở/đóng */}
      <div
        onClick={() => setOpen(!open)}
        onMouseEnter={handleMouseEnter}
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#1890ff",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1001,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          right: 0,
          bottom: 0,
          fontSize: "28px",
          transition: "transform 0.3s",
        }}
      >
        <PlusOutlined
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        />
      </div>
    </div>
  );
};

export default SocialFloatButton;

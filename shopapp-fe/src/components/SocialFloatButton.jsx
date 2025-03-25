import { PlusOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";

import { FaFacebookMessenger, FaFacebookSquare } from "react-icons/fa";
import { SiInstagram } from "react-icons/si";

const SocialFloatButton = () => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  // Các URL mạng xã hội của bạn
  const socialLinks = {
    facebook: "https://github.com/NamVu5404/shopapp",
    messenger: "https://github.com/NamVu5404/shopapp",
    instagram: "https://github.com/NamVu5404/shopapp",
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

  // Palette màu hiện đại
  const palette = {
    primary: "#4A6CF7", // Xanh dương đậm
    secondary: "#FF3CAC", // Màu hồng sáng
    accent1: "#8A2BE2", // Màu tím
    accent2: "#00BFA6", // Xanh ngọc
    dark: "#2E3156", // Màu nền tối
    light: "#FFFFFF", // Màu sáng
    gradient: "linear-gradient(45deg, #4A6CF7, #FF3CAC)",
  };

  // Các nút mạng xã hội được cập nhật với màu sắc mới
  const socialButtons = [
    {
      name: "Instagram",
      icon: <SiInstagram />,
      url: socialLinks.instagram,
      // Gradient theo phong cách Instagram
      background:
        "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      shadowColor: "rgba(220, 39, 67, 0.5)",
    },
    {
      name: "Facebook",
      icon: <FaFacebookSquare />,
      url: socialLinks.facebook,
      background: palette.primary,
      shadowColor: "rgba(74, 108, 247, 0.5)",
    },
    {
      name: "Messager",
      icon: <FaFacebookMessenger />,
      url: socialLinks.messenger,
      background: "linear-gradient(135deg, #00B2FF 0%, #006AFF 100%)",
      shadowColor: "rgba(0, 178, 255, 0.5)",
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
        const delay = index * 0.1; // Độ trễ tăng dần cho mỗi nút
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
              background: button.background,
              color: palette.light,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: `all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${delay}s`,
              boxShadow: open
                ? `0 8px 20px ${button.shadowColor}`
                : `0 4px 10px rgba(0, 0, 0, 0.1)`,
              right: open ? position.x : 0,
              bottom: open ? position.y : 0,
              opacity: open ? 1 : 0,
              transform: open
                ? "scale(1) rotate(0deg)"
                : "scale(0.5) rotate(-45deg)",
              pointerEvents: open ? "auto" : "none",
              fontSize: "22px",
              zIndex: 1000 - index,
              border: `2px solid ${palette.light}`,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(0deg)";
            }}
            onMouseOut={(e) => {
              if (open) {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              }
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
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: open ? palette.dark : palette.gradient,
          color: palette.light,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1001,
          boxShadow: open
            ? `0 8px 25px rgba(46, 49, 86, 0.4)`
            : `0 6px 20px rgba(74, 108, 247, 0.4)`,
          right: 0,
          bottom: 0,
          fontSize: "28px",
          transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
          transform: open ? "scale(1.1)" : "scale(1)",
          animation: open ? "none" : "pulse 2s infinite ease-in-out",
          border: `2px solid ${palette.light}`,
        }}
        onMouseOver={(e) => {
          if (!open) {
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseOut={(e) => {
          if (!open) {
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        <style jsx>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(74, 108, 247, 0.7);
            }
            70% {
              box-shadow: 0 0 0 15px rgba(74, 108, 247, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(74, 108, 247, 0);
            }
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes bounce {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-5px);
            }
          }
        `}</style>
        {open ? (
          <PlusOutlined
            style={{
              transform: "rotate(45deg)",
              transition: "transform 0.3s",
              animation: "spin 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
              fontSize: "28px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              overflow: "hidden",
              padding: "10px",
            }}
          >
            <img
              src="/logo/customer.webp"
              alt="contact"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
                transition: "all 0.3s",
                animation: "bounce 1s infinite alternate ease-in-out",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFloatButton;

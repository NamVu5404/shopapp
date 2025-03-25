import React from "react";
import { Carousel } from "antd";
import "./ImageSlider.css";

const ImageSlider = () => {
  // Mảng chứa đường dẫn đến các hình ảnh
  const images = ["/logo/thumbnail_home.webp", "/logo/slider_3.webp"];

  // Style inline cho hình ảnh
  const imageStyle = {
    width: "100vw",
    height: "auto",
    display: "block",
    userSelect: "none", // Ngăn người dùng chọn ảnh
    pointerEvents: "none", // Ngăn tương tác trực tiếp với ảnh
    willChange: "transform", // Thông báo cho trình duyệt về việc transform sẽ thay đổi
  };

  // Thiết lập các cài đặt cho Carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 300, // Giảm thời gian chuyển đổi để cảm giác nhanh hơn
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    swipeToSlide: true,
    touchMove: true,
    touchThreshold: 5, // Giảm ngưỡng để nhạy hơn với thao tác kéo
    useCSS: true, // Sử dụng CSS Transitions để mượt hơn
    useTransform: true, // Sử dụng transform thay vì position
    easing: "cubic-bezier(0.23, 1, 0.32, 1)", // Bezier curve cho animation mượt hơn
    cssEase: "cubic-bezier(0.23, 1, 0.32, 1)",
    waitForAnimate: false, // Không đợi hoàn thành animation trước khi cho phép tương tác tiếp
  };

  return (
    <div className="slider-container">
      <Carousel {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slider-item">
            <img
              src={image}
              alt={`slider_${index + 1}`}
              style={imageStyle}
              draggable="false" // Ngăn kéo ảnh trên trình duyệt
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageSlider;

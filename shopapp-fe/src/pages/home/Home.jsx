import { useEffect, useState } from "react";
import { FaTruckFast } from "react-icons/fa6";
import { MdPriceChange, MdSwapHorizontalCircle } from "react-icons/md";
import { RiVipFill } from "react-icons/ri";
import { searchProduct } from "../../api/product";
import ProductItem from "../../components/ProductItem";
import { Link } from "react-router-dom";
import MyButton from "../../components/MyButton";

export default function Home() {
  const [newProduct, setNewProduct] = useState(null);
  const [hotProduct, setHotProduct] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      const request = {
        id: "",
        categoryCode: "",
        supplierCode: "",
        code: "",
        name: "",
        minPrice: "",
        maxPrice: "",
      };

      const newProductData = await searchProduct(request, 1, 8, "createdDate");
      const hotProductData = await searchProduct(request, 1, 8, "soldQuantity");

      setNewProduct(newProductData.data);
      setHotProduct(hotProductData.data);
    };

    getProducts();
  }, []);

  return (
    <>
      <div style={{ margin: "-60px 0 0 -220px", width: "100vw" }}>
        <img
          alt="thumbnail_home"
          src="/logo/thumbnail_home.webp"
          style={{
            width: "100vw",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          margin: "0 0 0 -220px",
          backgroundColor: "var(--primary-color)",
          width: "100vw",
          padding: "25px 220px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaTruckFast style={{ fontSize: 50, marginBottom: 8 }} />
          <h4 style={{ marginBottom: 8 }}>MIỄN PHÍ GIAO HÀNG</h4>
          <p style={{ fontSize: 14 }}>Giao hàng hỏa tốc Hồ Chí Minh & Hà Nội</p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdPriceChange style={{ fontSize: 50, marginBottom: 8 }} />
          <h4 style={{ marginBottom: 8 }}>THANH TOÁN COD</h4>
          <p style={{ fontSize: 14 }}>Thanh toán khi nhận hàng (COD)</p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RiVipFill style={{ fontSize: 50, marginBottom: 8 }} />
          <h4 style={{ marginBottom: 8 }}>KHÁCH HÀNG VIP</h4>
          <p style={{ fontSize: 14 }}>Ưu đãi dành cho khách hàng VIP</p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdSwapHorizontalCircle style={{ fontSize: 50, marginBottom: 8 }} />
          <h4 style={{ marginBottom: 8 }}>HỖ TRỢ BẢO HÀNH</h4>
          <p style={{ fontSize: 14 }}>Đổi trả trong 7 ngày</p>
        </div>
      </div>

      {/* Sản phẩm mới */}
      <div
        style={{
          margin: "0 0 0 -220px",
          backgroundColor: "var(--secondary-color)",
          color: "var(--primary-color)",
          width: "100vw",
          padding: "60px 220px",
        }}
      >
        <h2>SẢN PHẨM MỚI</h2>

        <div>{newProduct && <ProductItem data={newProduct} />}</div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link to={"/products?sortBy=createdDate"}>
            <MyButton
              style={{
                width: 200,
                height: 50,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Xem tất cả
            </MyButton>
          </Link>
        </div>
      </div>

      {/* Hàng bán chạy */}
      <div
        style={{
          margin: "0 0 0 -220px",
          backgroundColor: "#FFF",
          color: "var(--primary-color)",
          width: "100vw",
          padding: "60px 220px 0 220px",
        }}
      >
        <h2>HÀNG BÁN CHẠY</h2>

        <div>{hotProduct && <ProductItem data={hotProduct} />}</div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link to={"/products?sortBy=soldQuantity"}>
            <MyButton
              style={{
                width: 200,
                height: 50,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Xem tất cả
            </MyButton>
          </Link>
        </div>
      </div>
    </>
  );
}

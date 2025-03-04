import { FaTruckFast } from "react-icons/fa6";
import { MdSwapHorizontalCircle } from "react-icons/md";
import { RiVipFill } from "react-icons/ri";
import { MdPriceChange } from "react-icons/md";
import { useEffect, useState } from "react";
import { searchProduct } from "../../api/product";
import ProductItem from "../../components/ProductItem";
import MyButton from "../../components/MyButton";
import { Link } from "react-router-dom";

export default function Home() {
  const [productData, setProductData] = useState(null);

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

      const data = await searchProduct(request, 1, 8);
      setProductData(data.data);
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

      {/* Hàng hot */}
      <div
        style={{
          margin: "0 0 0 -220px",
          backgroundColor: "var(--secondary-color)",
          color: "var(--primary-color)",
          width: "100vw",
          padding: "60px 220px",
        }}
      >
        <h2>SẢN PHẨM HOT</h2>

        <div>{productData && <ProductItem data={productData} />}</div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link to={"/products"}>
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

      {/* Hàng mới về */}
      <div
        style={{
          margin: "0 0 0 -220px",
          backgroundColor: "#FFF",
          color: "var(--primary-color)",
          width: "100vw",
          padding: "60px 220px 0 220px",
        }}
      >
        <h2>HÀNG MỚI VỀ</h2>

        <div>{productData && <ProductItem data={productData} />}</div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link to={"/products"}>
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

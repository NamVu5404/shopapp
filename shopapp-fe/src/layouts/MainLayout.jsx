import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import ScrollToTopButton from "../components/ScrollToTopButton";

const MainLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div className="container" style={{ flex: "1" }}>
        <main
          style={{
            marginTop: "150px",
            padding: "60px 0",
          }}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;

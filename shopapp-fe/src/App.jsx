import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { introspect, refresh } from "./api/auth";
import { getMyInfo } from "./api/user";
import "./App.css";
import { CategoryProvider } from "./context/CategoryContext";
import { RoleProvider } from "./context/RoleContext";
import { SupplierProvider } from "./context/SupplierContext";
import AppRoutes from "./routes/AppRoutes";
import { getToken } from "./services/localStorageService";

function App() {
  const token = getToken();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const refreshToken = async (token) => {
      const isValidAccessToken = await introspect(token);

      if (!isValidAccessToken) {
        await refresh(token);
      }

      // Lấy thông tin user sau khi xác thực token
      dispatch(getMyInfo(token));
    };

    if (token) {
      refreshToken(token);
    }
  }, [token, dispatch]);

  return (
    <>
      <CategoryProvider>
        <SupplierProvider>
          <RoleProvider>
            <AppRoutes />
          </RoleProvider>
        </SupplierProvider>
      </CategoryProvider>
    </>
  );
}

export default App;

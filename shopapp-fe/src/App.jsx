import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { introspect, refresh } from "./api/auth";
import { getMyInfo } from "./api/user";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { getToken } from "./services/localStorageService";
import { RoleProvider } from "./context/RoleContext";
import { CategoryProvider } from "./context/CategoryContext";
import { SupplierProvider } from "./context/SupplierContext";

function App() {
  const token = getToken();
  const dispatch = useDispatch();

  // refresh token
  useEffect(() => {
    const refreshToken = async (token) => {
      const isValidAccessToken = await introspect(token);

      if (!isValidAccessToken) {
        await refresh(token);
      }
    };

    if (token) {
      refreshToken(token).then(() => {
        dispatch(getMyInfo(token)); // Lấy thông tin user sau khi xác thực token
      });
    }
  }, [token, dispatch]);

  // set user data
  useEffect(() => {
    if (token) {
      dispatch(getMyInfo(token));
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

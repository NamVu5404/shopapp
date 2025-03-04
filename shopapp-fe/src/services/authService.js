import { jwtDecode } from "jwt-decode";
import { getToken } from "./localStorageService";

// Lấy scope từ JWT token
export const getScopeFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const decodedToken = jwtDecode(token);
  const scope = decodedToken.scope;
  return scope ? scope.split(" ") : [];
};

// Kiểm tra quyền dựa trên scope
export const hasPermission = (requiredRoles) => {
  const roles = getScopeFromToken();
  if (!Array.isArray(roles) || roles.length === 0) {
    return false;
  }

  try {
    return roles.some((role) => requiredRoles.includes(role));
  } catch {
    return true;
  }
};

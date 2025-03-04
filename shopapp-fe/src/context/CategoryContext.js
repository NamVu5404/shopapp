import React, { createContext, useContext, useEffect, useState } from "react";
import { getAll } from "../api/category";

// Tạo Context
const CategoryContext = createContext();

// Provider component
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getAllCategories = async () => {
      const data = await getAll();
      setCategories(data);
    };

    getAllCategories();
  }, []);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook để sử dụng categories trong các component
export const useCategories = () => useContext(CategoryContext);

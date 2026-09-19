import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, brandAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('postwise_token'));
  const [loading, setLoading] = useState(true);

  // Brands state
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchUserProfile = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await authAPI.getMe();
      if (response.data.user) {
        setUser(response.data.user);
        await fetchUserBrands();
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBrands = async () => {
    try {
      const res = await brandAPI.getBrands();
      const brandList = res.data.brands || [];
      setBrands(brandList);
      if (brandList.length > 0) {
        // Select first or saved active brand
        const savedBrandId = localStorage.getItem('postwise_active_brand_id');
        const found = brandList.find(b => b._id === savedBrandId);
        const selected = found || brandList[0];
        setActiveBrand(selected);
        localStorage.setItem('postwise_active_brand_id', selected._id);
      } else {
        setActiveBrand(null);
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('postwise_token', newToken);
    setToken(newToken);
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('postwise_token', newToken);
    setToken(newToken);
    setUser(userData);
    showToast('Account created successfully!', 'success');
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('postwise_token');
    localStorage.removeItem('postwise_active_brand_id');
    setToken(null);
    setUser(null);
    setBrands([]);
    setActiveBrand(null);
    showToast('Logged out successfully', 'info');
  };

  const selectActiveBrand = (brand) => {
    setActiveBrand(brand);
    localStorage.setItem('postwise_active_brand_id', brand._id);
    showToast(`Switched active brand to ${brand.name}`, 'info');
  };

  const refreshBrands = async () => {
    await fetchUserBrands();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        brands,
        activeBrand,
        toast,
        login,
        register,
        logout,
        selectActiveBrand,
        refreshBrands,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

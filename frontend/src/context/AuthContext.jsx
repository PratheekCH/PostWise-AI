import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, brandAPI } from '../services/api';
import { DEFAULT_USER } from '../services/mockData';

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
    }, 3500);
  };

  const fetchUserProfile = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await authAPI.getMe();
      const userData = response?.data?.user || response?.user;
      if (userData) {
        setUser(userData);
        await fetchUserBrands();
      } else {
        setUser(DEFAULT_USER);
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBrands = async () => {
    try {
      const res = await brandAPI.getBrands();
      const brandList = res?.data?.brands || res?.brands || [];
      setBrands(brandList);
      if (brandList && brandList.length > 0) {
        const savedBrandId = localStorage.getItem('postwise_active_brand_id');
        const found = brandList.find((b) => b._id === savedBrandId);
        const selected = found || brandList[0];
        setActiveBrand(selected);
        localStorage.setItem('postwise_active_brand_id', selected._id);
      } else {
        setActiveBrand(null);
      }
    } catch (err) {
      console.warn('Failed to fetch brands from API:', err);
      setBrands([]);
      setActiveBrand(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const newToken = res?.data?.token || res?.token;
      const userData = res?.data?.user || res?.user;
      localStorage.setItem('postwise_token', newToken);
      setToken(newToken);
      setUser(userData);
      await fetchUserBrands();
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return userData;
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
      throw err;
    }
  };

  const loginAsDemo = async () => {
    try {
      const demoEmail = 'demo@postwise.ai';
      const demoPass = 'demo123456';
      let userData;
      let newToken;
      try {
        const res = await authAPI.login({ email: demoEmail, password: demoPass });
        newToken = res?.data?.token || res?.token;
        userData = res?.data?.user || res?.user;
      } catch (e) {
        const regRes = await authAPI.register({ name: 'Demo Creator', email: demoEmail, password: demoPass });
        newToken = regRes?.data?.token || regRes?.token;
        userData = regRes?.data?.user || regRes?.user;
      }
      localStorage.setItem('postwise_token', newToken);
      setToken(newToken);
      setUser(userData);
      await fetchUserBrands();
      showToast(`Logged in as demo creator: ${userData.name}`, 'success');
      return userData;
    } catch (err) {
      showToast('Demo login failed', 'error');
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register({ name, email, password });
      const newToken = res?.data?.token || res?.token;
      const userData = res?.data?.user || res?.user;
      localStorage.setItem('postwise_token', newToken);
      setToken(newToken);
      setUser(userData);
      await fetchUserBrands();
      showToast('Account created successfully!', 'success');
      return userData;
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('postwise_token');
    localStorage.removeItem('postwise_user');
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
    showToast(`Switched active brand to ${brand.brandName || brand.name}`, 'info');
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
        loginAsDemo,
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, brandAPI } from '../services/api';
import { DEFAULT_USER, INITIAL_BRANDS } from '../services/mockData';

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
      const userData = response?.data?.user || response?.user || DEFAULT_USER;
      setUser(userData);
      await fetchUserBrands();
    } catch (err) {
      console.warn('Using default demo profile', err);
      setUser(DEFAULT_USER);
      await fetchUserBrands();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBrands = async () => {
    try {
      const res = await brandAPI.getBrands();
      const brandList = res?.data?.brands || res?.brands || res || INITIAL_BRANDS;
      setBrands(brandList);
      if (brandList && brandList.length > 0) {
        const savedBrandId = localStorage.getItem('postwise_active_brand_id');
        const found = brandList.find((b) => b._id === savedBrandId);
        const selected = found || brandList[0];
        setActiveBrand(selected);
        localStorage.setItem('postwise_active_brand_id', selected._id);
      }
    } catch (err) {
      console.warn('Failed to fetch brands, fallback to defaults', err);
      setBrands(INITIAL_BRANDS);
      setActiveBrand(INITIAL_BRANDS[0]);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const newToken = res?.data?.token || res?.token || 'demo_token';
      const userData = res?.data?.user || res?.user || DEFAULT_USER;
      localStorage.setItem('postwise_token', newToken);
      setToken(newToken);
      setUser(userData);
      await fetchUserBrands();
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return userData;
    } catch (err) {
      showToast('Login failed. Please try again.', 'error');
      throw err;
    }
  };

  const loginAsDemo = async () => {
    const userData = DEFAULT_USER;
    const demoToken = 'mock_jwt_token_demo_' + Date.now();
    localStorage.setItem('postwise_token', demoToken);
    localStorage.setItem('postwise_user', JSON.stringify(userData));
    setToken(demoToken);
    setUser(userData);
    setBrands(INITIAL_BRANDS);
    setActiveBrand(INITIAL_BRANDS[0]);
    showToast(`Logged in as demo strategist: ${userData.name}`, 'success');
    return userData;
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register({ name, email, password });
      const newToken = res?.data?.token || res?.token || 'demo_token';
      const userData = res?.data?.user || res?.user || { _id: 'usr_' + Date.now(), name, email };
      localStorage.setItem('postwise_token', newToken);
      setToken(newToken);
      setUser(userData);
      await fetchUserBrands();
      showToast('Account created successfully!', 'success');
      return userData;
    } catch (err) {
      showToast('Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('postwise_token');
    localStorage.removeItem('postwise_user');
    localStorage.removeItem('postwise_active_brand_id');
    setToken(null);
    setUser(null);
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

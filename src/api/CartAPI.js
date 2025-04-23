import axios from 'axios';

const API_BASE = 'https://smartshop-be.onrender.com/api/cart';

export const getCart = async (token) => {
    try {
        const response = await axios.get(API_BASE, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
};

export const addToCart = async (item, token) => {
    try {
        const response = await axios.post(`${API_BASE}/add`, item, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
};

export const removeCartItem = async (productId, productType, token) => {
    try {
        const response = await axios.delete(`${API_BASE}/item`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { productId, productType }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
};

export const clearCart = async (token) => {
    try {
        const response = await axios.delete(`${API_BASE}/clear`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
};

export const updateCartItemQuantity = async (productId, productType, quantity, token) => {
    try {
        const response = await axios.put(`${API_BASE}/update-quantity`, {
            productId,
            productType,
            quantity
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
};

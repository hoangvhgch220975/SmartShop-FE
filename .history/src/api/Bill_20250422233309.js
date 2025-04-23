import axios from "axios";

const API_BASE = "http://localhost:3333/api";

// 🧾 Create new bill (checkout)
export const checkout = async (billData, token) => {
  try {
    const res = await axios.post(`${API_BASE}/checkout`, billData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

// 📋 Get bills of the current user
export const getUserBills = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/bills/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: res.data.bills };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

// 📦 Get all bills (admin only)
export const getAllBills = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/bills`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: res.data.bills };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

// 🔎 Get detail of one bill by ID
export const getBillById = async (id, token) => {
  try {
    const res = await axios.get(`${API_BASE}/bills/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: res.data.bill };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

// 🔄 Update shipping status (admin only)
export const updateBillStatus = async (id, statusData, token) => {
  try {
    const res = await axios.put(
      `${API_BASE}/checkout/${id}/status`,
      statusData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

// 🗑️ Hide order from user history
export const hideUserBill = async (id, token) => {
  try {
    const res = await axios.put(
      `${API_BASE}/bills/${id}/hide`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

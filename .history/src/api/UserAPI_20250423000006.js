import axios from "axios";

const API_BASE = "http://localhost:3333/api/auth";

const API_USER = "http://localhost:3333/users";

// Login user
export const loginUser = async (credentials) => {
    try {
        return await axios.post(`${API_BASE}/login`, credentials);
    } catch (err) {
        console.error("Error logging in user:", err.message);
        throw err;
    }
};

// Signup user (username, password, email)
export const signupUser = async (userData) => {
    try {
        return await axios.post(`${API_BASE}/signup`, userData);
    } catch (err) {
        console.error("Error signing up user:", err.message);
        throw err;
    }
};

// Update user info (fullname, email, dob, address, avatar)
export const updateUserInfo = async (userId, info) => {
    try {
        return await axios.put(`${API_BASE}/user/${userId}`, info);
    } catch (err) {
        console.error("Error updating user info:", err.message);
        throw err;
    }
};

// Get user info by ID
export const getUserInfo = async (userId) => {
    try {
        return await axios.get(`${API_BASE}/user/${userId}`);
    } catch (err) {
        console.error("Error fetching user info:", err.message);
        throw err;
    }
};

// Get all users (admin only)
export const getAllUsers = async () => {
    try {
        return await axios.get(`${API_USER}`);
    } catch (err) {
        console.error("Error fetching all users:", err.message);
        throw err;
    }
};

// Get user by ID (admin only)
export const getUserById = async (userId) => {
    try {
        return await axios.get(`${API_USER}/${userId}`);
    } catch (err) {
        console.error("Error fetching user by ID:", err.message);
        throw err;
    }
};

// Update user by ID (admin only)
export const updateUserById = async (userId, userData) => {
    try {
        return await axios.put(`${API_USER}/${userId}`, userData);
    } catch (err) {
        console.error("Error updating user by ID:", err.message);
        throw err;
    }
};

// Delete user by ID (admin only)
export const deleteUserById = async (userId) => {
    try {
        return await axios.delete(`${API_USER}/${userId}`);
    } catch (err) {
        console.error("Error deleting user by ID:", err.message);
        throw err;
    }
};

// Add user (admin only)
export const addUser = async (userData) => {
    try {
        return await axios.post(`${API_USER}`, userData);
    } catch (err) {
        console.error("Error adding user:", err.message);
        throw err;
    }
};

// Change user password
export const changeUserPassword = async (userId, passwordData) => {
    try {
        // Use the correct route `/user/:id/change-password` to match the backend
        return await axios.put(`${API_USER}/${userId}/change-password`, passwordData);
    } catch (err) {
        console.error("Error changing user password:", err.message);
        throw err;
    }
};

// Check if username exists
export const checkUsernameExists = async (username) => {
    try {
        return await axios.get(`${API_USER}/check-username/${username}`);
    } catch (err) {
        console.error("Error checking username:", err.message);
        throw err;
    }
};

// Check if email exists
export const checkEmailExists = async (email) => {
    try {
        return await axios.get(`${API_USER}/check-email/${email}`);
    } catch (err) {
        console.error("Error checking email:", err.message);
        throw err;
    }
};



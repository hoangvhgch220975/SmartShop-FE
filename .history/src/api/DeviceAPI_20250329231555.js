import axios from "axios";

const API_BASE = "http://localhost:3333/devices";

// Get all devices
export const getAllDevices = async () => {
    try {
        return await axios.get(`${API_BASE}`);
    } catch (error) {
        console.error("Error fetching all devices:", error);
        throw error;
    }
};

// Get a single device by ID
export const getDeviceById = async (id) => {
    try {
        return await axios.get(`${API_BASE}/${id}`);
    } catch (error) {
        console.error(`Error fetching device with ID ${id}:`, error);
        throw error;
    }
};

// Search devices by name (keyword)
export const searchDevicesByName = async (keyword) => {
    try {
        return await axios.get(`${API_BASE}/search/${keyword}`);
    } catch (error) {
        console.error(`Error searching devices with keyword "${keyword}":`, error);
        throw error;
    }
};

// Add a new device
export const addDevice = async (deviceData) => {
    try {
        return await axios.post(`${API_BASE}`, deviceData);
    } catch (error) {
        console.error("Error adding a new device:", error);
        throw error;
    }
};



// Update an existing device
export const updateDevice = async (id, deviceData) => {
    try {
        return await axios.put(`${API_BASE}/${id}`, deviceData);
    } catch (error) {
        console.error(`Error updating device with ID ${id}:`, error);
        throw error;
    }
};

// Delete a device by ID
export const deleteDevice = async (id) => {
    try {
        return await axios.delete(`${API_BASE}/${id}`);
    } catch (error) {
        console.error(`Error deleting device with ID ${id}:`, error);
        throw error;
    }
};

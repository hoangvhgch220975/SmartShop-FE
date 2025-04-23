import axios from "axios";

const API_BASE = `http://localhost:3333/combos`;

// Get all combos
export const getAllCombos = async () => {
    try {
        return await axios.get(`${API_BASE}`);
    } catch (error) {
        console.error("Error fetching all combos:", error);
        throw error;
    }
};

// Get a single combo by ID
export const getComboById = async (id) => {
    try {
        return await axios.get(`${API_BASE}/${id}`);
    } catch (error) {
        console.error(`Error fetching combo with ID ${id}:`, error);
        throw error;
    }
};

// Search combos by name (keyword)
export const searchCombosByName = async (keyword) => {
    try {
        return await axios.get(`${API_BASE}/search/${keyword}`);
    } catch (error) {
        console.error(`Error searching combos with keyword "${keyword}":`, error);
        throw error;
    }
};

// Add a new combo
export const addCombo = async (comboData) => {
    try {
        return await axios.post(`${API_BASE}`, comboData);
    } catch (error) {
        console.error("Error adding a new combo:", error);
        throw error;
    }
};

// Update an existing combo
export const updateCombo = async (id, comboData) => {
    try {
        return await axios.put(`${API_BASE}/${id}`, comboData);
    } catch (error) {
        console.error(`Error updating combo with ID ${id}:`, error);
        throw error;
    }
};

// Delete a combo by ID
export const deleteCombo = async (id) => {
    try {
        return await axios.delete(`${API_BASE}/${id}`);
    } catch (error) {
        console.error(`Error deleting combo with ID ${id}:`, error);
        throw error;
    }
};

import axios from "axios";

const API_BASE = "http://localhost:3333/packages";

// Get all packages
export const getAllPackages = async () => {
    try {
        return await axios.get(`${API_BASE}`);
    } catch (error) {
        console.error("Error fetching all packages:", error);
        throw error;
    }
};

// Get a single package by ID
export const getPackageById = async (id) => {
    try {
        return await axios.get(`${API_BASE}/${id}`);
    } catch (error) {
        console.error(`Error fetching package with ID ${id}:`, error);
        throw error;
    }
};

// Search packages by name (keyword)
export const searchPackagesByName = async (keyword) => {
    try {
        return await axios.get(`${API_BASE}/search/${keyword}`);
    } catch (error) {
        console.error(`Error searching packages with keyword "${keyword}":`, error);
        throw error;
    }
};

// Add a new package
export const addPackage = async (packageData) => {
    try {
        return await axios.post(`${API_BASE}`, packageData);
    } catch (error) {
        console.error("Error adding a new package:", error);
        throw error;
    }
};

// Update an existing package
export const updatePackage = async (id, packageData) => {
    try {
        return await axios.put(`${API_BASE}/${id}`, packageData);
    } catch (error) {
        console.error(`Error updating package with ID ${id}:`, error);
        throw error;
    }
};

// Delete a package by ID
export const deletePackage = async (id) => {
    try {
        return await axios.delete(`${API_BASE}/${id}`);
    } catch (error) {
        console.error(`Error deleting package with ID ${id}:`, error);
        throw error;
    }
};

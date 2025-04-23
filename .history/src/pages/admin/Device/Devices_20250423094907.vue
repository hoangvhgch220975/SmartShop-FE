<template>
  <div class="admin-devices">
    <!-- Header -->
    <div class="admin-header text-success font-weight-bold">
      <h2>📱 Manage Devices</h2>
      <button class="btn btn-success shadow-sm" @click="addDevice">➕ Add Device</button>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="🔍 Search by name..."
      />
      <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
    </div>

    <!-- Feedback Messages -->
    <div v-if="loading" class="text-center text-secondary py-3">Loading devices...</div>
    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <!-- Devices Table -->
    <div v-else class="device-table-wrapper">
      <table class="table table-hover table-bordered shadow-sm bg-white rounded">
        <thead class="thead-dark">
          <tr class="text-center">
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(device, index) in paginatedDevices"
            :key="device._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td>
              <img
                v-if="device.image"
                :src="getImageSrc(device.image)"
                alt="device"
                class="img-thumbnail mx-auto d-block"
              />
            </td>
            <td class="fw-bold">{{ device.name }}</td>
            <td>{{ device.stock }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="viewDevice(device._id)">👁 View</button>
              <button class="btn btn-sm btn-warning me-1" @click="editDevice(device._id)">✏️ Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteDeviceById(device._id)">🗑 Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination d-flex justify-content-center mt-4">
        <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span>Page {{ currentPage }}</span>
        <button
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllDevices, deleteDevice } from "@/api/DeviceAPI";

export default {
  name: "AdminDeviceList",
  data() {
    return {
      devices: [],
      loading: true,
      error: null,
      searchQuery: "",
      currentPage: 1,
      pageSize: 4
    };
  },
  computed: {
    filteredDevices() {
      if (!this.searchQuery) return this.devices;
      return this.devices.filter((d) =>
        d.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredDevices.length / this.pageSize);
    },
    paginatedDevices() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredDevices.slice(start, end);
    }
  },
  methods: {
    async fetchDevices() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAllDevices();
        this.devices = response.data;
      } catch (err) {
        this.error = err.message || "Failed to load devices.";
      } finally {
        this.loading = false;
      }
    },
    async deleteDeviceById(id) {
      if (confirm("Are you sure you want to delete this device?")) {
        try {
          await deleteDevice(id);
          alert("✅ Device deleted successfully!");
          this.fetchDevices();
        } catch (err) {
          alert("❌ Delete failed: " + err.message);
        }
      }
    },
    viewDevice(id) {
      this.$router.push(`/admin/devices/view/${id}`);
    },
    editDevice(id) {
      this.$router.push(`/admin/devices/edit/${id}`);
    },
    addDevice() {
      this.$router.push("/admin/devices/add");
    },
    clearSearch() {
      this.searchQuery = "";
      this.currentPage = 1;
    },
    getImageSrc(imagePath) {
      if (!imagePath) return "";
      if (imagePath.startsWith("http")) return imagePath;
      try {
        return require(`@/assets/imagedevice/${imagePath}`);
      } catch {
        return `https://smartshop-be.onrender.com/uploads/${imagePath}`;
      }
    }
  },
  mounted() {
    this.fetchDevices();
  }
};
</script>

<style scoped>
.admin-devices {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(to bottom right, #f4f6f9, #dce3ea);
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
  padding: 0px 60px 40px 240px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.device-table-wrapper {
  flex-grow: 1;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.table {
  margin-bottom: 0;
  background-color: #fff;
  border-collapse: separate;
  border-spacing: 0;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: #343a40;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  height: 50px;
  padding: 12px;
  box-shadow: inset 0 -1px 0 #ccc;
}

.table tbody td {
  text-align: center;
  vertical-align: middle;
  padding: 12px;
  background-color: #fff;
}

.table tbody tr:first-child td {
  border-top: none;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.img-thumbnail {
  max-width: 100px;
  max-height: 100px;
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  margin: auto;
}

.table td button {
  min-width: 80px;
  min-height: 36px;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  margin: 4px 12px;
  white-space: nowrap;
}

.pagination {
  margin-top: 24px;
}

.pagination button {
  padding: 8px 16px;
  margin: 0 8px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-weight: bold;
  margin: 0 10px;
}
</style>
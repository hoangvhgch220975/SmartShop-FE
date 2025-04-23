<template>
  <div class="admin-packages">
    <!-- Header -->
    <div class="admin-header text-success font-weight-bold">
      <h2>📦 Manage Packages</h2>
      <button class="btn btn-success shadow-sm" @click="addPackage">➕ Add Package</button>
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
    <div v-if="loading" class="text-center text-secondary py-3">Loading packages...</div>
    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <!-- Packages Table -->
    <div v-else class="package-table-wrapper">
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
            v-for="(pkg, index) in paginatedPackages"
            :key="pkg._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td>
              <img
                v-if="pkg.image"
                :src="getImageSrc(pkg.image)"
                alt="package"
                class="img-thumbnail mx-auto d-block"
              />
            </td>
            <td class="fw-bold">{{ pkg.name }}</td>
            <td>{{ pkg.stock }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="viewPackage(pkg._id)">👁 View</button>
              <button class="btn btn-sm btn-warning me-1" @click="editPackage(pkg._id)">✏️ Edit</button>
              <button class="btn btn-sm btn-danger" @click="deletePackageById(pkg._id)">🗑 Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination d-flex justify-content-center mt-4">
        <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span>Page {{ currentPage }}</span>
        <button :disabled="currentPage >= totalPages" @click="currentPage++">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllPackages, deletePackage } from "@/api/PackageAPI";

export default {
  name: "PackageManagement",
  data() {
    return {
      packages: [],
      loading: true,
      error: null,
      searchQuery: "",
      currentPage: 1,
      pageSize: 4
    };
  },
  computed: {
    filteredPackages() {
      if (!this.searchQuery) return this.packages;
      return this.packages.filter((p) =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredPackages.length / this.pageSize);
    },
    paginatedPackages() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredPackages.slice(start, end);
    }
  },
  methods: {
    async fetchPackages() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAllPackages();
        this.packages = response.data;
      } catch (err) {
        this.error = err.message || "Failed to load packages.";
      } finally {
        this.loading = false;
      }
    },
    async deletePackageById(id) {
      if (confirm("Are you sure you want to delete this package?")) {
        try {
          await deletePackage(id);
          alert("✅ Package deleted successfully!");
          this.fetchPackages();
        } catch (err) {
          alert("❌ Delete failed: " + err.message);
        }
      }
    },
    viewPackage(id) {
      this.$router.push(`/admin/packages/view/${id}`);
    },
    editPackage(id) {
      this.$router.push(`/admin/packages/edit/${id}`);
    },
    addPackage() {
      this.$router.push("/admin/packages/add");
    },
    clearSearch() {
      this.searchQuery = "";
      this.currentPage = 1;
    },
    getImageSrc(imagePath) {
      if (!imagePath) return "";
      if (imagePath.startsWith("http")) return imagePath;
      try {
        return require(`@/assets/imagepackage/${imagePath}`);
      } catch {
        return `https://smartshop-be.onrender.com/uploads/${imagePath}`;
      }
    }
  },
  mounted() {
    this.fetchPackages();
  }
};
</script>

<style scoped>
.admin-packages {
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

.package-table-wrapper {
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
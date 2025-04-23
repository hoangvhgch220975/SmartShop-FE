<template>
  <div class="admin-combos">
    <!-- Header -->
    <div class="admin-header text-success font-weight-bold">
      <h2>🎁 Manage Combos</h2>
      <button class="btn btn-success shadow-sm" @click="addCombo">➕ Add Combo</button>
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
    <div v-if="loading" class="text-center text-secondary py-3">Loading combos...</div>
    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <!-- Combos Table -->
    <div v-else class="combo-table-wrapper">
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
          <tr v-for="(combo, index) in paginatedCombos" :key="combo._id" class="text-center align-middle">
            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td>
              <img
                v-if="combo.image"
                :src="getImageSrc(combo.image)"
                alt="combo"
                class="img-thumbnail mx-auto d-block"
              />
            </td>
            <td class="fw-bold">{{ combo.name }}</td>
            <td>{{ combo.stock }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="viewCombo(combo._id)">👁 View</button>
              <button class="btn btn-sm btn-warning me-1" @click="editCombo(combo._id)">✏️ Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteComboById(combo._id)">🗑 Delete</button>
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
import { getAllCombos, deleteCombo } from "@/api/ComboAPI";

export default {
  name: "ComboManagement",
  data() {
    return {
      combos: [],
      loading: true,
      error: null,
      searchQuery: "",
      currentPage: 1,
      pageSize: 4
    };
  },
  computed: {
    filteredCombos() {
      if (!this.searchQuery) return this.combos;
      return this.combos.filter((c) =>
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredCombos.length / this.pageSize);
    },
    paginatedCombos() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredCombos.slice(start, end);
    }
  },
  methods: {
    async fetchCombos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAllCombos();
        this.combos = response.data;
      } catch (err) {
        this.error = err.message || "Failed to load combos.";
      } finally {
        this.loading = false;
      }
    },
    async deleteComboById(id) {
      if (confirm("Are you sure you want to delete this combo?")) {
        try {
          await deleteCombo(id);
          alert("✅ Combo deleted successfully!");
          this.fetchCombos();
        } catch (err) {
          alert("❌ Delete failed: " + err.message);
        }
      }
    },
    viewCombo(id) {
      this.$router.push(`/admin/combos/view/${id}`);
    },
    editCombo(id) {
      this.$router.push(`/admin/combos/edit/${id}`);
    },
    addCombo() {
      this.$router.push("/admin/combos/add");
    },
    clearSearch() {
      this.searchQuery = "";
      this.currentPage = 1;
    },
    getImageSrc(imagePath) {
      if (!imagePath) return "";
      if (imagePath.startsWith("http")) return imagePath;
      try {
        return require(`@/assets/imagecombo/${imagePath}`);
      } catch {
        return `http://localhost:3333/uploads/${imagePath}`;
      }
    }
  },
  mounted() {
    this.fetchCombos();
  }
};
</script>

<style scoped>
.admin-combos {
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

.combo-table-wrapper {
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
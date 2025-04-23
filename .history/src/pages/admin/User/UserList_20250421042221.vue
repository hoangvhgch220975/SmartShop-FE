<template>
  <div class="admin-users">
    <!-- Header -->
    <div class="admin-header text-success font-weight-bold">
      <h2>👥 Manage Users</h2>
      <button class="btn btn-success shadow-sm" @click="addUser">➕ Add User</button>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="🔍 Search by username or email..."
      />
      <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
    </div>

    <!-- Feedback Messages -->
    <div v-if="loading" class="text-center text-secondary py-3">Loading users...</div>
    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <!-- Users Table -->
    <div v-else class="user-table-wrapper">
      <table class="table table-hover table-bordered shadow-sm bg-white rounded">
        <thead class="thead-dark">
          <tr class="text-center">
            <th>#</th>
            <th>Avatar</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in paginatedUsers"
            :key="user._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (page - 1) * pageSize }}</td>
            <td>
              <img
                v-if="user.avatar"
                :src="getImageSrc(user.avatar)"
                alt="avatar"
                class="img-thumbnail mx-auto d-block"
              />
            </td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="viewUser(user._id)">👁️ View</button>
              <button class="btn btn-sm btn-warning me-1" @click="editUser(user._id)">✏️ Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteUser(user._id)">🗑️ Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination d-flex justify-content-center mt-4">
        <button :disabled="page === 1" @click="goToPage(page - 1)">Previous</button>
        <span>Page {{ page }}</span>
        <button :disabled="page >= totalPages" @click="goToPage(page + 1)">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers, deleteUserById } from "@/api/UserAPI";

export default {
  name: "UserList",
  data() {
    return {
      users: [],
      loading: true,
      error: null,
      searchQuery: "",
      page: 1,
      pageSize: 4
    };
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize);
    },
    paginatedUsers() {
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredUsers.slice(start, end);
    }
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAllUsers();
        this.users = response.data;
      } catch (err) {
        this.error = err.message || "Failed to load users.";
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await deleteUserById(userId);
          alert("✅ User deleted successfully!");
          this.fetchUsers();
        } catch (err) {
          alert("❌ Delete failed: " + err.message);
        }
      }
    },
    viewUser(userId) {
      this.$router.push(`/admin/users/view/${userId}`);
    },
    editUser(userId) {
      this.$router.push(`/admin/users/edit/${userId}`);
    },
    addUser() {
      this.$router.push("/admin/users/add");
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.page = page;
    },
    clearSearch() {
      this.searchQuery = "";
      this.page = 1;
    },
    getImageSrc(imagePath) {
      if (!imagePath) return "";
      if (imagePath.startsWith("http")) return imagePath;
      try {
        return require(`@/assets/profilepicture/${imagePath}`);
      } catch {
        return `http://localhost:3333/uploads/${imagePath}`;
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.admin-users {
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

.user-table-wrapper {
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
  margin-top: 30px;
}

.pagination button {
  padding: 8px 15px;
  margin: 0 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
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
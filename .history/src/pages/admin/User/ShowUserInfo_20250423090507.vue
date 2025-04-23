<template>
  <div class="user-detail container mt-5 mb-5">
    <!-- Header -->
    <div class="header d-flex justify-content-between align-items-center mt-5 mb-4">
      <h2 class="text-success font-weight-bold">👥 User Details</h2>
      <button class="btn btn-warning shadow-sm" @click="editUser">✏️ Edit</button>
    </div>

    <!-- Feedback Messages -->
    <div v-if="loading" class="text-center text-secondary py-3">Loading user...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- User Info -->
    <div v-else class="user-info bg-white rounded shadow-sm p-4">
      <div class="row">
        <div class="col-md-4">
          <!-- Avatar Section -->
          <div class="avatar-container text-center">
            <img
              v-if="user.avatar"
              :src="getAvatarSrc(user.avatar)"
              alt="User Avatar"
              class="img-fluid rounded-circle shadow"
              style="max-width: 150px;"
            />
          </div>
        </div>

        <div class="col-md-8">
          <!-- User Information -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>👤 Full Name:</strong> {{ user.fullname }}</li> <!-- Added Full Name -->
            <li class="list-group-item"><strong>👤 Username:</strong> {{ user.username }}</li>
            <li class="list-group-item"><strong>📧 Email:</strong> {{ user.email }}</li>
            <li class="list-group-item"><strong>🔑 Role:</strong> {{ user.role }}</li>
            <li class="list-group-item"><strong>📅 Date of Birth:</strong> {{ user.dob }}</li>
            <li class="list-group-item"><strong>🏠 Address:</strong> {{ user.address }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="d-flex justify-content-end mt-4">
      <button class="btn btn-outline-secondary btn-lg shadow-sm" @click="$router.push('/admin/users')">
        🔙 Back to List
      </button>
    </div>
  </div>
</template>

<script>
import { getUserById } from "@/api/UserAPI"; // <-- Adjusted API import

export default {
  name: "ShowUser",
  data() {
    return {
      user: {},
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchUser() {
      const userId = this.$route.params.id;
      try {
        const response = await getUserById(userId);
        this.user = response.data;
      } catch (err) {
        this.error = err.message || "Failed to load user details.";
      } finally {
        this.loading = false;
      }
    },
    editUser() {
      this.$router.push(`/admin/users/edit/${this.user._id}`);
    },
    getAvatarSrc(avatarPath) {
      if (!avatarPath) return "";
      if (avatarPath.startsWith("http")) return avatarPath;
      try {
        return require(`@/assets/profilepicture/${avatarPath}`);
      } catch (err) {
        console.warn("Image not found:", avatarPath);
      }
      try {
        return `https://smartshop-be.onrender.com/uploads/${avatarPath}`;
      } catch (err) {
        console.warn("Image not found:", avatarPath);
      }
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
/* Container for the entire user detail page */
.user-detail {
  max-width: 900px;
  margin: auto;
  padding-top: 60px; /* Adjusted for navbar offset */
  background-color: #f4f6f9;
  box-sizing: border-box;
}

.header {
  background-color: #ffffff;
  padding: 25px 30px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #28a745;
  margin-bottom: 10px;
}

.header .btn {
  font-size: 1rem;
  border-radius: 25px;
  background-color: #ffc107;
  color: white;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.header .btn:hover {
  background-color: #e0a800;
  cursor: pointer;
}

.user-info {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  font-size: 1.15rem;
  padding: 15px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item strong {
  color: #28a745;
  font-weight: 600;
}

.avatar-container {
  text-align: center;
  margin-bottom: 25px;
}

.avatar-container img {
  max-width: 150px;
  height: auto;
  border-radius: 50%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.avatar-container img:hover {
  transform: scale(1.05);
}
</style>

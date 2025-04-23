<template>
  <div class="user-detail container mt-5 mb-5">
    <!-- Header -->
    <div class="header d-flex justify-content-between align-items-center mt-5 mb-4">
      <h2 class="text-success font-weight-bold">👥 My Profile</h2>
      <button class="btn btn-warning shadow-sm" @click="editUser">✏️ Edit</button>
    </div>

    <!-- Feedback Messages -->
    <div v-if="loading" class="text-center text-secondary py-3">Loading profile...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- User Info -->
    <div v-else class="user-info bg-white rounded shadow-sm p-4">
      <div class="row">
        <div class="col-md-4 text-center">
          <img
            v-if="user.avatar"
            :src="getAvatarSrc(user.avatar)"
            alt="Avatar"
            class="img-fluid rounded-circle shadow"
            style="max-width: 150px;"
          />
        </div>
        <div class="col-md-8">
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>👤 Full Name:</strong> {{ user.fullname }}</li>
            <li class="list-group-item"><strong>👤 Username:</strong> {{ user.username }}</li>
            <li class="list-group-item"><strong>📧 Email:</strong> {{ user.email }}</li>
            <li class="list-group-item"><strong>📅 Date of Birth:</strong> {{ formatDate(user.dob) }}</li>
            <li class="list-group-item"><strong>🏠 Address:</strong> {{ user.address }}</li>
          </ul>
        </div>
      </div>

      <!-- Change Password Button at the bottom and aligned to the right -->
      <div class="mt-4 text-right">
        <button class="btn btn-info shadow-sm" @click="changePassword">🔒 Change Password</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserById } from "@/api/UserAPI"; // Import the API to fetch user data

export default {
  name: "ProfilePage",
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
      if (!userId) {
        this.error = "User ID not found in route.";
        this.loading = false;
        return;
      }

      try {
        const res = await getUserById(userId);
        this.user = res.data;
      } catch (err) {
        this.error = err?.response?.data?.message || "Failed to load user details.";
      } finally {
        this.loading = false;
      }
    },
    editUser() {
      this.$router.push(`/profile/edit/${this.user._id}`);
    },
    // Navigate to the Change Password Page
    changePassword() {
      this.$router.push(`/profile/change-password/${this.user._id}`);
    },
    getAvatarSrc(avatarPath) {
      if (!avatarPath) return "";
      if (avatarPath.startsWith("http")) return avatarPath;
      try {
        return require(`@/assets/profilepicture/${avatarPath}`);
      } catch (err) {
        console.warn("Image not found:", avatarPath);
      }
      return `http://localhost:3333/uploads/${avatarPath}`;
    },
    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      return new Date(dateStr).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchUser(); // Fetch user details when the component is mounted
  },
};
</script>

<style scoped>
/* Styles for the profile page */
.user-detail {
  max-width: 900px;
  margin: auto;
  padding-top: 20px;
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
  background-color: #ffc107; /* Same as the Edit button */
  color: white;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.header .btn-info {
  font-size: 1rem;
  background-color: #17a2b8; /* Change Password button color */
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.header .btn:hover {
  background-color: #e0a800;
  cursor: pointer;
}

.header .btn-info:hover {
  background-color: #138496;
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

.text-right {
  text-align: right;
  margin-top: 20px; /* Margin to space it from the last item */
}
</style>

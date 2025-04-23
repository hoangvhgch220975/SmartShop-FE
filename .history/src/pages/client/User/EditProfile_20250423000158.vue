<template>
  <div class="container mt-5 pt-5">
    <h2 class="text-info font-weight-bold mb-4">✍️ Edit Profile</h2>

    <!-- Feedback Messages -->
    <div v-if="loading" class="text-center text-secondary py-3">Loading...</div>
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- User Info Form -->
    <form
      v-else
      @submit.prevent="submitForm"
      class="bg-light p-4 rounded shadow-sm"
    >
      <!-- Full Name -->
      <div class="form-group mb-4">
        <label for="fullname" class="font-weight-bold">Full Name</label>
        <input
          id="fullname"
          v-model="form.fullname"
          type="text"
          class="form-control"
          placeholder="Enter your full name"
          required
        />
      </div>

      <!-- Email -->
      <div class="form-group mb-4">
        <label for="email" class="font-weight-bold">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-control"
          placeholder="Enter your email"
          required
        />
      </div>

      <!-- Date of Birth -->
      <div class="form-group mb-4">
        <label for="dob" class="font-weight-bold">Date of Birth</label>
        <input
          id="dob"
          v-model="form.dob"
          type="date"
          class="form-control"
          required
        />
      </div>

      <!-- Address -->
      <div class="form-group mb-4">
        <label for="address" class="font-weight-bold">Address</label>
        <input
          id="address"
          v-model="form.address"
          type="text"
          class="form-control"
          placeholder="Enter your address"
          required
        />
      </div>

      <!-- Avatar URL -->
      <div class="form-group mb-4">
        <label for="avatar" class="font-weight-bold">Avatar URL</label>
        <input
          id="avatar"
          v-model="form.avatar"
          type="text"
          class="form-control"
          placeholder="Paste image URL or upload below"
        />
        <div v-if="form.avatar" class="text-center mt-3">
          <img
            :src="
              isLocalImage(form.avatar)
                ? getAvatarSrc(form.avatar)
                : form.avatar
            "
            alt="Avatar Preview"
            class="rounded"
            style="max-width: 150px"
          />
        </div>
      </div>

      <!-- Upload Image -->
      <div class="form-group mb-4">
        <label class="font-weight-bold">Or upload an image</label>
        <input
          type="file"
          @change="handleFileUpload"
          class="form-control-file"
          accept="image/*"
        />
        <div v-if="uploading" class="text-muted mt-1">Uploading...</div>
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-success btn-lg shadow-sm w-45">
          💾 Save
        </button>
        <button
          @click="$router.push(`/profile/${$route.params.id}`)"
          type="button"
          class="btn btn-outline-secondary btn-lg shadow-sm w-45"
        >
          ❌ Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { getUserById, updateUserInfo } from "@/api/UserAPI";

export default {
  name: "EditProfile",
  data() {
    return {
      form: {
        fullname: "",
        email: "",
        dob: "",
        address: "",
        avatar: "",
      },
      loading: true,
      error: null,
      uploading: false,
    };
  },
  async created() {
    this.fetchUser();
  },
  methods: {
    // Fetch user data from the server
    async fetchUser() {
      const userId = this.$route.params.id;
      try {
        const response = await getUserById(userId);
        const user = response.data;
        this.form.fullname = user.fullname || "";
        this.form.email = user.email || "";
        this.form.dob = user.dob || "";
        this.form.address = user.address || "";
        this.form.avatar = user.avatar || "";
      } catch (err) {
        this.error = "Error fetching user data.";
      } finally {
        this.loading = false;
      }
    },

    // Check if the avatar is a local image
    isLocalImage(filename) {
      return !filename.startsWith("http");
    },

    // Get avatar source path
    getAvatarSrc(path) {
      if (!path) return "";
      return path.startsWith("http")
        ? path
        : `http://localhost:3333/uploads/${path}`;
    },

    // Handle file upload for avatar
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://localhost:3333/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        this.form.avatar = data.filename;
        alert("✅ Avatar uploaded successfully!");
      } catch (err) {
        alert("❌ Upload failed: " + err.message);
      } finally {
        this.uploading = false;
      }
    },

    // Submit the updated user form
    async submitForm() {
      this.error = null;
      try {
        const userId = this.$route.params.id;
        await updateUserInfo(userId, this.form);
        alert("✅ Profile updated successfully!");
        this.$router.push(`/profile/${userId}`);
      } catch (err) {
        this.error = "Update failed.";
      }
    },
  },
};
</script>

<style scoped>
/* Styling for the edit profile page */
.container {
  padding-top: 100px;
  /* Ensure spacing from navbar */
}

.change-password-form {
  max-width: 720px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.change-password-form .form-group {
  margin-bottom: 20px;
}

.change-password-form label {
  font-weight: 600;
  color: #333;
}

.change-password-form .form-control {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

.change-password-form .form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

.change-password-form .btn {
  font-size: 1.1rem;
  padding: 12px;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.change-password-form .btn:hover {
  background-color: #218838;
  cursor: pointer;
}

.change-password-form .btn:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

.change-password-form .form-control-file {
  font-size: 1rem;
  padding: 0.75rem;
}

img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .change-password-form {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  .change-password-form {
    padding: 15px;
  }
}
</style>

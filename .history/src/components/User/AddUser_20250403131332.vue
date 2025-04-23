<template>
  <div class="add-user container mt-5 mb-5">
    <h2 class="form-title text-success font-weight-bold mb-4 text-center">➕ Add New User</h2>

    <form @submit.prevent="submitForm" class="shadow p-5 bg-white rounded-lg">
      <!-- Username -->
      <div class="form-group position-relative">
        <label for="username">👤 Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          class="form-control input-icon"
          placeholder="Enter a username"
          required
          @blur="checkUsernameExists"
        />
        <div v-if="usernameError" class="text-danger mt-2">{{ usernameError }}</div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">📧 Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          class="form-control"
          placeholder="Enter your email"
          required
          @blur="checkEmailExists"
        />
        <div v-if="emailError" class="text-danger mt-2">{{ emailError }}</div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password">🔒 Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          class="form-control"
          placeholder="Create a password"
          required
        />
      </div>

      <!-- Role -->
      <div class="form-group">
        <label for="role">🔑 Role</label>
        <select
          id="role"
          v-model="form.role"
          class="form-control custom-select"
          required
        >
          <option disabled value="">-- Select Role --</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Full Name -->
      <div class="form-group">
        <label for="fullname">🧾 Full Name</label>
        <input
          v-model="form.fullname"
          type="text"
          id="fullname"
          class="form-control"
          placeholder="Enter full name"
          required
        />
      </div>

      <!-- Date of Birth -->
      <div class="form-group mt-3">
        <label for="dob">📅 Date of Birth</label>
        <input
          v-model="form.dob"
          type="date"
          id="dob"
          class="form-control"
          required
        />
      </div>

      <!-- Address -->
      <div class="form-group mt-3">
        <label for="address">📍 Address</label>
        <input
          v-model="form.address"
          type="text"
          id="address"
          class="form-control"
          placeholder="Enter your full address"
          required
        />
      </div>

      <!-- Avatar -->
      <div class="form-group mt-3">
        <label for="avatar">🖼️ Avatar (URL or Upload)</label>
        <input
          v-model="form.avatar"
          type="text"
          id="avatar"
          class="form-control mb-2"
          placeholder="Paste image URL or upload below"
        />
        <input
          type="file"
          @change="handleFileUpload"
          class="form-control-file"
          accept="image/*"
        />
        <div v-if="uploading" class="text-muted mt-1">Uploading...</div>
      </div>

      <!-- Avatar Preview -->
      <div v-if="form.avatar" class="text-center mt-3">
        <img
          :src="isLocalImage(form.avatar) ? `http://localhost:3333/uploads/${form.avatar}` : form.avatar"
          alt="Avatar Preview"
          class="rounded"
          style="max-width: 150px"
        />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

      <!-- Submit Button -->
      <button class="btn btn-info btn-block mt-4 shadow-sm">Save User</button>
    </form>
  </div>
</template>

<script>
import { addUser, checkUsernameExists, checkEmailExists } from "@/api/UserAPI";

export default {
  name: "AddUser",
  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
        role: "user", // Default role is 'user'
        fullname: "",
        dob: "",
        address: "",
        avatar: "",
      },
      error: null,
      uploading: false,
      usernameError: null,
      emailError: null,
    };
  },
  methods: {
    isLocalImage(filename) {
      return !filename.startsWith("http");
    },

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

    async checkUsernameExists() {
      try {
        const response = await checkUsernameExists(this.form.username);
        if (response && response.data && response.data.exists) {
          this.usernameError = "⚠️ This username is already taken.";
        } else {
          this.usernameError = null;
        }
      } catch (err) {
        this.usernameError = "❌ Error checking username.";
      }
    },

    async checkEmailExists() {
      try {
        const response = await checkEmailExists(this.form.email);
        if (response && response.data && response.data.exists) {
          this.emailError = "⚠️ This email is already taken.";
        } else {
          this.emailError = null;
        }
      } catch (err) {
        this.emailError = "❌ Error checking email.";
      }
    },

    async submitForm() {
      if (this.usernameError || this.emailError) {
        alert("Please resolve the errors before submitting.");
        return;
      }

      this.error = null;

      try {
        await addUser(this.form); // Ensure addUser method is properly handling all fields
        alert("✅ User added successfully!");
        this.$router.push("/admin/users");
      } catch (err) {
        this.error = (err.response && err.response.data.message) || "Failed to add user";
      }
    },
  },
};
</script>


<style scoped>
.add-user {
  max-width: 720px;
  margin: auto;
}

.form-title {
  font-size: 1.8rem;
  text-shadow: 1px 1px 2px #ccc;
}

.form-control {
  transition: border-color 0.3s, box-shadow 0.3s;
  border-radius: 0.5rem;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

select.form-control {
  appearance: none;
}

.btn {
  min-width: 120px;
  border-radius: 1.5rem;
}

.btn-info:hover {
  background-color: #17a2b8;
}

.shadow-sm {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.img-thumbnail {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  margin: auto;
}
</style>

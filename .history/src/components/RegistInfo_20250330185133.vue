<template>
    <div class="regist-wrapper d-flex justify-content-center align-items-center">
      <div class="regist-info card shadow-lg p-4" style="max-width: 500px; width: 100%;">
        <h3 class="text-center text-info mb-4">👤 Complete Your Info</h3>
  
        <form @submit.prevent="submitInfo">
          <!-- Full Name -->
          <div class="form-group">
            <label for="fullname">🧾 Full Name</label>
            <input
              v-model="fullname"
              type="text"
              id="fullname"
              class="form-control"
              placeholder="e.g. John Doe"
              required
            />
          </div>
  
          <!-- DOB -->
          <div class="form-group mt-3">
            <label for="dob">📅 Date of Birth</label>
            <input
              v-model="dob"
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
              v-model="address"
              type="text"
              id="address"
              class="form-control"
              placeholder="Enter your full address"
              required
            />
          </div>
  
          <!-- Avatar -->
          <div class="form-group mt-3">
            <label for="avatar">🖼️ Avatar (URL or upload)</label>
            <input
              v-model="avatar"
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
  
          <!-- Preview -->
          <div v-if="avatar" class="text-center mt-3">
            <img
              :src="isLocalImage(avatar) ? `http://localhost:3333/uploads/${avatar}` : avatar"
              alt="Avatar Preview"
              class="rounded"
              style="max-width: 150px"
            />
          </div>
  
          <!-- Status messages -->
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
          <div v-if="success" class="alert alert-success mt-3">{{ success }}</div>
  
          <!-- Submit -->
          <button class="btn btn-info btn-block mt-4 shadow-sm">Save Info</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { updateUserInfo } from "@/api/UserAPI";
  
  export default {
    name: "RegistInfo",
    data() {
      return {
        fullname: "",
        dob: "",
        address: "",
        avatar: "",
        error: null,
        success: null,
        uploading: false,
      };
    },
    created() {
      const userId = localStorage.getItem("signupUserId");
      if (!userId) {
        this.$router.push("/signup");
      }
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
          this.avatar = data.filename;
          alert("✅ Avatar uploaded successfully!");
        } catch (err) {
          alert("❌ Upload failed: " + err.message);
        } finally {
          this.uploading = false;
        }
      },
      async submitInfo() {
        this.error = null;
        this.success = null;
        const userId = localStorage.getItem("signupUserId");
        if (!userId) {
          this.error = "User ID not found. Please sign up again.";
          return;
        }
  
        try {
          await updateUserInfo(userId, {
            fullname: this.fullname,
            dob: this.dob,
            address: this.address,
            avatar: this.avatar,
          });
          this.success = "✅ Info saved! Redirecting to login...";
          localStorage.removeItem("signupUserId");
          setTimeout(() => this.$router.push("/login"), 1500);
        } catch (err) {
          this.error = (err.response && err.response.data.message) || "Update failed";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .regist-wrapper {
    min-height: 100vh;
    padding-top: 60px;
    background: linear-gradient(135deg, #f1f4f8, #d4e0ed);
  }
  
  .regist-info {
    border-radius: 16px;
    background-color: white;
  }
  
  .regist-info input {
    border-radius: 8px;
    padding: 10px;
    font-size: 16px;
  }
  
  .regist-info button {
    border-radius: 8px;
    font-weight: bold;
  }
  </style>
  
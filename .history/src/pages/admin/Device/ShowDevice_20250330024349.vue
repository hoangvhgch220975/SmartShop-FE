<template>
    <div class="device-detail container mt-5 mb-5">
      <div v-if="loading" class="text-center text-secondary py-5">Loading device...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else class="device-card mx-auto">
        <!-- Title & Image -->
        <div class="text-center mb-4">
          <h2 class="device-title text-success font-weight-bold mb-3">
            {{ device.name }}
          </h2>
          <img
            v-if="device.image"
            :src="getImageSrc(device.image)"
            alt="device"
            class="device-image shadow"
          />
        </div>
  
        <!-- Device Info -->
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item">
            <strong>📦 Category:</strong> {{ device.category }}
          </li>
          <li class="list-group-item">
            <strong>📝 Description:</strong> {{ device.description }}
          </li>
          <li class="list-group-item">
            <strong>💲 Price:</strong> £{{ device.price }}
          </li>
          <li class="list-group-item">
            <strong>📊 Stock:</strong> {{ device.stock }}
          </li>
          <li class="list-group-item">
            <strong>⭐ Rating:</strong>
            <span v-if="device.rating">
              <span
                v-for="(star, index) in getStarIcons(device.rating)"
                :key="index"
                class="text-warning"
                style="font-size: 1.4em;"
              >
                {{ star }}
              </span>
              <small class="text-muted ml-2">({{ device.rating }})</small>
            </span>
            <span v-else>N/A</span>
          </li>
        </ul>
  
        <!-- Buttons -->
        <div class="d-flex justify-content-end">
          <button class="btn btn-warning btn-lg mr-3 shadow-sm" @click="editDevice">
            ✏️ Edit
          </button>
          <button class="btn btn-outline-secondary btn-lg shadow-sm" @click="$router.back()">
            🔙 Back
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getDeviceById } from "@/api/DeviceAPI";
  
  export default {
    name: "ShowDevice",
    data() {
      return {
        device: null,
        loading: true,
        error: null,
      };
    },
    methods: {
      async fetchDevice() {
        const id = this.$route.params.id;
        try {
          const response = await getDeviceById(id);
          this.device = response.data;
        } catch (err) {
          this.error = err.message || "Device not found.";
        } finally {
          this.loading = false;
        }
      },
      getImageSrc(imagePath) {
        
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        try {
          return require(`@/assets/imagedevice/${imagePath}`);
        } catch (err) {
          console.warn("Image not found:", imagePath);
        }
        try {
          return `http://localhost:3333/uploads/${imagePath}`;
          } catch (err) {
          console.warn("Image not found:", imagePath);
        }
      },

      editDevice() {
        this.$router.push(`/admin/devices/edit/${this.device._id}`);
      },
      getStarIcons(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
        for (let i = 0; i < fullStars; i++) stars.push("★");
        if (hasHalfStar) stars.push("☆");
        for (let i = 0; i < emptyStars; i++) stars.push("✩");
  
        return stars;
      },
    },
    mounted() {
      this.fetchDevice();
    },
  };
  </script>
  
  <style scoped>
  .device-detail {
    max-width: 900px;
  }
  
  .device-card {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    transition: box-shadow 0.3s ease;
  }
  
  .device-card:hover {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }
  
  .device-title {
    font-size: 2rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .device-image {
    max-width: 320px;
    max-height: 320px;
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
  }
  
  .device-image:hover {
    transform: scale(1.02);
  }
  
  .btn {
    min-width: 130px;
    border-radius: 2rem;
  }
  
  .btn-warning:hover {
    background-color: #e0a800;
  }
  
  .btn-outline-secondary:hover {
    background-color: #f8f9fa;
  }
  
  .list-group-item {
    font-size: 1.1rem;
    padding: 1rem 1.2rem;
    border: none;
    border-bottom: 1px solid #f1f1f1;
  }
  </style>
    
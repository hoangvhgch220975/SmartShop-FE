<template>
    <div class="combo-detail container mt-5 mb-5">
      <div v-if="loading" class="text-center text-secondary py-5">Loading combo...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else class="combo-card mx-auto">
        <!-- Title & Image -->
        <div class="text-center mb-4">
          <h2 class="combo-title text-success font-weight-bold mb-3">
            {{ combo.name }}
          </h2>
          <img
            v-if="combo.image"
            :src="getImageSrc(combo.image)"
            alt="combo"
            class="combo-image shadow"
          />
        </div>
  
        <!-- Combo Info -->
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item">
            <strong>📝 Description:</strong> {{ combo.description }}
          </li>
          <li class="list-group-item">
            <strong>📱 Included Devices:</strong>
            <ul class="mb-0 pl-3">
              <li v-for="(device, index) in combo.includedDevices" :key="'dev-' + index">
                {{ device }}
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <strong>📦 Included Packages:</strong>
            <ul class="mb-0 pl-3">
              <li v-for="(pkg, index) in combo.includedPackages" :key="'pkg-' + index">
                {{ pkg }}
              </li>
            </ul>
          </li>
          <li class="list-group-item">
            <strong>💲 Price:</strong> £{{ combo.price }}
          </li>
          <li class="list-group-item">
            <strong>📊 Stock:</strong> {{ combo.stock }}
          </li>
          <li class="list-group-item">
            <strong>⭐ Rating:</strong>
            <span v-if="combo.rating">
              <span
                v-for="(star, index) in getStarIcons(combo.rating)"
                :key="index"
                class="text-warning"
                style="font-size: 1.4em;"
              >
                {{ star }}
              </span>
              <small class="text-muted ml-2">({{ combo.rating }})</small>
            </span>
            <span v-else>N/A</span>
          </li>
        </ul>
  
        <!-- Buttons -->
        <div class="d-flex justify-content-end">
          <button class="btn btn-warning btn-lg mr-3 shadow-sm" @click="editCombo">
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
  import { getComboById } from "@/api/ComboAPI";
  
  export default {
    name: "ShowCombo",
    data() {
      return {
        combo: null,
        loading: true,
        error: null,
      };
    },
    methods: {
      async fetchCombo() {
        const id = this.$route.params.id;
        try {
          const response = await getComboById(id);
          this.combo = response.data;
        } catch (err) {
          this.error = err.message || "Combo not found.";
        } finally {
          this.loading = false;
        }
      },
      getImageSrc(imagePath) {
        
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        try {
          return require(`@/assets/imagecombo/${imagePath}`);
        } catch (err) {
          console.warn("Image not found:", imagePath);
        }
        try {
          return `http://localhost:3333/uploads/${imagePath}`;
          } catch (err) {
          console.warn("Image not found:", imagePath);
        }
      },
      editCombo() {
        this.$router.push(`/admin/combos/edit/${this.combo._id}`);
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
      this.fetchCombo();
    },
  };
  </script>
  
  <style scoped>
  .combo-detail {
    max-width: 900px;
  }
  
  .combo-card {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    transition: box-shadow 0.3s ease;
  }
  
  .combo-card:hover {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }
  
  .combo-title {
    font-size: 2rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .combo-image {
    max-width: 400px;
  max-height: 400px;
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  }
  
  .combo-image:hover {
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
  
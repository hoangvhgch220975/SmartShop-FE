<template>
    <div class="package-detail container mt-5 mb-5">
      <div v-if="loading" class="text-center text-secondary py-5">Loading package...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else class="package-card mx-auto">
        <!-- Title & Image -->
        <div class="text-center mb-4">
          <h2 class="package-title text-success font-weight-bold mb-3">
            {{ pkg.name }}
          </h2>
          <img
            v-if="pkg.image"
            :src="getImageSrc(pkg.image)"
            alt="package"
            class="package-image shadow"
          />
        </div>
  
        <!-- Package Info -->
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item">
            <strong>📦 Category:</strong> {{ pkg.category }}
          </li>
          <li class="list-group-item">
            <strong>📝 Description:</strong> {{ pkg.description }}
          </li>
          <li class="list-group-item">
            <strong>💲 Price:</strong> £{{ pkg.price }}
          </li>
          <li class="list-group-item">
            <strong>📊 Stock:</strong> {{ pkg.stock }}
          </li>
          <li class="list-group-item">
            <strong>⭐ Rating:</strong>
            <span v-if="pkg.rating">
              <span
                v-for="(star, index) in getStarIcons(pkg.rating)"
                :key="index"
                class="text-warning"
                style="font-size: 1.4em;"
              >
                {{ star }}
              </span>
              <small class="text-muted ml-2">({{ pkg.rating }})</small>
            </span>
            <span v-else>N/A</span>
          </li>
        </ul>
  
        <!-- Buttons -->
        <div class="d-flex justify-content-end">
          <button class="btn btn-warning btn-lg mr-3 shadow-sm" @click="editPackage">
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
  import { getPackageById } from "@/api/PackageAPI";
  
  export default {
    name: "ShowPackage",
    data() {
      return {
        pkg: null,
        loading: true,
        error: null,
      };
    },
    methods: {
      async fetchPackage() {
        const id = this.$route.params.id;
        try {
          const response = await getPackageById(id);
          this.pkg = response.data;
        } catch (err) {
          this.error = err.message || "Package not found.";
        } finally {
          this.loading = false;
        }
      },
  
      getImageSrc(imagePath) {
        
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        try {
          return require(`@/assets/imagepackage/${imagePath}`);
        } catch (err) {
          console.warn("Image not found:", imagePath);
        }
        try {
          return `http://localhost:3333/uploads/${imagePath}`;
          } catch (err) {
          console.warn("Image not found:", imagePath);
        }
      },
  
      editPackage() {
        this.$router.push(`/admin/packages/edit/${this.pkg._id}`);
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
      this.fetchPackage();
    },
  };
  </script>
  
  <style scoped>
  .package-detail {
    max-width: 900px;
  }
  
  .package-card {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    transition: box-shadow 0.3s ease;
  }
  
  .package-card:hover {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }
  
  .package-title {
    font-size: 2rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .package-image {
    max-width: 320px;
    max-height: 320px;
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
  }
  
  .package-image:hover {
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
  
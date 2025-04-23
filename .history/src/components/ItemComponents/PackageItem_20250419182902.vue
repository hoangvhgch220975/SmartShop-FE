<template>
  <div class="package-page">
    <div class="product-scroll-container">
      <!-- Left Arrow -->
      <button @click="scrollLeft" class="scroll-btn left" :disabled="scrollPosition <= 0">
        &#10094;
      </button>

      <!-- Package Cards -->
      <div v-for="packageItem in packages.slice(scrollPosition, scrollPosition + 3)" :key="packageItem._id"
        class="product-card" @click="goToPackageDetail(packageItem._id)">
        <div class="package-image-container">
          <div class="package-category-overlay">{{ packageItem.category }}</div>
          <img v-if="packageItem.image" :src="getImageSrc(packageItem.image)" alt="package" class="package-image" />
          <div class="package-hover-overlay">
            <router-link :to="'/package/' + packageItem._id" class="view-details-btn">
              View Details
            </router-link>
          </div>
        </div>

        <div class="package-info">
          <h3 class="package-name">{{ packageItem.name }}</h3>
          <p class="package-description">{{ packageItem.description }}</p>
        </div>

        <div class="package-info-bottom">
          <div class="price-cart-row">
            <p class="package-price">${{ packageItem.price.toFixed(2) }}</p>
            <button class="add-to-cart-btn" @click.stop="addToCart(packageItem)">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
          <p class="package-available">Available: {{ packageItem.stock }}</p>
        </div>
      </div>

      <!-- Right Arrow -->
      <button @click="scrollRight" class="scroll-btn right" :disabled="scrollPosition + 3 >= packages.length">
        &#10095;
      </button>
    </div>
  </div>
</template>

<script>
import { getAllPackages } from '@/api/PackageAPI';
import { addToCart } from '@/api/CartAPI';


export default {
  name: "PackageItem",
  data() {
    return {
      packages: [],
      scrollPosition: 0,
    };
  },
  created() {
    this.fetchPackages();
  },
  methods: {
    async fetchPackages() {
      try {
        const response = await getAllPackages();
        this.packages = response.data;
      } catch (error) {
        console.error("Error fetching packages: ", error);
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
      return `http://localhost:3333/uploads/${imagePath}`;
    },
    scrollLeft() {
      if (this.scrollPosition > 0) {
        this.scrollPosition -= 1;
      }
    },
    scrollRight() {
      if (this.scrollPosition + 3 < this.packages.length) {
        this.scrollPosition += 1;
      }
    },
    goToPackageDetail(packageId) {
      this.$router.push(`/package/${packageId}`);
    },
    async addToCart(pkg) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to your cart.');
        this.$router.push('/login');
        return;
      }

      const item = {
        productId: pkg._id,
        productType: 'package',
        quantity: 1,
        price: pkg.price
      };

      try {
        await addToCart(item, token);
        alert(`Added ${pkg.name} to cart!`);
        this.$router.push('/cart'); // ✅ Go to cart after adding
        window.location.reload(); // ✅ Reload cart page
      } catch (error) {
        console.error('Failed to add to cart:', error);
        alert('Something went wrong while adding to cart.');
      }
    }
  },
};
</script>

<style scoped>
.package-page {
  padding: 20px;
  text-align: center;
  background-color: #f0f0f0;
}

.product-scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 30px;
  padding: 60px;
  align-items: center;
  position: relative;
  justify-content: center;
  width: calc(3.8 * 350px + 60px);
}

.scroll-btn {
  background-color: #333;
  color: white;
  border: none;
  padding: 12px;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  z-index: 10;
  border-radius: 50%;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 50px;
  height: 50px;
}

.scroll-btn.left {
  left: 10px;
}

.scroll-btn.right {
  right: 10px;
}

.scroll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scroll-btn:hover:not(:disabled) {
  background-color: #7ecf2f;
  transform: scale(1.1);
}

.product-card {
  width: 350px;
  height: 500px;
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  justify-content: space-between;
  border: 1px solid #ddd;
  position: relative;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.package-image-container {
  position: relative;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  overflow: hidden;
}

.package-category-overlay {
  position: absolute;
  top: 0px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  z-index: 2;
}

.package-image {
  max-width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: cover;
}

.package-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.package-image-container:hover .package-hover-overlay {
  opacity: 1;
}

.view-details-btn {
  padding: 12px 24px;
  background-color: #7ecf2f;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.view-details-btn:hover {
  transform: scale(1.1);
}

.package-info {
  font-size: 16px;
  color: #333;
}

.package-name {
  font-size: 20px;
  font-weight: bold;
  color: #222;
  margin-bottom: 10px;
  text-transform: capitalize;
}

.package-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.package-info-bottom {
  width: 100%;
  padding: 0 15px;
}

.price-cart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.package-price {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #7ecf2f;
  padding: 8px 15px;
  border-radius: 25px;
  text-align: center;
  width: 100%;
  margin: 0;
}

.add-to-cart-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.add-to-cart-btn:hover {
  background-color: #333;
}

.package-available {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
  text-align: right;
  padding-right: 15px;
}

.product-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.product-scroll-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.product-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>

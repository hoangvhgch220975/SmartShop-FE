<template>
  <div class="home">
    <!-- Banner Section -->
    <section class="banner">
      <div class="banner-content">
        <button class="banner-btn" @click="scrollToProducts">Shop Now</button>
      </div>
    </section>

    <!-- Home Content Section -->
    <main class="home-content" id="products-section">
      <h1>Our Products</h1>

      <div class="device">
        <h2>Explore Our Latest Devices</h2>
        <!-- Render DeviceItem component here -->
        <DeviceItem />
      </div>

      <div class="package">
        <h2>Explore Our Latest Packages</h2>
        <!-- Render PackageItem component here -->
        <PackageItem />
      </div>

      <div class="combo">
        <h2>Explore Our Latest Combos</h2>
        <!-- Render ComboItem component here -->
        <ComboItem />
      </div>
    </main>

    <!-- Include Footer Component -->
    <Footer />
  </div>
</template>

<script>
// Import Footer component
import Footer from '@/components/Footer.vue';
import DeviceItem from '@/components/ItemComponents/DeviceItem.vue';
import PackageItem from '@/components/ItemComponents/PackageItem.vue';
import ComboItem from '@/components/ItemComponents/ComboItem.vue';

export default {
  name: "HomePage",
  components: {
    Footer,   // Register the Footer component
    DeviceItem,  // Register the DeviceItem component
    PackageItem, // Register the PackageItem component
    ComboItem,   // Register the ComboItem component
  },
  methods: {
    scrollToProducts() {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        window.scrollTo({
          top: productsSection.offsetTop,
          behavior: 'smooth',  // Ensures smooth scroll
        });
      }
    }
  }
};
</script>

<style scoped>
/* Basic Reset */
* {
  margin-top: 10px;
  padding: 0;
  box-sizing: border-box;
}

/* Home Page Styles */
.home {
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 30px;
  background-color: #111;
  color: #fff;
  padding-top: 80px; /* Create space for fixed navbar */
}

/* Banner Section */
.banner {
  background: url('@/assets/banner3.jpg') no-repeat center center;
  background-size: cover; /* Ensures the background image covers the entire section */
  height: 70vh; /* Set the banner to take up the full height of the viewport */
  padding: 0 20px; /* Remove top and bottom padding */
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center; /* Center text */
}

.banner-content {
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.banner-btn {
  padding: 12px 25px; /* Shrink the padding */
  background-color: #fff;
  border: none;
  color: #111;
  font-size: 16px; /* Make the font smaller */
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  margin-left: auto;
  margin-top: 20%;
}

.banner-btn:hover {
  background-color: #009933;
}

/* Home Content */
.home-content {
  margin-top: 40px;
}

.home-content section {
  margin-bottom: 40px;
}

.home-content h2 {
  font-size: 28px;
  margin-bottom: 20px;
}

.home-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #ddd;
}

/* Footer Styling */
.home-footer {
  margin-top: 40px;
  font-size: 0.9em;
  color: #666;
  padding: 10px 20px;
  background-color: #222;
  border-radius: 8px;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .banner h2 {
    font-size: 28px;
  }

  .banner p {
    font-size: 16px;
  }

  .home-content h2 {
    font-size: 24px;
  }

  .home-content p {
    font-size: 14px;
  }

  .product-categories .categories-container {
    flex-direction: column;
  }

  .category {
    width: 100%;
    margin-bottom: 20px;
  }

  .product-card {
    width: 100px;
    height: 150px;
    font-size: 14px;
  }
}
</style>

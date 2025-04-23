<template>
  <div class="device-details">
    <Navbar />
    <div class="container mt-5">
      <div v-if="device" class="card">
        <div class="card-body">
          <h2 class="card-title">{{ device.name }}</h2>
          <div class="row">
            <div class="col-md-6">
              <img :src="getImageSrc(device.image)" class="img-fluid mb-3" alt="Device image" />
            </div>
            <div class="col-md-6">
              <p class="card-text"><strong>Category:</strong> {{ device.category }}</p>
              <p class="card-text"><strong>Price:</strong> ${{ device.price }}</p>
              <p class="card-text">
                <strong>Rating:</strong>
                <span class="star-rating">
                  <i v-for="n in 5" :key="n" :class="['fas', 'fa-star', { filled: n <= device.rating }]"></i>
                </span>
              </p>
              <p class="card-text"><strong>Description:</strong> {{ device.description }}</p>

              <div class="action-buttons">
                <button class="add-to-cart-btn" @click="addToCart(device)">
                  <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>

                <!-- Back button or router-link depending on history -->
                <button v-if="canGoBack" @click="goBack" class="back-btn">
                  <i class="fas fa-arrow-left"></i>
                </button>
                <router-link v-else to="/" class="back-btn">
                  <i class="fas fa-arrow-left"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { getDeviceById } from '@/api/DeviceAPI'
import { addToCart } from '@/api/CartAPI';


export default {
  name: 'DeviceDetails',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      device: null,
      canGoBack: false
    }
  },
  created() {
    this.canGoBack = window.history.length > 1;
    this.fetchDevice();
  },
  methods: {
    async fetchDevice() {
      try {
        const response = await getDeviceById(this.$route.params.id);
        this.device = response.data;
      } catch (error) {
        console.error('Error fetching device details:', error);
      }
    },
    getImageSrc(imagePath) {
      if (!imagePath) return "";
      if (imagePath.startsWith("http")) return imagePath;
      try {
        return require(`@/assets/imagedevice/${imagePath}`);
      } catch (err) {
        console.warn("Image not found:", imagePath);
        return `https://smartshop-be.onrender.com/uploads/${imagePath}`;
      }
    },
    async addToCart(device) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in to add to cart!');
        this.$router.push('/login');
        return;
      }

      const item = {
        productId: device._id,
        productType: 'device',
        quantity: 1,
        price: device.price
      };

      try {
        await addToCart(item, token);
        alert(`Added ${device.name} to cart!`);
        this.$router.push('/cart'); // ✅ Redirect to cart
        window.location.reload(); // ✅ Reload cart page
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('An error occurred while adding product to cart.');
      }
    },
    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.device-details {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.container {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 15px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.card-body {
  padding: 2rem;
  background-color: white;
}

.card-title {
  color: #000;
  font-size: 28px;
  margin-bottom: 20px;
}

.card-text {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.add-to-cart-btn {
  background-color: #7ecf2f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-to-cart-btn:hover {
  transform: scale(1.05);
}

.back-btn {
  background-color: #000;
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #333;
}

.star-rating {
  display: inline-block;
  margin-left: 10px;
}

.fa-star {
  color: #ddd;
  margin-right: 2px;
}

.fa-star.filled {
  color: #ffd700;
}
</style>
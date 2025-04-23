<template>
  <div class="combo-detail">
    <Navbar />
    <div class="container mt-5">
      <div v-if="combo" class="card">
        <div class="card-body">
          <h2 class="card-title">{{ combo.name }}</h2>
          <div class="row">
            <div class="col-md-6">
              <img :src="getImageSrc(combo.image)" class="img-fluid mb-3" alt="Combo image" />
            </div>
            <div class="col-md-6">
              <p class="card-text"><strong>Price:</strong> ${{ combo.price }}</p>

              <p class="card-text" v-if="combo.rating !== undefined">
                <strong>Rating:</strong>
                <span class="star-rating">
                  <i v-for="n in 5" :key="n" :class="['fas', 'fa-star', { filled: n <= combo.rating }]"></i>
                </span>
              </p>

              <p class="card-text"><strong>Description:</strong> {{ combo.description }}</p>

              <p class="card-text" v-if="combo.includedDevices?.length">
                <strong>Included Devices:</strong>
              <ul>
                <li v-for="(device, index) in combo.includedDevices" :key="'dev-' + index">
                  {{ device }}
                </li>
              </ul>
              </p>

              <p class="card-text" v-if="combo.includedPackages?.length">
                <strong>Included Packages:</strong>
              <ul>
                <li v-for="(pkg, index) in combo.includedPackages" :key="'pkg-' + index">
                  {{ pkg }}
                </li>
              </ul>
              </p>

              <div class="action-buttons">
                <button class="add-to-cart-btn" @click="addToCart(combo)">
                  <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>

                <!-- Back logic -->
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
import { getComboById } from '@/api/ComboAPI'
import { addToCart } from '@/api/CartAPI';


export default {
  name: 'ComboDetail',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      combo: null,
      canGoBack: false
    }
  },
  created() {
    this.canGoBack = window.history.length > 1;
    this.fetchCombo();
  },
  methods: {
    async fetchCombo() {
      try {
        const response = await getComboById(this.$route.params.id);
        this.combo = response.data;
      } catch (error) {
        console.error('Error fetching combo detail:', error);
      }
    },
    getImageSrc(imagePath) {
      if (!imagePath) return "";
      if (imagePath.startsWith("http")) return imagePath;
      try {
        return require(`@/assets/imagecombo/${imagePath}`);
      } catch {
        return `https://smartshop-be.onrender.com/uploads/${imagePath}`;
      }
    },
    async addToCart(combo) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to your cart.');
        this.$router.push('/login');
        return;
      }

      const item = {
        productId: combo._id,
        productType: 'combo',
        quantity: 1,
        price: combo.price
      };

      try {
        await addToCart(item, token);
        alert(`Added ${combo.name} to cart!`);
        this.$router.push('/cart');
        window.location.reload();
      } catch (error) {
        console.error('Failed to add combo to cart:', error);
        alert('Failed to add to cart. Please try again.');
      }
    },

    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.combo-detail {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
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

ul {
  margin-top: 10px;
  padding-left: 20px;
  text-align: left;
}

li {
  color: #444;
  margin-bottom: 5px;
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

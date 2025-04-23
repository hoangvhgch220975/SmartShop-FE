<template>
  <div class="combo-page">
    <div class="product-scroll-container">
      <!-- Left Arrow -->
      <button @click="scrollLeft" class="scroll-btn left" :disabled="scrollPosition <= 0">
        &#10094;
      </button>

      <!-- Combo Cards -->
      <div
        v-for="combo in combos.slice(scrollPosition, scrollPosition + 3)"
        :key="combo._id"
        class="product-card"
        @click="goToComboDetail(combo._id)"
      >
        <div class="combo-image-container">
          <img v-if="combo.image" :src="getImageSrc(combo.image)" alt="combo" class="combo-image" />
          <div class="combo-hover-overlay">
            <router-link :to="'/combo/' + combo._id" class="view-details-btn">View Details</router-link>
          </div>
        </div>

        <div class="combo-info">
          <h3 class="combo-name">{{ combo.name }}</h3>
          <p class="combo-description">{{ combo.description }}</p>
        </div>

        <div class="combo-info-bottom">
          <div class="price-cart-row">
            <p class="combo-price">${{ combo.price.toFixed(2) }}</p>
            <button class="add-to-cart-btn" @click.stop="addToCart(combo)">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
          <p class="combo-available">Available: {{ combo.stock }}</p>
        </div>
      </div>

      <!-- Right Arrow -->
      <button @click="scrollRight" class="scroll-btn right" :disabled="scrollPosition + 3 >= combos.length">
        &#10095;
      </button>
    </div>
  </div>
</template>

<script>
import { getAllCombos } from '@/api/ComboAPI';
import { addToCart } from '@/api/CartAPI';


export default {
  name: "ComboItem",
  data() {
    return {
      combos: [],
      scrollPosition: 0,
    };
  },
  created() {
    this.fetchCombos();
  },
  methods: {
    async fetchCombos() {
      try {
        const response = await getAllCombos();
        this.combos = response.data;
      } catch (error) {
        console.error("Error fetching combos: ", error);
      }
    },
    getImageSrc(imagePath) {
      if (!imagePath) return "";
      if (imagePath.startsWith("http")) return imagePath;
      try {
        return require(`@/assets/imagecombo/${imagePath}`);
      } catch {
        return `http://localhost:3333/uploads/${imagePath}`;
      }
    },
    scrollLeft() {
      if (this.scrollPosition > 0) this.scrollPosition -= 1;
    },
    scrollRight() {
      if (this.scrollPosition + 3 < this.combos.length) this.scrollPosition += 1;
    },
    goToComboDetail(comboId) {
      this.$router.push(`/combo/${comboId}`);
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

  }
};
</script>

<style scoped>
.combo-page {
  padding: 20px;
  background-color: #f0f0f0;
  text-align: center;
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

.combo-image-container {
  position: relative;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  overflow: hidden;
}

.combo-image {
  max-width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: cover;
}

.combo-hover-overlay {
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

.combo-image-container:hover .combo-hover-overlay {
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

.combo-info {
  font-size: 16px;
  color: #333;
}

.combo-name {
  font-size: 20px;
  font-weight: bold;
  color: #222;
  margin-bottom: 10px;
  text-transform: capitalize;
}

.combo-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.combo-info-bottom {
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

.combo-price {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #7ecf2f;
  padding: 8px 15px;
  border-radius: 25px;
  text-align: center;
  width: 100%;
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
.combo-available {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
  text-align: right;
  padding-right: 15px;
}

.combo-rating {
  color: #666;
  font-size: 14px;
  text-align: right;
  padding-right: 10px;
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

<template>
    <div class="combo-list-page">
      <Navbar />
      <div class="container">
        <h2 class="page-title">All Combos</h2>
  
        <!-- Bộ lọc -->
        <div class="filter-bar">
          <div class="filter-group">
            <label>Price Range:</label>
            <select v-model="selectedPriceRange" @change="applyFilters">
              <option value="">All</option>
              <option value="under100">Under $100</option>
              <option value="100to600">$100 - $600</option>
              <option value="600to1000">$600 - $1000</option>
              <option value="over1000">Over $1000</option>
            </select>
          </div>
  
          <div class="filter-group">
            <label>Sort by:</label>
            <select v-model="sortOption" @change="applyFilters">
              <option value="">Default</option>
              <option value="priceAsc">Price ↑</option>
              <option value="priceDesc">Price ↓</option>
              <option value="ratingAsc">Rating ↑</option>
              <option value="ratingDesc">Rating ↓</option>
            </select>
          </div>
  
          <button class="reset-btn" @click="resetFilters">Reset</button>
        </div>
  
        <!-- Danh sách combo -->
        <div class="combo-grid">
          <div
            class="combo-card"
            v-for="combo in sortedAndFilteredCombos"
            :key="combo._id"
            @click="goToComboDetail(combo._id)"
          >
            <img :src="getImageSrc(combo.image)" alt="Combo" class="combo-image" />
            <h3>{{ combo.name }}</h3>
            <p class="combo-price">${{ combo.price }}</p>
            <div class="rating">
              <i
                v-for="n in 5"
                :key="n"
                :class="['fas', 'fa-star', { filled: n <= combo.rating }]"
              ></i>
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
  import { getAllCombos } from '@/api/ComboAPI'
  
  export default {
    name: 'ComboList',
    components: { Navbar, Footer },
    data() {
      return {
        combos: [],
        selectedPriceRange: '',
        sortOption: '',
      }
    },
    computed: {
      sortedAndFilteredCombos() {
        let filtered = this.combos;
  
        // Bộ lọc theo giá
        if (this.selectedPriceRange === 'under100') {
          filtered = filtered.filter(c => c.price < 100);
        } else if (this.selectedPriceRange === '100to600') {
          filtered = filtered.filter(c => c.price >= 100 && c.price <= 600);
        } else if (this.selectedPriceRange === '600to1000') {
          filtered = filtered.filter(c => c.price > 600 && c.price <= 1000);
        } else if (this.selectedPriceRange === 'over1000') {
          filtered = filtered.filter(c => c.price > 1000);
        }
  
        // Sắp xếp
        if (this.sortOption === 'priceAsc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (this.sortOption === 'priceDesc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (this.sortOption === 'ratingAsc') {
          filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        } else if (this.sortOption === 'ratingDesc') {
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
  
        return filtered;
      }
    },
    methods: {
      async fetchCombos() {
        try {
          const response = await getAllCombos();
          this.combos = response.data;
        } catch (error) {
          console.error("Error fetching combos:", error);
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
      goToComboDetail(id) {
        this.$router.push({ path: `/combo/${id}` });
      },
      applyFilters() {
        // Nothing needed here because computed auto updates
      },
      resetFilters() {
        this.selectedPriceRange = '';
        this.sortOption = '';
      }
    },
    created() {
      this.fetchCombos();
    }
  }
  </script>
  
  <style scoped>
  .combo-list-page {
    background-color: #f7f8fa;
    min-height: 100vh;
    padding-top: 80px;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
  }
  
  .page-title {
    font-size: 32px;
    margin-bottom: 25px;
    font-weight: bold;
    text-align: center;
    color: #222;
  }
  
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-end;
    margin-bottom: 35px;
    justify-content: center;
    background-color: #fff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }
  
  .filter-group select {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    min-width: 160px;
    font-size: 14px;
  }
  
  .reset-btn {
    padding: 10px 18px;
    background-color: #555;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
    height: 42px;
  }
  
  .reset-btn:hover {
    background-color: #333;
  }
  
  .combo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 30px;
  }
  
  .combo-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 18px rgba(0,0,0,0.05);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
    text-align: center;
    border: 1px solid #eee;
  }
  
  .combo-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.1);
  }
  
  .combo-image {
    max-height: 160px;
    object-fit: contain;
    width: 100%;
    margin-bottom: 14px;
    border-radius: 10px;
  }
  
  .combo-price {
    font-weight: bold;
    font-size: 18px;
    color: #28a745;
    margin: 8px 0;
  }
  
  .rating {
    margin-top: 6px;
  }
  
  .fa-star {
    color: #ccc;
    margin-right: 2px;
  }
  
  .fa-star.filled {
    color: #ffd700;
  }
  </style>
  
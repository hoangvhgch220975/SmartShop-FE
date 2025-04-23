<template>
    <div class="device-list-page">
      <Navbar />
      <div class="container">
        <h2 class="page-title">All Devices</h2>
  
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
  
        <!-- Danh sách thiết bị -->
        <div class="device-grid">
          <div
            class="device-card"
            v-for="device in sortedAndFilteredDevices"
            :key="device._id"
            @click="goToDeviceDetail(device._id)"
          >
            <img :src="getImageSrc(device.image)" alt="Device" class="device-image" />
            <h3>{{ device.name }}</h3>
            <p class="device-price">${{ device.price }}</p>
            <div class="rating">
              <i
                v-for="n in 5"
                :key="n"
                :class="['fas', 'fa-star', { filled: n <= device.rating }]"
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
  import { getAllDevices } from '@/api/DeviceAPI'
  
  export default {
    name: 'DeviceList',
    components: { Navbar, Footer },
    data() {
      return {
        devices: [],
        selectedPriceRange: '',
        sortOption: '',
      }
    },
    computed: {
      sortedAndFilteredDevices() {
        let filtered = this.devices;
  
        // Bộ lọc theo giá
        if (this.selectedPriceRange === 'under100') {
          filtered = filtered.filter(d => d.price < 100);
        } else if (this.selectedPriceRange === '100to600') {
          filtered = filtered.filter(d => d.price >= 100 && d.price <= 600);
        } else if (this.selectedPriceRange === '600to1000') {
          filtered = filtered.filter(d => d.price > 600 && d.price <= 1000);
        } else if (this.selectedPriceRange === 'over1000') {
          filtered = filtered.filter(d => d.price > 1000);
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
      async fetchDevices() {
        try {
          const response = await getAllDevices();
          this.devices = response.data;
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      },
      getImageSrc(imagePath) {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        try {
          return require(`@/assets/imagedevice/${imagePath}`);
        } catch {
          return `http://localhost:3333/uploads/${imagePath}`;
        }
      },
      goToDeviceDetail(id) {
        this.$router.push({ path: `/device/${id}`, query: { from: 'shop' } });
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
      this.fetchDevices();
    }
  }
  </script>
  
  <style scoped>
  .device-list-page {
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
  
  .device-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 30px;
  }
  
  .device-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 18px rgba(0,0,0,0.05);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
    text-align: center;
    border: 1px solid #eee;
  }
  
  .device-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.1);
  }
  
  .device-image {
    max-height: 160px;
    object-fit: contain;
    width: 100%;
    margin-bottom: 14px;
    border-radius: 10px;
  }
  
  .device-price {
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
  
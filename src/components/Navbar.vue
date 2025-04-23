<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo and Shop Name -->
      <div class="logo-container">
        <router-link to="/" class="logo-link">
          <img src="@/assets/smartshop-high-resolution-logo.png" alt="SmartShop Logo" class="logo" />
          <span class="shop-name">SmartShop</span>
        </router-link>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search for products..." @input="searchProducts" />
      </div>

      <!-- Cart Icon with Badge -->
      <ul class="nav-links" :class="{ active: isMenuOpen }">
        <li class="cart-icon">
          <router-link v-if="user" to="/cart">
            <i class="fa-solid fa-cart-shopping" :data-count="cartItemCount"></i>
          </router-link>
          <a v-else href="#" @click.prevent="showLoginNotification">
            <i class="fa-solid fa-cart-shopping" :data-count="cartItemCount"></i>
          </a>
        </li>

        <!-- Navigation Links -->
        <li class="dropdown">
          <router-link to="/">Shop</router-link>
          <ul class="dropdown-menu bg-dark">
            <li>
              <router-link class="dropdown-item" to="/shop/device">
                <i class="fa-solid fa-mobile-screen-button me-2 text-success"></i> Device
              </router-link>
            </li>
            <li>
              <router-link class="dropdown-item" to="/shop/package">
                <i class="fa-solid fa-box-open me-2 text-success"></i> Package
              </router-link>
            </li>
            <li>
              <router-link class="dropdown-item" to="/shop/combo">
                <i class="fa-solid fa-layer-group me-2 text-success"></i> Combo
              </router-link>
            </li>
          </ul>
        </li>

        <li><router-link to="/contact">Contact</router-link></li>

        <!-- Show login/signup if not logged in -->
        <template v-if="!user">
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/signup">Signup</router-link></li>
        </template>

        <!-- Show user info and logout if logged in -->
        <template v-else>
          <li class="dropdown">
            <a href="#" class="text-white dropdown-toggle" data-bs-toggle="dropdown" role="button">
              👋 Hello, {{ user.username }}
            </a>
            <ul class="dropdown-menu bg-dark">
              <li>
                <router-link :to="`/profile/${user._id}`" class="dropdown-item text-white">
                  👤 Profile
                </router-link>
              </li>
              <li>
                <router-link to="/order-history" class="dropdown-item text-white">
                  📦 Order History
                </router-link>
              </li>
            </ul>
          </li>
          <li><a href="#" @click.prevent="logout">🚪 Logout</a></li>
        </template>
      </ul>

      <!-- Hamburger Menu for Mobile -->
      <div class="hamburger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
</template>

<script>
import { getCart } from '@/api/CartAPI';

export default {
  name: "NavbarElement",
  data() {
    return {
      isMenuOpen: false,
      searchQuery: '',
      cartItemCount: 0,
      token: localStorage.getItem('token')
    };
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    }
  },
  methods: {
    async fetchCartCount() {
      try {
        if (this.token) {
          const res = await getCart(this.token);
          this.cartItemCount = res.data.items?.length || 0;
        }
      } catch (err) {
        console.error('Cannot retrieve amount in shopping cart:', err);
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/");
      window.location.reload();
    },
    searchProducts() {
      const currentQuery = this.$route.query.q;
      if (this.searchQuery && this.searchQuery !== currentQuery) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } });
      }
    },
    showLoginNotification() {
      alert("You need to log in to view the cart.");
      this.$router.push("/login");
      window.location.reload();
    }
  },
  mounted() {
    this.fetchCartCount();
  }
};
</script>

<style scoped>
/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Search Bar */
.search-bar input {
  padding: 10px 20px;
  /* Khoảng cách bên trong */
  margin-left: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
  border-radius: 20px;
  /* Bo tròn */
  width: 300px;
  transition: width 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  width: 500px;
  transition: width 0.3s ease;
}

/* Cart Icon */
.nav-links li i {
  font-size: 25px;
  /* Increase the size of the icon */
  margin-right: 10px;
  /* Add space between the icon and text */
  color: #fff;
  /* Set the default icon color */
  transition: color 0.3s ease, transform 0.3s ease;
  /* Add smooth transition */
  position: relative;
  /* Position the badge */
}

/* Cart Icon Hover Effects */
.nav-links li i:hover {
  color: #00b33c;
  /* Change the icon color on hover */
  transform: scale(1.2);
  /* Slightly increase the icon size on hover */
}

/* Cart Icon Badge */
.nav-links li i::after {
  content: attr(data-count);
  /* The count from the data-count attribute */
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #ff4d4d;
  /* Red color for the badge */
  color: white;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 12px;
  font-weight: bold;
}

/* Navbar Styling */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #111;
  padding: 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.shop-name {
  margin-left: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

/* Navigation Links */
.nav-links {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
  list-style-type: none;
  display: flex;
}

.nav-links li {
  margin: 0 15px;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  position: relative;
  transition: color 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  background: #00ff99;
  bottom: -4px;
  left: 0;
  transition: 0.3s;
}

.nav-links a:hover {
  color: #00b33c;
}

.nav-links a:hover::after {
  width: 100%;
}

/* Dropdown Menu */
.dropdown {
  position: relative;
  align-items: center;
  border: none;
  background: none;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: -37px;
  background: transparent;
  display: none;
  align-items: stretch;
  list-style: none;
  padding-top: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu li {
  padding: 10px 0;
  text-align: left;
}

.dropdown-menu a {
  color: #000000;
  padding: 10px 20px;
  display: block;
  align-items: center;
  transition: color 0.3s ease;
}

.dropdown-menu a:hover {
  color: #5efc93;
  background: rgba(0, 0, 0, 0.3);
}

.dropdown:hover .dropdown-menu {
  display: block;
}

/* Hamburger Menu for Mobile */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.hamburger span {
  height: 3px;
  width: 25px;
  background: #fff;
  margin: 4px 0;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Media Query for Mobile Devices */
@media screen and (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 65px;
    left: 0;
    background: #1c1c1c;
    width: 100%;
    flex-direction: column;
    align-items: center;
    display: none;
  }

  .nav-links li {
    margin: 15px 0;
  }

  .hamburger {
    display: block;
  }

  .nav-links.active {
    display: block;
  }

  .dropdown-menu {
    position: relative;
  }
}

body {
  padding-top: 80px;
}
</style>

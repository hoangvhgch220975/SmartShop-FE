<template>
  <nav class="sidebar">
    <div class="logo-container">
      <router-link to="/admin" class="logo-link">
        <img src="@/assets/smartshop-high-resolution-logo.png" alt="SmartShop Logo" class="logo" />
        <span class="shop-name">SmartShop</span>
      </router-link>
    </div>

    <ul class="nav-links">
      <li><router-link to="/admin">🏠 Dashboard</router-link></li>
      <li><router-link to="/admin/devices">📱 Manage Device</router-link></li>
      <li><router-link to="/admin/packages">📦 Manage Package</router-link></li>
      <li><router-link to="/admin/combos">🎁 Manage Combo</router-link></li>
      <li><router-link to="/admin/users">👤 Manage User</router-link></li>
      <li><router-link to="/admin/orders">🧾 Manage Orders</router-link></li>
      <li><a href="#" @click.prevent="logout">🚪 Logout</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavbarElement",
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/");
      window.location.reload();
    }
  }
};
</script>

<style scoped>
/* Sidebar container */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 220px;
  background: linear-gradient(to bottom, #2fdd55, #2f8160, #000000);
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

/* Logo + Name */
.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
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
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

/* Navigation menu */
.nav-links {
  list-style: none;
  padding-left: 0;
  width: 100%;
}

.nav-links li {
  width: 100%;
  margin: 10px 0;
}

.nav-links a {
  display: block;
  width: 100%;
  padding: 10px 15px;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s ease, color 0.3s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #00ff99;
}

.nav-links a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.2);
  color: #00ff99;
}

/* Responsive for smaller screens */
@media screen and (max-width: 768px) {
  .sidebar {
    width: 180px;
  }

  .shop-name {
    font-size: 16px;
  }

  .nav-links a {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
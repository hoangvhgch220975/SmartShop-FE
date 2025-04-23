<template>
  <div class="admin-layout">
    <NavbarAdmin />
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavbarAdmin from './components/NavbarAdmin.vue';

export default {
  name: 'AdminLayout',
  components: { NavbarAdmin }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
}

.admin-main {
  margin-left: 220px; /* đủ chỗ cho sidebar */
  padding: 40px;
  background-color: #f1f3f5;
  min-height: 100vh;
  width: calc(100% - 220px);
  overflow-x: hidden;
}
</style>
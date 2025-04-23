<template>
  <div class="admin-homepage">
    <header class="admin-header">
      <h1>Welcome, Admin</h1>
      <p>Manage your dashboard efficiently</p>
    </header>

    <section class="admin-actions">
      <div class="action-card" v-for="action in actions" :key="action.id">
        <h2>{{ action.title }}</h2>
        <p>{{ action.description }}</p>
        <button @click="navigateTo(action.route)">Go to {{ action.title }}</button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue';

export default {
  name: 'AdminHomePage',
  components: { Footer },
  data() {
    return {
      actions: [
        { id: 1, title: 'Manage Device', description: 'View and manage devices', route: '/admin/devices' },
        { id: 2, title: 'Manage Package', description: 'View and manage packages', route: '/admin/packages' },
        { id: 3, title: 'Manage Combo', description: 'View and manage combos', route: '/admin/combos' },
        { id: 4, title: 'Manage User', description: 'View and manage users', route: '/admin/users' },
        { id: 5, title: 'Manage Orders', description: 'View and manage orders', route: '/admin/orders' }
      ]
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.admin-homepage {
  display: flex;
  flex-direction: column;
  color: #222;
  background: linear-gradient(to bottom right, #f4f6f9, #dce3ea);

}

.admin-header {
  text-align: center;
  background: linear-gradient(135deg, #1d3557, #457b9d);
  color: white;
  width: 100%;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.admin-header p {
  font-size: 16px;
}

.admin-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1100px;
  padding: 20px;
}

.action-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 200, 200, 0.3);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);

}

.action-card h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 14px;
  color: #555;
  margin-bottom: 16px;
}

.action-card button {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-card button:hover {
  background: #256bd4;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
</style>
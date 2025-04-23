<template>
  <div class="container py-5" style="padding-top: 120px;">
    <h2 class="text-center text-success mb-5 fw-bold display-5">🧾 Your Order History</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-success"></div>
    </div>

    <div v-else-if="orders.length === 0" class="text-center text-muted">
      <p>You haven't made any purchases yet.</p>
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle bg-dark text-white">
          <thead class="table-success text-dark">
            <tr>
              <th>#</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Total</th>
              <th style="min-width: 400px;">Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bill, index) in visibleOrders" :key="bill._id">
              <td class="fw-semibold">{{ index + 1 }}</td>
              <td>{{ new Date(bill.createdAt).toLocaleString() }}</td>
              <td><span :class="statusClass(bill.shippingStatus)">{{ bill.shippingStatus.toUpperCase() }}</span></td>
              <td class="fw-bold text-success">${{ (bill.totalPrice + bill.shipping).toFixed(2) }}</td>
              <td>
                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="item in bill.items"
                    :key="item.productId + item.productType"
                    class="d-flex align-items-center bg-secondary bg-opacity-25 border border-success rounded p-2 gap-3"
                  >
                    <img :src="getImage(item.image, item.productType)" height="60" width="60" class="rounded border" alt="Product" />
                    <div class="text-start">
                      <div class="fw-semibold small mb-1">{{ item.name || 'Unnamed' }}</div>
                      <div class="small">Qty: {{ item.quantity }}</div>
                      <div class="small text-muted">Type: {{ capitalize(item.productType) }}</div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="d-flex flex-column gap-2 justify-content-center align-items-center">
                <router-link :to="`/order/${bill._id}`" class="btn btn-outline-success btn-sm rounded-pill px-4">
                  📄 Details
                </router-link>
                <button class="btn btn-outline-danger btn-sm rounded-pill px-4" @click="hideOrder(bill._id)">
                  🗑️ Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserBills, hideUserBill } from '@/api/Bill';
import { getDeviceById } from '@/api/DeviceAPI';
import { getPackageById } from '@/api/PackageAPI';
import { getComboById } from '@/api/ComboAPI';

export default {
  name: 'OrderHistory',
  data() {
    return {
      orders: [],
      loading: true,
      token: localStorage.getItem('token')
    };
  },
  computed: {
    visibleOrders() {
      return this.orders.filter(order => !order.isHiddenByUser);
    }
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await getUserBills(this.token);
        if (res.success) {
          for (const bill of res.data) {
            for (const item of bill.items) {
              let detail = {};
              try {
                if (item.productType === 'device') {
                  const { data } = await getDeviceById(item.productId);
                  detail = data;
                } else if (item.productType === 'package') {
                  const { data } = await getPackageById(item.productId);
                  detail = data;
                } else if (item.productType === 'combo') {
                  const { data } = await getComboById(item.productId);
                  detail = data;
                }
                item.name = detail.name;
                item.image = detail.image;
              } catch (err) {
                console.warn('Missing product details for item', item);
              }
            }
          }
          this.orders = res.data;
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        this.loading = false;
      }
    },
    async hideOrder(id) {
      if (!confirm('Are you sure you want to delete this order?')) return;
      const res = await hideUserBill(id, this.token);
      if (res.success) {
        alert('✅ Order deleted successfully!');
        this.fetchOrders();
      } else {
        alert('❌ Failed to delete order');
        console.error(res.error);
      }
    },
    getImage(path, type) {
      if (!path) return 'https://via.placeholder.com/300x200?text=No+Image';
      if (path.startsWith('http')) return path;
      try {
        if (type === 'device') return require(`@/assets/imagedevice/${path}`);
        if (type === 'package') return require(`@/assets/imagepackage/${path}`);
        if (type === 'combo') return require(`@/assets/imagecombo/${path}`);
      } catch (err) {
        return `http://localhost:3333/uploads/${path}`;
      }
    },
    statusClass(status) {
      return `badge rounded-pill px-3 py-1 ${{
        pending: 'bg-secondary',
        shipping: 'bg-info text-dark',
        completed: 'bg-success',
        cancelled: 'bg-danger'
      }[status] || 'bg-light text-dark'}`;
    },
    capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
.container {
  margin-top: 60px;
}
img {
  object-fit: cover;
}
</style>
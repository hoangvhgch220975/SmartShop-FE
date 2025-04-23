<template>
  <div class="admin-orders">
    <!-- Header -->
    <div class="admin-header text-success font-weight-bold">
      <h2>📦 Manage Orders</h2>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchId"
        class="form-control"
        placeholder="🔍 Search by Order ID..."
      />
      <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
    </div>

    <!-- Loading / Empty States -->
    <div v-if="loading" class="text-center text-secondary py-3">Loading orders...</div>
    <div v-else-if="filteredOrders.length === 0" class="text-center text-muted py-3">No orders found.</div>

    <!-- Orders Table -->
    <div v-else class="order-table-wrapper">
      <table class="table table-hover table-bordered shadow-sm bg-white rounded">
        <thead class="thead-dark">
          <tr class="text-center">
            <th>#</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Change Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bill, index) in paginatedOrders" :key="bill._id" class="text-center align-middle">
            <td>{{ index + 1 + (page - 1) * pageSize }}</td>
            <td>
              <div class="fw-semibold">{{ bill.userId?.username || 'N/A' }}</div>
              <small class="text-muted">{{ bill.userId?.email }}</small>
            </td>
            <td>${{ (bill.totalPrice + bill.shipping).toFixed(2) }}</td>
            <td>
              <span :class="statusClass(bill.shippingStatus)">
                {{ bill.shippingStatus.toUpperCase() }}
              </span>
            </td>
            <td>{{ new Date(bill.createdAt).toLocaleString() }}</td>
            <td>
              <select
                v-model="bill.shippingStatus"
                @change="updateStatus(bill._id, bill.shippingStatus)"
                class="form-select"
              >
                <option value="pending">Pending</option>
                <option value="shipping">Shipping</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td>
              <router-link :to="`/admin/order/${bill._id}`" class="btn btn-sm btn-outline-primary">
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination d-flex justify-content-center mt-4">
        <button :disabled="page === 1" @click="page--">Previous</button>
        <span>Page {{ page }}</span>
        <button :disabled="page >= totalPages" @click="page++">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllBills, updateBillStatus } from '@/api/Bill';

export default {
  name: 'OrderManagement',
  data() {
    return {
      orders: [],
      loading: true,
      token: localStorage.getItem('token'),
      searchId: '',
      page: 1,
      pageSize: 6
    };
  },
  computed: {
    filteredOrders() {
      if (!this.searchId.trim()) return this.orders;
      return this.orders.filter(order =>
        order._id.toLowerCase().includes(this.searchId.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.pageSize);
    },
    paginatedOrders() {
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredOrders.slice(start, end);
    }
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await getAllBills(this.token);
        if (res.success) {
          this.orders = res.data;
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(id, status) {
      try {
        const res = await updateBillStatus(id, { status }, this.token);
        if (res.success) {
          alert('✅ Status updated successfully!');
        } else {
          alert('❌ Failed to update status');
        }
      } catch (err) {
        console.error('Failed to update status:', err);
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
    clearSearch() {
      this.searchId = '';
      this.page = 1;
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
.admin-orders {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(to bottom right, #f4f6f9, #dce3ea);
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
  padding: 0px 60px 40px 240px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.order-table-wrapper {
  flex-grow: 1;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.table {
  margin-bottom: 0;
  background-color: #fff;
  border-collapse: separate;
  border-spacing: 0;
}

.table tbody td {
  text-align: center;
  vertical-align: middle;
  padding: 12px;
  background-color: #fff;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.form-select {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
}

.badge {
  font-size: 13px;
}

.pagination {
  margin-top: 30px;
}

.pagination button {
  padding: 8px 15px;
  margin: 0 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-weight: bold;
  margin: 0 10px;
}
</style>

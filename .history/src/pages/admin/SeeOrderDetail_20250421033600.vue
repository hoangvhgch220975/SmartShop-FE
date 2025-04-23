
<template>
  <div class="container py-5" style="padding-top: 120px;">
    <h2 class="text-center text-primary fw-bold mb-5">📦 Order Detail</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="!bill" class="text-center text-muted">
      <p>Order not found.</p>
    </div>

    <div v-else class="card bg-white shadow-lg border-0 rounded-4 p-4">
      <div class="mb-4">
        <h5 class="mb-2 text-dark">Bill ID: <span class="text-muted">{{ bill._id }}</span></h5>
        <p class="mb-1"><strong>Status:</strong> <span :class="statusClass(bill.shippingStatus)">{{ bill.shippingStatus }}</span></p>
        <p class="mb-1"><strong>Date:</strong> {{ new Date(bill.createdAt).toLocaleString() }}</p>
      </div>

      <div class="bg-light p-3 rounded-3 mb-4">
        <h5 class="mb-3">👤 Customer Information</h5>
        <ul class="list-unstyled mb-0">
          <li><strong>Name:</strong> {{ bill.userId?.username || 'N/A' }}</li>
          <li><strong>Email:</strong> {{ bill.userId?.email || 'N/A' }}</li>
          <li><strong>Address:</strong> {{ bill.userId?.address || 'N/A' }}</li>
          <li><strong>Card Number:</strong> **** **** **** {{ bill.paymentDetails?.cardNumber?.slice(-4) || 'N/A' }}</li>
        </ul>
      </div>

      <div>
        <h5 class="mb-3">🛍️ Ordered Items</h5>
        <div class="row g-4">
          <div v-for="item in bill.items" :key="item.productId + item.productType" class="col-md-6">
            <div class="d-flex align-items-center bg-white border rounded-3 shadow-sm p-3">
              <img :src="getImage(item.image, item.productType)" alt="product" class="rounded border me-3" width="75" height="75" />
              <div class="flex-grow-1">
                <div class="fw-bold text-dark">{{ item.name || 'Product' }}</div>
                <div class="text-muted small">Type: {{ capitalize(item.productType) }}</div>
                <div class="small">Qty: {{ item.quantity }}</div>
                <div class="small">Price: ${{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ Highlight phần Shipping và Total -->
      <hr class="my-4" />
      <div class="bg-light border rounded-3 p-3 mt-3 text-start">
        <div class="mb-2">
          <strong>🚚 Shipping: </strong>
          <span class="text-primary fw-bold">${{ bill.shipping }}</span>
        </div>
        <div>
          <strong>💰 Total: </strong>
          <span class="text-success fw-bold fs-5">${{ (bill.totalPrice + bill.shipping).toFixed(2) }}</span>
        </div>
      </div>

      <div class="text-end mt-4">
        <router-link to="/admin/orders" class="btn btn-outline-primary px-4">⬅ Back to History</router-link>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { getBillById } from '@/api/Bill';
  import { getDeviceById } from '@/api/DeviceAPI';
  import { getPackageById } from '@/api/PackageAPI';
  import { getComboById } from '@/api/ComboAPI';
  import { getUserById } from '@/api/UserAPI';
  
  export default {
    name: 'OrderHistoryDetail',
    data() {
      return {
        bill: null,
        loading: true,
        token: localStorage.getItem('token')
      };
    },
    methods: {
      async fetchBill() {
        try {
          const res = await getBillById(this.$route.params.id, this.token);
          if (res.success) {
            const bill = res.data;
  
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
                console.warn('Missing product info', item);
              }
            }
  
            // Get full user info
            try {
              const { data } = await getUserById(bill.userId._id);
              bill.userId.address = data.address;
            } catch (err) {
              console.warn('Failed to fetch user address');
            }
  
            this.bill = bill;
          }
        } catch (err) {
          console.error('Error fetching bill', err);
        } finally {
          this.loading = false;
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
      this.fetchBill();
    }
  };
  </script>
  
  <style scoped>
  img {
    object-fit: cover;
  }
  </style>
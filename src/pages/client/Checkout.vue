<template>
    <div class="container py-5" style="padding-top: 100px;">
      <h2 class="mb-4 text-center text-primary fw-bold">💳 Checkout</h2>
  
      <div class="row">
        <!-- Cart Summary -->
        <div class="col-md-7">
          <div class="card p-4 shadow-sm mb-4 bg-dark text-white">
            <h5 class="fw-semibold mb-3">🛒 Your Items</h5>
            <div
              v-for="item in cart.items"
              :key="item.productId"
              class="d-flex border rounded mb-3 p-3 align-items-center justify-content-between"
            >
              <div class="d-flex align-items-center gap-3">
                <img
                  :src="getImageSrc(item.image, item.productType)"
                  alt="product"
                  class="rounded border"
                  width="80"
                  height="80"
                />
                <div>
                  <h6 class="mb-1 fw-bold text-white">{{ item.name }}</h6>
                  <div class="text-muted small">Type: {{ capitalize(item.productType) }}</div>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-secondary text-white rounded-pill px-2 py-1 fs-6 fw-bold mb-2">Qty: {{ item.quantity }}</div>
                <div class="fw-semibold fs-6 text-white">${{ (item.price * item.quantity).toFixed(2) }}</div>
              </div>
            </div>
  
            <div class="d-flex justify-content-between mt-3">
              <span class="fw-semibold">Shipping:</span>
              <span>${{ shipping }}</span>
            </div>
            <div class="d-flex justify-content-between mt-2 border-top pt-3">
              <span class="fw-bold">Total:</span>
              <span class="fw-bold">${{ (cart.totalPrice + shipping).toFixed(2) }}</span>
            </div>
          </div>
        </div>
  
        <!-- Payment Form -->
        <div class="col-md-5">
          <div class="card p-4 shadow-sm">
            <h5 class="fw-semibold mb-3">💳 Payment Details</h5>
  
            <form @submit.prevent="submitCheckout">
              <div class="mb-3">
                <label class="form-label">Cardholder Name</label>
                <input type="text" class="form-control" v-model="payment.cardholder" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Card Number</label>
                <input type="text" class="form-control" v-model="payment.cardNumber" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Expiration</label>
                  <input type="month" class="form-control" v-model="payment.expiration" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">CVV</label>
                  <div class="input-group">
                    <input
                      :type="showCvv ? 'text' : 'password'"
                      class="form-control"
                      v-model="payment.cvv"
                      required
                    />
                    <button type="button" class="btn btn-outline-secondary" @click="toggleCvv">
                      <i :class="showCvv ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
  
              <button type="submit" class="btn btn-success w-100 fw-semibold" :disabled="loading">
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm"></span> Processing...
                </span>
                <span v-else>
                  💳 Pay ${{ (cart.totalPrice + shipping).toFixed(2) }}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { checkout } from '@/api/Bill';
  import { clearCart } from '@/api/CartAPI';
  
  export default {
    name: 'CheckoutPage',
    data() {
      return {
        cart: { items: [], totalPrice: 0 },
        payment: {
          cardholder: '',
          cardNumber: '',
          expiration: '',
          cvv: ''
        },
        showCvv: false,
        shipping: 20,
        loading: false,
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user')) // ✅ lấy user
      };
    },
    methods: {
      getImageSrc(imagePath, type) {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        try {
          if (type === 'device') return require(`@/assets/imagedevice/${imagePath}`);
          if (type === 'package') return require(`@/assets/imagepackage/${imagePath}`);
          if (type === 'combo') return require(`@/assets/imagecombo/${imagePath}`);
        } catch (err) {
          return `https://smartshop-be.onrender.com/uploads/${imagePath}`;
        }
      },
      capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
      },
      toggleCvv() {
        this.showCvv = !this.showCvv;
      },
      async submitCheckout() {
        this.loading = true;
        const payload = {
          items: this.cart.items.map(i => ({
            productId: i.productId,
            productType: i.productType,
            quantity: i.quantity,
            price: i.price
          })),
          totalPrice: this.cart.totalPrice,
          shipping: this.shipping,
          paymentDetails: this.payment
        };
  
        try {
          const res = await checkout(payload, this.token);
          if (res.success) {
            await clearCart(this.token);
            localStorage.removeItem('checkout_cart');
            this.$emit('cart-updated');
            setTimeout(() => {
              this.loading = false;
              this.$router.push('/thanks');
            }, 2000);
          } else {
            alert('❌ Checkout failed.');
            this.loading = false;
            console.error(res.error);
          }
        } catch (err) {
          this.loading = false;
          console.error(err);
        }
      }
    },
    mounted() {
      const localCart = localStorage.getItem('checkout_cart');
      if (localCart) {
        this.cart = JSON.parse(localCart);
      } else {
        this.$router.push('/cart');
      }
  
      // ✅ Set cardholder name if user exists
      if (this.user && (this.user.fullname || this.user.username)) {
        this.payment.cardholder = this.user.fullname || this.user.username;
      }
    }
  };
  </script>
  
  <style scoped>
  input {
    font-size: 14px;
  }
  </style>
  
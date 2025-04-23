<template>
    <div class="container cart-container">
        <h1 class="text-center mb-5 display-5 fw-bold text-primary-emphasis">🛒 Your Shopping Cart</h1>

        <div v-if="loading" class="d-flex justify-content-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div v-else-if="cart.items.length === 0" class="text-center">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
                alt="empty cart" style="max-width: 300px;" />
            <h4 class="mt-3 text-secondary">Your cart is currently empty.</h4>
        </div>

        <div v-else class="card shadow-sm border-0 rounded-4 px-3 py-4 bg-white">
            <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-danger fw-semibold px-4 py-2 rounded-pill" @click="clearCart">
                    🧹 Clear Cart
                </button>
            </div>

            <div class="table-responsive">
                <table class="table align-middle text-center">
                    <thead class="table-light">
                        <tr>
                            <th class="text-start ps-4">Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in cart.items" :key="item.productId">
                            <td class="text-start d-flex align-items-center gap-3 ps-4">
                                <img v-if="item.image" :src="getImageSrc(item.image, item.productType)" alt="product"
                                    class="rounded border" width="70" height="70" style="object-fit: cover" />
                                <div>
                                    <h6 class="mb-0 fw-semibold">{{ item.name || 'Product' }}</h6>
                                    <small class="text-muted">Type: {{ capitalize(item.productType) }}</small>
                                </div>
                            </td>
                            <td>${{ item.price.toLocaleString() }}</td>
                            <td>
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <button class="btn btn-sm btn-outline-secondary"
                                        @click="decreaseQuantity(item)">➖</button>
                                    <span>{{ item.quantity }}</span>
                                    <button class="btn btn-sm btn-outline-secondary"
                                        @click="increaseQuantity(item)">➕</button>
                                </div>
                            </td>
                            <td>${{ (item.quantity * item.price).toLocaleString() }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm rounded-pill" @click="removeItem(item)">✖</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 border-top pt-4">
                <h4 class="mb-3 mb-md-0 text-primary fw-bold">Total: ${{ cart.totalPrice.toLocaleString() }}</h4>
                <button class="btn btn-success btn-lg rounded-pill px-4 py-2 fw-semibold" @click="checkout">
                    💳Checkout
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getCart,
    removeCartItem,
    clearCart as clearCartAPI,
    updateCartItemQuantity
} from '@/api/CartAPI';
import { getDeviceById } from '@/api/DeviceAPI';
import { getPackageById } from '@/api/PackageAPI';
import { getComboById } from '@/api/ComboAPI';

export default {
    name: 'CartPage',
    data() {
        return {
            cart: { items: [], totalPrice: 0 },
            loading: true,
            token: localStorage.getItem('token')
        };
    },
    methods: {
        async fetchCart() {
            try {
                const res = await getCart(this.token);
                if (!res.success) throw res.error;

                const items = res.data.items;

                for (const item of items) {
                    let productData = {};
                    try {
                        if (item.productType === 'device') {
                            const { data } = await getDeviceById(item.productId);
                            productData = data;
                        } else if (item.productType === 'package') {
                            const { data } = await getPackageById(item.productId);
                            productData = data;
                        } else if (item.productType === 'combo') {
                            const { data } = await getComboById(item.productId);
                            productData = data;
                        }
                        item.name = productData.name;
                        item.image = productData.image;
                    } catch (err) {
                        console.error('Error in getting product detail: ', err);
                    }
                }

                this.cart = { ...res.data, items };
            } catch (err) {
                console.error('Error in adding product to cart: ', err);
            } finally {
                this.loading = false;
            }
        },

        async increaseQuantity(item) {
            const newQuantity = item.quantity + 1;
            const res = await updateCartItemQuantity(item.productId, item.productType, newQuantity, this.token);
            if (res.success) {
                this.fetchCart();
            } else {
                alert('⚠️ Cannot increase quantity. Please try again.');
                console.error(res.error);
            }
        },

        async decreaseQuantity(item) {
            const newQuantity = item.quantity - 1;

            if (newQuantity <= 0) {
                this.removeItem(item);
            } else {
                const res = await updateCartItemQuantity(item.productId, item.productType, newQuantity, this.token);
                if (res.success) {
                    this.fetchCart();
                } else {
                    alert('⚠️ Cannot decrease quantity. Please try again.');
                    console.error(res.error);
                }
            }
        },

        async removeItem(item) {
            try {
                const res = await removeCartItem(item.productId, item.productType, this.token);
                if (res.success) {
                    this.fetchCart();
                    alert('✅ Item removed from cart successfully!');
                    window.location.reload();
                } else {
                    alert('⚠️ Cannot remove item from cart.');
                    console.error(res.error);
                }
            } catch (err) {
                console.error(err);
            }
        },

        async clearCart() {
            try {
                const res = await clearCartAPI(this.token);
                if (res.success) {
                    this.fetchCart();
                    alert('✅ Cart cleared successfully!');
                    window.location.reload();
                } else {
                    alert('⚠️ Cannot remove all item.');
                    console.error(res.error);
                }
            } catch (err) {
                console.error(err);
            }
        },

        checkout() {
            localStorage.setItem('checkout_cart', JSON.stringify(this.cart));
            this.$router.push('/checkout')
        },

        getImageSrc(imagePath, type) {
            if (!imagePath) return '';
            if (imagePath.startsWith('http')) return imagePath;
            try {
                if (type === 'device') return require(`@/assets/imagedevice/${imagePath}`);
                if (type === 'package') return require(`@/assets/imagepackage/${imagePath}`);
                if (type === 'combo') return require(`@/assets/imagecombo/${imagePath}`);
            } catch (err) {
                return `http://localhost:3333/uploads/${imagePath}`;
            }
        },

        capitalize(text) {
            if (!text) return '';
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
    },
    mounted() {
        this.fetchCart();
    }
};
</script>

<style scoped>
.cart-container {
    padding-top: 100px;
    padding-bottom: 50px;
}

img {
    object-fit: cover;
}
</style>
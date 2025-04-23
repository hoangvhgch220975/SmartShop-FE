<template>
  <div id="app">
    <!-- Navbar Component -->
    <Navbar ref="navbar" />
    <!-- Routed Components -->
    <router-view @cart-updated="updateCartCount" />

    <ChatIcon v-if="!showBot" @open="showBot = true" />
    <ChatWindow v-if="showBot" @close="showBot = false" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import ChatIcon from "@/components/Chatbot/ChatIcon.vue";
import ChatWindow from "@/components/Chatbot/ChatWindow.vue";


export default {
  name: 'App',
  components: {
    Navbar,
    ChatIcon,
    ChatWindow
  },
  data() {
    return {
      showBot: false   // 🟢 Bắt buộc phải khai báo biến này!
    };
  },
  methods: {
    updateCartCount() {
      if (this.$refs.navbar && this.$refs.navbar.fetchCartCount) {
        this.$refs.navbar.fetchCartCount();
      }
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
}
</style>

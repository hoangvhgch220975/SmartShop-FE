//ChatWindow.vue

<template>
    <div class="chat-window shadow" v-click-outside="close">
      <div class="chat-header bg-success text-white d-flex justify-content-between p-2">
        <strong>🤖 SmartBot</strong>
        <button @click="close" class="btn btn-sm btn-light">×</button>
      </div>
  
      <div class="chat-body p-3" ref="chatBody">
        <div v-for="msg in messages" :key="msg.id" :class="msg.sender">
          <p class="mb-2">{{ msg.text }}</p>
        </div>
        <div v-if="loading" class="text-muted">Bot is typing...</div>
      </div>
  
      <!-- ✅ FORM để xử lý Enter -->
      <form @submit.prevent="sendMessage" class="chat-footer p-2">
        <input
          v-model="input"
          class="form-control mb-2"
          placeholder="Ask me about a product..."
        />
        <button class="btn btn-success w-100" type="submit">Send</button>
      </form>
    </div>
  </template>
  
  <script>
import { getAllProducts } from "@/api/productService";
import { initFuzzySearch, matchProductsHybrid } from "./BotEngine";


  
  export default {
    data() {
      return {
        input: "",
        messages: [
          { id: 1, text: "👋 Hello! Ask me about our products or combos.", sender: "bot" }
        ],
        products: [],
        loading: false,
      };
    },
    async mounted() {
      try {
        this.products = await getAllProducts();
        initFuzzySearch(this.products);
        console.log("✅ Products loaded:", this.products);
      } catch (error) {
        console.error("❌ Error loading products:", error);
        this.messages.push({ id: Date.now(), text: "⚠️ Failed to load product data.", sender: "bot" });
      }
    },
    methods: {
      sendMessage() {
        const msg = this.input.trim();
        console.log("📨 User message:", msg);
  
        if (!msg) {
          console.warn("⚠️ Empty message ignored");
          return;
        }
  
        this.messages.push({ id: Date.now(), text: msg, sender: "user" });
        this.input = "";
        this.loading = true;
  
        setTimeout(() => {
            const matched = matchProductsHybrid(this.products, msg);
            console.log("🔍 Matched products:", matched);
  
          if (matched.length > 0) {
            this.messages.push({
              id: Date.now() + 1,
              text: `🔍 Found ${matched.length} product(s):\n` +
                matched.slice(0, 3).map(p => `• ${p.name} (${p.type})`).join('\n'),
              sender: "bot"
            });
          } else {
      const fallbackReplies = [
        "😕 I couldn't find any matching products.",
        "🤔 Could you describe more clearly what you're looking for?",
        "💡 You can say things like: 'headphones', 'smartwatch', 'combo internet'..."
      ];
      this.messages.push({
        id: Date.now() + 2,
        text: fallbackReplies.join("\n"),
        sender: "bot"
      });
    }
          this.loading = false;
          this.scrollToBottom();
        }, 700);
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const container = this.$refs.chatBody;
          container.scrollTop = container.scrollHeight;
        });
      },
      close() {
        this.$emit("close");
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-window {
    position: fixed;
    bottom: 100px;
    right: 24px;
    width: 350px;
    height: 480px;
    background: #1e1e1e;
    color: #f8f9fa;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .chat-body {
    flex: 1;
    overflow-y: auto;
    font-size: 14px;
  }
  
  .chat-body .user {
    text-align: right;
    color: #198754;
  }
  
  .chat-body .bot {
    text-align: left;
    color: #eee;
  }
  
  .chat-footer input {
    font-size: 14px;
  }
  </style>
<template>
    <div class="signup-wrapper d-flex justify-content-center align-items-center">
      <div class="signup card shadow-lg p-4" style="max-width: 400px; width: 100%;">
        <h3 class="text-center text-primary mb-4">📝 Sign Up</h3>
  
        <form @submit.prevent="handleSignup">
          <div class="form-group">
            <label for="username">👤 Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="form-control"
              placeholder="Enter a username"
              required
            />
          </div>
  
          <div class="form-group mt-3">
            <label for="email">📧 Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
  
          <div class="form-group mt-3">
            <label for="password">🔒 Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-control"
              placeholder="Create a password"
              required
            />
          </div>
  
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  
          <button class="btn btn-primary btn-block mt-4 shadow-sm">Sign Up</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { signupUser } from "@/api/UserAPI";
  
  export default {
    name: "SignupForm",
    data() {
      return {
        username: "",
        email: "",
        password: "",
        error: null,
      };
    },
    methods: {
      async handleSignup() {
        this.error = null;
        try {
          const res = await signupUser({
            username: this.username,
            password: this.password,
            email: this.email,
          });
  
          const userId = res.data.userId;
          localStorage.setItem("signupUserId", userId);
          this.$router.push("/regist-info");
        } catch (err) {
          this.error = (err.response && err.response.data.message) || "Signup failed";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .signup-wrapper {         
    min-height: 100vh;
    padding-top: 40px; /* space under fixed navbar */
    background: linear-gradient(135deg, #f8f9fa, #dee2e6);
  }
  
  .signup {
    border-radius: 16px;
    background-color: white;
  }
  
  .signup input {
    border-radius: 8px;
    padding: 10px;
    font-size: 16px;
  }
  
  .signup button {
    border-radius: 8px;
    font-weight: bold;
  }
  </style>
  
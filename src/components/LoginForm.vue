<template>
  <div class="login-wrapper">
    <div class="login-container row shadow-lg">
      <!-- 📽️ Intro Video Section -->
      <div class="col-md-6 video-container d-none d-md-block">
        <video autoplay muted loop class="intro-video">
          <source src="@/assets/intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <!-- 🔐 Login Form Section -->
      <div class="col-md-6 p-4 form-area d-flex flex-column justify-content-center">
        <h3 class="text-center text-success mb-4">🔐 Login to Your Account</h3>

        <form @submit.prevent="handleLogin">
          <!-- Username -->
          <div class="form-group">
            <label for="username">👤 Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="form-control"
              placeholder="Enter your username"
              required
            />
          </div>

          <!-- Password + 👁️ Icon -->
          <div class="form-group mt-3">
            <label for="password">🔑 Password</label>
            <div class="input-icon-wrapper">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="form-control"
                placeholder="Enter your password"
                required
              />
              <span class="toggle-password" @click="togglePassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

          <!-- Submit Button -->
          <button class="btn btn-success btn-block mt-4 shadow-sm">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "@/api/UserAPI";

export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      error: null,
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      this.error = null;
      try {
        const res = await loginUser({
          username: this.username,
          password: this.password,
        });

        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const path = user.role === "admin" ? "/admin" : "/";
        this.$router.push(path).then(() => {
          window.location.reload();
        });
      } catch (err) {
        this.error =
          (err.response && err.response.data && err.response.data.message) ||
          "Login failed";
      }
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  padding: 40px 15px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  max-width: 960px;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 🔹 Video Section */
.video-container {
  padding: 0;
  background-color: #000;
  flex: 1;
  min-height: 420px;
}

.intro-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-right: 1px solid #e0e0e0;
}

/* 🔸 Form Section */
.form-area {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 40px;
  min-height: 420px;
}

.form-area h3 {
  font-weight: bold;
  font-size: 24px;
}

.form-area input {
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
}

.form-area button {
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.form-area button:hover {
  background-color: #218838;
}

/* 👁️ Password Icon */
.input-icon-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
  font-size: 18px;
}

.toggle-password:hover {
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .video-container {
    display: none;
  }

  .form-area {
    padding: 40px 25px;
  }
}
</style>

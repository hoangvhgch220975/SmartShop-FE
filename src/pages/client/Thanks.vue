<template>
    <div class="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-dark">
      <transition name="fade-up">
        <div class="card bg-black text-white p-5 shadow-lg thanks-card text-center">
          <div class="mb-4">
            <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h2 class="fw-bold text-success">Thank You for Your Purchase!</h2>
          </div>
          <p class="lead text-muted mb-4">
            Your order has been placed successfully. We'll process it and keep you updated.
          </p>
          <router-link to="/" class="btn btn-success btn-lg px-5 py-2 rounded-pill">
            ⬅️ Back to Home
          </router-link>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ThanksPage'
  };
  </script>
  
  <style scoped>
  .thanks-card {
    max-width: 600px;
    border-radius: 20px;
    background: linear-gradient(to right, #0f0f0f, #1a1a1a);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  /* Animation */
  .fade-up-enter-active {
    animation: fadeUp 0.6s ease;
  }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
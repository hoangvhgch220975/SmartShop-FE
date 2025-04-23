<template>
    <div @click="$emit('open')" class="chat-icon">
      💬
    </div>
  </template>
  
  <style scoped>
  .chat-icon {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #198754;
    color: white;
    font-size: 24px;
    padding: 14px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
  }
  </style>
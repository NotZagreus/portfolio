<template>
    <header>
      <Logo />
      <Navigation />
    </header>
  </template>
  
  <script setup lang="ts">
  import Logo from './Logo.vue'
  import Navigation from './Navigation.vue'
  </script>
  
  <style scoped>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  @media (max-width: 768px) {
    header {
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
  }
  </style>
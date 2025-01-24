<template>
  <header>
    <Navigation />
  </header>
</template>
  
<script setup lang="ts">
  import Navigation from './Navigation.vue'
</script>
  
<style scoped>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: hsla(210, 20%, 20%, 1); /* Dark blue-steel background */
    box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1); /* Dark blue-steel shadow */
    position: sticky;
    top: 0;
    z-index: 1000;
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    header {
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
  }
</style>
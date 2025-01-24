<template>
  <div class="logo">
    <img src="@/assets/logo.svg" alt="Logo" />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
  .logo {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background-color: hsla(210, 20%, 20%, 1); /* Dark blue-steel background */
    border-radius: 8px;
    box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1); /* Dark blue-steel shadow */
  }

  .logo img {
    height: 40px;
  }
</style>
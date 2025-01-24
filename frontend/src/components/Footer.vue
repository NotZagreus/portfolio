<template>
  <footer>
    <p>&copy; 2025 My Portfolio. All rights reserved.</p>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
  footer {
    text-align: center;
    padding: 1rem;
    background-color: hsla(210, 20%, 20%, 1); /* Dark blue-steel background */
    border-top: 1px solid hsla(210, 20%, 10%, 1); /* Dark blue-steel border */
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0; /* Ensure the footer starts from the left edge */
    color: hsla(210, 50%, 70%, 1); /* Medium blue-steel text */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
</style>
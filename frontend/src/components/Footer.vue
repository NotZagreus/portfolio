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
    text-size-adjust: 100%;
    padding: 1rem;
    background-color: #29333d; /* Dark blue-steel background */
    border-top: 1px solid hsla(210, 20%, 10%, 1); /* Dark blue-steel border */
    position: fixed;
    width: 100%;
    height: 10%;
    bottom: 0;
    left: 0; /* Ensure the footer starts from the left edge */
    color: hsla(210, 50%, 70%, 1); /* Medium blue-steel text */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
</style>
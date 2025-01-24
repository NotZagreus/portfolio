<template>
  <section class="welcome">
    <h1>Welcome to My Portfolio</h1>
    <p>
      This is a showcase of my work in computer science, featuring projects, skills, and experiences.
      Stay tuned as I transform this into a photography portfolio!
    </p>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
  .welcome {
    text-align: center;
    padding: 50px;
    background-color: hsla(210, 20%, 25%, 1); /* Dark blue-steel container background */
    border-radius: 8px;
    box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1); /* Dark blue-steel shadow */
    margin: 20px;
  }

  h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: hsla(210, 50%, 80%, 1); /* Light blue-steel */
  }

  p {
    font-size: 1.2em;
    color: hsla(210, 50%, 70%, 1); /* Medium blue-steel */
  }
</style>
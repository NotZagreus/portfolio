<template>
  <div class="container">
    <div class="left-side">
      <Contact />
      <div class="info-container">
        <h1>Artem Kozlov</h1>
        <h3>3rd Year Computer Science Student</h3>
        <h3>I specialize in full-stack development, IT support and love cybersecurity.</h3>
      </div>
      <div class="navigation-container"></div>
    </div>
    <div class="right-side">
      <Projects />
    </div>
  </div>
</template>

<script setup lang="ts">
import Contact from './components/Contact.vue'
import Projects from './components/Projects.vue';
</script>

<style scoped></style>

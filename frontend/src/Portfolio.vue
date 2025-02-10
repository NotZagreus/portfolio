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
      <div class="paragraph-container">
        <h3>
          With a love for problem-solving, I have worked as an infanteer in the Canadian Army,
          honing my skills in punctuality, teamwork, and charisma to engage with others and achieve
          results. Using a logical and straightforward approach, I tackle any problem I’m faced
          with, combining curiosity and military-level discipline to find effective and efficient
          solutions. Attention to detail and clear communication are critical in overcoming
          challenges, and I consistently support my team while continuously improving my skills and
          effectiveness.
        </h3>
      </div>
      <Projects />
    </div>
  </div>
</template>

<script setup lang="ts">
import Contact from './components/Contact.vue'
import Projects from './components/Projects.vue'
</script>

<style scoped></style>

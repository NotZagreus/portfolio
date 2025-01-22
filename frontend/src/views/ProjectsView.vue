<template>
    <section class="projects">
      <h1>My Projects</h1>
      <div class="grid">
        <div class="project-card" v-for="project in projects" :key="project.id">
          <h2>{{ project.title }}</h2>
          <p>{{ project.description }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  const projects = [
    { id: 1, title: 'Project One', description: 'Description of project one.' },
    { id: 2, title: 'Project Two', description: 'Description of project two.' },
    // Add more projects here
  ]
  </script>
  
  <style scoped>
  .projects {
    padding: 2rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .project-card {
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>
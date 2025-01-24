<template>
  <section class="projects">
    <h1>My Projects</h1>
    <div class="grid">
      <div class="project-card" v-for="project in projects" :key="project._id">
        <h2>{{ project.title }}</h2>
        <p>{{ project.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
}

const projects = ref<Project[]>([]);

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:14344/api/projects');
    projects.value = response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

onMounted(fetchProjects);
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
  background-color: hsla(210, 20%, 25%, 1); /* Dark blue-steel container background */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1); /* Dark blue-steel shadow */
  color: hsla(210, 50%, 70%, 1); /* Medium blue-steel text */
}

.project-card h2 {
  font-size: 1.5rem;
  color: hsla(210, 50%, 80%, 1); /* Light blue-steel */
  margin-top: 1rem;
}

.project-card p {
  font-size: 1rem;
  color: hsla(210, 50%, 70%, 1); /* Medium blue-steel */
}
</style>
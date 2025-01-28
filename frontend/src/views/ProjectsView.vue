<template>
  <section class="projects">
    <h1>Projects</h1>
    <div class="grid">
      <div class="project-card" v-for="project in projects" :key="project.id">
        <div class="card-header">
          <h2>{{ project.title }}</h2>
          <div class="dropdown">
            <button @click="toggleDropdown(project.id)">...</button>
            <div v-if="dropdownOpen === project.id" class="dropdown-menu">
              <button @click="editProject(project)">Edit</button>
              <button @click="confirmDelete(project.id)">Delete</button>
            </div>
          </div>
        </div>
        <p>{{ project.description }}</p>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Project</h3>
        <input v-model="editForm.title" placeholder="Title" />
        <textarea v-model="editForm.description" placeholder="Description"></textarea>
        <button @click="saveProject">Save</button>
        <button @click="closeEditModal">Cancel</button>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Are you sure you want to delete this project?</h3>
        <button @click="deleteProject">Yes</button>
        <button @click="closeDeleteModal">No</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Project {
  id: string;
  title: string;
  description: string;
}

const projects = ref<Project[]>([]);
const dropdownOpen = ref<string | null>(null);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editForm = ref<Project>({ id: '', title: '', description: '' });
const projectToDelete = ref<string | null>(null);

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:14344/api/projects');
    projects.value = response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const toggleDropdown = (id: string) => {
  dropdownOpen.value = dropdownOpen.value === id ? null : id;
};

const editProject = (project: Project) => {
  editForm.value = { id: project.id, title: project.title, description: project.description };
  showEditModal.value = true;
  dropdownOpen.value = null;
};

const saveProject = async () => {
  try {
    const { id, title, description } = editForm.value;
    await axios.put(`http://localhost:14344/api/projects/${id}`, { title, description });
    const index = projects.value.findIndex(p => p.id === id);
    if (index !== -1) {
      projects.value[index] = { id, title, description };
    }
    closeEditModal();
  } catch (error) {
    console.error('Error saving project:', error);
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const confirmDelete = (id: string) => {
  projectToDelete.value = id;
  showDeleteModal.value = true;
  dropdownOpen.value = null;
};

const deleteProject = async () => {
  try {
    await axios.delete(`http://localhost:14344/api/projects/${projectToDelete.value}`);
    projects.value = projects.value.filter(p => p.id !== projectToDelete.value);
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  projectToDelete.value = null;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure the modal is on top of everything */
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
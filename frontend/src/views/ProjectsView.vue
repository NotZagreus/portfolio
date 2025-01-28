<template>
  <section class="projects">
    <h1>Projects</h1>
    
    <div class="grid">
      <div class="project-card" v-for="project in projects" :key="project.id">
        <div class="card-header">
          <h2>{{ project.title }}</h2>
          <div class="dropdown">
            <button class="dropdown-button" @click="toggleDropdown(project.id)">...</button>
            <div v-if="dropdownOpen === project.id" class="dropdown-menu">
              <button class="dropdown-item" @click="editProject(project)">Edit</button>
              <button class="dropdown-item" @click="confirmDelete(project.id)">Delete</button>
            </div>
          </div>
        </div>
        <p>{{ project.description }}</p>
      </div>
      <div class="add-project">
        <button class="add-button" @click="showAddModal = true">+</button>
      </div>
    </div>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New Project</h3>
        <input v-model="newProject.title" placeholder="Title" />
        <textarea v-model="newProject.description" placeholder="Description"></textarea>
        <div class="modal-buttons">
          <button class="modal-button" @click="addProject">Add</button>
          <button class="modal-button" @click="closeAddModal">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Project</h3>
        <input v-model="editForm.title" placeholder="Title" />
        <textarea v-model="editForm.description" placeholder="Description"></textarea>
        <div class="modal-buttons">
          <button class="modal-button" @click="saveProject">Save</button>
          <button class="modal-button" @click="closeEditModal">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Are you sure you want to delete this project?</h3>
        <div class="modal-buttons">
          <button class="modal-button" @click="deleteProject">Yes</button>
          <button class="modal-button" @click="closeDeleteModal">No</button>
        </div>
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
const showAddModal = ref(false);
const editForm = ref<Project>({ id: '', title: '', description: '' });
const newProject = ref<Project>({ id: '', title: '', description: '' });
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

const addProject = async () => {
  try {
    const response = await axios.post('http://localhost:14344/api/projects', newProject.value);
    projects.value.push(response.data);
    closeAddModal();
  } catch (error) {
    console.error('Error adding project:', error);
  }
};

const closeAddModal = () => {
  showAddModal.value = false;
  newProject.value = { id: '', title: '', description: '' };
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
  background-color: hsla(210, 20%, 25%, 1);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1);
  color: hsla(210, 50%, 70%, 1);
}

.project-card h2 {
  font-size: 1.5rem;
  color: hsla(210, 50%, 80%, 1);
  margin-top: 1rem;
}

.project-card p {
  font-size: 1rem;
  color: hsla(210, 50%, 70%, 1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.dropdown {
  position: absolute;
  top: 0;
  right: 0;
}

.dropdown-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: hsla(210, 50%, 70%, 1);
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.dropdown-button:hover {
  transform: rotate(90deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgb(36, 45, 54);
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: hsla(210, 50%, 70%, 1);
}

.dropdown-item:hover {
  background-color: hsla(210, 20%, 30%, 1);
  color: hsla(210, 50%, 80%, 1);
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
  z-index: 1000;
}

.modal-content {
  background-color: hsla(210, 20%, 25%, 1);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  color: hsla(210, 50%, 70%, 1);
}

.modal-content h3 {
  margin-top: 0;
  color: hsla(210, 50%, 80%, 1);
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  border: 1px solid hsla(210, 20%, 40%, 1);
  border-radius: 4px;
  background-color: hsla(210, 20%, 30%, 1);
  color: hsla(210, 50%, 70%, 1);
}

.modal-content input::placeholder,
.modal-content textarea::placeholder {
  color: hsla(210, 50%, 60%, 1);
}

.modal-content input:focus,
.modal-content textarea:focus {
  outline: none;
  border-color: hsla(210, 50%, 70%, 1);
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-button {
  background-color: rgb(71, 85, 100);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-button:hover {
  background-color: hsla(210, 50%, 60%, 1);
}

.add-project {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.add-button {
  background-color: hsla(210, 20%, 25%, 1);
  color: hsla(210, 50%, 70%, 1);
  border: none;
  padding: 1rem;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1);
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-button:hover {
  background-color: hsla(210, 20%, 30%, 1);
  color: hsla(210, 50%, 80%, 1);
}
</style>

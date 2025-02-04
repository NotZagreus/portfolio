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
        <img v-if="project.image" :src="project.image" alt="Project Image" style="width: 200px; height: 200px;" />
        <a v-if="project.github_link" :href="project.github_link" target="_blank">
          <img src="@/assets/Pictures/25231.png" alt="GitHub Icon" class="github-icon" />
        </a>
        <p>{{ project.description }}</p>
      </div>
      <div class="add-project">
        <button class="add-button" @click="showAddModal = true">+</button>
      </div>
    </div>

    <!-- Add Project Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New Project</h3>
        <input v-model="newProject.title" placeholder="Title" />
        <div v-if="addError.title" class="error-message">{{ addError.title }}</div>
        <textarea v-model="newProject.description" placeholder="Description"></textarea>
        <div v-if="addError.description" class="error-message">{{ addError.description }}</div>
        <input v-model="newProject.github_link" placeholder="GitHub Link" />
        <input type="file" @change="handleFileUpload($event, 'newProject')" />
        <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
        <div class="modal-buttons">
          <button class="modal-button" @click="addProject">Add</button>
          <button class="modal-button" @click="closeAddModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Edit Project Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Project</h3>
        <input v-model="editForm.title" placeholder="Title" />
        <div v-if="editError.title" class="error-message">{{ editError.title }}</div>
        <textarea v-model="editForm.description" placeholder="Description"></textarea>
        <div v-if="editError.description" class="error-message">{{ editError.description }}</div>
        <input v-model="editForm.github_link" placeholder="GitHub Link" />
        <input type="file" @change="handleFileUpload($event, 'editForm')" />
        <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
        <div class="modal-buttons">
          <button class="modal-button" @click="saveProject">Save</button>
          <button class="modal-button" @click="closeEditModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Project Modal -->
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
  image: string;
  github_link?: string;
}

const projects = ref<Project[]>([]);
const dropdownOpen = ref<string | null>(null);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showAddModal = ref(false);
const editForm = ref<Project>({ id: '', title: '', description: '', image: '', github_link: '' });
const newProject = ref<Project>({ id: '', title: '', description: '', image: '', github_link: '' });
const projectToDelete = ref<string | null>(null);
const uploadError = ref<string | null>(null);
const addError = ref<{ title?: string; description?: string }>({});
const editError = ref<{ title?: string; description?: string }>({});

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
  editForm.value = { id: project.id, title: project.title, description: project.description, image: project.image, github_link: project.github_link };
  showEditModal.value = true;
  dropdownOpen.value = null;
};

const saveProject = async () => {
  if (!editForm.value.title) {
    editError.value.title = 'Title is required.';
  } else {
    editError.value.title = '';
  }
  if (!editForm.value.description) {
    editError.value.description = 'Description is required.';
  } else {
    editError.value.description = '';
  }
  if (editError.value.title || editError.value.description) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', editForm.value.title);
    formData.append('description', editForm.value.description);
    if (editForm.value.github_link) {
      formData.append('github_link', editForm.value.github_link);
    }
    if (editForm.value.image) {
      formData.append('image', editForm.value.image);
    }
    await axios.put(`http://localhost:14344/api/projects/${editForm.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const index = projects.value.findIndex(p => p.id === editForm.value.id);
    if (index !== -1) {
      projects.value[index] = { ...editForm.value };
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
  if (!newProject.value.title) {
    addError.value.title = 'Title is required.';
  } else {
    addError.value.title = '';
  }
  if (!newProject.value.description) {
    addError.value.description = 'Description is required.';
  } else {
    addError.value.description = '';
  }
  if (addError.value.title || addError.value.description) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', newProject.value.title);
    formData.append('description', newProject.value.description);
    if (newProject.value.github_link) {
      formData.append('github_link', newProject.value.github_link);
    }
    if (newProject.value.image) {
      formData.append('image', newProject.value.image);
    }
    const response = await axios.post('http://localhost:14344/api/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    projects.value.push(response.data);
    closeAddModal();
  } catch (error) {
    console.error('Error adding project:', error);
  }
};

const closeAddModal = () => {
  showAddModal.value = false;
  newProject.value = { id: '', title: '', description: '', image: '', github_link: '' };
  uploadError.value = null;
  addError.value = {};
};

const handleFileUpload = (event: Event, formType: 'newProject' | 'editForm') => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width === img.height) {
          if (formType === 'newProject') {
            newProject.value.image = reader.result as string;
          } else {
            editForm.value.image = reader.result as string;
          }
          uploadError.value = null;
        } else {
          uploadError.value = 'Please upload a square image.';
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
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

.github-icon {
  width: 24px;
  height: 24px;
}

.error-message {
  color: rgb(238, 210, 180);
  margin-top: 1rem;
}
</style>

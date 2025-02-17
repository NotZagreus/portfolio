<template>
  <section class="projects">
    <h1>{{ t('projects.title') }}</h1>

    <div class="project-dropdown" v-for="project in projects" :key="project.id">
      <button class="project-title" @click="toggleProjectDropdown(project.id)">
        {{ project.title }}
      </button>
      <div v-if="dropdownOpen === project.id" class="project-card">
        <div class="card-header">
          <h2>{{ project.title }}</h2>
          <div v-if="isAdmin" class="dropdown">
            <button class="dropdown-button" @click="toggleDropdown(project.id)">...</button>
            <div v-if="dropdownOpen === project.id" class="dropdown-menu">
              <button class="dropdown-item" @click="editProject(project)">
                {{ t('projects.edit') }}
              </button>
              <button class="dropdown-item" @click="confirmDelete(project.id)">
                {{ t('projects.delete') }}
              </button>
            </div>
          </div>
        </div>
        <img v-if="project.image" :src="project.image" alt="Project Image" class="project-image" />
        <p>{{ project.description }}</p>
        <a v-if="project.github_link" :href="project.github_link" target="_blank">
          <img src="@/assets/Pictures/25231.png" alt="GitHub Icon" class="github-icon" />
        </a>
      </div>
    </div>
    <div v-if="isAdmin" class="add-project">
      <button class="add-button" @click="showAddModal = true">+</button>
    </div>

    <!-- Add Project Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('projects.addNew') }}</h3>
        <input v-model="newProject.title" :placeholder="t('projects.titlePlaceholder')" />
        <div v-if="addError.title" class="error-message">{{ addError.title }}</div>
        <textarea
          v-model="newProject.description"
          :placeholder="t('projects.descriptionPlaceholder')"
        ></textarea>
        <div v-if="addError.description" class="error-message">{{ addError.description }}</div>
        <input
          v-model="newProject.github_link"
          :placeholder="t('projects.githubLinkPlaceholder')"
        />
        <input type="file" @change="handleFileUpload($event, 'newProject')" />
        <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
        <div class="modal-buttons">
          <button class="modal-button" @click="addProject">{{ t('projects.add') }}</button>
          <button class="modal-button" @click="closeAddModal">{{ t('projects.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Edit Project Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('projects.editProject') }}</h3>
        <input v-model="editForm.title" :placeholder="t('projects.titlePlaceholder')" />
        <div v-if="editError.title" class="error-message">{{ editError.title }}</div>
        <textarea
          v-model="editForm.description"
          :placeholder="t('projects.descriptionPlaceholder')"
        ></textarea>
        <div v-if="editError.description" class="error-message">{{ editError.description }}</div>
        <input v-model="editForm.github_link" :placeholder="t('projects.githubLinkPlaceholder')" />
        <input type="file" @change="handleFileUpload($event, 'editForm')" />
        <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
        <div class="modal-buttons">
          <button class="modal-button" @click="saveProject">{{ t('projects.save') }}</button>
          <button class="modal-button" @click="closeEditModal">{{ t('projects.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Delete Project Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('projects.confirmDelete') }}</h3>
        <div class="modal-buttons">
          <button class="modal-button" @click="deleteProject">{{ t('projects.yes') }}</button>
          <button class="modal-button" @click="closeDeleteModal">{{ t('projects.no') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ref, onMounted, watch, type Ref } from 'vue'
import axios from 'axios'
import './CSS/ProjectsView.css'
import { useAuth0 } from '@auth0/auth0-vue'

interface Project {
  id: string
  title: string
  description: string
  image: string
  github_link?: string
}

const projects = ref<Project[]>([])
const dropdownOpen = ref<string | null>(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const editForm = ref<Project>({ id: '', title: '', description: '', image: '', github_link: '' })
const newProject = ref<Project>({ id: '', title: '', description: '', image: '', github_link: '' })
const projectToDelete = ref<string | null>(null)
const uploadError = ref<string | null>(null)
const addError = ref<{ title?: string; description?: string }>({})
const editError = ref<{ title?: string; description?: string }>({})

const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()
const isAdmin = ref(false)

const fetchUserInfo = async () => {
  if (isAuthenticated.value) {
    try {
      const token = await getAccessTokenSilently()
      const response = await axios.get('https://dev-k4fhctws467co87d.us.auth0.com/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      isAdmin.value = response.data.sub === 'google-oauth2|111871631735892967671'
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }
  fetchProjects()
}

onMounted(fetchUserInfo)

watch(isAuthenticated, (newValue) => {
  if (newValue) {
    fetchUserInfo()
  }
})

const fetchProjects = async () => {
  try {
    let response
    if (isAuthenticated.value) {
      const token = await getAccessTokenSilently()
      response = await axios.get('http://localhost:14344/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
    } else {
      response = await axios.get('http://localhost:14344/api/projects')
    }
    projects.value = response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

const saveProject = async () => {
  if (!editForm.value.title) {
    editError.value.title = 'Title is required.'
  } else {
    editError.value.title = ''
  }
  if (!editForm.value.description) {
    editError.value.description = 'Description is required.'
  } else {
    editError.value.description = ''
  }
  if (editError.value.title || editError.value.description) {
    return
  }

  try {
    const token = await getAccessTokenSilently()

    console.log('Token:', token)

    const formData = new FormData()
    formData.append('title', editForm.value.title)
    formData.append('description', editForm.value.description)
    if (editForm.value.github_link) {
      formData.append('github_link', editForm.value.github_link)
    }
    if (editForm.value.image) {
      formData.append('image', editForm.value.image)
    }
    const response = await axios.put(
      `http://localhost:14344/api/projects/${editForm.value.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    console.log('Response:', response)
    const index = projects.value.findIndex((p) => p.id === editForm.value.id)
    if (index !== -1) {
      projects.value[index] = { ...editForm.value }
    }
    closeEditModal()
  } catch (error) {
    console.error('Error saving project:', error)
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
  }
}

const deleteProject = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.delete(`http://localhost:14344/api/projects/${projectToDelete.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    projects.value = projects.value.filter((p) => p.id !== projectToDelete.value)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting project:', error)
  }
}

const addProject = async () => {
  if (!newProject.value.title) {
    addError.value.title = 'Title is required.'
  } else {
    addError.value.title = ''
  }
  if (!newProject.value.description) {
    addError.value.description = 'Description is required.'
  } else {
    addError.value.description = ''
  }
  if (addError.value.title || addError.value.description) {
    return
  }

  try {
    const token = await getAccessTokenSilently()
    const formData = new FormData()
    formData.append('title', newProject.value.title)
    formData.append('description', newProject.value.description)
    if (newProject.value.github_link) {
      formData.append('github_link', newProject.value.github_link)
    }
    if (newProject.value.image) {
      formData.append('image', newProject.value.image)
    }
    const response = await axios.post('http://localhost:14344/api/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
    projects.value.push(response.data)
    closeAddModal()
  } catch (error) {
    console.error('Error adding project:', error)
  }
}

const toggleDropdown = (id: string) => {
  dropdownOpen.value = dropdownOpen.value === id ? null : id
}

const toggleProjectDropdown = (id: string) => {
  dropdownOpen.value = dropdownOpen.value === id ? null : id
}

const editProject = (project: Project) => {
  editForm.value = {
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    github_link: project.github_link,
  }
  showEditModal.value = true
  dropdownOpen.value = null
}

const closeEditModal = () => {
  showEditModal.value = false
}

const confirmDelete = (id: string) => {
  projectToDelete.value = id
  showDeleteModal.value = true
  dropdownOpen.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  projectToDelete.value = null
  projectToDelete.value = null
}

const closeAddModal = () => {
  showAddModal.value = false
  newProject.value = { id: '', title: '', description: '', image: '', github_link: '' }
  uploadError.value = null
  addError.value = {}
}

const handleFileUpload = (event: Event, formType: 'newProject' | 'editForm') => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        if (img.width === img.height) {
          if (formType === 'newProject') {
            newProject.value.image = reader.result as string
          } else {
            editForm.value.image = reader.result as string
          }
          uploadError.value = null
        } else {
          resizeImage(img, formType)
        }
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const resizeImage = (img: HTMLImageElement, formType: 'newProject' | 'editForm') => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = Math.min(img.width, img.height)
  canvas.width = size
  canvas.height = size
  ctx?.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size)
  const resizedImage = canvas.toDataURL('image/png')
  if (formType === 'newProject') {
    newProject.value.image = resizedImage
  } else {
    editForm.value.image = resizedImage
  }
  uploadError.value = null
  downloadImage(resizedImage)
}

const downloadImage = (dataUrl: string) => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'resized-image.png'
  link.click()
}

onMounted(fetchProjects)

function customWatch(isAuthenticated: Ref<boolean, boolean>, arg1: (newValue: any) => void) {
  throw new Error('Function not implemented.')
}
</script>

<style scoped></style>

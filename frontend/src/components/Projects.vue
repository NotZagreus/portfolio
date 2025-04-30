<template>
  <section class="projects">
    <h1>{{ t('projects.title') }}</h1>
    <div class="project-dropdown" v-for="project in projects" :key="project.id">
      <button class="project-title" @click="toggleProjectDropdown(project.id)">
        {{ currentLocale === 'fr' ? project.titleFr : project.titleEn }}
      </button>
      <div
        v-if="dropdownOpen === project.id"
        class="project-card"
        @click="openActionModal(project)"
      >
        <div class="project-content">
          <img
            v-if="project.image"
            :src="project.image"
            alt="Project Image"
            class="project-image"
          />
          <div class="project-description">
            <p>{{ currentLocale === 'fr' ? project.descriptionFr : project.descriptionEn }}</p>
            <a v-if="project.github_link" :href="project.github_link" target="_blank">
                <img src="https://res.cloudinary.com/dhtprehby/image/upload/v1746055237/github_icon.png" alt="GitHub Icon" class="github-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isAdmin" class="add-project">
      <button class="add-button" @click="showAddModal = true">+</button>
    </div>

    <!-- Add Project Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('projects.addNew') }}</h3>
        <input v-model="newProject.titleEn" :placeholder="t('projects.titlePlaceholderEn')" />
        <input v-model="newProject.titleFr" :placeholder="t('projects.titlePlaceholderFr')" />
        <textarea
          v-model="newProject.descriptionEn"
          :placeholder="t('projects.descriptionPlaceholderEn')"
        ></textarea>
        <textarea
          v-model="newProject.descriptionFr"
          :placeholder="t('projects.descriptionPlaceholderFr')"
        ></textarea>
        <input
          v-model="newProject.github_link"
          :placeholder="t('projects.githubLinkPlaceholder')"
        />
        <input type="file" @change="handleFileUpload($event, 'newProject')" />
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
        <input v-model="editForm.titleEn" :placeholder="t('projects.titlePlaceholderEn')" />
        <input v-model="editForm.titleFr" :placeholder="t('projects.titlePlaceholderFr')" />
        <textarea
          v-model="editForm.descriptionEn"
          :placeholder="t('projects.descriptionPlaceholderEn')"
        ></textarea>
        <textarea
          v-model="editForm.descriptionFr"
          :placeholder="t('projects.descriptionPlaceholderFr')"
        ></textarea>
        <input v-model="editForm.github_link" :placeholder="t('projects.githubLinkPlaceholder')" />
        <input type="file" @change="handleFileUpload($event, 'editForm')" />
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

    <!-- Project Actions Modal -->
    <div v-if="showActionModal" class="modal">
      <div class="modal-content">
        <h3>{{ currentLocale === 'fr' ? selectedProject?.titleFr : selectedProject?.titleEn }}</h3>
        <div class="modal-buttons">
          <button class="modal-button" @click="triggerEdit">{{ t('projects.edit') }}</button>
          <button class="modal-button" @click="triggerDelete">{{ t('projects.delete') }}</button>
          <button class="modal-button" @click="closeActionModal">{{ t('projects.cancel') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { ref, onMounted, watch, type Ref } from 'vue'
import axios from 'axios'
import './CSS/ProjectsView.css'
import { useAuth0 } from '@auth0/auth0-vue'
import { computed } from 'vue'

interface Project {
  id: string
  titleEn: string
  descriptionEn: string
  titleFr: string
  descriptionFr: string
  image: string
  github_link?: string
}

const projects = ref<Project[]>([])
const dropdownOpen = ref<string | null>(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const editForm = ref<Project>({
  id: '',
  titleEn: '',
  descriptionEn: '',
  titleFr: '',
  descriptionFr: '',
  image: '',
  github_link: '',
})
const newProject = ref<Project>({
  id: '',
  titleEn: '',
  descriptionEn: '',
  titleFr: '',
  descriptionFr: '',
  image: '',
  github_link: '',
})
const projectToDelete = ref<string | null>(null)
const uploadError = ref<string | null>(null)
const addError = ref<{ title?: string; description?: string }>({})
const editError = ref<{ title?: string; description?: string }>({})
const showActionModal = ref(false)
const selectedProject = ref<Project | null>(null)
const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()
const isAdmin = ref(false)

const fetchUserInfo = async () => {
  if (isAuthenticated.value) {
    try {
      const token = await getAccessTokenSilently()
      const response = await axios.get('https://dev-k4fhctws467co87d.us.auth0.com/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      isAdmin.value = response.data.sub === import.meta.env.VITE_ADMIN_USER_ID
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
      response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } else {
      response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`)
    }
    projects.value = response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

const openActionModal = (project: Project) => {
  selectedProject.value = project
  showActionModal.value = true
}

const closeActionModal = () => {
  selectedProject.value = null
  showActionModal.value = false
}

const triggerEdit = () => {
  if (selectedProject.value) {
    editProject(selectedProject.value)
    closeActionModal()
  }
}

const triggerDelete = () => {
  if (selectedProject.value) {
    confirmDelete(selectedProject.value.id)
    closeActionModal()
  }
}

const addProject = async () => {
  if (!newProject.value.titleEn || !newProject.value.titleFr) {
    addError.value.title = 'Both English and French titles are required.'
  } else {
    addError.value.title = ''
  }
  if (!newProject.value.descriptionEn || !newProject.value.descriptionFr) {
    addError.value.description = 'Both English and French descriptions are required.'
  } else {
    addError.value.description = ''
  }
  if (addError.value.title || addError.value.description) {
    return
  }

  try {
    const token = await getAccessTokenSilently()
    const formData = new FormData()
    formData.append('titleEn', newProject.value.titleEn)
    formData.append('titleFr', newProject.value.titleFr)
    formData.append('descriptionEn', newProject.value.descriptionEn)
    formData.append('descriptionFr', newProject.value.descriptionFr)
    if (newProject.value.github_link) {
      formData.append('github_link', newProject.value.github_link)
    }
    if (newProject.value.image) {
      formData.append('image', newProject.value.image)
    }
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, formData, {
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

const saveProject = async () => {
  if (!editForm.value.titleEn || !editForm.value.titleFr) {
    editError.value.title = 'Both English and French titles are required.'
  } else {
    editError.value.title = ''
  }
  if (!editForm.value.descriptionEn || !editForm.value.descriptionFr) {
    editError.value.description = 'Both English and French descriptions are required.'
  } else {
    editError.value.description = ''
  }
  if (editError.value.title || editError.value.description) {
    return
  }

  try {
    const token = await getAccessTokenSilently()
    const formData = new FormData()
    formData.append('titleEn', editForm.value.titleEn)
    formData.append('titleFr', editForm.value.titleFr)
    formData.append('descriptionEn', editForm.value.descriptionEn)
    formData.append('descriptionFr', editForm.value.descriptionFr)
    if (editForm.value.github_link) {
      formData.append('github_link', editForm.value.github_link)
    }
    if (editForm.value.image) {
      formData.append('image', editForm.value.image)
    }
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/projects/${editForm.value.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const index = projects.value.findIndex((p) => p.id === editForm.value.id)
    if (index !== -1) {
      projects.value[index] = { ...editForm.value }
    }
    closeEditModal()
  } catch (error) {
    console.error('Error saving project:', error)
  }
}

const deleteProject = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${projectToDelete.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    projects.value = projects.value.filter((p) => p.id !== projectToDelete.value)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting project:', error)
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
    titleEn: project.titleEn,
    descriptionEn: project.descriptionEn,
    titleFr: project.titleFr,
    descriptionFr: project.descriptionFr,
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
  newProject.value = {
    id: '',
    titleEn: '',
    descriptionEn: '',
    titleFr: '',
    descriptionFr: '',
    image: '',
    github_link: '',
  }
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
        resizeImage(img, formType)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const resizeImage = (img: HTMLImageElement, formType: 'newProject' | 'editForm') => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const targetSize = 300
  canvas.width = targetSize
  canvas.height = targetSize
  ctx?.drawImage(img, 0, 0, targetSize, targetSize)
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

const currentLocale = computed(() => {
  return locale.value
})

onMounted(fetchProjects)

function customWatch(isAuthenticated: Ref<boolean, boolean>, arg1: (newValue: any) => void) {
  throw new Error('Function not implemented.')
}
</script>

<style scoped></style>

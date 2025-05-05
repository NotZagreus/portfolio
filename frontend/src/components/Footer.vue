<template>
  <footer v-if="showFooter" ref="footer" class="footer">
    <h3>{{ t('portfolio.technologies') }}</h3>
    <div class="technologies">
      <div
        v-for="tech in technologies"
        :key="tech.name"
        class="technology"
        @mouseover="hoveredTech = tech.name"
        @mouseleave="hoveredTech = null"
        @click="isAdmin ? openActionModal(tech) : null"
      >
        <img :src="tech.image" :alt="tech.name" />
        <span v-if="hoveredTech === tech.name" class="tooltip">{{ tech.name }}</span>
      </div>
      <div v-if="isAdmin" class="add-technology">
        <button class="add-tech-button" @click="showAddModal = true">+</button>
      </div>
    </div>

    <!-- Add Technology Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('portfolio.addTechnology') }}</h3>
        <input
          v-model="newTechnology.name"
          :placeholder="t('portfolio.technologyNamePlaceholder')"
        />
        <input v-model="newTechnology.image" :placeholder="t('portfolio.imageUrlPlaceholder')" />
        <div class="modal-buttons">
          <button class="modal-button" @click="addTechnology">{{ t('portfolio.save') }}</button>
          <button class="modal-button" @click="closeAddModal">{{ t('portfolio.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Action Modal -->
    <div v-if="showActionModal" class="modal">
      <div class="modal-content">
        <h3>{{ selectedTechnology?.name }}</h3>
        <div class="modal-buttons">
          <button class="modal-button" @click="triggerEdit">{{ t('portfolio.edit') }}</button>
          <button class="modal-button" @click="triggerDelete">{{ t('portfolio.delete') }}</button>
          <button class="modal-button" @click="closeActionModal">{{ t('portfolio.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Edit Technology Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('portfolio.editTechnology') }}</h3>
        <input v-model="editForm.name" :placeholder="t('portfolio.technologyNamePlaceholder')" />
        <input v-model="editForm.image" :placeholder="t('portfolio.imageUrlPlaceholder')" />
        <div class="modal-buttons">
          <button class="modal-button" @click="updateTechnology">{{ t('portfolio.save') }}</button>
          <button class="modal-button" @click="closeEditModal">{{ t('portfolio.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('portfolio.confirmDeleteText', { name: selectedTechnology?.name }) }}</h3>
        <div class="modal-buttons">
          <button class="modal-button" @click="confirmDelete">{{ t('portfolio.yes') }}</button>
          <button class="modal-button" @click="closeDeleteConfirmModal">{{ t('portfolio.no') }}</button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'

const { t } = useI18n()
const { getAccessTokenSilently, isAuthenticated } = useAuth0()

const technologies = ref<{ id: string; name: string; image: string }[]>([])
const showFooter = ref(false)
const footerHeight = ref(0)
const footer = ref<HTMLElement | null>(null)
const hoveredTech = ref<string | null>(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showActionModal = ref(false)
const newTechnology = ref<{ name: string; image: string }>({ name: '', image: '' })
const editForm = ref<{ id: string; name: string; image: string }>({ id: '', name: '', image: '' })
const selectedTechnology = ref<{ id: string; name: string; image: string } | null>(null)
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
}

watch(isAuthenticated, () => {
  fetchUserInfo()
})


const fetchTechnologies = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/technologies`)
    technologies.value = response.data
  } catch (error) {
    console.error('Failed to fetch technologies:', error)
  }
}

const addTechnology = async () => {
  if (!newTechnology.value.name || !newTechnology.value.image) {
    alert(t('portfolio.fillAllFields'))
    return
  }

  try {
    const token = await getAccessTokenSilently()
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/technologies`,
      newTechnology.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    technologies.value.push(response.data)
    closeAddModal()
  } catch (error) {
    console.error('Failed to add technology:', error)
  }
}

const updateTechnology = async () => {
  if (!editForm.value.name || !editForm.value.image) {
    alert(t('portfolio.fillAllFields'))
    return
  }

  try {
    const token = await getAccessTokenSilently()
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/technologies/${editForm.value.id}`,
      editForm.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const index = technologies.value.findIndex((tech) => tech.id === editForm.value.id)
    if (index !== -1) {
      technologies.value[index] = response.data
    }
    closeEditModal()
  } catch (error) {
    console.error('Failed to update technology:', error)
  }
}

const deleteTechnology = async () => {
  if (!selectedTechnology.value) return

  try {
    const token = await getAccessTokenSilently()
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/technologies/${selectedTechnology.value.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    technologies.value = technologies.value.filter(
      (tech) => tech.id !== selectedTechnology.value?.id,
    )
    closeActionModal()
  } catch (error) {
    console.error('Error deleting technology:', error)
  }
}

const showDeleteConfirmModal = ref(false)

const triggerDelete = () => {
  if (selectedTechnology.value) {
    showDeleteConfirmModal.value = true
  }
}

const confirmDelete = async () => {
  if (selectedTechnology.value) {
    await deleteTechnology()
    closeDeleteConfirmModal()
  }
}

const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false
}

const openActionModal = (tech: { id: string; name: string; image: string }) => {
  selectedTechnology.value = tech
  showActionModal.value = true
}

const closeActionModal = () => {
  selectedTechnology.value = null
  showActionModal.value = false
}

const triggerEdit = () => {
  if (selectedTechnology.value) {
    editForm.value = { ...selectedTechnology.value }
    showEditModal.value = true
    closeActionModal()
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  newTechnology.value = { name: '', image: '' }
}

const closeEditModal = () => {
  showEditModal.value = false
}


const handleScroll = () => {
  const scrollPosition = window.scrollY
  const totalHeight = Math.ceil(document.documentElement.scrollHeight)

  showFooter.value =
    scrollPosition > 0 && Math.ceil(scrollPosition + window.innerHeight) >= totalHeight - 1
  document.body.style.paddingBottom = showFooter.value ? `${footerHeight.value}px` : '0'
}

onMounted(async () => {
  await fetchTechnologies()
  await fetchUserInfo()
  window.addEventListener('scroll', handleScroll)
  await nextTick()
  footerHeight.value = footer.value?.offsetHeight || 0
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

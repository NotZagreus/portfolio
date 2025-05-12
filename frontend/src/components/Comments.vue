<template>
  <section class="comments">
    <h1>{{ t('comments.title') }}</h1>
    <div class="carousel">
      <button class="arrow left-arrow" @click="prevComment">‹</button>
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="comment-card" v-for="comment in visibleComments" :key="comment.id">
          <h2>{{ comment.firstName }} {{ comment.lastName }}</h2>
          <p>{{ comment.comment }}</p>
          <div v-if="isAdmin" class="dropdown">
            <div v-if="dropdownOpen === comment.id" class="dropdown-menu">
              <button class="dropdown-item" @click="openDeleteModal(comment)">
                {{ t('comments.delete') }}
              </button>
              <button
                v-if="!comment.approved"
                class="dropdown-item"
                @click="approveComment(comment)"
              >
                {{ t('comments.approve') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <button class="arrow right-arrow" @click="nextComment">›</button>
    </div>
    <div class="carousel-actions">
      <button v-if="isAuthenticated" class="add-comment-button" @click="showAddModal = true">
        {{ t('comments.addComment') }}
      </button>
      <button v-if="isAdmin" class="view-comments-button" @click="showViewModal = true">
        {{ t('comments.viewAll') }}
      </button>
    </div>
    <!-- Add Comment Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ t('comments.addNewComment') }}</h3>
        <input v-model="newComment.firstName" :placeholder="t('comments.firstNamePlaceholder')" />
        <div v-if="addError.firstName" class="error-message">{{ addError.firstName }}</div>
        <input v-model="newComment.lastName" :placeholder="t('comments.lastNamePlaceholder')" />
        <div v-if="addError.lastName" class="error-message">{{ addError.lastName }}</div>
        <textarea
          v-model="newComment.comment"
          :placeholder="t('comments.commentPlaceholder')"
        ></textarea>
        <div v-if="addError.comment" class="error-message">{{ addError.comment }}</div>
        <div class="modal-buttons">
          <button class="modal-button" @click="addComment">{{ t('comments.add') }}</button>
          <button class="modal-button" @click="closeAddModal">{{ t('comments.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- Delete Comment Modal -->
    <div v-if="showDeleteModal" class="delete-comments-modal">
      <div class="modal-content">
        <h3>{{ t('comments.confirmDelete') }}</h3>
        <div class="modal-buttons">
          <button class="modal-button" @click="deleteComment">{{ t('comments.yes') }}</button>
          <button class="modal-button" @click="closeDeleteModal">{{ t('comments.no') }}</button>
        </div>
      </div>
    </div>
    <!-- View All Comments Modal -->
    <div v-if="showViewModal" class="view-comments-modal">
      <div class="modal-content view-modal">
        <span class="close" @click="showViewModal = false">&times;</span>
        <h3>{{ t('comments.manageComments') }}</h3>

        <!-- Filter -->
        <div class="filter-controls">
          <label>
            <input type="radio" v-model="filterStatus" value="all" /> {{ t('comments.all') }}
          </label>
          <label>
            <input type="radio" v-model="filterStatus" value="approved" />
            {{ t('comments.approved') }}
          </label>
          <label>
            <input type="radio" v-model="filterStatus" value="pending" />
            {{ t('comments.pending') }}
          </label>
        </div>

        <!-- Comment List -->
        <ul class="comment-list">
          <li v-for="comment in filteredAdminComments" :key="comment.id">
            <p>
              <strong>{{ comment.firstName }} {{ comment.lastName }}</strong
              >: {{ comment.comment }}
            </p>
            <p>
              Status:
              <span :class="comment.approved ? 'approved' : 'pending'">
                {{ comment.approved ? t('comments.approved') : t('comments.pending') }}
              </span>
            </p>

            <div class="modal-buttons inline">
              <button v-if="!comment.approved" @click="approveComment(comment)">
                {{ t('comments.approve') }}
              </button>

              <button v-if="!comment.inCarousel" @click="toggleCarouselComment(comment.id)">
                {{ t('comments.addCarousel') }}
              </button>
              <button v-else @click="toggleCarouselComment(comment.id)">
                {{ t('comments.removeCarousel') }}
              </button>

              <!-- Add Delete Button -->
              <button class="delete-button" @click="openDeleteModal(comment)">
                {{ t('comments.delete') }}
              </button>
            </div>
          </li>
        </ul>

        <div class="modal-buttons">
          <button class="modal-button" @click="closeViewModal">{{ t('comments.close') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-vue'
import { useI18n } from 'vue-i18n'
import './CSS/Comments.css'
import { computed } from 'vue'

const { t } = useI18n()

interface Comment {
  id: string
  firstName: string
  lastName: string
  comment: string
  approved: boolean
  inCarousel: boolean
}

const comments = ref<Comment[]>([])
const currentIndex = ref(0)
const delay = 7777
const showAddModal = ref(false)
const newComment = ref<Comment>({
  id: '',
  firstName: '',
  lastName: '',
  comment: '',
  approved: false,
  inCarousel: false,
})
const addError = ref<{ firstName?: string; lastName?: string; comment?: string }>({})
const showDeleteModal = ref(false)
const commentToDelete = ref<Comment | null>(null)
const dropdownOpen = ref<string | null>(null)
const isAdmin = ref(false)

const showViewModal = ref(false)
const filterStatus = ref<'all' | 'approved' | 'pending'>('all')
const selectedCarouselIds = ref<Set<string>>(new Set())

const filteredAdminComments = computed(() => {
  return comments.value.filter((comment) => {
    if (filterStatus.value === 'approved') return comment.approved
    if (filterStatus.value === 'pending') return !comment.approved
    return true
  })
})

const toggleCarouselComment = async (id: string) => {
  const comment = comments.value.find((c) => c.id === id)
  if (!comment) return

  try {
    const token = await getAccessTokenSilently()
    const updatedComment = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/comments/${id}`,
      { inCarousel: !comment.inCarousel },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    comment.inCarousel = updatedComment.data.inCarousel
  } catch (error) {
    console.error('Error toggling carousel state:', error)
  }
}

const closeViewModal = () => {
  showViewModal.value = false
}

const { getAccessTokenSilently, isAuthenticated } = useAuth0()

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
  } else {
    isAdmin.value = false
  }
  await fetchComments()
}

onMounted(fetchUserInfo)

watch(isAuthenticated, fetchUserInfo)

const fetchComments = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments`)
    comments.value = response.data
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
}

const visibleComments = computed(() => {
  return comments.value.filter((comment) => comment.inCarousel)
})

const nextComment = () => {
  currentIndex.value = (currentIndex.value + 1) % visibleComments.value.length
}

const prevComment = () => {
  currentIndex.value =
    (currentIndex.value - 1 + visibleComments.value.length) % visibleComments.value.length
}

const addComment = async () => {
  if (!newComment.value.firstName) {
    addError.value.firstName = t('comments.firstNameRequired')
  } else {
    addError.value.firstName = ''
  }
  if (!newComment.value.lastName) {
    addError.value.lastName = t('comments.lastNameRequired')
  } else {
    addError.value.lastName = ''
  }
  if (!newComment.value.comment) {
    addError.value.comment = t('comments.commentRequired')
  } else {
    addError.value.comment = ''
  }
  if (addError.value.firstName || addError.value.lastName || addError.value.comment) {
    return
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/comments`,
      {
        firstName: newComment.value.firstName,
        lastName: newComment.value.lastName,
        comment: newComment.value.comment,
        approved: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    comments.value.push(response.data)
    closeAddModal()
  } catch (error) {
    console.error('Error adding comment:', error)
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  newComment.value = {
    id: '',
    firstName: '',
    lastName: '',
    comment: '',
    approved: false,
    inCarousel: false,
  }
  addError.value = {}
}

const toggleDropdown = (id: string) => {
  dropdownOpen.value = dropdownOpen.value === id ? null : id
}

const openDeleteModal = (comment: Comment) => {
  commentToDelete.value = comment
  showDeleteModal.value = true
  dropdownOpen.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  commentToDelete.value = null
}

const deleteComment = async () => {
  if (!commentToDelete.value) return

  try {
    const token = await getAccessTokenSilently()
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/comments/${commentToDelete.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    comments.value = comments.value.filter((comment) => comment.id !== commentToDelete.value!.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

const approveComment = async (comment: Comment) => {
  try {
    const token = await getAccessTokenSilently()
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/comments/${comment.id}`,
      { approved: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    comment.approved = true
  } catch (error) {
    console.error('Error approving comment:', error)
  }
}

onMounted(() => {
  fetchComments()
  setInterval(nextComment, delay)

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      prevComment()
    } else if (event.key === 'ArrowRight') {
      nextComment()
    }
  }

  window.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped></style>

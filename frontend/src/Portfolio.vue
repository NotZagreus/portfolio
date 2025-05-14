<template>
  <div id="enchant-rain"></div>
  <div class="container">
    <Header />
    <div class="left-side">
      <div class="info-container">
        <h1>{{ t('portfolio.name') }}</h1>
        <h3 @click="openModal('title')">
          {{ currentLocale === 'fr' ? portfolio.titleFr : portfolio.titleEn }}
        </h3>
        <h4 @click="openModal('specialization')">
          {{ currentLocale === 'fr' ? portfolio.specializationFr : portfolio.specializationEn }}
        </h4>
      </div>

      <div class="navigation-container">
        <nav>
          <ul>
            <li
              v-for="section in sections"
              :key="section"
              :class="{ active: activeSection === section }"
            >
              <a :href="`#${section}`" @click.prevent="scrollToSection(section)">
                {{ t(`portfolio.${section}`) }}
              </a>
            </li>
          </ul>
          <div class="line"></div>
          <div class="dot" :style="dotStyle"></div>
        </nav>
      </div>
    </div>

    <div class="right-side">
      <div id="description" class="section">
        <h3
          @click="openModal('description')"
          v-html="currentLocale === 'fr' ? portfolio.descriptionFr : portfolio.descriptionEn"
        ></h3>
      </div>
      <div id="projects" class="section">
        <Projects />
      </div>
      <div id="testimonials" class="section">
        <Comments />
      </div>
      <Footer />
    </div>
  </div>

  <!-- Edit Modal -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>{{ modalTitle }}</h3>
      <input
        v-model="editForm.titleEn"
        v-if="editingField === 'title'"
        placeholder="Enter title in English"
      />
      <input
        v-model="editForm.titleFr"
        v-if="editingField === 'title'"
        placeholder="Enter title in French"
      />

      <input
        v-model="editForm.specializationEn"
        v-if="editingField === 'specialization'"
        placeholder="Enter specialization in English"
      />
      <input
        v-model="editForm.specializationFr"
        v-if="editingField === 'specialization'"
        placeholder="Enter specialization in French"
      />

      <textarea
        v-model="editForm.descriptionEn"
        v-if="editingField === 'description'"
        placeholder="Enter description in English"
      ></textarea>
      <textarea
        v-model="editForm.descriptionFr"
        v-if="editingField === 'description'"
        placeholder="Enter description in French"
      ></textarea>

      <div class="modal-buttons">
        <button class="modal-button" @click="saveField">{{ t('portfolio.save') }}</button>
        <button class="modal-button" @click="closeModal">{{ t('portfolio.cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Ref, watch as vueWatch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'

import Projects from './components/Projects.vue'
import Comments from './components/Comments.vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

const { t, locale } = useI18n()
const { isAuthenticated, getAccessTokenSilently } = useAuth0()

const isAdmin = ref(false)
const showModal = ref(false)
const editingField = ref<string | null>(null)
const modalTitle = ref('')

const portfolio = ref({
  id: '',
  titleEn: '',
  titleFr: '',
  specializationEn: '',
  specializationFr: '',
  descriptionEn: '',
  descriptionFr: '',
})

const editForm = ref({ ...portfolio.value })
const currentLocale = computed(() => locale.value)

const sections = ref(['description', 'projects', 'testimonials'])
const activeSection = ref('')
const dotStyle = ref({ top: '0px' })
const mouse = { x: -1000, y: -1000 }

const scrollToSection = (section: string) => {
  const el = document.getElementById(section)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = section
  }
}

const handleScroll = () => {
  const scrollY = window.scrollY
  const total = document.documentElement.scrollHeight - window.innerHeight
  const progress = (scrollY / total) * 100
  dotStyle.value = { top: `${progress}%` }

  sections.value.forEach((section) => {
    const el = document.getElementById(section)
    if (el) {
      const { top, bottom } = el.getBoundingClientRect()
      if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
        activeSection.value = section
      }
    }
  })

  const navigationContainer = document.querySelector('.navigation-container') as HTMLElement
  if (navigationContainer) {
    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight) {
      navigationContainer.style.display = 'none'
    } else {
      navigationContainer.style.display = 'block'
    }
  }
}

const fetchPortfolio = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`)
    portfolio.value = res.data[0]
    editForm.value = { ...res.data[0] }
  } catch (err) {
    console.error('Failed to fetch portfolio:', err)
  }
}

const openModal = (field: string) => {
  if (!isAdmin.value) return
  editingField.value = field
  modalTitle.value =
    field === 'title'
      ? 'Edit Title'
      : field === 'specialization'
        ? 'Edit Specialization'
        : 'Edit Description'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingField.value = null
}

const saveField = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/portfolio/${portfolio.value.id}`,
      editForm.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    portfolio.value = { ...editForm.value }
    closeModal()
  } catch (err) {
    console.error('Failed to save:', err)
  }
}

const audio = new Audio(
  'https://res.cloudinary.com/dhtprehby/video/upload/v1746110446/lnac20vfgv07soxcmo3n.mp3',
)
const hovering = ref(false)

const playHoverSound = () => {
  if (!hovering.value) {
    hovering.value = true
    audio.play()
  }
}

const stopHoverSound = () => {
  hovering.value = false
  audio.pause()
  audio.currentTime = 0
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
})

onMounted(async () => {
  await fetchPortfolio()

  vueWatch(isAuthenticated, async (authReady) => {
    if (authReady) {
      try {
        const token = await getAccessTokenSilently()
        const response = await axios.get('https://dev-k4fhctws467co87d.us.auth0.com/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        })
        isAdmin.value = response.data.sub === import.meta.env.VITE_ADMIN_USER_ID
        console.log('isAdmin:', isAdmin.value)
      } catch (err) {
        console.error('Error checking admin status:', err)
      }
    }
  })

  window.addEventListener('scroll', handleScroll)
  handleScroll()

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const enchantRain = document.getElementById('enchant-rain')

  if (!enchantRain || !ctx) return

  enchantRain.appendChild(canvas)
  canvas.classList.add('canvas')

  const runes = [
    'ᔑ',
    'ʖ',
    'ᓵ',
    '↸',
    'ᒷ',
    '⎓',
    '⊣',
    '⍑',
    '╎',
    '⋮',
    'ꖌ',
    'ꖎ',
    'ᒲ',
    'リ',
    '𝙹',
    '!¡',
    'ᑑ',
    '∷',
    'ᓭ',
    'ℸ',
    '⚍',
    '⍊',
    '∴',
    '̇/',
    '||',
    '⨅',
  ]

  let fontSize = 18
  let columns: number
  let drops: number[] = []

  const setupCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    columns = Math.floor(canvas.width / fontSize)
    drops = Array(columns * 2).fill(1)
  }

  const draw = () => {
    if (!ctx) return

    ctx.fillStyle = 'rgba(232,232,208,0.05)'
    ctx.font = `${fontSize - 8}px monospace`
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize
      const y = drops[i] * fontSize
      const rune = runes[Math.floor(Math.random() * runes.length)]
      const distance = Math.hypot(mouse.x - x, mouse.y - y)
      let opacity = Math.min(drops[i] / (canvas.height / 4), 1)
      let color = `rgba(232, 232, 208, ${opacity})`

      if (distance < 100) {
        drops[i] -= 0.1
        color = `rgba(255, 255, 160, ${Math.min(1, opacity + 0.3)})`
      }

      ctx.fillStyle = color
      ctx.fillText(rune, x, y)

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }

      drops[i] += 0.1
    }

    requestAnimationFrame(draw)
  }

  setupCanvas()
  draw()
  window.addEventListener('resize', setupCanvas)
})
</script>

<style scoped>
#enchant-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  background: hsla(0, 0%, 0%, 0);
  overflow: hidden;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

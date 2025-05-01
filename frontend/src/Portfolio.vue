<template>
  <div id="enchant-rain"></div>
  <div class="container">
    <Header />
    <div class="left-side">
      <div class="info-container">
        <h1>{{ t('portfolio.name') }}</h1>
        <h3>{{ currentLocale === 'fr' ? portfolio.titleFr : portfolio.titleEn }}</h3>
        <h4>
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
          <div class="line" :style="{ height: lineHeight }"></div>
          <div class="dot" :style="dotStyle"></div>
        </nav>
      </div>
    </div>

    <div class="right-side">
      <div id="description" class="section">
        <h3>{{ currentLocale === 'fr' ? portfolio.descriptionFr : portfolio.descriptionEn }}</h3>
      </div><div v-if="isAdmin" class="edit-portfolio">
        <button 
          class="edit-button" 
          @click="showEditModal = true" 
          @mouseover="playHoverSound" 
          @mouseleave="stopHoverSound"
        >
          <img src="https://res.cloudinary.com/dhtprehby/image/upload/v1746110042/metal_gear.png" alt="Edit" />
        </button>
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
  <div v-if="showEditModal" class="modal">
    <div class="modal-content">
      <h3>{{ t('portfolio.editPortfolio') }}</h3>
      <input v-model="editForm.titleEn" :placeholder="t('portfolio.titlePlaceholderEn')" />
      <input v-model="editForm.titleFr" :placeholder="t('portfolio.titlePlaceholderFr')" />
      <input
        v-model="editForm.specializationEn"
        :placeholder="t('portfolio.specializationPlaceholderEn')"
      />
      <input
        v-model="editForm.specializationFr"
        :placeholder="t('portfolio.specializationPlaceholderFr')"
      />
      <textarea
        v-model="editForm.descriptionEn"
        :placeholder="t('portfolio.descriptionPlaceholderEn')"
      ></textarea>
      <textarea
        v-model="editForm.descriptionFr"
        :placeholder="t('portfolio.descriptionPlaceholderFr')"
      ></textarea>

      <div class="modal-buttons">
        <button class="modal-button" @click="savePortfolio">{{ t('portfolio.save') }}</button>
        <button class="modal-button" @click="closeEditModal">{{ t('portfolio.cancel') }}</button>
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
const showEditModal = ref(false)

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
const lineHeight = ref('100vh')
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

const savePortfolio = async () => {
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
    closeEditModal()
  } catch (err) {
    console.error('Failed to save:', err)
  }
}

const closeEditModal = () => {
  showEditModal.value = false
}

const audio = new Audio('https://res.cloudinary.com/dhtprehby/video/upload/v1746110446/lnac20vfgv07soxcmo3n.mp3')
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

  lineHeight.value = `${window.innerHeight * 0.3}px`
  window.addEventListener('scroll', handleScroll)
  handleScroll()

  // Rune Canvas Logic
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

<template>
  <div class="container">
    <div class="left-side">
      <CV />
      <div class="info-container">
        <h1>{{ t('portfolio.name') }}</h1>
        <h3>{{ t('portfolio.title') }}</h3>
        <h4>{{ t('portfolio.specialization') }}</h4>
      </div>
      <div class="navigation-container">
        <nav>
          <ul>
            <li
              v-for="(section, index) in sections"
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
      <div class="auth-language-container">
        <div class="auth-buttons">
          <button
            v-if="isAuthenticated"
            @click="logout({ logoutParams: { returnTo: windowLocation } })"
          >
            {{ t('contact.logout') }}
          </button>
          <button v-else @click="loginWithRedirect()">{{ t('contact.login') }}</button>
        </div>
        <div class="language-switcher">
          <button @click="switchLanguage">{{ currentLanguage }}</button>
        </div>
      </div>
    </div>
    <div class="right-side">
      <div id="description" class="section">
        <h3>{{ t('portfolio.descriptionText') }}</h3>
      </div>
      <div id="projects" class="section">
        <Projects />
      </div>
      <div id="testimonials" class="section">
        <Comments />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useI18n } from 'vue-i18n'
import Projects from './components/Projects.vue'
import CV from './components/CV.vue'
import Comments from './components/Comments.vue'
import Footer from './components/Footer.vue'

const { t, locale } = useI18n()
const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()
const windowLocation = window.location.origin
const accessToken = ref('')
const sections = ref(['description', 'projects', 'testimonials'])
const activeSection = ref('')
const dotStyle = ref({ top: '0px' })
const lineHeight = ref('100vh')

const scrollToSection = (section: string) => {
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = section
  }
}

const handleScroll = () => {
  const scrollPosition = window.scrollY
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollProgress = (scrollPosition / totalHeight) * 100

  // Update the dot position
  dotStyle.value = { top: `${scrollProgress}%` }

  // Update the active section based on scroll position
  sections.value.forEach((section) => {
    const element = document.getElementById(section)
    if (element) {
      const { top, bottom } = element.getBoundingClientRect()
      if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
        activeSection.value = section
      }
    }
  })
}

const currentLanguage = computed(() => (locale.value === 'en' ? 'En' : 'Fr'))

const switchLanguage = () => {
  locale.value = locale.value === 'en' ? 'fr' : 'en'
}

onMounted(() => {
  // Set the line height to match the total scrollable height
  lineHeight.value = `${document.documentElement.scrollHeight}px`

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll)

  // Initial call to set the dot position
  handleScroll()
})
</script>

<style scoped>
.auth-language-container {
  margin-top: 20px;
}

.language-switcher {
  display: flex;
  gap: 10px;
}

button {
  padding: 5px 10px;
  border: none;
  background-color: #1e293b;
  color: #e2e8f0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #334155;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
}

</style>

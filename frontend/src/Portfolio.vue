<template>
  <div class="container">
    <Header />
    <div class="left-side">
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
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Projects from './components/Projects.vue'
import Comments from './components/Comments.vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

const { t } = useI18n()
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

onMounted(() => {
  lineHeight.value = `${document.documentElement.scrollHeight}px`
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

</script>

<style scoped>


</style>

<template>
  <div class="container">
    <div class="left-side">
      <Contact />
      <div class="info-container">
        <h1>{{ t('portfolio.name') }}</h1>
        <h3>{{ t('portfolio.title') }}</h3>
        <h3>{{ t('portfolio.specialization') }}</h3>
      </div>
      <LanguageSwitcher />
      <div class="navigation-container">
        <nav>
          <ul>
            <li :class="{ active: activeSection === 'description' }">
              <a href="#description">{{ t('portfolio.description') }}</a>
            </li>
            <li :class="{ active: activeSection === 'projects' }">
              <a href="#projects">{{ t('portfolio.projects') }}</a>
            </li>
            <li :class="{ active: activeSection === 'testimonials' }">
              <a href="#testimonials">{{ t('portfolio.testimonials') }}</a>
            </li>
          </ul>
          <div class="line"></div>
          <div class="dot" :style="dotStyle"></div>
        </nav>
      </div>
    </div>
    <div class="right-side">
      <div id="description" class="paragraph-container">
        <h3>{{ t('portfolio.descriptionText') }}</h3>
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="testimonials">
        <Comments />
      </div>
      <div id="CV">
        <CV />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Contact from './components/Contact.vue'
import Projects from './components/Projects.vue'
import CV from './components/CV.vue'
import Comments from './components/Comments.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const sections = ref(['description', 'projects', 'testimonial'])
const activeSection = ref('')
const dotStyle = ref({ top: '0px' })

const handleScroll = () => {
  const scrollPosition = window.scrollY + 100
  sections.value.forEach((section, index) => {
    const element = document.getElementById(section)
    if (element) {
      const offsetTop = element.offsetTop
      const offsetHeight = element.offsetHeight
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection.value = section
        dotStyle.value = { top: `${index * 50}px` }
      }
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})
</script>

<style scoped></style>
<template>
  <div class="container">
    <div class="left-side">
      <Contact />
      <div class="info-container">
        <h1>Artem Kozlov</h1>
        <h3>3rd Year Computer Science Student</h3>
        <h3>I specialize in full-stack development, IT support and love cybersecurity.</h3>
      </div>
      <div class="navigation-container">
        <nav>
          <ul>
            <li :class="{ active: activeSection === 'description' }">
              <a href="#description">Description</a>
            </li>
            <li :class="{ active: activeSection === 'projects' }">
              <a href="#projects">Projects</a>
            </li>
            <li :class="{ active: activeSection === 'testimonials' }">
              <a href="#testimonials">Testimonials</a>
            </li>
          </ul>
          <div class="line"></div>
          <div class="dot" :style="dotStyle"></div>
        </nav>
      </div>
    </div>
    <div class="right-side">
      <div id="description" class="paragraph-container">
        <h3>
          With a love for problem-solving, I have worked as an infanteer in the Canadian Army,
          honing my skills in punctuality, teamwork, and charisma to engage with others and achieve
          results. Using a logical and straightforward approach, I tackle any problem I’m faced
          with, combining curiosity and military-level discipline to find effective and efficient
          solutions. Attention to detail and clear communication are critical in overcoming
          challenges, and I consistently support my team while continuously improving my skills and
          effectiveness.
        </h3>
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

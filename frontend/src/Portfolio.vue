<template>
  <div id="enchant-rain"></div>
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
const mouse = { x: -1000, y: -1000 }

const scrollToSection = (section: string) => {
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = section
  }
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
})

const handleScroll = () => {
  const scrollPosition = window.scrollY
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollProgress = (scrollPosition / totalHeight) * 100
  dotStyle.value = { top: `${scrollProgress}%` }

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

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const enchantRain = document.getElementById("enchant-rain")

  if (!enchantRain || !ctx) return

  enchantRain.appendChild(canvas)
  canvas.classList.add("canvas")

  const minecraftRunes = [
    "ᔑ", "ʖ", "ᓵ", "↸", "ᒷ", "⎓", "⊣", "⍑", "╎",
    "⋮", "ꖌ", "ꖎ", "ᒲ", "リ", "𝙹", "!¡", "ᑑ", "∷",
    "ᓭ", "ℸ", "⚍", "⍊", "∴", "̇/", "||", "⨅"
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
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(232, 232, 208, 0.05)";
    ctx.font = `${fontSize - 8}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const rune = minecraftRunes[Math.floor(Math.random() * minecraftRunes.length)];
      const distance = Math.hypot(mouse.x - x, mouse.y - y);
      let opacity = Math.min(drops[i] / (canvas.height / 4), 1);
      let color = `rgba(232, 232, 208, ${opacity})`;

      if (distance < 100) {
        drops[i] -= 0.1;
        color = `rgba(255, 255, 160, ${Math.min(1, opacity + 0.3)})`;
      }

      ctx.fillStyle = color;
      ctx.fillText(rune, x, y);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i] += 0.3;
    }

    requestAnimationFrame(draw);
  };

  setupCanvas();
  draw();
  window.addEventListener("resize", setupCanvas);
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

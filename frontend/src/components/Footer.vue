<template>
  <footer v-if="showFooter" ref="footer" class="footer">
    <h3>{{ t('portfolio.technologies') }}</h3>
    <div class="technologies">
      <img v-for="tech in technologies" :key="tech.name" :src="tech.image" :alt="tech.name" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const technologies = ref([
  { name: 'Vue', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905325/vue-icon_a4fkpt.png' },
  { name: 'Docker', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905325/docker-icon_scasmy.png' },
  { name: 'Java', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905324/java-icon_vcsyis.png' },
  { name: 'Auth0', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/auth0-icon_pwgjzv.png' },
  { name: 'SQL', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905323/sql-icon_crwpnb.png' },
  { name: 'MongoDB', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905323/mongo-icon_xiz2tr.png' },
  { name: 'DigitalOcean', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/digitalocean-icon_nh1khz.png' },
  { name: 'C#', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/c-sharp-icon_ahjpy1.png' },
  { name: 'Flask', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/flask-icon_eueh19.png' },
  { name: 'Git', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905323/git-icon_qhdwhb.png' },
  { name: 'JS', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905324/javascript-icon_kx95me.png' },
  { name: 'TS', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/typescript-icon_ql9c69.png' },
  { name: 'React', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905323/react-icon_c4ojac.png' },
  { name: 'NodeJS', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905324/nodejs-icon_dpz2rb.png' },
  { name: 'ExpressJS', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/expressjs-icon_yrmssc.png' },
  { name: 'Python', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/python-icon_jxyv1w.png' },
  { name: 'Kotlin', image: 'https://res.cloudinary.com/dhtprehby/image/upload/v1739905322/kotlin-icon_iudkow.png' }
])

const showFooter = ref(false)
const footerHeight = ref(0)
const footer = ref<HTMLElement | null>(null)

const handleScroll = () => {
    const scrollPosition = Math.ceil(window.scrollY + window.innerHeight);
    const totalHeight = Math.ceil(document.documentElement.scrollHeight);

    showFooter.value = scrollPosition >= totalHeight - 1;
    document.body.style.paddingBottom = showFooter.value ? `${footerHeight.value}px` : '0';
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await nextTick()
  footerHeight.value = footer.value?.offsetHeight || 0
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped></style>

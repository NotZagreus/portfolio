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
    { name: 'Vue', image: 'src/assets/icons/vue-icon.png' },
    { name: 'Docker', image: 'src/assets/icons/docker-icon.png' },
    { name: 'Java', image: 'src/assets/icons/java-icon.png' },
    { name: 'Auth0', image: 'src/assets/icons/auth0-icon.png' },
    { name: 'SQL', image: 'src/assets/icons/sql-icon.png' },
    { name: 'MongoDB', image: 'src/assets/icons/mongo-icon.png' },
    { name: 'DigitalOcean', image: 'src/assets/icons/digitalocean-icon.png' },
    { name: 'C#', image: 'src/assets/icons/c-sharp-icon.png' },
    { name: 'Flask', image: 'src/assets/icons/flask-icon.png' },
    { name: 'Git', image: 'src/assets/icons/git-icon.png' },
    { name: 'JS', image: 'src/assets/icons/javascript-icon.png' },
    { name: 'TS', image: 'src/assets/icons/typescript-icon.png' },
    { name: 'React', image: 'src/assets/icons/react-icon.png' },
    { name: 'NodeJS', image: 'src/assets/icons/nodejs-icon.png' },
    { name: 'ExpressJS', image: 'src/assets/icons/expressjs-icon.png' },
    { name: 'Python', image: 'src/assets/icons/python-icon.png' },
    { name: 'Kotlin', image: 'src/assets/icons/kotlin-icon.png' }
])

const showFooter = ref(false)
const footerHeight = ref(0)
const footer = ref<HTMLElement | null>(null)

const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight
    const totalHeight = document.documentElement.scrollHeight
    showFooter.value = scrollPosition >= totalHeight
    document.body.style.paddingBottom = showFooter.value ? `${footerHeight.value}px` : '0'
}

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

<style scoped>
.footer {
    background-color: rgb(25, 33, 48);
    color: #e2e8f0;
    padding-bottom: 1rem;
    text-align: center;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}

.technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.technologies img {
    width: 3%;
    height: 5%;
    object-fit: contain;
    background-color: #5a6074;
    border: 1px solid #24293f;
    border-radius: 8px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.technologies img:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
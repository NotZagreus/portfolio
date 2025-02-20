<template>
    <footer v-if="showFooter" ref="footer" class="footer"> <!-- responsive -->
        <h3>{{ t('portfolio.technologies') }}</h3>
        <div class="technologies"> <!-- responsive -->
            <img v-for="tech in technologies" :key="tech.name" :src="tech.image" :alt="tech.name" /> <!-- responsive -->
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
.footer { /* responsive */
    background-color: rgb(25, 33, 48);
    color: #e2e8f0;
    padding-bottom: 1rem;
    text-align: center;
    width: 100%; /* responsive */
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}

.technologies { /* responsive */
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* responsive */
    justify-content: center;
}

.technologies img { /* responsive */
    width: 3%; /* responsive */
    height: auto;
    object-fit: contain;
    background-color: #5a6074;
    border: 1px solid #24293f;
    border-radius: 8px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.technologies img:hover { /* responsive */
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1200px) {
    .technologies img { /* responsive */
        width: 5%; /* responsive */
    }
}

@media (max-width: 800px) {
    .technologies img { /* responsive */
        width: 7%; /* responsive */
    }
}

@media (max-width: 600px) {
    .technologies img { /* responsive */
        width: 10%; /* responsive */
    }
}
</style>

<template>
    <div class="language-switcher">
        <button @click="switchLanguage">{{ currentLanguage }}</button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLanguage = computed(() => locale.value === 'en' ? 'En' : 'Fr')

const switchLanguage = () => {
    locale.value = locale.value === 'en' ? 'fr' : 'en'
}
import { computed } from 'vue'
</script>

<style scoped>
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
</style>

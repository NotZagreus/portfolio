<template>
  <header v-if="showHeader" ref="header" class="header">
    <div class="auth-language-container">
      <div class="auth-buttons">
        <button v-if="isAuthenticated" @click="logout({ logoutParams: { returnTo: windowLocation } })">
          {{ t('contact.logout') }}
        </button>
        <button v-else @click="loginWithRedirect()">{{ t('contact.login') }}</button>
      </div>
      <div class="language-switcher">
        <button @click="switchLanguage">{{ currentLanguage }}</button>
      </div>
      <button class="contact-btn" @click="toggleBurgerMenu">
        <span>{{ t('contact.contactMe') }}</span>
      </button>
    </div>
    <div v-if="isBurgerMenuOpen" class="burger-menu-sidebar">
      <div class="socialContainer containerOne" @click="showCvModal = true">
        <svg class="socialSvg cvSvg" viewBox="0 0 24 24">
          <path
            d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-4H8V8h5v2zm1-5.5V9h5.5L14 2.5z"
          ></path>
        </svg>
      </div>
      <a href="https://github.com/NotZagreus" class="socialContainer containerTwo">
        <svg class="socialSvg githubSvg" viewBox="0 0 16 16">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/artem-kozlov-75544a23a/"
        class="socialContainer containerThree"
      >
        <svg class="socialSvg linkdinSvg" viewBox="0 0 448 512">
          <path
            d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
          ></path>
        </svg>
      </a>
      <div class="socialContainer containerFour" @click="showModal = true">
        <svg class="socialSvg mailSvg" viewBox="0 0 24 24">
          <path
            d="M12 12.713l11.985-7.99A1.993 1.993 0 0 0 22 4H2c-.729 0-1.373.391-1.732.723L12 12.713zM12 14.287l-12-8V18c0 1.103.897 2 2 2h20c1.103 0 2-.897 2-2v-11.713l-12 8z"
          ></path>
        </svg>
      </div>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h1>{{ t('contact.contactMe') }}</h1>
        <form @submit.prevent="sendEmail">
          <div>
            <label for="firstName">{{ t('contact.firstName') }}:</label>
            <input type="text" id="firstName" v-model="firstName" required />
          </div>
          <div>
            <label for="lastName">{{ t('contact.lastName') }}:</label>
            <input type="text" id="lastName" v-model="lastName" required />
          </div>
          <div>
            <label for="email">{{ t('contact.email') }}:</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div>
            <label for="message">{{ t('contact.message') }}:</label>
            <textarea id="message" v-model="message" required></textarea>
          </div>
          <button type="submit">{{ t('contact.send') }}</button>
        </form>
      </div>
    </div>
    <div v-if="showCvModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showCvModal = false">&times;</span>
        <h2>{{ t('cv.selectLanguage') }}</h2>
        <select v-model="selectedLanguage" class="cv-select">
          <option value="" disabled>{{ t('cv.selectLanguagePlaceholder') }}</option>
          <option value="en">{{ t('cv.english') }}</option>
          <option value="fr">{{ t('cv.french') }}</option>
        </select>
        <button class="cv-button" @click="downloadSelectedCV">{{ t('cv.downloadButton') }}</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useI18n } from 'vue-i18n'
import cvEn from '@/assets/Resume EN - Artem Kozlov.pdf'
import cvFr from '@/assets/Resume FR - Artem Kozlov.pdf'

const { t, locale } = useI18n()
const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()
const windowLocation = window.location.origin

const showHeader = ref(false)
const headerHeight = ref(0)
const header = ref<HTMLElement | null>(null)

const handleScroll = () => {
  const scrollPosition = window.scrollY
  showHeader.value = scrollPosition <= headerHeight.value
  document.body.style.paddingTop = showHeader.value ? `${headerHeight.value}rem` : '0'
}

const isBurgerMenuOpen = ref(false)

const toggleBurgerMenu = () => {
  isBurgerMenuOpen.value = !isBurgerMenuOpen.value
}

const currentLanguage = computed(() => (locale.value === 'en' ? 'En' : 'Fr'))

const switchLanguage = () => {
  locale.value = locale.value === 'en' ? 'fr' : 'en'
}

const accessToken = ref('')
const showModal = ref(false)
const showCvModal = ref(false)
const selectedLanguage = ref<keyof typeof cvFiles | ''>('')
const cvFiles = {
  en: cvEn,
  fr: cvFr,
}
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const message = ref('')

onMounted(async () => {
  if (isAuthenticated.value) {
    accessToken.value = await getAccessTokenSilently()
  }
  window.addEventListener('scroll', handleScroll)
  await nextTick()
  headerHeight.value = header.value?.offsetHeight || 0
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const sendEmail = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: 'jhondoesnthack@gmail.com',
      subject: `Portfolio: Contact from ${firstName.value} ${lastName.value}`,
      text: `${firstName.value} ${lastName.value} has contacted you about your portfolio from ${email.value}, and here's what they said:\n\n${message.value}`,
    }),
  })

  if (response.ok) {
    alert(t('contact.emailSent'))
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    message.value = ''
    showModal.value = false
  } else {
    alert(t('contact.emailFailed'))
  }
}

const downloadSelectedCV = () => {
  if (selectedLanguage.value && cvFiles[selectedLanguage.value]) {
    downloadCV(cvFiles[selectedLanguage.value])
    showCvModal.value = false
  } else {
    alert(t('cv.selectValidLanguage'))
  }
}

const downloadCV = (path: string) => {
  if (!path) return
  window.open(path, '_blank')
}
</script>

<style scoped>
.header {
  background-color: rgb(25, 33, 48);
  color: #e2e8f0;
  text-align: center;
  width: 100%;
  position: fixed;
  height: 5rem;
  top: 0;
  left: 0;
  z-index: 10;
}

.auth-language-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 0px;
  position: absolute;
  bottom: 20px;
  left: 0;
  padding: 0 20px;
}


.language-switcher {
  display: flex;
  gap: 10px;
}

.auth-buttons,
.language-switcher {
  margin-right: 10px;
  width: 100%;
}

.auth-buttons button,
.language-switcher button {
  width: 100%;
  padding: 5px 10px;
  border: none;
  background-color: rgb(83, 96, 108);
  color: #e2e8f0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.auth-buttons button:hover,
.language-switcher button:hover {
  background-color: #334155;
}


.auth-language-contact-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  position: fixed;
  top: 1.25rem;
  right: 1.75rem;
  z-index: 2;
}

.auth-buttons,
.language-switcher {
  display: flex;
  gap: 10px;
}


.auth-buttons button {
  --btn-default-bg: #1e293b;
  --btn-padding: 0.65rem 1rem;
  --btn-hover-bg: #334155;
  --btn-transition: 0.3s;
  --btn-letter-spacing: 0.1rem;
  --btn-animation-duration: 1.2s;
  --btn-shadow-color: rgba(0, 0, 0, 0.137);
  --btn-shadow: 0 2px 10px 0 var(--btn-shadow-color);
  --hover-btn-color: #eff1f8;
  --default-btn-color: #fff;
  --font-size: 16px;
  --font-weight: 600;
  --font-family: Menlo, Roboto Mono, monospace;
  box-sizing: border-box;
  padding: var(--btn-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--default-btn-color);
  font: var(--font-weight) var(--font-size) var(--font-family);
  background: var(--btn-default-bg);
  border: none;
  cursor: pointer;
  transition: var(--btn-transition);
  overflow: hidden;
  box-shadow: var(--btn-shadow);
  white-space: nowrap;
  position: relative;
}

.auth-buttons button span {
  letter-spacing: var(--btn-letter-spacing);
  transition: var(--btn-transition);
  box-sizing: border-box;
  position: relative;
  background: inherit;
}

.auth-buttons button:hover,
.auth-buttons button:focus {
  background-color: var(--btn-hover-bg);
}

.auth-buttons button:hover span,
.auth-buttons button:focus span {
  color: var(--hover-btn-color);
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

.language-switcher button {
  --btn-default-bg: #1e293b;
  --btn-padding: 0.65rem 1rem;
  --btn-hover-bg: #334155;
  --btn-transition: 0.3s;
  --btn-letter-spacing: 0.1rem;
  --btn-animation-duration: 1.2s;
  --btn-shadow-color: rgba(0, 0, 0, 0.137);
  --btn-shadow: 0 2px 10px 0 var(--btn-shadow-color);
  --hover-btn-color: #eff1f8;
  --default-btn-color: #fff;
  --font-size: 16px;
  --font-weight: 600;
  --font-family: Menlo, Roboto Mono, monospace;
  box-sizing: border-box;
  padding: var(--btn-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--default-btn-color);
  font: var(--font-weight) var(--font-size) var(--font-family);
  background: var(--btn-default-bg);
  border: none;
  cursor: pointer;
  transition: var(--btn-transition);
  overflow: hidden;
  box-shadow: var(--btn-shadow);
  white-space: nowrap;
  position: relative;
}

.language-switcher button span {
  letter-spacing: var(--btn-letter-spacing);
  transition: var(--btn-transition);
  box-sizing: border-box;
  position: relative;
  background: inherit;
}

.language-switcher button:hover,
.language-switcher button:focus {
  background-color: var(--btn-hover-bg);
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  position: absolute;
  width: 100%;
  height: auto;
  gap: 1rem;
  flex-wrap: nowrap;
}

.burger-menu-sidebar {
  position: fixed;
  top: 1.25rem;
  right: calc(3rem + 160px);
  display: flex;
  height: 1.5rem;
  flex-direction: row;
  background-color: rgba(30, 41, 59, 0.95);
  padding: 0.5rem;
  border-radius: 8px;
  z-index: 2;
  animation: slideInLeft 0.3s ease-out;
}

.socialContainer {
  flex: 0 0 auto;
  min-width: 3rem;
  min-height: 1.5rem;
  background-color: hsla(210, 20%, 20%, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  margin: 0 5px;
  transition: transform 0.3s ease;
}

.socialContainer:hover {
  transform: scale(1.1);
}

.containerTwo:hover {
  background-color: #333;
  transition-duration: 0.3s;
}

.containerThree:hover {
  background-color: #0072b1;
  transition-duration: 0.3s;
}

.containerFour:hover {
  background-color: #d44638;
  transition-duration: 0.3s;
}

.socialContainer:active {
  transform: scale(0.9);
  transition-duration: 0.3s;
}

.socialSvg {
  width: 17px;
}

.socialSvg path {
  fill: rgb(255, 255, 255);
}

.socialContainer:hover .socialSvg {
  animation: slide-in-top 0.3s both;
}

@keyframes slide-in-top {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.modal-content {
  background-color: hsl(212, 19%, 15%);
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
  position: relative;
  text-align: left;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.cv-select {
  padding: 10px;
  margin: 10px;
  font-size: 16px;
}

.cv-button {
  background-color: #3f3f3f;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.cv-button:hover {
  transition-duration: 0.3s;
}

/* Menu Button */
.contact-btn {
  --btn-default-bg: #1e293b;
  --btn-padding: 0.65rem 1rem;
  --btn-hover-bg: #334155;
  --btn-transition: 0.3s;
  --btn-letter-spacing: 0.1rem;
  --btn-animation-duration: 1.2s;
  --btn-shadow-color: rgba(0, 0, 0, 0.137);
  --btn-shadow: 0 2px 10px 0 var(--btn-shadow-color);
  --hover-btn-color: #eff1f8;
  --default-btn-color: #fff;
  --font-size: 16px;
  --font-weight: 600;
  --font-family: Menlo, Roboto Mono, monospace;
  box-sizing: border-box;
  padding: var(--btn-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--default-btn-color);
  font: var(--font-weight) var(--font-size) var(--font-family);
  background: var(--btn-default-bg);
  border: none;
  cursor: pointer;
  transition: var(--btn-transition);
  overflow: hidden;
  box-shadow: var(--btn-shadow);
  white-space: nowrap;
  position: fixed;
  top: 1.25rem;
  right: 1.75rem;
  translate: (-50%);
  z-index: 2;
}

.contact-btn span {
  letter-spacing: var(--btn-letter-spacing);
  transition: var(--btn-transition);
  box-sizing: border-box;
  position: relative;
  background: inherit;
}

.contact-btn span::before {
  box-sizing: border-box;
  position: absolute;
  content: "";
  background: inherit;
}

.contact-btn:hover span,
.contact-btn:focus span {
  color: var(--hover-btn-color);
}

.contact-btn:hover span::before,
.contact-btn:focus span::before {
  animation: chitchat linear both var(--btn-animation-duration);
}

@keyframes chitchat {
  0% {
    content: "#*";
  }
  5% {
    content: ".@";
  }
  10% {
    content: "^{!";
  }
  15% {
    content: "-!@$";
  }
  20% {
    content: "#$_*&";
  }
  25% {
    content: "№:0*&$@";
  }
  30% {
    content: "#{+.*@$&";
  }
  35% {
    content: "@}-?@&^#*";
  }
  45% {
    content: "=.,^!@&#)";
  }
  50% {
    content: "?2@%&*^%@";
  }
  60% {
    content: "?{%*@&@$:";
    right: 0;
  }
  65% {
    content: "|{f[4&^@";
    right: 0;
  }
  70% {
    content: "{4%0%*!$";
    right: 0;
  }
  75% {
    content: "'1_0<$@";
    right: 0;
  }
  80% {
    content: "{0%$#!";
    right: 0;
  }
  85% {
    content: "]>'@$";
    right: 0;
  }
  90% {
    content: "4#@";
    right: 0;
  }
  95% {
    content: "2!";
    right: 0;
  }
  100% {
    content: "";
    right: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .burger-menu-sidebar {
    top: calc(5rem + 0px); /* Adjust based on header height */
    right: 0;
    left: 50%;
    flex-direction: column;
    width: 35%;
    height: auto;
    border-radius: 0;
    animation: slideInDown 0.3s ease-out;
    gap: 0.25rem;
    padding: 1rem;
  }

  @keyframes slideInDown {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

</style>



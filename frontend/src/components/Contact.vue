<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()
const windowLocation = window.location.origin
const accessToken = ref('')
const showModal = ref(false)
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const message = ref('')

onMounted(async () => {
  if (isAuthenticated.value) {
    accessToken.value = await getAccessTokenSilently()
  }
})

const sendEmail = async () => {
  const response = await fetch(`http://localhost:14344/send`, {
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
</script>

<template>
  <main>
    <div class="card">
      <a href="https://www.instagram.com/artemkozlov_/" class="socialContainer containerOne">
        <svg class="socialSvg instagramSvg" viewBox="0 0 16 16">
          <path
            d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
          ></path>
        </svg>
      </a>
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
    <div class="auth-buttons">
      <button
        v-if="isAuthenticated"
        @click="logout({ logoutParams: { returnTo: windowLocation } })"
      >
        {{ t('contact.logout') }}
      </button>
      <button v-else @click="loginWithRedirect()">{{ t('contact.login') }}</button>
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
  </main>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  position: relative;
  width: 100%;
  height: auto;
  gap: 5%;
  flex-wrap: nowrap;
}

/* for all social containers*/
.socialContainer {
  width: 52px;
  height: 52px;
  background-color: hsla(210, 20%, 20%, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition-duration: 0.3s;
}
/* instagram*/
.containerOne:hover {
  background-color: #d62976;
  transition-duration: 0.3s;
}
/* github*/
.containerTwo:hover {
  background-color: #333;
  transition-duration: 0.3s;
}
/* linkdin*/
.containerThree:hover {
  background-color: #0072b1;
  transition-duration: 0.3s;
}
/* mail*/
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
  z-index: 10000;
}

.modal-content {
  background-color: hsl(212, 19%, 15%);
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
  position: relative;
  text-align: left;
  z-index: 3000;
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
</style>

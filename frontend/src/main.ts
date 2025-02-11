// import './assets/main.css'
import './assets/portfolio.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue'
import router from './router'
import auth0 from './plugins/auth0'
import Portfolio from './Portfolio.vue'
import i18n from './i18n'

// const app = createApp(App)

const app = createApp(Portfolio)

app.use(createPinia())
app.use(router)
app.use(auth0)
app.use(i18n)

app.mount('#app')

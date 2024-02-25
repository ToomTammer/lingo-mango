import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import our custom CSS
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App).use(router).mount('#app')

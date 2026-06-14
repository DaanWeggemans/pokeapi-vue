import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.scss';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register("/pokeapi-vue/service-worker.js");
    });
}

const app = createApp(App)

app.use(router)

app.mount('#app')

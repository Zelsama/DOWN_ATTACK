import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'bulma/css/bulma.min.css'; // Importação do Bulma

const app = createApp(App);
const pinia = createPinia()

app.use(pinia)
app.use(router);

app.mount('#app');
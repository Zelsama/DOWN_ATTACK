import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bulma/css/bulma.min.css'; // Importação do Bulma

const app = createApp(App);
app.use(router);
app.mount('#app');
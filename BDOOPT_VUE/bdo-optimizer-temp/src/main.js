import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'bulma/css/bulma.min.css';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);
const pinia = createPinia()

app.use(pinia)
app.use(router);

useAuthStore(pinia).checkAuthStatus().then(() => {  
  app.use(router);  
  app.mount('#app');  
});

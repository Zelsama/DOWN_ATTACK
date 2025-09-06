<template>
  <div class="home">   
    <h1>{{ process.env.VUE_APP_API_URL }}</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted } from 'vue';

onMounted(() => {
  console.log("HomeView mounted");
  console.log("API URL: "+process.env.VUE_APP_API_URL);
});

export default {
  name: 'HomeView',
  components: {
  }
}
</script>

<style>
:root{
  height: 100vh;
  width: 100vw;
  background-color: #0e0f11
}
.home {
  background-color: #0e0f11;
}
</style>
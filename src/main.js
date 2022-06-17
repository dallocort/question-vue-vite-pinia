import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./routing/router.js";

const app = createApp(App);
app.use(router);
app.use(createPinia());
router.isReady().then(function () {
  app.mount("#app");
});

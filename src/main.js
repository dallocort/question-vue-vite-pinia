import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './routing';

const app = createApp(App);
app.use(router);
app.use(createPinia);
router.isReady().then(function () {
	app.mount('#app');
});

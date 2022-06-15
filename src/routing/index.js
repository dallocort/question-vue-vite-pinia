import Admin from "@/pages/Admin.vue";
import {createRouter, createWebHistory} from 'vue-router';
import Choice from '../pages/Choice.vue';
import GameOver from "../pages/GameOver.vue";
import Level from "../pages/Level.vue";
import Login from "../pages/Login.vue";
import Main from "../pages/Main.vue";
import Register from "../pages/Register.vue";
import Welcome from '../pages/Welcome';
import store from '../store';

const router = createRouter({
	history: createWebHistory(),
	routes: [{
		name: 'welcome',
		path: '/',
		component: Welcome,
		beforeEnter(to, from, next) {
			if (sessionStorage.getItem('username') && sessionStorage.getItem('sid')) {
				next('/main');
			} else {
				next();
			}
		}
	}, {
		name: 'choice',
		path: '/choice',
		component: Choice,
		beforeEnter(to, from, next) {
			if (sessionStorage.getItem('username') && sessionStorage.getItem('sid')) {
				next('/main');
			} else {
				if (to.path === '/choice/login') {
					next();
				} else {
					next('/choice/login');
				}
			}
		},
		children: [{
			name: 'login',
			path: 'login',
			component: Login
		}, {
			name: 'register',
			path: 'register',
			component: Register
		}]
	}, {
		name: 'main',
		path: '/main',
		component: Main
	}, {
		name: 'level',
		path: '/level',
		component: Level
	}, {
		name: 'admin',
		path: '/admin',
		component: Admin,
		beforeEnter(to, from, next) {
			if (sessionStorage.getItem('username') && sessionStorage.getItem('sid') && store.getters.isAdmin) {
				next();
			} else {
				next('/main');
			}
		}
	}, {
		name: 'game-over',
		path: '/game-over',
		component: GameOver,
		beforeEnter(to, from, next) {
			if (store.getters.isGameOver) {
				next();
			} else {
				next('/main');
			}
		}
	}, {
		path: '/:anything(.*)',
		redirect: '/'
	}]
});
router.beforeEach((to, from, next) => {
	if (to.path.startsWith('/choice')) {
		next();
		return;
	}
	if (sessionStorage.getItem('username') && sessionStorage.getItem('sid')) {
		next();
	} else {
		if (to.path === '/') {
			next();
		} else {
			next('/');
		}
	}
});
export default router;

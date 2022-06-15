import {createStore} from "vuex";

const store = createStore({
	state() {
		return {
			isGameOver: false,
			isAdmin: false
		};
	},
	mutations: {
		setGameIsOver(state) {
			state.isGameOver = true;
		},
		setGameNotOver(state) {
			state.isGameOver = false;
		},
		setIsAdmin(state) {
			state.isAdmin = true;
		},
		setNotAdmin(state) {
			state.isAdmin = false;
		}
	},
	actions: {
		setGameIsOver(context) {
			context.commit('setGameIsOver');
		},
		setGameNotOver(context) {
			context.commit('setGameNotOver');
		},
		setIsAdmin(context) {
			context.commit('setIsAdmin');
		},
		setNotAdmin(context) {
			context.commit('setNotAdmin');
		}
	},
	getters: {
		isGameOver(state) {
			return state.isGameOver;
		},
		isAdmin(state) {
			return state.isAdmin;
		}
	}
});
export default store;

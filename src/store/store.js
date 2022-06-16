import { defineStore } from "pinia";

export const useStore = defineStore("question", {
  state: () => ({
    isGameOver: false,
    isAdmin: true,
  }),
  actions: {
    setGameIsOver() {
      this.isGameOver = true;
    },
    setGameNotOver() {
      this.isGameOver = false;
    },
    setIsAdmin() {
      this.isAdmin = true;
    },
    setNotAdmin() {
      this.isAdmin = false;
    },
  },
});

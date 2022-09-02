import axios from "axios";
import { defineStore } from "pinia";

export const useStore = defineStore("question", {
  state: () => ({
    isAuthenticated: false,
    isGameOver: false,
    isAdmin: false,
    idToken: "",
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
    setIsAuthenticated() {
      this.isAuthenticated = true;
    },
    clearStore() {
      this.isAuthenticated = false;
      this.isGameOver = false;
      this.isAdmin = false;
      this.idToken = "";
    },
    async deleteQuestion(
      postedQuestion,
      postedAnswer1,
      postedAnswer2,
      postedAnswer3,
      postedAnswer4
    ) {
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions/${postedQuestion}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer1}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer2}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer3}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer4}`
      );
    },
  },
});

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
      postedQuestionUID,
      postedAnswer1UID,
      postedAnswer2UID,
      postedAnswer3UID,
      postedAnswer4UID
    ) {
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions/${postedQuestionUID}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer1UID}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer2UID}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer3UID}`
      );
      await axios.delete(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers/${postedAnswer4UID}`
      );
    },
    async addQuestion(
      question,
      correctAnswer,
      answer2,
      answer3,
      answer4,
      qst_level
    ) {
      let postedQuestionUID = "";
      let postedAnswer1UID = "";
      let postedAnswer2UID = "";
      let postedAnswer3UID = "";
      let postedAnswer4UID = "";
      if (
        question !== "" &&
        correctAnswer !== "" &&
        answer2 !== "" &&
        answer3 !== "" &&
        answer4 !== "" &&
        (qst_level === 1 || qst_level === 2)
      ) {
        try {
          //get max qst_id
          const first100Questions = await axios.get(
            //if no limit, it retrieves only 15 questions
            "https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions?limit=100"
          );
          let qst_id =
            first100Questions.data.data.reduce(
              (a, b) =>
                Math.max(
                  a.attributes ? a.attributes.qst_id : a,
                  b.attributes.qst_id
                ),
              -Infinity
            ) + 1;
          if (qst_id === -Infinity) {
            qst_id = 1;
          }
          //get max ans_id
          const first100Answers = await axios.get(
            //if no limit, retrieves only some answers
            "https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers?limit=1000"
          );
          let ans_id =
            first100Answers.data.data.reduce(
              (a, b) =>
                Math.max(
                  a.attributes ? a.attributes.ans_id : a,
                  b.attributes.ans_id
                ),
              -Infinity
            ) + 1;
          if (ans_id === -Infinity) {
            ans_id = 1;
          }
          postedQuestionUID = (
            await axios.post(
              "https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions",
              {
                qst_level: qst_level,
                question: question,
                qst_id: qst_id,
              }
            )
          ).data.data.uid;
          postedAnswer1UID = (
            await axios.post(
              "https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers",
              {
                ans_id: ans_id,
                ans_text: correctAnswer,
                ans_true: true,
                qst_id: qst_id,
              }
            )
          ).data.data.uid;
          postedAnswer2UID = (
            await axios.post(
              "https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers",
              {
                ans_id: ans_id + 1,
                ans_text: answer2,
                ans_true: false,
                qst_id: qst_id,
              }
            )
          ).data.data.uid;
          postedAnswer3UID = (
            await axios.post(
              "https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers",
              {
                ans_id: ans_id + 2,
                ans_text: answer3,
                ans_true: false,
                qst_id: qst_id,
              }
            )
          ).data.data.uid;
          postedAnswer4UID = (
            await axios.post(
              "https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers",
              {
                ans_id: ans_id + 3,
                ans_text: answer4,
                ans_true: false,
                qst_id: qst_id,
              }
            )
          ).data.data.uid;
        } catch (message) {
          await store.deleteQuestion(
            postedQuestionUID,
            postedAnswer1UID,
            postedAnswer2UID,
            postedAnswer3UID,
            postedAnswer4UID
          );
        }
      } else {
      }
    },
  },
});

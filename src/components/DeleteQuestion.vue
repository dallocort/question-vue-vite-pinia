<template>
    <section id="deleteQuestion">
        <label for="one">SEARCH:</label>
        <input id="one" v-model="searchText" placeholder="search questions"/>
        <article v-if="filteredQuestions.length" id="listOfQuestions">
            <p v-for="(question,index) in
            filteredQuestions"
               :key="question.qst_id"
               @click="deleteQuestion(question.qst_id)">
                {{ index + 1 }}. {{ question.question }}
            </p>
        </article>
        <p v-if="info" class="info">{{ info }}</p>
    </section>
</template>

<script>
import axios from "axios";

export default {
    name: "DeleteQuestion",
    data() {
        return {
            questions: [],
            info: '',
            searchText: ''
        };
    },
    methods: {
        createAllQuestions() {
            const request = axios.get(
                `http://739k121.mars-e1.mars-hosting.com/dm_quiz/questions?sid=${sessionStorage.getItem(
                    'sid')}&level=all`);
            request.then(response => {
                if (response.data.status === 'E') {
                    throw new Error(response.data.message);
                } else if (response.data.status === 'S') {
                    this.questions = response.data.data;
                    console.log(this.questions);
                }
            }).catch(message => this.info = message);
        },
        deleteQuestion(id) {
            const request = axios.delete(
                `http://739k121.mars-e1.mars-hosting.com/inkvizicija/unosPitanja.js?id=${id}`);
            request.then(response => {
                console.log(response);
                if (response.status !== 200) {
                    throw new Error(response.data.message);
                } else if (response.status === 200) {
                    this.info = 'Question deleted successfully!!';
                    setTimeout(() => this.info = '', 3000);
                    this.createAllQuestions();
                }
            }).catch(message => this.info = message);
        }
    },
    computed: {
        filteredQuestions() {
            if (this.searchText.length > 2) {
                return this.questions.filter(qst => qst.question.toLowerCase()
                .includes(this.searchText.toLowerCase()));
            } else {
                return this.questions;
            }
        }
    },
    mounted() {
        this.createAllQuestions();
    }
};
</script>

<style scoped>
#deleteQuestion {
    margin: 10px 0 20px;
}

.info {
    color: #91ff19;
    margin: 0;
    text-align: center;
}

#listOfQuestions {
    overflow: auto;
    height: 70vh;
    position: relative;
}

label {
    display: inline-block;
    width: 100px;
    text-align: left;
}

input {
    width: 260px;
    height: 25px;
    font-size: 1.1em;
}

article p {
    text-align: left;
    font-size: .8em;
    color: white;
    padding: 0 10px 0 40px;
    cursor: pointer;
    text-indent: -20px;
}

article p:hover {
    color: darkred;
}

article p:hover::before {
    content: '❌';
    position: absolute;
    left: 18px;
    color: red;
}
</style>

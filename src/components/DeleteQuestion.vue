<script setup>
import axios from "axios";
import {computed, onMounted} from "vue";

let questions = [];
let info = '';
let searchText = '';

function createAllQuestions() {
    const request = axios.get(
        `http://739k121.mars-e1.mars-hosting.com/dm_quiz/questions?sid=${sessionStorage.getItem(
            'sid')}&level=all`);
    request.then(response => {
        if (response.data.status === 'E') {
            throw new Error(response.data.message);
        } else if (response.data.status === 'S') {
            questions = response.data.data;
            console.log(questions);
        }
    }).catch(message => info = message);
}

function deleteQuestion(id) {
    const request = axios.delete(
        `http://739k121.mars-e1.mars-hosting.com/inkvizicija/unosPitanja.js?id=${id}`);
    request.then(response => {
        console.log(response);
        if (response.status !== 200) {
            throw new Error(response.data.message);
        } else if (response.status === 200) {
            info = 'Question deleted successfully!!';
            setTimeout(() => info = '', 3000);
            createAllQuestions();
        }
    }).catch(message => info = message);
}

const filteredQuestions = computed(() => {
    if (searchText.length > 2) {
        return questions.filter(qst => qst.question.toLowerCase()
        .includes(searchText.toLowerCase()));
    } else {
        return questions;
    }
});
onMounted(() => {
    createAllQuestions();
});
</script>

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

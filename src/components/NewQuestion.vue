<script setup>
import axios from "axios";
import {onBeforeRouteLeave} from "vue-router";

let question = '';
let correctAnswer = '';
let answer2 = '';
let answer3 = '';
let answer4 = '';
let qst_level = '1';
let info = '';
let buttonDisabled = false;

function addQuestion() {
    buttonDisabled = true;
    if (question !== '' && correctAnswer !== '' && answer2 !== '' && answer3 !== '' && answer4 !== '' && (qst_level === 1 || qst_level === 2 || qst_level === '2' || qst_level === '1')) {
        const request = axios.post(
            'http://739k121.mars-e1.mars-hosting.com/inkvizicija/unosPitanja.js',
            {
                odgovor2: answer2,
                odgovor3: answer3,
                odgovor4: answer4,
                qst_level: Number(qst_level),
                question: question,
                tacanOdgovor: correctAnswer
            });
        request.then(response => {
            if (response.status !== 200) {
                throw new Error(response.data.message);
            } else {
                info = 'Question added successfully!!';
                reset();
                buttonDisabled = false;
            }
        })
        .catch(message => {
            buttonDisabled = false;
            info = message;
        });
    } else {
        buttonDisabled = false;
        info = 'error, enter data correctly';
        setTimeout(() => info = '', 3000);
    }
}

function reset() {
    answer2 = '';
    answer3 = '';
    answer4 = '';
    qst_level = '1';
    question = '';
    correctAnswer = '';
    setTimeout(() => info = '', 3000);
}

onBeforeRouteLeave(() => buttonDisabled = false);
</script>

<template>
    <section id="newQuestion" :class="{cursor:buttonDisabled}">
        <h1>CREATE NEW QUESTION</h1>
        <textarea id="question"
                  v-model="question"
                  autofocus
                  cols="30"
                  placeholder="Enter question here..."
                  rows="5"/>
        <br/>
        <label for="correctAnswer">CORRECT ANSWER:&nbsp;&nbsp;</label>
        <input id="correctAnswer" v-model="correctAnswer" type="text"/>
        <br/>
        <label for="answer2">ANSWER 2:&nbsp;&nbsp;</label>
        <input id="answer2" v-model="answer2" type="text"/>
        <br/>
        <label for="answer3">ANSWER 3:&nbsp;&nbsp;</label>
        <input id="answer3" v-model="answer3" type="text"/>
        <br/>
        <label for="answer4">ANSWER 4:&nbsp;&nbsp;</label>
        <input id="answer4" v-model="answer4" type="text"/>
        <br/>
        <label for="qst_level">QUESTION LEVEL:&nbsp;&nbsp;</label>
        <input id="qst_level"
               v-model="qst_level"
               max="2"
               min="1"
               type="number"/>
        <br/>
        <button :disabled="buttonDisabled" @click="addQuestion">ADD QUESTION
        </button>
        <p v-if="info" class="info">{{ info }}</p>
    </section>
</template>

<style scoped>
label {
    display: inline-block;
    width: 171px;
    padding: 7px;
    text-align: left;
}

#newQuestion.cursor, #newQuestion.cursor button:last-of-type {
    cursor: progress;
}

label:last-of-type {
    width: 279px;
}

button {
    margin: 15px 0 15px;
    font-size: 1.1em;
    height: 40px;
}

textarea {
    margin-bottom: 7px;
    resize: none;
}

.info {
    text-transform: uppercase;
    color: #d5ca16;
    font-size: 1.1em;
}
</style>

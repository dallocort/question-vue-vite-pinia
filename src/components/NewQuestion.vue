<script setup>
import axios from "axios";
import {ref} from "vue";
import {onBeforeRouteLeave} from "vue-router";
import {useStore} from "../store/store.js";
import Button from "./Button.vue";

let store = useStore();
let question = ref('');
let correctAnswer = ref('');
let answer2 = ref('');
let answer3 = ref('');
let answer4 = ref('');
let qst_level = ref(1);
let info = ref('');
let buttonDisabled = ref(false);
let clearTimer;
let qst_id = null;
let ans_id = null;
let postedQuestion = null;
let postedAnswer1 = null;
let postedAnswer2 = null;
let postedAnswer3 = null;
let postedAnswer4 = null;

async function addQuestion() {
    buttonDisabled.value = true;
    //for spamming the button ADD QUESTION
    clearTimeout(clearTimer);
    if (question.value !== '' && correctAnswer.value !== '' && answer2.value !== '' && answer3.value !== '' && answer4.value !== '' && (qst_level.value === 1 || qst_level.value === 2)) {
        try {
            //get max qst_id
            const requestMAXQid = await axios.get(//if no limit, retrieves only 15 questions
                'https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions?limit=100');
            qst_id = requestMAXQid.data.data.reduce(
                (a, b) => Math.max(a.attributes ? a.attributes.qst_id : a, b.attributes.qst_id), -Infinity) + 1;
            //get max ans_id
            const requestMAXAid = await axios.get(//if no limit, retrieves only some answers
                'https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers?limit=1000');
            ans_id = requestMAXAid.data.data.reduce(
                (a, b) => Math.max(a.attributes ? a.attributes.ans_id : a, b.attributes.ans_id), -Infinity) + 1;
            postedQuestion = (await axios.post('https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions', {
                qst_level: qst_level.value,
                question: question.value,
                qst_id: qst_id
            })).data.data.uid;
            postedAnswer1 = (await axios.post('https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers', {
                "ans_id": ans_id,
                "ans_text": correctAnswer.value,
                "ans_true": true,
                "qst_id": qst_id
            })).data.data.uid;
            postedAnswer2 = (await axios.post('https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers', {
                "ans_id": ans_id + 1,
                "ans_text": answer2.value,
                "ans_true": false,
                "qst_id": qst_id
            })).data.data.uid;
            postedAnswer3 = (await axios.post('https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers', {
                "ans_id": ans_id + 2,
                "ans_text": answer3.value,
                "ans_true": false,
                "qst_id": qst_id
            })).data.data.uid;
            postedAnswer4 = (await axios.post('https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers', {
                "ans_id": ans_id + 3,
                "ans_text": answer4.value,
                "ans_true": false,
                "qst_id": qst_id
            })).data.data.uid;
            info.value = 'Question added successfully!!';
            reset();
            buttonDisabled.value = false;
        } catch (message) {
            await store.deleteQuestion(postedQuestion, postedAnswer1, postedAnswer2, postedAnswer3, postedAnswer4);
            buttonDisabled.value = false;
            info.value = message;
        }
    } else {
        info.value = 'Please, enter data correctly';
        buttonDisabled.value = false;
        clearTimer = setTimeout(() => {
            info.value = '';
        }, 3000);
    }
}

function reset() {
    answer2.value = '';
    answer3.value = '';
    answer4.value = '';
    qst_level.value = 1;
    question.value = '';
    correctAnswer.value = '';
    setTimeout(() => info.value = '', 3000);
}

onBeforeRouteLeave((_to, _from, next) => {
    //initial value to disable button (ADD QUESTION) click
    buttonDisabled.value = false;
    //to proceed with routing
    next();
});
</script>

<template>
    <section id="newQuestion" :class="{cursor:buttonDisabled}">
        <h1>CREATE NEW QUESTION</h1>
        <textarea id="question"
                  v-model="question"
                  v-focus
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
               v-model.number="qst_level"
               max="2"
               min="1"
               type="number"/>
        <br/>
        <Button :disabled="buttonDisabled" btn-text="ADD QUESTION" span-text="19px" style="scale: .6"
                @click="addQuestion"></Button>
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
    width: 289px;
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
    color: #d5ca16;
    font-size: 1.1em;
}
</style>

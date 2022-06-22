<script setup>
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import {useRouter} from 'vue-router';
import Emotions from "../components/Emotions.vue";
import Harts from "../components/Harts.vue";
import Timer from "../components/Timer.vue";
import {useStore} from "../store/store.js";

const router = useRouter();
const store = useStore();
let level = ref(1);
let error = ref('');
let indexOfQuestion = ref(0);
let allQuestions = ref([]);
let questions = ref([]);
let answers = ref([]);
let restartTimer = ref(false);
let stopTimer = ref(false);
let showTimeIsUp = ref(false);
let user = sessionStorage.getItem('username');
let score = ref(0);
let numOfLives = ref(3);
let showQuestions = ref(true);
let answerWrong = ref('');
let answerCorrect = ref(1);
let blocking = ref(false);
let seconds = ref(20);
let correctAnswerArray = ref([]);
let emotion = ref('normal');
let questionsFetched = ref(false);

function createAllQuestions(lvl) {
    const request = axios.get(
        `https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions?where=[{"attribute":"qst_level","operator":"=","value":"${lvl}"}]`);
    request.then(response => {
        if (response.data?.errors) {
            throw new Error(response.data.errors.detail);
        } else {
            response.data.data.forEach(
                el => allQuestions.value.push(el.attributes));
        }
    }).catch(message => error = message);
}

function createAnswers() {
    const helperArray = [];
    questions.value.forEach(el => {
        helperArray.push(axios.get(
            `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers?where=[{"attribute":"qst_id","operator":"=","value":"${el.qst_id}"}]`));
    });
    Promise.all(helperArray)
    .then(response => {
        response.forEach(obj => {
            answers.value.push(obj.data.data);
        });
        answers.value.sort(
            (a, b) => a[0].attributes.qst_id - b[0].attributes.qst_id);
        answers.value.forEach((el) => {
            el.sort(() => .5 - Math.random());
        });
        questionsFetched.value = true;
    })
    .catch(message => error.value = message);
}

function pickedAnswer(ans_true, ans_id) {
    stopTimer.value = true;
    blocking.value = true;
    correctAnswerArray.value.push({
        level: questions.value[indexOfQuestion.value].qst_level,
        correct: ans_true === 1
    });
    if (ans_true === true) {
        answerCorrect.value = true;
        emotion.value = 'happy';
        if (level.value === 1) {
            calculateScore(10);
        } else {
            calculateScore(20);
        }
        if (correctAnswerArray.value.length >= 3) {
            addBonus();
        }
        if (indexOfQuestion.value === 4) {
            nextLevel();
            return;
        }
        reset();
    } else {
        emotion.value = 'angry';
        answerWrong.value = ans_id;
        numOfLives.value -= 1;
        if (numOfLives.value === 0) {
            store.setGameIsOver();
            setTimeout(() => {
                router.push({
                    name: 'game-over',
                    query: {
                        score: score.value,
                        status: 'LOST'
                    }
                });
            }, 3000);
            return;
        }
        if (indexOfQuestion.value === 4) {
            nextLevel();
            return;
        }
        setTimeout(() => {
            emotion.value = 'normal';
            indexOfQuestion.value += 1;
            restartTimer.value = !restartTimer.value;
            showQuestions.value = true;
            showTimeIsUp.value = false;
            stopTimer.value = false;
            answerWrong.value = '';
            blocking.value = false;
        }, 3000);
    }
}

function addBonus() {
    if (correctAnswerArray.value[correctAnswerArray.value.length - 1].correct && correctAnswerArray.value[correctAnswerArray.value.length - 2].correct && correctAnswerArray.value[correctAnswerArray.value.length - 3].correct) {
        for (let i = 1; i <= 3; i++) {
            correctAnswerArray.value[correctAnswerArray.value.length - i].level === 1 ?
                calculateScore(10) : calculateScore(20);
        }
        //to break the array of correct answers
        correctAnswerArray.value.push({
            level: 0,
            correct: false
        });
    }
}

function nextLevel() {
    if (level.value === 1) {
        resetNewLevel();
    } else {
        store.setGameIsOver();
        setTimeout(() => {
            router.push({
                name: 'game-over',
                query: {
                    score: score.value + 200,
                    status: 'W I N !!!!!!!!'
                }
            });
        }, 3000);
    }
}

function reset() {
    setTimeout(() => {
        emotion.value = 'normal';
        indexOfQuestion.value += 1;
        restartTimer.value = !restartTimer.value;
        stopTimer.value = false;
        answerCorrect.value = 0;
        blocking.value = false;
    }, 3000);
}

function resetNewLevel() {
    setTimeout(() => {
        emotion.value = 'normal';
        showTimeIsUp.value = false;
        questionsFetched.value = false;
        showQuestions.value = true;
        indexOfQuestion.value = 0;
        restartTimer.value = !restartTimer.value;
        stopTimer.value = false;
        answerCorrect.value = 0;
        blocking.value = false;
        seconds.value = 15;
        level.value = 2;
    }, 3000);
}

function timeIsUp() {
    emotion.value = 'angry';
    showTimeIsUp.value = true;
    numOfLives.value -= 1;
    showQuestions.value = false;
    if (numOfLives.value === 0) {
        store.setGameIsOver();
        setTimeout(() => {
            router.push({
                name: 'game-over',
                query: {
                    score: score.value,
                    status: 'L O S T'
                }
            });
        }, 3000);
        return;
    } else if (indexOfQuestion.value === 4) {
        nextLevel();
        return;
    }
    setTimeout(() => {
        emotion.value = 'normal';
        indexOfQuestion.value += 1;
        restartTimer.value = !restartTimer.value;
        showQuestions.value = true;
        showTimeIsUp.value = false;
    }, 3000);
}

function calculateScore(value) {
    score.value += value;
}

onMounted(() => {
    createAllQuestions(level.value);
});
watch(allQuestions, () => {
    if (allQuestions.value.length !== 0) {
        while (questions.value.length !== 5) {
            let random = Math.floor(Math.random() * allQuestions.value.length);
            if (!questions.value.includes(allQuestions.value[random])) {
                questions.value.push(allQuestions.value[random]);
            }
        }
        questions.value.sort((a, b) => a.qst_id - b.qst_id);
        createAnswers();
    }
}, {deep: true});
watch(level, () => {
    indexOfQuestion.value = 0;
    questions.value = [];
    answers.value = [];
    allQuestions.value = [];
    createAllQuestions(level.value);
});
</script>

<template>
    <section id="level" :class="{level2:level===2}">
        <h1>QUESTIONS LEVEL {{ level }}</h1>
        <h4>USER: {{ user }}</h4>
        <section id="info">
            <p>SCORE: {{ score }}</p>
            <p>QUESTION: {{ indexOfQuestion + 1 }}/5</p>
            <Timer
                v-if="questionsFetched"
                :restart="restartTimer"
                :seconds="seconds"
                :stop="stopTimer"
                @time-is-up="timeIsUp"/>
            <Harts :numOfLives.number="numOfLives"/>
        </section>
        <p v-show="showTimeIsUp">Your time is up, one life lost!
        </p>
        <section v-if="questions.length && showQuestions && questionsFetched"
                 id="questions">
            <article>
                <p>{{ questions[indexOfQuestion].question }}</p>
            </article>
            <section v-if="blocking" id="blocking"></section>
            <transition-group v-if="answers.length>0" name="questions" tag="ol">
                <li v-for="answer in answers[indexOfQuestion]"
                    :key="answer.attributes.ans_id"
                    :class="['answers',{wrong:answerWrong===answer.attributes.ans_id,correct:answerCorrect===answer.attributes.ans_true}]"
                    @click="pickedAnswer(answer.attributes.ans_true,
                    answer.attributes.ans_id)">
                    {{ answer.attributes.ans_text }}
                </li>
            </transition-group>
        </section>
        <section v-if="!questionsFetched" class="loading">Loading questions...
        </section>
        <p v-if="error">{{ error }}</p>
        <transition name="smiley">
            <Emotions v-if="questionsFetched" :emotion="emotion"/>
        </transition>
        <router-link :to="{name:'main'}">MAIN MENU</router-link>
    </section>
</template>

<style scoped>
#level {
    width: 495px;
    margin: 10vh auto 0;
    background: rgba(229, 241, 255, 0.2);
    padding: 1px;
    height: 530px;
    overflow: hidden;
    position: relative;
}

#level a:last-child {
    display: block;
    position: absolute;
    top: 0;
    padding: 5px;
    text-decoration: none;
}

#level.level2 {
    background-color: rgba(180, 76, 174, 0.5);
    color: #f5ac23;
}

#level > p:first-of-type {
    font-size: 1.25em;
    color: #ff3d3d;
}

#questions article {
    display: flex;
    background: rgba(229, 241, 255, 0.2);
    color: #fff;
    height: 90px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

#questions article p:first-of-type {
    font-weight: bold;
}

.answers {
    text-align: left;
    margin: 10px 0 10px;
    padding: 5px;
    height: 20px;
}

.answers:hover {
    font-weight: bold;
    font-size: 1.1em;
    cursor: pointer;
}

#questions p {
    text-align: left;
    padding-left: 22px;
}

h1 {
    text-align: center;
}

#info {
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-around;
    align-items: center;
    font-family: monospace;
    font-size: 1.3em;
    font-weight: bold;
}

.wrong::after {
    content: '❌';
    color: red;
    padding-left: 5px;
}

.wrong {
    font-weight: bold;
}

.correct::after {
    content: '✔';
    color: green;
    padding-left: 5px;
}

.correct {
    font-weight: bold;
}

#blocking {
    width: 495px;
    height: 285px;
    position: absolute;
}

.smiley-enter-active {
    transform-origin: 50% 100%;
    animation: jumping .6s linear;
}

@keyframes jumping {
    0% {
        opacity: 0;
        transform: translate3d(0, -100px, 0) scale3d(1, 1, 1);
    }
    30% {
        transform: translate3d(0, -60px, 0) scale3d(.8, 1.2, 1);
    }
    50% {
        transform: translate3d(0, 0, 0) scale3d(.8, 1.2, 1);
    }
    80% {
        transform: translate3d(0, 0, 0) scale3d(1.5, .7, 1);
    }
    100% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    }
}

.questions-enter-from {
    opacity: 0;
    transform: translateX(-100px);
}

.questions-enter-active {
    transition: all .40s linear;
}

.questions-move {
    transition: all .30s linear;
}

.questions-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.loading {
    margin-top: 25%;
    font-weight: bold;
}
</style>

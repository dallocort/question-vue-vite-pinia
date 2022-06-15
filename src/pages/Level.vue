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
let error = '';
let indexOfQuestion = 0;
let allQuestions = ref([]);
let questions = [];
let answers = [];
let restartTimer = false;
let stopTimer = false;
let showTimeIsUp = false;
let user = sessionStorage.getItem('username');
let score = 0;
let numOfLives = 3;
let showQuestions = true;
let answerWrong = '';
let answerCorrect = '';
let blocking = false;
let seconds = 20;
let correctAnswerArray = [];
let emotion = 'normal';
let questionsFetched = false;

function createAllQuestions(lvl) {
    const request = axios.get(
        `http://739k121.mars-e1.mars-hosting.com/dm_quiz/questions?sid=${sessionStorage.getItem(
            'sid')}&level=${lvl}`);
    request.then(response => {
        if (response.data.status === 'E') {
            throw new Error(response.data.message);
        } else if (response.data.status === 'S') {
            allQuestions.value = response.data.data;
        }
    }).catch(message => error = message);
}

function createAnswers() {
    const helperArray = [];
    questions.forEach(el => {
        helperArray.push(axios.get(
            `http://739k121.mars-e1.mars-hosting.com/dm_quiz/answers?sid=${sessionStorage.getItem(
                'sid')}&qst_id=${el.qst_id}`));
    });
    Promise.all(helperArray)
    .then(response => {
        response.forEach(obj => {
            answers.push(obj.data.data);
        });
        answers.sort((a, b) => a[0].qst_id - b[0].qst_id);
        answers.forEach((el) => {
            el.sort(() => .5 - Math.random());
        });
        console.log('ANSWERS: ', answers);
        questionsFetched = true;
    })
    .catch(message => error = message);
}

function pickedAnswer(ans_true, ans_id) {
    stopTimer = true;
    blocking = true;
    correctAnswerArray.push({
        level: questions[indexOfQuestion].qst_level,
        correct: ans_true === 1
    });
    if (ans_true === 1) {
        answerCorrect = 1;
        emotion = 'happy';
        if (level.value === 1) {
            calculateScore(10);
        } else {
            calculateScore(20);
        }
        if (correctAnswerArray.length >= 3) {
            addBonus();
        }
        if (indexOfQuestion === 4) {
            nextLevel();
            return;
        }
        reset();
    } else {
        emotion = 'angry';
        answerWrong = ans_id;
        numOfLives -= 1;
        if (numOfLives === 0) {
            store.setGameIsOver();
            setTimeout(() => {
                router.push({
                    name: 'game-over',
                    query: {
                        score: score,
                        status: 'LOST'
                    }
                });
            }, 3000);
            return;
        }
        if (indexOfQuestion === 4) {
            nextLevel();
            return;
        }
        setTimeout(() => {
            emotion = 'normal';
            indexOfQuestion += 1;
            restartTimer = !restartTimer;
            showQuestions = true;
            showTimeIsUp = false;
            stopTimer = false;
            answerWrong = '';
            blocking = false;
        }, 3000);
    }
}

function addBonus() {
    if (correctAnswerArray[correctAnswerArray.length - 1].correct && correctAnswerArray[correctAnswerArray.length - 2].correct && correctAnswerArray[correctAnswerArray.length - 3].correct) {
        for (let i = 1; i <= 3; i++) {
            correctAnswerArray[correctAnswerArray.length - i].level === 1 ?
                calculateScore(10) : calculateScore(20);
        }
        //to break the array of correct answers
        correctAnswerArray.push({
            level: 0,
            correct: false
        });
    }
}

function nextLevel() {
    if (level.value === 1) {
        console.log('NEXT LEVEL');
        resetNewLevel();
    } else {
        store.setGameIsOver();
        setTimeout(() => {
            router.push({
                name: 'game-over',
                query: {
                    score: score + 200,
                    status: 'W I N !!!!!!!!'
                }
            });
        }, 3000);
    }
}

function reset() {
    setTimeout(() => {
        emotion = 'normal';
        indexOfQuestion += 1;
        restartTimer = !restartTimer;
        stopTimer = false;
        answerCorrect = '';
        blocking = false;
    }, 3000);
}

function resetNewLevel() {
    setTimeout(() => {
        emotion = 'normal';
        showTimeIsUp = false;
        showQuestions = true;
        indexOfQuestion = 0;
        restartTimer = !restartTimer;
        stopTimer = false;
        answerCorrect = '';
        blocking = false;
        seconds = 15;
        level.value = 2;
    }, 3000);
}

function timeIsUp() {
    emotion = 'angry';
    showTimeIsUp = true;
    numOfLives -= 1;
    showQuestions = false;
    if (numOfLives === 0) {
        store.setGameIsOver();
        setTimeout(() => {
            router.push({
                name: 'game-over',
                query: {
                    score: score,
                    status: 'L O S T'
                }
            });
        }, 3000);
        return;
    } else if (indexOfQuestion === 4) {
        nextLevel();
        return;
    }
    setTimeout(() => {
        emotion = 'normal';
        indexOfQuestion += 1;
        restartTimer = !restartTimer;
        showQuestions = true;
        showTimeIsUp = false;
    }, 3000);
}

function calculateScore(value) {
    score += value;
}

onMounted(() => {
    createAllQuestions(level.value);
    console.log('GAME OVER:', store.isGameOver);
});
watch(allQuestions, () => {
    while (questions.length !== 5) {
        let random = Math.floor(Math.random() * allQuestions.value.length);
        if (!questions.includes(allQuestions.value[random])) {
            questions.push(allQuestions.value[random]);
        }
    }
    questions.sort((a, b) => a.qst_id - b.qst_id);
    console.log('QUESTIONS: ', questions);
    createAnswers();
});
watch(level, () => {
    indexOfQuestion = 0;
    questions = [];
    answers = [];
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
            <Timer :restart="restartTimer"
                   :seconds="seconds"
                   :stop="stopTimer"
                   @time-is-up="timeIsUp"></Timer>
            <Harts :numOfLives="numOfLives"></Harts>
        </section>
        <p v-show="showTimeIsUp">Your time is up, one life lost!
        </p>
        <section v-if="questions.length && showQuestions>0" id="questions">
            <article>
                <p>{{ questions[indexOfQuestion].question }}</p>
            </article>
            <section v-if="blocking" id="blocking"></section>
            <transition-group v-if="answers.length>0" name="questions" tag="ol">
                <li v-for="answer in answers[indexOfQuestion]"
                    :key="answer.ans_id"
                    :class="['answers',{wrong:answerWrong===answer.ans_id,correct:answerCorrect===answer.ans_true}]"
                    @click="pickedAnswer(answer.ans_true, answer.ans_id)">
                    {{ answer.ans_text }}
                </li>
            </transition-group>
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
</style>

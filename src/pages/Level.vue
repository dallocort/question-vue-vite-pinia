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

<script>
import Emotions from "@/components/Emotions.vue";
import axios from "axios";
import {mapActions, mapGetters} from 'vuex';
import Harts from "../components/Harts.vue";
import Timer from "../components/Timer.vue";

export default {
    name: "Level",
    components: {
        Emotions,
        Timer,
        Harts
    },
    data() {
        return {
            level: 1,
            error: '',
            indexOfQuestion: 0,
            allQuestions: [],
            questions: [],
            answers: [],
            restartTimer: false,
            stopTimer: false,
            showTimeIsUp: false,
            user: sessionStorage.getItem('username'),
            score: 0,
            numOfLives: 3,
            showQuestions: true,
            answerWrong: '',
            answerCorrect: '',
            blocking: false,
            seconds: 20,
            correctAnswerArray: [],
            emotion: 'normal',
            questionsFetched: false
        };
    },
    methods: {
        ...mapActions(['setGameIsOver']),
        createAllQuestions(level) {
            const request = axios.get(
                `http://739k121.mars-e1.mars-hosting.com/dm_quiz/questions?sid=${sessionStorage.getItem(
                    'sid')}&level=${level}`);
            request.then(response => {
                if (response.data.status === 'E') {
                    throw new Error(response.data.message);
                } else if (response.data.status === 'S') {
                    this.allQuestions = response.data.data;
                }
            }).catch(message => this.error = message);
        },
        createAnswers() {
            const helperArray = [];
            this.questions.forEach(el => {
                helperArray.push(axios.get(
                    `http://739k121.mars-e1.mars-hosting.com/dm_quiz/answers?sid=${sessionStorage.getItem(
                        'sid')}&qst_id=${el.qst_id}`));
            });
            Promise.all(helperArray)
            .then(response => {
                response.forEach(obj => {
                    this.answers.push(obj.data.data);
                });
                this.answers.sort((a, b) => a[0].qst_id - b[0].qst_id);
                this.answers.forEach((el) => {
                    el.sort(() => .5 - Math.random());
                });
                console.log('ANSWERS: ', this.answers);
                this.questionsFetched = true;
            })
            .catch(message => this.error = message);
        },
        pickedAnswer(ans_true, ans_id) {
            this.stopTimer = true;
            this.blocking = true;
            this.correctAnswerArray.push({
                level: this.questions[this.indexOfQuestion].qst_level,
                correct: ans_true === 1
            });
            if (ans_true === 1) {
                this.answerCorrect = 1;
                this.emotion = 'happy';
                if (this.level === 1) {
                    this.calculateScore(10);
                } else {
                    this.calculateScore(20);
                }
                if (this.correctAnswerArray.length >= 3) {
                    this.addBonus();
                }
                if (this.indexOfQuestion === 4) {
                    this.nextLevel();
                    return;
                }
                this.reset();
            } else {
                this.emotion = 'angry';
                this.answerWrong = ans_id;
                this.numOfLives -= 1;
                if (this.numOfLives === 0) {
                    this.setGameIsOver();
                    setTimeout(() => {
                        this.$router.push({
                            name: 'game-over',
                            query: {
                                score: this.score,
                                status: 'LOST'
                            }
                        });
                    }, 3000);
                    return;
                }
                if (this.indexOfQuestion === 4) {
                    this.nextLevel();
                    return;
                }
                setTimeout(() => {
                    this.emotion = 'normal';
                    this.indexOfQuestion += 1;
                    this.restartTimer = !this.restartTimer;
                    this.showQuestions = true;
                    this.showTimeIsUp = false;
                    this.stopTimer = false;
                    this.answerWrong = '';
                    this.blocking = false;
                }, 3000);
            }
        },
        addBonus() {
            if (this.correctAnswerArray[this.correctAnswerArray.length - 1].correct && this.correctAnswerArray[this.correctAnswerArray.length - 2].correct && this.correctAnswerArray[this.correctAnswerArray.length - 3].correct) {
                for (let i = 1; i <= 3; i++) {
                    this.correctAnswerArray[this.correctAnswerArray.length - i].level === 1 ?
                        this.calculateScore(10) : this.calculateScore(20);
                }
                //to break the array of correct answers
                this.correctAnswerArray.push({
                    level: 0,
                    correct: false
                });
            }
        },
        nextLevel() {
            if (this.level === 1) {
                console.log('NEXT LEVEL');
                this.resetNewLevel();
            } else {
                this.setGameIsOver();
                setTimeout(() => {
                    this.$router.push({
                        name: 'game-over',
                        query: {
                            score: this.score + 200,
                            status: 'W I N !!!!!!!!'
                        }
                    });
                }, 3000);
            }
        },
        reset() {
            setTimeout(() => {
                this.emotion = 'normal';
                this.indexOfQuestion += 1;
                this.restartTimer = !this.restartTimer;
                this.stopTimer = false;
                this.answerCorrect = '';
                this.blocking = false;
            }, 3000);
        },
        resetNewLevel() {
            setTimeout(() => {
                this.emotion = 'normal';
                this.showTimeIsUp = false;
                this.showQuestions = true;
                this.indexOfQuestion = 0;
                this.restartTimer = !this.restartTimer;
                this.stopTimer = false;
                this.answerCorrect = '';
                this.blocking = false;
                this.seconds = 15;
                this.level = 2;
            }, 3000);
        },
        timeIsUp() {
            this.emotion = 'angry';
            this.showTimeIsUp = true;
            this.numOfLives -= 1;
            this.showQuestions = false;
            if (this.numOfLives === 0) {
                this.setGameIsOver();
                setTimeout(() => {
                    this.$router.push({
                        name: 'game-over',
                        query: {
                            score: this.score,
                            status: 'L O S T'
                        }
                    });
                }, 3000);
                return;
            } else if (this.indexOfQuestion === 4) {
                this.nextLevel();
                return;
            }
            setTimeout(() => {
                this.emotion = 'normal';
                this.indexOfQuestion += 1;
                this.restartTimer = !this.restartTimer;
                this.showQuestions = true;
                this.showTimeIsUp = false;
            }, 3000);
        },
        calculateScore(value) {
            this.score += value;
        }
    },
    computed: {
        ...mapGetters(['isGameOver'])
    },
    mounted() {
        this.createAllQuestions(this.level);
        console.log('GAME OVER:', this.isGameOver);
    },
    watch: {
        allQuestions() {
            while (this.questions.length !== 5) {
                let random = Math.floor(
                    Math.random() * this.allQuestions.length);
                if (!this.questions.includes(this.allQuestions[random])) {
                    this.questions.push(this.allQuestions[random]);
                }
            }
            this.questions.sort((a, b) => a.qst_id - b.qst_id);
            console.log('QUESTIONS: ', this.questions);
            this.createAnswers();
        },
        level() {
            this.indexOfQuestion = 0;
            this.questions = [];
            this.answers = [];
            this.createAllQuestions(this.level);
        }
    }
};
</script>

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

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

<script>
import axios from "axios";

export default {
    name: "NewQuestion",
    data() {
        return {
            question: '',
            correctAnswer: '',
            answer2: '',
            answer3: '',
            answer4: '',
            qst_level: '1',
            info: '',
            buttonDisabled: false
        };
    },
    methods: {
        addQuestion() {
            this.buttonDisabled = true;
            if (this.question !== '' && this.correctAnswer !== '' && this.answer2 !== '' && this.answer3 !== '' && this.answer4 !== '' && (this.qst_level === 1 || this.qst_level === 2 || this.qst_level === '2' || this.qst_level === '1')) {
                const request = axios.post(
                    'http://739k121.mars-e1.mars-hosting.com/inkvizicija/unosPitanja.js',
                    {
                        odgovor2: this.answer2,
                        odgovor3: this.answer3,
                        odgovor4: this.answer4,
                        qst_level: Number(this.qst_level),
                        question: this.question,
                        tacanOdgovor: this.correctAnswer
                    });
                request.then(response => {
                    if (response.status !== 200) {
                        throw new Error(response.data.message);
                    } else {
                        this.info = 'Question added successfully!!';
                        this.reset();
                        this.buttonDisabled = false;
                    }
                })
                .catch(message => {
                    this.buttonDisabled = false;
                    this.info = message;
                });
            } else {
                this.buttonDisabled = false;
                this.info = 'error, enter data correctly';
                setTimeout(() => this.info = '', 3000);
            }
        },
        reset() {
            this.answer2 = '';
            this.answer3 = '';
            this.answer4 = '';
            this.qst_level = '1';
            this.question = '';
            this.correctAnswer = '';
            setTimeout(() => this.info = '', 3000);
        }
    },
    beforeRouteLeave() {
        this.buttonDisabled = false;
    }
};
</script>

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

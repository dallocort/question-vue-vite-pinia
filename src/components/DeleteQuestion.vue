<script setup>
import axios from "axios";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useStore} from "../store/store.js";

const store = useStore();
let questions = ref([]);
let info = ref('');
let searchText = ref('');
let showQuestions = ref(false);

function createAllQuestions() {
    questions.value = [];
    showQuestions.value = false;
    const request = axios.get(`https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions?limit=100`);
    request.then(response => {
        if (response.data?.errors) {
            throw new Error(response.data.errors.detail);
        } else {
            response.data.data.forEach(el => {
                el.attributes.uid = el.uid;
                questions.value.push(el.attributes);
            });
            console.log(questions);
            showQuestions.value = true;
        }
    }).catch(message => info.value = message);
}

function deleteQuestion(id, uid) {
    let decision = confirm('Are you sure you want to delete?');
    if (decision) {
        console.log(arguments);
        console.log('filtered', filteredQuestions.value);
        //locate uid for all answers
        let helperResponse;
        const answers = [];
        helperResponse = axios.get(
            `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers?where=[{"attribute":"qst_id","operator":"=","value":${id}}]`);
        helperResponse.then(res => {
            res.data.data.forEach(el => answers.push(el.uid));
            store.deleteQuestion(uid, answers[0], answers[1], answers[2], answers[3]).then(() => {
                info.value = 'Question deleted successfully!!';
                setTimeout(() => info.value = '', 3000);
                createAllQuestions();
            }).catch(message => info.value = message);
        }).catch(message => info.value = message);
    }
}

const filteredQuestions = computed(() => {
    // to respond only on the second character >2
    if (searchText.value.length >= 1) {
        return questions.value.filter(qst => qst.question.toLowerCase().includes(searchText.value.toLowerCase()));
    } else {
        return questions.value;
    }
});
onMounted(() => {
    createAllQuestions();
});
watch(searchText, () => {
    //why nextTick? When computed property "filteredQuestions" changes, we need to wait for DOM updates, then run WATCH! Because this watch catching DOM elements present on the page.
    nextTick(() => {
        let paragraphs = document.getElementById("listOfQuestions")?.childNodes;
        if (paragraphs) {
            let re1 = /<mark>/g;
            let re2 = /<\/mark>/g;
            paragraphs?.forEach((p) => {
                p.innerHTML = p?.innerHTML?.replace(re1, '');
                p.innerHTML = p?.innerHTML?.replace(re2, '');
            });
            if (searchText.value !== "") {
                let re = new RegExp(searchText.value, "gi");
                paragraphs.forEach((p) => {
                    p.innerHTML = p?.innerHTML?.replace(re, (match) => `<mark>${match}</mark>`);
                });
            }
        }
    });
});
</script>

<template>
    <section v-if="showQuestions" id="deleteQuestion">
        <label for="one">SEARCH:</label>
        <input id="one" v-model="searchText" v-focus
               placeholder="search questions"/>
        <button @click="createAllQuestions">REFRESH</button>
        <article v-if="filteredQuestions.length" id="listOfQuestions">
            <p v-for="(question,index) in filteredQuestions" :key="question.qst_id"
               @click="deleteQuestion(question.qst_id,question.uid)">
                {{ index + 1 }}. {{ question.question }}
            </p>
        </article>
        <p v-if="info" class="info">{{ info }}</p>
    </section>
    <section v-else>
        <p>Loading questions...</p>
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

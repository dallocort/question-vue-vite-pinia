<script setup>
import axios from "axios";
import {computed, nextTick, onActivated, ref, watch} from "vue";
import {useStore} from "../store/store.js";
import Button from "./Button.vue";

const store = useStore();
let questions = ref([]);
let info = ref('');
let searchText = ref('');
let showQuestions = ref(false);
let buttonRestoreDisabled = ref(false);
let showBlockade = ref(false);

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
            showQuestions.value = true;
        }
    }).catch(message => info.value = message);
}

async function restoreAllQuestions() {
    let decision = confirm(
        "You are about to recreate all base questions. It will delete all current questions, and create 22 basic ones with 44 answers. It will take about 3min to complete. Are you sure you want to proceed?");
    if (decision) {
        buttonRestoreDisabled.value = true;
        showQuestions.value = false;
        await deleteAllQuestions();
        await store.addQuestion('Inkvizicija je napokon ugasena, koje godine?', '1834', '1795', '1852', '1890', 2);
        await store.addQuestion('Okosnicu inkvizicije činili su oduvek...', 'Dominikanci', 'Masoni', 'Biskupi', 'Templari', 1);
        await store.addQuestion('Inkvizicija (lat. inquisitio) u prevodu znaci:', 'Isledjivanje', 'Proterivanje', 'Širenje',
            'Proveravanje', 1);
        await store.addQuestion('Ideju o heliocentričnom sistemu sveta podržavao je u IV veku i jedan car. Koji?',
            'Julijan Otpadnik', 'Tiberije', 'Marko Aurelije', 'Domicijan', 2);
        await store.addQuestion('Koje nacionalnosti je bio Nikola Kopernik?', 'Poljak', 'Slovenac', 'Grk', 'Madjar', 1);
        await store.addQuestion('Početak rada inkvizicije vezuje se za ličnost pape ...', 'Grgura IX', 'Siksta III', 'Jovana I',
            'Benedikta III', 1);
        await store.addQuestion('Koliko bajt ima bita?', '8', '6', '4', '2', 1);
        await store.addQuestion('Koje godine je spaljen Djordano Bruno?', '1600', '1610', '1575', '1590', 2);
        await store.addQuestion(
            'Sto godina nakon Galilejeve smrti, telo mu je prebaceno u porodicnu grobnicu, a nesto njegovo je danas izlozeno u muzeju u Firenci. Sta?',
            'Srednji prst', 'Pramen kose', 'Globus', 'Teleskop', 2);
        await store.addQuestion('U Galileovu cast, nazvan je i jedan asteroid. Koji?', 'Galileo 697', 'Galileo 987',
            'Galileo 178', 'Galileo 353', 1);
        await store.addQuestion(
            '359 godina nakon procesa protiv Galileja, papa Jovan Pavle II zatražio je oprost i ukinuo presudu inkvizicije protiv Galileja. Kada se to desilo?',
            '1992', '1878', '1678', '1912', 2);
        await store.addQuestion(
            'Galileo Galilej je jos jedan Kopernikov sledbenik koga je progonila Rimska inkvizicija. On je ...',
            'Odustao od tog ucenja', 'Uspeo da pobegne', 'Preminuo u tamnici', 'Spaljen na lomaci', 1);
        await store.addQuestion('Galileo je pred kraj svog zivota 1638.', 'Potpuno oslepeo', 'Ostao nepokretan', 'Ogluveo',
            'Izgubio moc govora', 2);
        await store.addQuestion('Prvi general inkvizicije bio je:', 'Torkemada', 'Riconi', 'Domeniko', 'Alfredo', 2);
        await store.addQuestion('Model nebeskih sfera (njih 27) prvi je postavio veliki matematicar ...', 'Eudoks', 'Arhimed',
            'Dekart', 'Aristotel', 2);
        await store.addQuestion(
            'U kom veku su crkva i inkvizicija dobile timove savetnika, učenih ljudi, teologa i pravnika, koji su pomagali kardinalima, te raskrinkavali lažne doktrine i čuvali integritet vere',
            'XVI', 'XIV', 'XIII', 'XV', 1);
        await store.addQuestion('Posebnu pažnju inkvizicije privukla je južna Francuska sa pokretom jeretika katara odnosno...',
            'Albižana', 'Judaista', 'Muslimana', 'Jevreja', 2);
        await store.addQuestion(
            "'Planete opisuju oko Sunca eliptične putanje. U zajedničkoj žiži tih putanja nalazi se Sunce\' je ...",
            'Prvi Keplerov zakon', 'Njutnova Geo-teza', 'Galileova Helio-teza', 'Prvi Ptolomejev zakon', 1);
        await store.addQuestion("Španska inkvizicija zapocela je ...", '1478', '1460', '1382', '1502', 1);
        await store.addQuestion("Gde se prvenstveno pojavila inkvizicija?", 'u Francuskoj', 'u Spaniji', 'u Italiji',
            'u Engleskoj', 1);
        await store.addQuestion("Koliko gigabajt ima megabajta?", '1.000', '100', '10', '10.000', 1);
        await store.addQuestion("Knjiga Nikole Kopernika „O kretanju nebeskih sfera“ objavljena je 1543. U kom gradu?",
            'Nirnbergu', 'Atini', 'Parizu', 'Londonu', 1);
        createAllQuestions();
        buttonRestoreDisabled.value = false;
    }
}

async function deleteAllQuestions() {
    const allQuestionsUID = [];
    const allQuestionsID = [];
    const first100Questions = await axios.get(//if no limit, it retrieves only 15 questions
        "https://dacha-questions.api.deskree.com/api/v1/rest/collections/questions?limit=100");
    first100Questions.data.data.forEach(el => allQuestionsUID.push(el.uid));
    first100Questions.data.data.forEach(el => allQuestionsID.push(el.attributes.qst_id));
    for (let i = 0; i < allQuestionsUID.length; i++) {
        deleteQuestion(allQuestionsID[i], allQuestionsUID[i], false);
    }
}

function deleteQuestion(id, uid, askConfirm = true) {
    let decision = true;
    if (askConfirm) {
        decision = confirm('Are you sure you want to delete?');
        showBlockade.value = true;
    }
    if (decision) {
        //locate uid for all answers
        let helperResponse;
        const answers = [];
        helperResponse = axios.get(
            `https://dacha-questions.api.deskree.com/api/v1/rest/collections/answers?where=[{"attribute":"qst_id","operator":"=","value":${id}}]`);
        helperResponse.then(res => {
            res.data.data.forEach(el => answers.push(el.uid));
            store.deleteQuestion(uid, answers[0], answers[1], answers[2], answers[3]).then(() => {
                info.value = `Question id[${id}] deleted successfully!!`;
                console.log(`Question id[${id}] deleted successfully!!`);
                setTimeout(() => info.value = '', 7000);
                if (askConfirm) {
                    createAllQuestions();
                }
                showBlockade.value = false;
            }).catch(message => info.value = message);
        }).catch(message => info.value = message);
    } else {
        showBlockade.value = false;
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
//onMounted run at first mount just like onActivated, resulting question array
//gets double arguments, because both hooks runs at the same time, and array is
//getting data from onMounted and from onActivated
//onMounted(() => {
//    console.log('on mounted');
//    createAllQuestions();
//});
onActivated(() => {
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
                //to avoid invalid characters in your expression you should escape it (like ?) make \\?
                let re = new RegExp(searchText.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "gi");
                paragraphs.forEach((p) => {
                    p.innerHTML = p?.textContent?.slice(0, 12) + p?.textContent?.slice(12)
                    ?.replace(re, (match) => `<mark>${match}</mark>`);
                });
            }
        }
    });
});
</script>

<template>
    <section v-if="showQuestions && questions.length>=1" id="deleteQuestion">
        <div v-if="showBlockade" id="blockade">
            <p>Please wait...</p>
            <div class="loader"></div>
        </div>
        <label for="one">SEARCH:</label>
        <div id="x">
            <input id="one" v-model="searchText" v-focus
                   placeholder="search questions"/>
            <button v-if="searchText" id="delete" @click="searchText=''">❌</button>
        </div>

        <button @click="createAllQuestions">REFRESH QUESTIONS</button>
        <article v-if="filteredQuestions.length" id="listOfQuestions">
            <template v-for="(question,index) in filteredQuestions" :key="question.qst_id">
                <p v-if="question.qst_level===1"
                   @click="deleteQuestion(question.qst_id,question.uid)">
                    {{ index + 1 }}. LEVEL: {{ question.qst_level }}&nbsp;&nbsp; {{ question.question }}
                </p>
            </template>
            <template v-for="(question,index) in filteredQuestions" :key="question.qst_id">
                <p v-if="question.qst_level===2"
                   @click="deleteQuestion(question.qst_id,question.uid)">
                    {{ index + 1 }}. LEVEL: {{ question.qst_level }}&nbsp;&nbsp; {{ question.question }}
                </p>
            </template>

        </article>
        <p v-if="info" class="info">{{ info }}</p>
    </section>

    <section v-if="!showQuestions">
        <p>Loading questions...</p>
    </section>
    <Button :disabled="buttonRestoreDisabled"
            btn-text="RESTORE QUESTIONS"
            span-text="12px"
            style="scale:.9"
            @click="restoreAllQuestions"></Button>
</template>

<style scoped>
#deleteQuestion {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    position: relative;
}

#delete {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 0;
    right: -9px;
    cursor: pointer;
}

#x {
    position: relative;
}

.info {
    color: #91ff19;
    margin: 0;
    text-align: center;
}

#listOfQuestions {
    overflow: auto;
    height: 55vh;
    margin-top: 10px;
    border-top: 1px solid #bab9b9;
    border-bottom: 1px solid #bab9b9;
    position: relative;
}

label {
    font-size: 13px;
}

input {
    height: 25px;
}

article p {
    text-align: left;
    font-size: .8em;
    color: white;
    padding: 0 10px 0 40px;
    cursor: pointer;
    text-indent: -20px;
    position: relative;
}

article p:hover {
    color: darkred;
}

article p:hover::before {
    content: '❌';
    position: absolute;
    left: 18px;
    color: red;
    top: -2px;
}

button {
    margin: 5px;
    border-radius: 5px;
    border-color: transparent;
}

#blockade {
    position: absolute;
    width: 492px;
    top: 0;
    height: 588px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(2px);
    z-index: 10;
}

#blockade p {
    margin-top: 200px;
    font-size: 22px;
    color: #ff9900;
}

.loader {
    border: 10px solid #f3f3f3;
    border-radius: 50%;
    border-top: 10px solid #3498db;
    width: 29px;
    height: 29px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
    position: relative;
    top: 0;
    left: 45%;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

</style>

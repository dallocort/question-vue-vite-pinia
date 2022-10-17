<script setup>
import axios from "axios";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useStore} from "../store/store.js";
import Button from "./Button.vue";

const store = useStore();
let questions = ref([]);
let info = ref('');
let searchText = ref('');
let showQuestions = ref(false);
let buttonRestoreDisabled = ref(false);

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

async function restoreAllQuestions() {
    buttonRestoreDisabled.value = true;
    await store.addQuestion('Inkvizicija je napokon ugasena, koje godine?', '1834', '1795', '1852', '1890', 2);
    await store.addQuestion('Okosnicu inkvizicije činili su oduvek...', 'Dominikanci', 'Masoni', 'Biskupi', 'Templari', 1);
    await store.addQuestion('Inkvizicija (lat. inquisitio) u prevodu znaci:', 'Isledjivanje', 'Proterivanje', 'Širenje',
        'Proveravanje', 1);
    await store.addQuestion('Ideju o heliocentričnom sistemu sveta podržavao je u IV veku i jedan car. Koji?', 'Julijan Otpadnik',
        'Tiberije', 'Marko Aurelije', 'Domicijan', 2);
    await store.addQuestion('Koje nacionalnosti je bio Nikola Kopernik?', 'Poljak', 'Slovenac', 'Grk', 'Madjar', 1);
    await store.addQuestion('Početak rada inkvizicije vezuje se za ličnost pape ...', 'Grgura IX', 'Siksta III', 'Jovana I',
        'Benedikta III', 1);
    await store.addQuestion('Koliko bajt ima bita?', '8', '6', '4', '2', 1);
    await store.addQuestion('Koje godine je spaljen Djordano Bruno?', '1600', '1610', '1575', '1590', 2);
    await store.addQuestion(
        'Sto godina nakon Galilejeve smrti, telo mu je prebaceno u porodicnu grobnicu, a nesto njegovo je danas izlozeno u muzeju u Firenci. Sta?',
        'Srednji prst', 'Pramen kose', 'Globus', 'Teleskop', 2);
    await store.addQuestion('U Galileovu cast, nazvan je i jedan asteroid. Koji?', 'Galileo 697', 'Galileo 987', 'Galileo 178',
        'Galileo 353', 1);
    await store.addQuestion(
        '359 godina nakon procesa protiv Galileja, papa Jovan Pavle II zatražio je oprost i ukinuo presudu inkvizicije protiv Galileja. Kada se to desilo?',
        '1992', '1878', '1678', '1912', 2);
    await store.addQuestion('Galileo Galilej je jos jedan Kopernikov sledbenik koga je progonila Rimska inkvizicija. On je ...',
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
    await store.addQuestion("Gde se prvenstveno pojavila inkvizicija?", 'u Francuskoj', 'u Spaniji', 'u Italiji', 'u Engleskoj',
        1);
    await store.addQuestion("Koliko gigabajt ima megabajta?", '1.000', '100', '10', '10.000', 1);
    await store.addQuestion("Knjiga Nikole Kopernika „O kretanju nebeskih sfera“ objavljena je 1543. U kom gradu?", 'Nirnbergu',
        'Atini', 'Parizu', 'Londonu', 1);
    createAllQuestions();
    buttonRestoreDisabled.value = false;
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
                setTimeout(() => info.value = '', 7000);
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
                //to avoid invalid characters in your expression you should escape it (like ?) make \\?
                let re = new RegExp(searchText.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "gi");
                paragraphs.forEach((p) => {
                    p.innerHTML = p?.textContent?.slice(0, 12) + p?.textContent?.slice(12)
                    ?.replace(re, (match) => `<mark>${match}</mark>`);
                    console.log(p);
                });
            }
        }
    });
});
</script>

<template>
    <section v-if="showQuestions && questions.length>=1" id="deleteQuestion">
        <label for="one">SEARCH:</label>
        <input id="one" v-model="searchText" v-focus
               placeholder="search questions"/>
        <button v-if="searchText" id="delete" @click="searchText=''">❌</button>
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
    /* margin: 10px 0 20px; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}

#delete {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 87px;
    left: 210px;
    cursor: pointer;
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
    width: 71px;
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
</style>

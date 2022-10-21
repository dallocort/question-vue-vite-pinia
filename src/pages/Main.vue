<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import Button from "../components/Button.vue";
import {useStore} from "../store/store.js";

const store = useStore();
const router = useRouter();
let user = sessionStorage.getItem('username');
let highScores = ref('');
let error = ref('');

// todo add score
function exitGame() {
    sessionStorage.clear();
    store.clearStore();
    router.push({name: 'welcome'});
}

function goToLevel() {
    router.push({name: 'level'});
}

function adminPage() {
    router.push({name: 'admin'});
}

onMounted(() => {
    //todo score database
    //const request = axios.get(`http://739k121.mars-e1.mars-hosting.com/dm_quiz/highScores?sid=${sessionStorage.getItem('sid')}`);
    //request.then(response => {
    //    if (response?.data?.status === 'E') {
    //        throw new Error(response.data.message);
    //    } else if (response?.data?.status === 'S') {
    //        highScores.value = response.data.data.sort((a, b) => b.usr_points - a.usr_points);
    //    }
    //}).catch(message => error.value = message);
});
</script>

<template>
    <section id="main">
        <h1>Welcome {{ user }} </h1>
        <Button btnText="NEW GAME" @click="goToLevel"></Button>
        <Button btnText="EXIT GAME" @click="exitGame"></Button>
        <Button btnText="ADMIN" @click="adminPage"></Button>
        <p v-if="error" style="color:red">{{ error }}</p>
        <section v-if="highScores" id="highScores">
            <p style="font-weight: bold;">NAME</p>
            <p style="font-weight: bold;">POINTS</p>
            <p style="font-weight: bold;">GOLD</p>
            <template v-for="score in highScores" :key="score.usr_name">
                <p :class="{mark:user===score.usr_name}">
                    {{ score.usr_name }}
                </p>
                <p :class="{mark:user===score.usr_name}">
                    {{ score.usr_points }}
                </p>
                <p :class="{mark:user===score.usr_name}">
                    {{ score.usr_gold }}
                </p>
            </template>
        </section>
        <p v-else>no highs-cores loaded...</p>
    </section>
</template>

<style scoped>
#main {
    max-width: 495px;
    height: auto;
    margin: 10vh auto 0;
    color: #d0eac7;
    padding: 1px 1px 30px;
    background: rgba(229, 241, 255, 0.2);
}

#main button {
    scale: 0.7;
}

#highScores p {
    margin: 0;
    padding: 0 5px 0;
    width: 30%;
    height: 32px;
    text-align: left;
    overflow: hidden;
}

#highScores {
    width: 95%;
    margin: 35px auto 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding-left: 60px;
}

.mark {
    font-weight: bold;
    color: #ff5c5c;
}
</style>

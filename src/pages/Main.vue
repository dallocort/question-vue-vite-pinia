<script setup>
import axios from "axios";
import {onMounted} from "vue";

let user = sessionStorage.getItem('username');
let highScores = '';
let error = '';

function exitGame() {
    sessionStorage.clear();
    this.setNotAdmin();
    this.$router.push({name: 'welcome'});
}

function goToLevel() {
    this.$router.push({name: 'level'});
}

function adminPage() {
    this.$router.push({name: 'admin'});
}

onMounted(() => {
    const request = axios.get(
        `http://739k121.mars-e1.mars-hosting.com/dm_quiz/highscores?sid=${sessionStorage.getItem(
            'sid')}`);
    request.then(response => {
        if (response.data.status === 'E') {
            throw new Error(response.data.message);
        } else if (response.data.status === 'S') {
            this.highScores = response.data.data.sort(
                (a, b) => b.usr_points - a.usr_points);
        }
    }).catch(message => this.error = message);
});
</script>

<template>
    <section id="main">
        <h1>Welcome {{ user }}! </h1>
        <button @click="goToLevel">
            NEW GAME
        </button>
        <button @click="exitGame">
            EXIT GAME
        </button>
        <button v-if="isAdmin" @click="adminPage">
            ADMIN
        </button>
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
    </section>
</template>

<style scoped>
#main {
    width: 495px;
    height: auto;
    margin: 10vh auto 0;
    color: #d0eac7;
    padding: 1px 1px 30px;
    background: rgba(229, 241, 255, 0.2);
}

#main button {
    margin: 5px 5px 0;
    width: 130px;
    height: 40px;
    font-size: 1.2em;
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

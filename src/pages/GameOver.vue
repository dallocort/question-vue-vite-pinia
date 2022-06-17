<script setup>
import axios from "axios";
import {onMounted} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import {useStore} from "../store/store.js";

const route = useRoute();
const router = useRouter();
const store = useStore();
let scoreUpdate = '';
let status = route.query.status;
let score = route.query.score;

function drag(e) {
    const doc = document.getElementById('modal');
    this.startElX = doc.offsetLeft;
    this.startElY = doc.offsetTop;
    this.startMouseX = e.clientX;
    this.startMouseY = e.clientY;
    doc.style.position = 'absolute';
    doc.style.margin = '0';
    doc.style.left = this.startElX + 'px';
    doc.style.top = this.startElY + 'px';
    this.moving = true;
}

function dragging(e) {
    const doc = document.getElementById('modal');
    if (this.moving) {
        let movedMouseX = this.startMouseX - e.clientX;
        let movedMouseY = this.startMouseY - e.clientY;
        doc.style.left = this.startElX - movedMouseX + "px";
        doc.style.top = this.startElY - movedMouseY + "px";
        this.startElX = doc.offsetLeft;
        this.startElY = doc.offsetTop;
        this.startMouseX = e.clientX;
        this.startMouseY = e.clientY;
    }
}

function drop() {
    this.moving = false;
}

function goToMain() {
    router.push({name: 'main'});
}

onMounted(() => {
    if (Number.isInteger(Number(route.query.score))) {
        const request = axios.put(
            'http://739k121.mars-e1.mars-hosting.com/dm_quiz/score', {
                sid: sessionStorage.getItem('sid'),
                score: Number(route.query.score)
            });
        request.then(response => {
            if (response.data.status === 'E') {
                throw new Error(response.data.message);
            } else if (response.data.status === 'S') {
                scoreUpdate = 'Score updated successfully!!';
            }
        })
        .catch(message => scoreUpdate = message + ' - Score not updated!!');
    }
    console.log('GAME OVER:', store.isGameOver);
});
onBeforeRouteLeave(() => {
    store.setGameNotOver();
    console.log('GAME OVER:', store.isGameOver);
});
</script>

<template>
    <div id="gameOver"
         @mouseleave="drop"
         @mousemove="dragging"
         @click.self="goToMain">
        <section id="modal"
                 @mousemove="dragging"
                 @mouseup="drop"
                 @mousedown.left="drag">
            <header> G A M E &nbsp;&nbsp;&nbsp; {{ status }}</header>
            <p>POINTS: {{ score }}</p>
            <p v-if="scoreUpdate">{{ scoreUpdate }}</p>
            <button @click="goToMain" @mousedown.stop>MAIN
                                                      MENU
            </button>
        </section>
    </div>
</template>

<style scoped>
#gameOver {
    overflow: hidden;
}

#modal {
    margin: 250px auto 100px;
    width: 300px;
    border: 1px solid #8f8f8f;
    padding: 1rem 1rem 1rem;
    color: white;
    background-color: #4c4545;
    cursor: grab;
}

#modal:active {
    cursor: grabbing;
}

#modal header {
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
}

#modal button {
    display: block;
    margin: 0 auto 0;
    height: 40px;
}

#gameOver {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);
}
</style>

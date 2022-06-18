<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import {useStore} from "../store/store.js";

const route = useRoute();
const router = useRouter();
const store = useStore();
let scoreUpdate = ref('');
let status = route.query.status;
let score = route.query.score;
let startElX = 0;
let startElY = 0;
let startMouseX = 0;
let startMouseY = 0;
let moving = false;

function drag(e) {
    const doc = window.document.getElementById('modal');
    startElX = doc.offsetLeft;
    startElY = doc.offsetTop;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    doc.style.position = 'absolute';
    doc.style.margin = '0';
    doc.style.left = startElX + 'px';
    doc.style.top = startElY + 'px';
    moving = true;
}

function dragging(e) {
    if (moving) {
        const doc = window.document.getElementById('modal');
        let movedMouseX = startMouseX - e.clientX;
        let movedMouseY = startMouseY - e.clientY;
        doc.style.left = startElX - movedMouseX + "px";
        doc.style.top = startElY - movedMouseY + "px";
        startElX = doc.offsetLeft;
        startElY = doc.offsetTop;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
    }
}

function drop() {
    moving = false;
}

function goToMain() {
    router.push({name: 'main'});
}

onMounted(() => {
    if (Number.isInteger(Number(route.query.score))) {
        if (+route.query.score !== 0) {
            const request = axios.put(
                'http://739k121.mars-e1.mars-hosting.com/dm_quiz/score', {
                    sid: sessionStorage.getItem('sid'),
                    score: Number(route.query.score)
                });
            request.then(response => {
                if (response.data.status === 'E') {
                    throw new Error(response.data.message);
                } else if (response.data.status === 'S') {
                    scoreUpdate.value = 'Score updated successfully!!';
                }
            })
            .catch(
                message => scoreUpdate.value = message + ' - Score not updated!!');
        }
    }
});
onBeforeRouteLeave(() => {
    store.setGameNotOver();
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
            <button @click="goToMain" @mousedown.stop>MAIN MENU
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

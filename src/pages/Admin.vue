<script setup>
import {shallowRef} from "vue";
import DeleteQuestion from '../components/DeleteQuestion.vue';
import NewQuestion from '../components/NewQuestion.vue';

const component = shallowRef(NewQuestion);
</script>

<template>
    <section id="admin">
        <button :disabled="component===NewQuestion"
                @click="component=NewQuestion">New Question
        </button>
        <button :disabled="component===DeleteQuestion"
                @click="component=DeleteQuestion">Delete Question
        </button>
        <keep-alive>
            <component :is="component"/>
        </keep-alive>
        <router-link :to="{name:'main'}">MAIN MENU</router-link>
    </section>
</template>

<style scoped>
#admin {
    width: 495px;
    margin: 10vh auto 50px;
    background: rgba(229, 241, 255, 0.2);
    padding: 1px 1px 1px;
    position: relative;
}

#admin a:last-child {
    display: block;
    position: absolute;
    top: 0;
    padding: 5px;
    text-decoration: none;
}

button {
    height: 27px;
    text-transform: uppercase;
    margin: 5px;
}
</style>

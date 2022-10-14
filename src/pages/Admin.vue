<script setup>
import {shallowRef} from "vue";
import Button from "../components/Button.vue";
import DeleteQuestion from '../components/DeleteQuestion.vue';
import NewQuestion from '../components/NewQuestion.vue';

const component = shallowRef(NewQuestion);
</script>

<template>
    <section id="admin">
        <Button :disabled="component===NewQuestion"
                btnText="NEW QUESTION" spanText="18px" @click="component=NewQuestion"></Button>
        <Button :disabled="component===DeleteQuestion"
                btnText="ALL QUESTIONS" spanText="18px" @click="component=DeleteQuestion"></Button>
        <keep-alive>
            <component :is="component"/>
        </keep-alive>
        <router-link :to="{name:'main'}">MAIN MENU</router-link>
    </section>
</template>

<style scoped>
#admin {
    width: 495px;
    margin: 4vh auto 4vh;
    background: rgba(229, 241, 255, 0.2);
    position: relative;
    padding: 22px 1px 1px;
}

#admin a:last-child {
    display: block;
    position: absolute;
    top: 0;
    padding: 5px;
    text-decoration: none;
}

button {
    scale: 0.7;
}

</style>

<script setup>
import {ref} from "vue";
import DeleteQuestion from '../components/DeleteQuestion.vue';
import NewQuestion from '../components/NewQuestion.vue';
//todo why this is not working with: <component :is="component"></component>
//todo main menu doesn't work also
let component = ref('NewQuestion');
</script>

<template>
    <section id="admin">
        <button :disabled="component==='NewQuestion'"
                @click="component='NewQuestion'">New Question
        </button>
        <button :disabled="component==='DeleteQuestion'"
                @click="component='DeleteQuestion'">Delete Question
        </button>
        <NewQuestion v-if="component==='NewQuestion'"></NewQuestion>
        <DeleteQuestion v-else></DeleteQuestion>
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

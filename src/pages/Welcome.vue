<script setup>
import {useRouter} from 'vue-router';
import Button from "../components/Button.vue";

const router = useRouter();

function enter() {
    router.push('/choice');
}
</script>

<template>
    <section id="welcome">
        <h1>Welcome to the QUESTION GAME</h1>
        <Button btn-text="ENTER" @click="enter"/>
    </section>
</template>

<style scoped>
#welcome {
    margin-top: 40vh;
}

h1 {
    color: #ff9900;
}

</style>

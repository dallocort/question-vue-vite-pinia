<script setup>
import {useRouter} from 'vue-router';

const router = useRouter();

function enter() {
    router.push('/choice');
}
</script>

<template>
    <section id="welcome">
        <h1>Welcome to The Question Game</h1>
        <button @click="enter">ENTER</button>
    </section>
</template>


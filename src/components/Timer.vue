<script setup>
import {defineEmits, defineProps, onMounted, watch} from "vue";

const emits = defineEmits(['time-is-up']);
const props = defineProps({
    seconds: {
        type: Number,
        default: 20
    },
    restart: {
        type: Boolean
    },
    stop: {
        type: Boolean
    }
});
let currentTime = props.seconds;
let interval = '';

function count() {
    this.interval = setInterval(() => this.currentTime -= 1, 1000);
}

//todo can it be like this, currentTime is primitive?
watch(() => currentTime, (newValue) => {
    if (newValue <= 0) {
        clearInterval(interval);
        interval = '';
        emits('time-is-up', this);//todo šta je this
    }
});
watch(() => props.restart, () => {
    this.currentTime = props.seconds;
    if (!this.interval) {
        this.count();
    }
});
watch(() => props.stop, (newValue) => {
    if (newValue) {
        clearInterval(interval);
        interval = '';
    }
});
onMounted(() => {
    count();
});
</script>

<template>
    <section id="timer">
        <p>TIME: {{ currentTime }}</p>
    </section>
</template>

<style scoped>

</style>

<script setup>
import {onMounted, ref, watch} from "vue";

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
let currentTime = ref(props.seconds);
let interval = null;

function count() {
    interval = setInterval(() => currentTime.value -= 1, 1000);
}

watch(currentTime, (newValue) => {
    if (newValue <= 0) {
        clearInterval(interval);
        interval = null;
        emits('time-is-up', this);//todo šta je this
    }
});
watch(() => props.restart, () => {
    currentTime.value = props.seconds;
    if (!interval) {
        count();
    }
});
watch(() => props.stop, (newValue) => {
    if (newValue) {
        clearInterval(interval);
        interval = null;
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

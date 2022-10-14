<script setup>
import {computed} from "vue";
import {useRoute} from 'vue-router';

const route = useRoute();
defineProps({
    btnText: {
        type: String,
        required: true
    },
    spanText: {
        type: String,
        default: '22px'
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
const routeBtn = computed(() => route.name);
</script>

<template>
    <button :class="{visibleBtn:routeBtn==='admin'&&disabled}" :disabled="disabled" class="my-button" v-bind="$attrs">
        <svg height="60" width="320" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-gradient" x1="50%" x2="75%" y1="0%" y2="100%">

                    <stop offset="0%" stop-color="#F79533">
                        <animate attributeName="stop-color"
                                 dur="4s"
                                 repeatCount="indefinite"
                                 values="#F79533; #F37055; #EF4E7B; #A166AB; #5073B8; #1098AD; #07B39B; #6DBA82; #F79533"></animate>
                    </stop>

                    <stop offset="100%" stop-color="#F79533">
                        <animate attributeName="stop-color"
                                 dur="4s"
                                 repeatCount="indefinite"
                                 values="#F37055; #EF4E7B; #A166AB; #5073B8; #1098AD; #07B39B; #6DBA82; #F79533; #F37055"></animate>
                    </stop>

                </linearGradient>
            </defs>
            <rect class="btn" height="60" rx="30" ry="30" width="220"/>
        </svg>
        <span class="btn-text">{{ disabled ? "please wait..." : btnText }}</span>
    </button>
</template>

<style scoped>

.my-button {
    height: 60px;
    position: relative;
    width: 220px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    border-radius: 28px;
    overflow: hidden;
}

.btn {
    fill: transparent;
    stroke-width: 5px;
    stroke: url('#logo-gradient');
}

.btn-text {
    font-family: 'Poppins', sans-serif;
    font-size: v-bind('spanText');
    letter-spacing: 3px;
    font-weight: 600;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: linear-gradient(45deg, red, yellow);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.visibleBtn {
    visibility: hidden;
}
</style>

<script setup>
import {onMounted, ref} from "vue";

defineProps({
    emotion: {
        type: String,
        default: 'normal'
    }
});
const blink = ref(false);
onMounted(() => setInterval(() => blink.value = !blink.value, 3000));
</script>

<template>
    <section :class="[emotion, {blink:blink}]">
        <div class="smiley">
            <div class="eyes">
                <div class="eye"></div>
                <div class="eye"></div>
            </div>
            <div class="mouth"></div>
        </div>
    </section>
</template>

<style scoped>
body, html {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    font-family: 'Open Sans', sans-serif;
}

body {
    min-height: 500px;
    background: #f5f5f5;
    text-align: center;
}

section {
    box-sizing: border-box;
    position: absolute;
    top: 300px;
    right: 20px;
}

p {
    margin: 40px 0;
}

/* Buttons */
input {
    display: none;
}

label {
    background: #FFCD00;
    border: 0;
    color: #B57700;
    padding: 15px;
    min-width: 60px;
    font-size: 18px;
    font-weight: bold;
    margin: 10px
}

/* Smiley */
.smiley {
    background: linear-gradient(135deg, rgb(255, 233, 25) 0%, rgb(251, 192, 0) 100%);
    border-radius: 100%;
    padding: 25px;
    width: 50px;
    height: 50px;
    box-shadow: inset rgb(249 178 93) 0 5px 20px 0, rgb(195 199 147) 0 9px 20px 2px;
}

.mouth {
    width: 50%;
    height: 23%;
    border-radius: 0 0 100px 100px;
    box-sizing: border-box;
    position: absolute;
    bottom: 19%;
    left: 50%;
    margin-left: -24%;
    background: #B57700;
    transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
}

.eyes {
    width: 100%;
    margin-top: 15%;
    box-sizing: border-box;
    padding: 0 5px;
    transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
}

.eyes .eye {
    width: 10px;
    height: 10px;
    background: #B57700;
    float: left;
    border-radius: 100%;
    position: relative;
}

.eyes .eye:nth-of-type(2) {
    float: right;
}

.eyes .eye::after {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    background: #fed800;
    transform: rotate(0deg);
    top: -15px;
    left: 5px;
    transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
}

.eyes .eye:first-of-type::after {
    transform: rotate(0deg);
    left: auto;
    right: 5px;
}

/* Normal animation */
.normal .smiley .mouth {
    border-radius: 100px;
    height: 10%;
    width: 40%;
    bottom: 25%;
    margin-left: -20%;
}

.normal .smiley .eyes {
    margin-top: 30%
}

/* angry animation */
.angry .smiley .mouth {
    width: 40%;
    height: 20%;
    border-radius: 100% 100% 20px 20px;
    bottom: 18%;
    left: 50%;
    margin-left: -20%;
    border-bottom: 0;
}

.angry .smiley .eyes {
    margin-top: 35%
}

.angry .smiley .eye::after {
    width: 120%;
    height: 50%;
    transform: rotate(-35deg);
    top: 0;
    left: -5px;
    border-radius: 0;
}

.angry .smiley .eye:first-of-type::after {
    transform: rotate(35deg);
    left: auto;
    right: -5px;
}

/* */
.happy .smiley .mouth {
    animation: move-mouth-down .8s;
    animation-delay: .3s;
}

@keyframes move-mouth-down {
    0% {
        bottom: 18%;
    }
    35% {
        bottom: 16%;
    }
    65% {
        bottom: 16%;
    }
    100% {
        bottom: 18%;
    }
}

.happy .smiley .eyes {
    animation: move-eyes-down .8s;
    animation-delay: .3s;
}

@keyframes move-eyes-down {
    0% {
        margin-top: 15%;
    }
    35% {
        margin-top: 19%;
    }
    65% {
        margin-top: 19%;
    }
    100% {
        margin-top: 15%;
    }
}

.happy .smiley .eye:nth-of-type(2) {
    height: 10px;
    margin-top: 0;
    animation: wink .8s;
    animation-delay: .3s;
}

@keyframes wink {
    0% {
        height: 10px;
        margin-top: 0;
    }
    30% {
        height: 3px;
        margin-top: 8px;
    }
    70% {
        height: 3px;
        margin-top: 8px;
    }
    100% {
        height: 10px;
        margin-top: 0;
    }
}

.normal .smiley .eye {
    height: 10px;
    margin-top: 0;
    animation: blink .6s;
    animation-delay: .3s;
}

@keyframes blink {
    0% {
        height: 10px;
        margin-top: 0;
    }
    25% {
        height: 2px;
        margin-top: 8px;
    }
    50% {
        height: 10px;
        margin-top: 0;
    }
    75% {
        height: 2px;
        margin-top: 8px;
    }
    100% {
        height: 10px;
        margin-top: 0;
    }
}

.angry .smiley .eyes,
.angry .smiley .mouth {
    animation: move-angry-head .6s;
    animation-delay: .3s;
}

@keyframes move-angry-head {
    0% {
        transform: translateX(0%);
    }
    20% {
        transform: translateX(-20%);
    }
    40% {
        transform: translateX(15%);
    }
    60% {
        transform: translateX(-10%);
    }
    80% {
        transform: translateX(5%);
    }
    100% {
        transform: translateX(0%);
    }
}

.normal.smiley-enter-active .mouth {
    height: 17%;
    width: 17%;
    margin-left: -9%;
}

.normal.blink .smiley .eyes .eye {
    animation: blink2 .6s;
}

.normal.blink .smiley .mouth {
    border-radius: 100px;
    height: 10%;
    width: 40%;
    bottom: 25%;
    margin-left: -20%;
}

@keyframes blink2 {
    0% {
        height: 10px;
        margin-top: 0;
    }
    25% {
        height: 2px;
        margin-top: 8px;
    }
    50% {
        height: 10px;
        margin-top: 0;
    }
}
</style>

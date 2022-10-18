<script setup>
import {computed} from "vue";
import {useRoute} from 'vue-router';

const route = useRoute();
const choiceLink = computed(() => route.name === 'login' ? 'register' : 'login');
</script>

<template>
    <section id="choice">
        <router-view v-slot="{Component}">
            <transition mode="out-in">
                <keep-alive>
                    <component :is="Component"></component>
                </keep-alive>
            </transition>
        </router-view>
        <div class="choice">
            <router-link :to="choiceLink">
                {{ choiceLink }}
            </router-link>
        </div>
    </section>
</template>

<style scoped>
#choice {
    margin: 100px auto 0;
    font-weight: bold;
    overflow: hidden;
}

#choice .choice {
    font-size: 1.2em;
    padding: 19px;
    text-transform: uppercase;
}

#choice .choice a {
    text-decoration: none;
    color: #ff9900;
}
</style>

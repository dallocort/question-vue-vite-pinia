<template>
    <section id="admin">
        <button :disabled="component==='NewQuestion'"
                @click="component='NewQuestion'">Add
                                                 Question
        </button>
        <button :disabled="component==='DeleteQuestion'"
                @click="component='DeleteQuestion'">Delete Question
        </button>
        <component :is="component"></component>

        <router-link :to="{name:'main'}">MAIN MENU</router-link>
    </section>
</template>

<script>

import DeleteQuestion from "@/components/DeleteQuestion.vue";
import NewQuestion from "@/components/NewQuestion.vue";

export default {
    name: "Admin",
    components: {
        NewQuestion,
        DeleteQuestion
    },
    data() {
        return {
            component: 'NewQuestion'
        };
    }
};
</script>

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

<template>
    <section id="welcome">
        <h1>Welcome to The Question Game</h1>
        <button @click="enter">ENTER</button>
    </section>
</template>

<script>
export default {
    name: "Welcome",
    data() {
        return {};
    },
    methods: {
        enter() {
            this.$router.push('/choice');
        }
    }
};
</script>

<style scoped>

</style>

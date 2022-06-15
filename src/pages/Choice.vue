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
                {{ choiceLink.name }}
            </router-link>
        </div>

    </section>
</template>

<script>
export default {
    name: "Choice",
    data() {
        return {
            session: sessionStorage.getItem('username')
        };
    },
    methods: {},
    computed: {
        choiceLink() {
            return {
                name: this.$route.name === 'login' ? 'register' : 'login'
            };
        }
    }
};

</script>

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
</style>

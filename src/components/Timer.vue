<template>
    <section id="timer">
        <p>TIME: {{ currentTime }}</p>
    </section>
</template>

<script>
export default {
    name: "Timer",
    emits: ['time-is-up'],
    props: {
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
    },
    data() {
        return {
            currentTime: this.seconds,
            interval: ''
        };
    },
    methods: {
        count() {
            this.interval = setInterval(() => this.currentTime -= 1, 1000);
        }
    },
    watch: {
        currentTime(newValue) {
            if (newValue <= 0) {
                clearInterval(this.interval);
                this.interval = '';
                this.$emit('time-is-up', this);
            }
        },
        restart() {
            this.currentTime = this.seconds;
            if (!this.interval) {
                this.count();
            }
        },
        stop(newValue) {
            if (newValue) {
                clearInterval(this.interval);
                this.interval = '';
            }
        }
    },
    mounted() {
        this.count();
    }
};
</script>

<style scoped>

</style>

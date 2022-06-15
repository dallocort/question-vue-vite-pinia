<script setup>
let name = "Harts";
const props = defineProps({numOfLives: String});
</script>

<template>
    <section id="harts">
        <template v-for="num in numOfLives" :key="num">
            <article :class="'heart'+num">
                <img alt="hearts" src="../assets/images/heart.png"/>
            </article>

        </template>
        <template v-for="num in 3" :key="num">
            <article>
                <img alt="hearts" src="../assets/images/heart-empty.png"/>
            </article>

        </template>

    </section>
</template>

<style scoped>
#harts {
    position: relative;
}

.heart1 {
    position: absolute;
    left: 0;
    z-index: 1;
}

.heart2 {
    position: absolute;
    left: 40px;
    z-index: 1;
}

.heart3 {
    position: absolute;
    left: 80px;
    z-index: 1;
}

article {
    display: inline-block;
    margin: 5px;
}

img {
    width: 30px;
    height: 30px;
}
</style>

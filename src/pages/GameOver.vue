<template>
    <div id="gameOver"
         @mouseleave="drop"
         @mousemove="dragging"
         @click.self="goToMain">
        <section id="modal"
                 @mousemove="dragging"
                 @mouseup="drop"
                 @mousedown.left="drag">
            <header> GAME {{ status }}</header>
            <p>POINTS: {{ score }}</p>
            <p v-if="scoreUpdate">{{ scoreUpdate }}</p>
            <button @click="goToMain" @mousedown.stop>MAIN
                                                      MENU
            </button>
        </section>
    </div>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "GameOver",
    data() {
        return {
            scoreUpdate: '',
            status: this.$route.query.status,
            score: this.$route.query.score
        };
    },
    methods: {
        ...mapActions(['setGameNotOver']),
        drag(e) {
            const doc = document.getElementById('modal');
            this.startElX = doc.offsetLeft;
            this.startElY = doc.offsetTop;
            this.startMouseX = e.clientX;
            this.startMouseY = e.clientY;
            doc.style.position = 'absolute';
            doc.style.margin = '0';
            doc.style.left = this.startElX + 'px';
            doc.style.top = this.startElY + 'px';
            this.moving = true;
        },
        dragging(e) {
            const doc = document.getElementById('modal');
            if (this.moving) {
                let movedMouseX = this.startMouseX - e.clientX;
                let movedMouseY = this.startMouseY - e.clientY;
                doc.style.left = this.startElX - movedMouseX + "px";
                doc.style.top = this.startElY - movedMouseY + "px";
                this.startElX = doc.offsetLeft;
                this.startElY = doc.offsetTop;
                this.startMouseX = e.clientX;
                this.startMouseY = e.clientY;
            }
        },
        drop() {
            this.moving = false;
        },
        goToMain() {
            this.$router.push({name: 'main'});
        }
    },
    computed: {
        ...mapGetters(['isGameOver'])
    },
    mounted() {
        if (Number.isInteger(Number(this.$route.query.score))) {
            const request = axios.put(
                'http://739k121.mars-e1.mars-hosting.com/dm_quiz/score', {
                    sid: sessionStorage.getItem('sid'),
                    score: Number(this.$route.query.score)
                });
            request.then(response => {
                if (response.data.status === 'E') {
                    throw new Error(response.data.message);
                } else if (response.data.status === 'S') {
                    this.scoreUpdate = 'Score updated successfully!!';
                }
            })
            .catch(
                message => this.scoreUpdate = message + ' - Score not updated!!');
        }
        console.log('GAME OVER:', this.isGameOver);
    },
    beforeRouteLeave() {
        this.setGameNotOver();
        console.log('GAME OVER:', this.isGameOver);
    }
};
</script>

<style scoped>
#gameOver {
    overflow: hidden;
}

#modal {
    margin: 250px auto 100px;
    width: 300px;
    border: 1px solid #8f8f8f;
    padding: 1rem 1rem 1rem;
    color: white;
    background-color: #4c4545;
    cursor: grab;
}

#modal:active {
    cursor: grabbing;
}

#modal header {
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
}

#modal button {
    display: block;
    margin: 0 auto 0;
    height: 40px;
}

#gameOver {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);
}
</style>

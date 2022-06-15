<script setup>
import axios from "axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "../store/store.js";

const store = useStore();
const router = useRouter();
let error = ref('');
let username = ref("");
let password = ref("");
let buttonDisabled = ref(false);

function login() {
    buttonDisabled.value = true;
    const request = axios.post(
        'http://739k121.mars-e1.mars-hosting.com/dm_quiz/login', {
            "username": username.value,
            "password": password.value
        });
    request.then(response => {
        if (response.data.status === 'E') {
            throw new Error(response.data.message);
        } else if (response.data.status === 'S') {
            console.log(response.data);
            sessionStorage.setItem('sid', response.data.sid);
            sessionStorage.setItem('username', response.data.username);
            if (response.data.access === 1) {
                store.setIsAdmin();
            }
            router.push({name: 'main'});
        }
    }).catch(message => {
        buttonDisabled.value = false;
        error.value = message;
    });
}
</script>

<template>
    <section id="login" :class="{cursor:buttonDisabled}">
        <h1>Enter your username and password:</h1>
        <label for="username">USERNAME:&nbsp;&nbsp;</label>
        <input id="username"
               v-model="username"
               autofocus
               name="username"
               type="text"
               @keydown.enter="login"/>
        <br/>
        <br/>
        <label for="password">PASSWORD:&nbsp;&nbsp;</label>
        <input id="password"
               v-model="password"
               name="password"
               type="password"
               @keydown.enter="login"/>
        <br/>
        <button :disabled="buttonDisabled" @click="login">LOG IN</button>
        <p v-if="error" class="error">{{ error }}</p>
        <router-link :to="{name:'main'}">MAIN MENU</router-link>
    </section>
</template>

<style scoped>
#login {
    width: 495px;
    height: 280px;
    margin: 10vh auto 0;
    background: rgba(229, 241, 255, 0.2);
    padding: 1px;
    position: relative;
}

#login.cursor, #login.cursor button {
    cursor: progress;
}

#login a:last-child {
    display: block;
    position: absolute;
    top: 0;
    padding: 5px;
    text-decoration: none;
}

label {
    font-family: monospace;
    font-size: 1.3em;
}

h1 {
    margin: 30px 0 30px;
}

#login input {
    height: 30px;
    font-size: 1.2em;
}

button {
    width: 150px;
    height: 40px;
    margin-top: 24px;
    font-weight: bold;
}

.error {
    color: red;
}
</style>
